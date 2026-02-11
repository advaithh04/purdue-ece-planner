import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse all filter parameters
    // Basic filters
    const minCredits = searchParams.get('minCredits');
    const maxCredits = searchParams.get('maxCredits');
    const minGPA = searchParams.get('minGPA');
    const maxGPA = searchParams.get('maxGPA');
    const maxWorkloadHours = searchParams.get('maxWorkloadHours');
    const maxDifficulty = searchParams.get('maxDifficulty');
    const noPrerequisites = searchParams.get('noPrerequisites') === 'true';
    const semester = searchParams.get('semester');
    const level = searchParams.get('level');
    const careerTags = searchParams.get('careerTags')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search');
    const professor = searchParams.get('professor');

    // Schedule convenience filters
    const noFridayClasses = searchParams.get('noFridayClasses') === 'true';
    const noMorningClasses = searchParams.get('noMorningClasses') === 'true';
    const onlyTueThu = searchParams.get('onlyTueThu') === 'true';
    const onlyOnlineHybrid = searchParams.get('onlyOnlineHybrid') === 'true';

    // Exam/Assignment intensity
    const maxExams = searchParams.get('maxExams');
    const projectBased = searchParams.get('projectBased') === 'true';
    const examBased = searchParams.get('examBased') === 'true';
    const homeworkIntensity = searchParams.get('homeworkIntensity');
    const codingHeavy = searchParams.get('codingHeavy') === 'true';
    const mathHeavy = searchParams.get('mathHeavy') === 'true';
    const examIntensity = searchParams.get('examIntensity');
    const hasGroupProjects = searchParams.get('hasGroupProjects') === 'true';

    // Degree requirements
    const majorRequirement = searchParams.get('majorRequirement') === 'true';
    const techElective = searchParams.get('techElective') === 'true';
    const genEd = searchParams.get('genEd') === 'true';
    const labCredit = searchParams.get('labCredit') === 'true';

    // Build Prisma where clause
    const where: any = {};

    // Credits filter
    if (minCredits || maxCredits) {
      where.credits = {};
      if (minCredits) where.credits.gte = parseInt(minCredits);
      if (maxCredits) where.credits.lte = parseInt(maxCredits);
    }

    // GPA filter (min and max average GPA)
    if (minGPA || maxGPA) {
      where.avgGPA = {};
      if (minGPA) where.avgGPA.gte = parseFloat(minGPA);
      if (maxGPA) where.avgGPA.lte = parseFloat(maxGPA);
    }

    // Workload filter (maximum hours per week)
    if (maxWorkloadHours) {
      where.workloadHours = { lte: parseFloat(maxWorkloadHours) };
    }

    // Difficulty filter (maximum difficulty)
    if (maxDifficulty && maxDifficulty !== 'any') {
      where.difficultyRating = { lte: parseFloat(maxDifficulty) };
    }

    // Course level filter
    if (level && level !== 'any') {
      const levelNum = parseInt(level);
      if (levelNum >= 50000) {
        // Graduate courses (50000+)
        where.level = { gte: 50000 };
      } else {
        where.level = {
          gte: levelNum,
          lt: levelNum + 10000,
        };
      }
    }

    // Search by name or code
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Schedule convenience filters - these go directly in where clause
    if (noFridayClasses) {
      where.hasFridayClass = false;
    }

    if (noMorningClasses) {
      where.hasMorningSection = false;
    }

    if (onlyOnlineHybrid) {
      where.OR = [
        ...(where.OR || []),
        { hasOnlineOption: true },
        { hasHybridOption: true },
      ];
      // If OR already exists from search, we need to handle this differently
      if (search) {
        where.AND = [
          {
            OR: [
              { code: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          {
            OR: [
              { hasOnlineOption: true },
              { hasHybridOption: true },
            ],
          },
        ];
        delete where.OR;
      }
    }

    // Exam/Assignment intensity filters
    if (maxExams && maxExams !== 'any') {
      where.numExams = { lte: parseInt(maxExams) };
    }

    if (projectBased) {
      where.isProjectBased = true;
    }

    if (examBased) {
      where.isExamBased = true;
    }

    if (homeworkIntensity && homeworkIntensity !== 'any') {
      where.homeworkIntensity = homeworkIntensity;
    }

    if (codingHeavy) {
      where.isCodingHeavy = true;
    }

    if (mathHeavy) {
      where.isMathHeavy = true;
    }

    if (examIntensity && examIntensity !== 'any') {
      where.examIntensity = examIntensity;
    }

    if (hasGroupProjects) {
      where.hasGroupProjects = true;
    }

    // Degree requirement filters
    if (majorRequirement) {
      where.isMajorRequirement = true;
    }

    if (techElective) {
      where.isTechElective = true;
    }

    if (genEd) {
      where.isGenEd = true;
    }

    if (labCredit) {
      where.isLabCredit = true;
    }

    // Fetch courses with filters
    let courses = await prisma.course.findMany({
      where,
      orderBy: [
        { avgGPA: 'desc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        code: true,
        name: true,
        credits: true,
        description: true,
        avgGPA: true,
        difficultyRating: true,
        workloadHours: true,
        reviewCount: true,
        prerequisites: true,
        semesters: true,
        careerTags: true,
        interestTags: true,
        level: true,
        professors: true,
        typicalDays: true,
        hasMorningSection: true,
        hasAfternoonSection: true,
        hasEveningSection: true,
        hasFridayClass: true,
        hasOnlineOption: true,
        hasHybridOption: true,
        numExams: true,
        isProjectBased: true,
        isExamBased: true,
        homeworkIntensity: true,
        isCodingHeavy: true,
        isMathHeavy: true,
        examIntensity: true,
        hasGroupProjects: true,
        isMajorRequirement: true,
        isTechElective: true,
        isGenEd: true,
        isLabCredit: true,
        requirementCategory: true,
      },
    });

    // Apply array-based filters that Prisma can't handle directly

    // No prerequisites filter
    if (noPrerequisites) {
      courses = courses.filter((course) => course.prerequisites.length === 0);
    }

    // Semester offered filter
    if (semester && semester !== 'any') {
      courses = courses.filter((course) => course.semesters.includes(semester));
    }

    // Career tags filter (course must have at least one of the selected tags)
    if (careerTags.length > 0) {
      courses = courses.filter((course) =>
        careerTags.some((tag) => course.careerTags.includes(tag))
      );
    }

    // Professor filter
    if (professor) {
      const profLower = professor.toLowerCase();
      courses = courses.filter((course) =>
        course.professors.some((p) => p.toLowerCase().includes(profLower))
      );
    }

    // Only Tue/Thu filter
    if (onlyTueThu) {
      courses = courses.filter((course) =>
        course.typicalDays.some((d) => d === 'TR' || d === 'T' || d === 'R')
      );
    }

    return NextResponse.json({
      courses,
      count: courses.length,
      filters: {
        minCredits,
        maxCredits,
        minGPA,
        maxGPA,
        maxWorkloadHours,
        maxDifficulty,
        noPrerequisites,
        semester,
        level,
        careerTags,
        search,
        professor,
        noFridayClasses,
        noMorningClasses,
        onlyTueThu,
        onlyOnlineHybrid,
        maxExams,
        projectBased,
        examBased,
        homeworkIntensity,
        codingHeavy,
        mathHeavy,
        examIntensity,
        hasGroupProjects,
        majorRequirement,
        techElective,
        genEd,
        labCredit,
      },
    });
  } catch (error) {
    console.error('Course finder API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
