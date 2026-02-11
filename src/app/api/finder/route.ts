import { NextRequest, NextResponse } from 'next/server';

// Fallback course data for demo when database is unavailable
const DEMO_COURSES = [
  { id: 'c1', code: 'ECE 20001', name: 'Electrical Engineering Fundamentals I', credits: 3, description: 'Introduction to electrical engineering concepts. Basic circuit elements, Kirchhoffs laws, nodal and mesh analysis.', avgGPA: 2.85, difficultyRating: 3.2, workloadHours: 12, reviewCount: 156, prerequisites: ['PHYS 17200', 'MA 26100'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'embedded', 'signals'], interestTags: ['circuits', 'physics'], level: 20000, professors: ['Mark Johnson', 'Shreyas Sen'], typicalDays: ['MWF', 'TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c2', code: 'ECE 20002', name: 'Electrical Engineering Fundamentals II', credits: 3, description: 'Second-order transient response, sinusoidal steady-state response, AC power analysis.', avgGPA: 2.78, difficultyRating: 3.4, workloadHours: 13, reviewCount: 142, prerequisites: ['ECE 20001'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'signals', 'power'], interestTags: ['circuits', 'analog'], level: 20000, professors: ['Mark Johnson'], typicalDays: ['MWF', 'TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c3', code: 'ECE 20875', name: 'Python for Data Science', credits: 3, description: 'Introduction to Python programming with applications in data analysis.', avgGPA: 3.25, difficultyRating: 2.5, workloadHours: 10, reviewCount: 203, prerequisites: [], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software', 'ml'], interestTags: ['programming', 'math'], level: 20000, professors: ['David Inouye', 'Stanley Chan'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: true, hasHybridOption: true, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'breadth' },
  { id: 'c4', code: 'ECE 26400', name: 'Advanced C Programming', credits: 3, description: 'Advanced C programming concepts including pointers, dynamic memory allocation.', avgGPA: 2.92, difficultyRating: 3.5, workloadHours: 14, reviewCount: 178, prerequisites: ['CS 15900'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software', 'embedded'], interestTags: ['programming'], level: 26000, professors: ['Yung-Hsiang Lu'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c5', code: 'ECE 27000', name: 'Introduction to Digital System Design', credits: 4, description: 'Boolean algebra, combinational and sequential logic design, finite state machines.', avgGPA: 2.95, difficultyRating: 3.3, workloadHours: 14, reviewCount: 165, prerequisites: [], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'embedded', 'vlsi'], interestTags: ['digital', 'circuits'], level: 27000, professors: ['Cheng-Kok Koh'], typicalDays: ['MWF'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 3, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: true, requirementCategory: 'core' },
  { id: 'c6', code: 'ECE 30100', name: 'Signals and Systems', credits: 3, description: 'Continuous and discrete-time signals and systems. Convolution, Fourier transform.', avgGPA: 2.58, difficultyRating: 4.2, workloadHours: 15, reviewCount: 189, prerequisites: ['ECE 20002', 'MA 26600'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['signals', 'communications', 'ml'], interestTags: ['math', 'dsp'], level: 30000, professors: ['Mireille Boutin', 'Charlie Bouman'], typicalDays: ['MWF', 'TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c7', code: 'ECE 30200', name: 'Probabilistic Methods in ECE', credits: 3, description: 'Probability theory, random variables, stochastic processes for engineering applications.', avgGPA: 2.72, difficultyRating: 3.8, workloadHours: 13, reviewCount: 134, prerequisites: ['MA 26500'], semesters: ['Fall', 'Spring'], careerTags: ['ml', 'signals'], interestTags: ['math', 'statistics'], level: 30000, professors: ['Mark Bell'], typicalDays: ['MWF'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c8', code: 'ECE 36200', name: 'Microprocessor Systems and Interfacing', credits: 4, description: 'Microprocessor architecture, assembly language programming, hardware interfacing.', avgGPA: 2.88, difficultyRating: 3.6, workloadHours: 15, reviewCount: 145, prerequisites: ['ECE 27000', 'ECE 26400'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['embedded', 'hardware', 'software'], interestTags: ['architecture', 'programming'], level: 36000, professors: ['James Krogmeier'], typicalDays: ['MWF'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: true, requirementCategory: 'core' },
  { id: 'c9', code: 'ECE 36800', name: 'Data Structures', credits: 3, description: 'Fundamental data structures: arrays, linked lists, stacks, queues, trees, graphs.', avgGPA: 2.95, difficultyRating: 3.4, workloadHours: 12, reviewCount: 167, prerequisites: ['ECE 26400'], semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software'], interestTags: ['programming'], level: 36000, professors: ['Yung-Hsiang Lu'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false, isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false, requirementCategory: 'core' },
  { id: 'c10', code: 'ECE 43700', name: 'Introduction to VLSI Design', credits: 3, description: 'MOS transistor theory, CMOS logic design, standard cell design methodology.', avgGPA: 2.82, difficultyRating: 3.9, workloadHours: 14, reviewCount: 98, prerequisites: ['ECE 27000'], semesters: ['Fall', 'Spring'], careerTags: ['vlsi', 'hardware'], interestTags: ['circuits', 'digital'], level: 43000, professors: ['Kaushik Roy'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
  { id: 'c11', code: 'ECE 46100', name: 'Software Engineering', credits: 3, description: 'Software development methodologies, requirements, design, testing, project management.', avgGPA: 3.15, difficultyRating: 2.8, workloadHours: 10, reviewCount: 112, prerequisites: ['ECE 36800'], semesters: ['Fall', 'Spring'], careerTags: ['software'], interestTags: ['programming', 'teamwork'], level: 46000, professors: ['Xiaokang Qiu'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false, numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'moderate', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: true, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
  { id: 'c12', code: 'ECE 49500', name: 'Introduction to Machine Learning', credits: 3, description: 'Fundamentals of machine learning. Supervised and unsupervised learning, neural networks.', avgGPA: 3.08, difficultyRating: 3.5, workloadHours: 13, reviewCount: 187, prerequisites: ['ECE 30200', 'ECE 20875'], semesters: ['Fall', 'Spring'], careerTags: ['ml', 'software'], interestTags: ['programming', 'math'], level: 49000, professors: ['Stanley Chan', 'David Inouye'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
  { id: 'c13', code: 'ECE 50863', name: 'Deep Learning', credits: 3, description: 'Advanced deep learning. CNNs, RNNs, transformers, GANs.', avgGPA: 3.22, difficultyRating: 3.6, workloadHours: 14, reviewCount: 156, prerequisites: ['ECE 49500'], semesters: ['Fall', 'Spring'], careerTags: ['ml', 'software'], interestTags: ['programming', 'math'], level: 50000, professors: ['Qiang Qiu'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false, numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: true, examIntensity: 'low', hasGroupProjects: true, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
  { id: 'c14', code: 'ECE 55900', name: 'Microprocessor Architectures', credits: 3, description: 'Advanced computer architecture. Pipelining, caches, branch prediction, multicore.', avgGPA: 2.92, difficultyRating: 3.7, workloadHours: 13, reviewCount: 89, prerequisites: ['ECE 36200'], semesters: ['Fall'], careerTags: ['hardware', 'embedded', 'software'], interestTags: ['architecture'], level: 55000, professors: ['Anand Raghunathan'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false, numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
  { id: 'c15', code: 'ECE 59500', name: 'Reinforcement Learning', credits: 3, description: 'Theory and applications of reinforcement learning. MDPs, Q-learning, policy gradient.', avgGPA: 3.18, difficultyRating: 3.8, workloadHours: 14, reviewCount: 76, prerequisites: ['ECE 49500'], semesters: ['Spring'], careerTags: ['ml', 'robotics'], interestTags: ['math', 'programming'], level: 59000, professors: ['Vaneet Aggarwal'], typicalDays: ['TR'], hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false, hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false, numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy', isCodingHeavy: true, isMathHeavy: true, examIntensity: 'low', hasGroupProjects: true, isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false, requirementCategory: 'depth' },
];

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

    // Try database first
    const prisma = (await import('@/lib/prisma')).default;

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
    console.error('Course finder API error, using demo data:', error);

    // Fallback to demo data with basic filtering
    const searchParams = request.nextUrl.searchParams;
    let filteredCourses = [...DEMO_COURSES];

    // Apply basic filters to demo data
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const minGPA = searchParams.get('minGPA');
    const maxGPA = searchParams.get('maxGPA');
    const careerTags = searchParams.get('careerTags')?.split(',').filter(Boolean) || [];
    const noPrerequisites = searchParams.get('noPrerequisites') === 'true';
    const noFridayClasses = searchParams.get('noFridayClasses') === 'true';
    const majorRequirement = searchParams.get('majorRequirement') === 'true';
    const techElective = searchParams.get('techElective') === 'true';
    const codingHeavy = searchParams.get('codingHeavy') === 'true';
    const mathHeavy = searchParams.get('mathHeavy') === 'true';
    const projectBased = searchParams.get('projectBased') === 'true';

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(c =>
        c.code.toLowerCase().includes(searchLower) ||
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }

    if (level && level !== 'any') {
      const levelNum = parseInt(level);
      if (levelNum >= 50000) {
        filteredCourses = filteredCourses.filter(c => c.level >= 50000);
      } else {
        filteredCourses = filteredCourses.filter(c => c.level >= levelNum && c.level < levelNum + 10000);
      }
    }

    if (minGPA) {
      filteredCourses = filteredCourses.filter(c => c.avgGPA >= parseFloat(minGPA));
    }

    if (maxGPA) {
      filteredCourses = filteredCourses.filter(c => c.avgGPA <= parseFloat(maxGPA));
    }

    if (careerTags.length > 0) {
      filteredCourses = filteredCourses.filter(c => careerTags.some(tag => c.careerTags.includes(tag)));
    }

    if (noPrerequisites) {
      filteredCourses = filteredCourses.filter(c => c.prerequisites.length === 0);
    }

    if (noFridayClasses) {
      filteredCourses = filteredCourses.filter(c => !c.hasFridayClass);
    }

    if (majorRequirement) {
      filteredCourses = filteredCourses.filter(c => c.isMajorRequirement);
    }

    if (techElective) {
      filteredCourses = filteredCourses.filter(c => c.isTechElective);
    }

    if (codingHeavy) {
      filteredCourses = filteredCourses.filter(c => c.isCodingHeavy);
    }

    if (mathHeavy) {
      filteredCourses = filteredCourses.filter(c => c.isMathHeavy);
    }

    if (projectBased) {
      filteredCourses = filteredCourses.filter(c => c.isProjectBased);
    }

    // Sort by GPA descending
    filteredCourses.sort((a, b) => b.avgGPA - a.avgGPA);

    return NextResponse.json({
      courses: filteredCourses,
      count: filteredCourses.length,
      filters: { search, level, minGPA, maxGPA, careerTags, noPrerequisites, noFridayClasses, majorRequirement, techElective, codingHeavy, mathHeavy, projectBased },
    });
  }
}
