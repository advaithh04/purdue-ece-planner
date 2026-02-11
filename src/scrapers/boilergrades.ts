import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GradeData {
  courseCode: string;
  avgGPA: number;
  professors: string[];
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  sectionCount: number;
}

async function scrapeBoilerGrades(courseCode: string): Promise<GradeData | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set a user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Navigate to boilergrades
    await page.goto('https://www.boilergrades.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for the page to load (JavaScript rendered)
    await page.waitForSelector('input', { timeout: 10000 });

    // Format course code for search (e.g., "ECE 59500" -> "ECE 59500")
    const searchTerm = courseCode.replace(/\s+/g, ' ');

    // Find and fill the search input
    const searchInput = await page.$('input[type="text"], input[placeholder*="search" i], input');
    if (!searchInput) {
      console.log(`Could not find search input for ${courseCode}`);
      return null;
    }

    await searchInput.type(searchTerm, { delay: 50 });

    // Wait for search results to appear
    await new Promise(r => setTimeout(r, 2000));

    // Try to find and click on the course result
    // Boilergrades shows autocomplete results
    const courseLink = await page.$(`a[href*="${courseCode.replace(' ', '')}"], [data-course*="${courseCode}"]`);

    if (courseLink) {
      await courseLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    } else {
      // Try pressing Enter to search
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 3000));
    }

    // Now we should be on the course page or search results
    // Try to extract grade data from the page
    const gradeData = await page.evaluate((code) => {
      const data: any = {
        courseCode: code,
        avgGPA: 0,
        professors: [],
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        sectionCount: 0,
      };

      // Try to find GPA information
      const gpaElements = document.querySelectorAll('[class*="gpa"], [class*="GPA"]');
      gpaElements.forEach((el) => {
        const text = el.textContent || '';
        const gpaMatch = text.match(/(\d+\.\d+)/);
        if (gpaMatch) {
          const gpa = parseFloat(gpaMatch[1]);
          if (gpa >= 0 && gpa <= 4.0 && gpa > data.avgGPA) {
            data.avgGPA = gpa;
          }
        }
      });

      // Try to find professor names
      const profElements = document.querySelectorAll('[class*="instructor"], [class*="professor"], [class*="prof"]');
      profElements.forEach((el) => {
        const name = el.textContent?.trim();
        if (name && name.length > 2 && name.length < 50 && !data.professors.includes(name)) {
          data.professors.push(name);
        }
      });

      // Try to find grade distribution
      const gradeElements = document.querySelectorAll('[class*="grade"], [class*="distribution"]');
      gradeElements.forEach((el) => {
        const text = el.textContent || '';
        // Look for patterns like "A: 30%" or "A 30%"
        const grades = ['A', 'B', 'C', 'D', 'F'];
        grades.forEach((grade) => {
          const regex = new RegExp(`${grade}[:\\s]+?(\\d+\\.?\\d*)%?`, 'i');
          const match = text.match(regex);
          if (match) {
            data.gradeDistribution[grade] = parseFloat(match[1]);
          }
        });
      });

      // Count sections
      const sectionElements = document.querySelectorAll('[class*="section"], tr');
      data.sectionCount = sectionElements.length;

      return data;
    }, courseCode);

    return gradeData as GradeData;
  } catch (error) {
    console.error(`Error scraping ${courseCode}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

async function updateCourseWithGradeData(courseCode: string, gradeData: GradeData) {
  try {
    // Only update if we have meaningful data
    if (gradeData.avgGPA > 0) {
      const updateData: any = {
        avgGPA: gradeData.avgGPA,
      };

      if (gradeData.professors.length > 0) {
        updateData.professors = gradeData.professors;
      }

      if (Object.values(gradeData.gradeDistribution).some(v => v > 0)) {
        updateData.gradeDistribution = gradeData.gradeDistribution;
      }

      await prisma.course.update({
        where: { code: courseCode },
        data: updateData,
      });

      console.log(`✓ Updated ${courseCode} with GPA: ${gradeData.avgGPA}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to update ${courseCode}:`, error);
    return false;
  }
}

async function scrapeAllECECourses() {
  console.log('Starting Boilergrades scraper for ECE courses...\n');

  // Get all ECE courses from database
  const courses = await prisma.course.findMany({
    where: { department: 'ECE' },
    select: { code: true },
  });

  console.log(`Found ${courses.length} ECE courses to scrape\n`);

  let successCount = 0;
  let failCount = 0;

  for (const course of courses) {
    console.log(`Scraping ${course.code}...`);

    const gradeData = await scrapeBoilerGrades(course.code);

    if (gradeData && gradeData.avgGPA > 0) {
      const updated = await updateCourseWithGradeData(course.code, gradeData);
      if (updated) {
        successCount++;
      } else {
        failCount++;
      }
    } else {
      console.log(`  No grade data found for ${course.code}`);
      failCount++;
    }

    // Add delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✅ Scraping complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
}

async function scrapeSingleCourse(courseCode: string) {
  console.log(`Scraping ${courseCode} from Boilergrades...\n`);

  const gradeData = await scrapeBoilerGrades(courseCode);

  if (gradeData) {
    console.log('Grade data found:');
    console.log(`  Average GPA: ${gradeData.avgGPA}`);
    console.log(`  Professors: ${gradeData.professors.join(', ') || 'None found'}`);
    console.log(`  Grade Distribution: A=${gradeData.gradeDistribution.A}%, B=${gradeData.gradeDistribution.B}%, C=${gradeData.gradeDistribution.C}%, D=${gradeData.gradeDistribution.D}%, F=${gradeData.gradeDistribution.F}%`);

    const updated = await updateCourseWithGradeData(courseCode, gradeData);
    if (updated) {
      console.log(`\n✓ Database updated successfully`);
    }
  } else {
    console.log('No grade data could be scraped');
  }
}

// CLI interface
const args = process.argv.slice(2);

if (args[0] === '--all') {
  scrapeAllECECourses()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} else if (args[0]) {
  scrapeSingleCourse(args[0])
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} else {
  console.log('Usage:');
  console.log('  npx tsx src/scrapers/boilergrades.ts "ECE 59500"  - Scrape single course');
  console.log('  npx tsx src/scrapers/boilergrades.ts --all        - Scrape all ECE courses');
  process.exit(0);
}

export { scrapeBoilerGrades, updateCourseWithGradeData, scrapeAllECECourses };
