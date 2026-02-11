import scrapePurdueCatalog from './catalog';
import scrapeGradeDistributions from './grades';
import scrapeRatings from './ratings';

export { scrapePurdueCatalog, scrapeGradeDistributions, scrapeRatings };

export async function runAllScrapers() {
  console.log('='.repeat(50));
  console.log('Starting full scrape pipeline...');
  console.log('='.repeat(50));

  const results = {
    catalog: { success: false, count: 0 },
    grades: { success: false, count: 0 },
    ratings: { success: false, count: 0 },
  };

  // Step 1: Scrape course catalog
  console.log('\n[1/3] Scraping course catalog...');
  try {
    const courses = await scrapePurdueCatalog();
    results.catalog = { success: true, count: courses.length };
    console.log(`Catalog: ${courses.length} courses scraped`);
  } catch (error) {
    console.error('Catalog scrape failed:', error);
  }

  // Step 2: Scrape grade distributions
  console.log('\n[2/3] Scraping grade distributions...');
  try {
    const grades = await scrapeGradeDistributions();
    results.grades = { success: true, count: grades.length };
    console.log(`Grades: ${grades.length} records scraped`);
  } catch (error) {
    console.error('Grade scrape failed:', error);
  }

  // Step 3: Scrape ratings and reviews
  console.log('\n[3/3] Scraping ratings and reviews...');
  try {
    const reviews = await scrapeRatings();
    results.ratings = { success: true, count: reviews.length };
    console.log(`Ratings: ${reviews.length} reviews scraped`);
  } catch (error) {
    console.error('Ratings scrape failed:', error);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Scrape pipeline complete!');
  console.log('='.repeat(50));
  console.log('Results:');
  console.log(`  Catalog: ${results.catalog.success ? 'Success' : 'Failed'} (${results.catalog.count} courses)`);
  console.log(`  Grades:  ${results.grades.success ? 'Success' : 'Failed'} (${results.grades.count} records)`);
  console.log(`  Ratings: ${results.ratings.success ? 'Success' : 'Failed'} (${results.ratings.count} reviews)`);

  return results;
}

// CLI entry point
if (require.main === module) {
  runAllScrapers()
    .then((results) => {
      const allSuccess = results.catalog.success && results.grades.success && results.ratings.success;
      process.exit(allSuccess ? 0 : 1);
    })
    .catch((error) => {
      console.error('Pipeline failed:', error);
      process.exit(1);
    });
}

export default runAllScrapers;
