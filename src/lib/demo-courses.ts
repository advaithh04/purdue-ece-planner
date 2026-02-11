// Comprehensive demo course data for fallback when database is unavailable
// This data represents actual Purdue ECE courses

export interface DemoCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  avgGPA: number;
  difficultyRating: number;
  workloadHours: number;
  reviewCount: number;
  prerequisites: string[];
  corequisites: string[];
  semesters: string[];
  careerTags: string[];
  interestTags: string[];
  level: number;
  professors: string[];
  typicalDays: string[];
  hasMorningSection: boolean;
  hasAfternoonSection: boolean;
  hasEveningSection: boolean;
  hasFridayClass: boolean;
  hasOnlineOption: boolean;
  hasHybridOption: boolean;
  numExams: number;
  isProjectBased: boolean;
  isExamBased: boolean;
  homeworkIntensity: string;
  isCodingHeavy: boolean;
  isMathHeavy: boolean;
  examIntensity: string;
  hasGroupProjects: boolean;
  isMajorRequirement: boolean;
  isTechElective: boolean;
  isGenEd: boolean;
  isLabCredit: boolean;
  requirementCategory: string;
  gradeDistribution: { A: number; B: number; C: number; D: number; F: number };
  reviews: Array<{
    id: string;
    rating: number;
    difficulty: number;
    workload: number;
    comment: string;
    professor: string;
    semester: string;
    source: string;
  }>;
}

export const DEMO_COURSES: DemoCourse[] = [
  // 20000-level courses (Sophomore)
  {
    id: 'c1', code: 'ECE 20001', name: 'Electrical Engineering Fundamentals I', credits: 3,
    description: 'Introduction to electrical engineering concepts including basic circuit elements, Kirchhoffs laws, nodal and mesh analysis, Thevenin and Norton equivalent circuits, and operational amplifiers.',
    avgGPA: 2.85, difficultyRating: 3.2, workloadHours: 12, reviewCount: 156,
    prerequisites: ['PHYS 17200', 'MA 26100'], corequisites: ['ECE 20007'],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'embedded', 'signals'],
    interestTags: ['circuits', 'physics', 'analog'], level: 20000,
    professors: ['Mark Johnson', 'Shreyas Sen'], typicalDays: ['MWF', 'TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 18, B: 28, C: 30, D: 14, F: 10 },
    reviews: [
      { id: 'r1', rating: 3, difficulty: 4, workload: 12, comment: 'Challenging but foundational. Make sure you understand KVL/KCL well.', professor: 'Mark Johnson', semester: 'Fall 2024', source: 'BoilerGrades' },
      { id: 'r2', rating: 4, difficulty: 3, workload: 10, comment: 'Dr. Sen explains concepts clearly. Office hours are helpful.', professor: 'Shreyas Sen', semester: 'Spring 2024', source: 'RateMyProfessor' },
    ]
  },
  {
    id: 'c2', code: 'ECE 20002', name: 'Electrical Engineering Fundamentals II', credits: 3,
    description: 'Continuation of ECE 20001. Second-order transient response, sinusoidal steady-state response, AC power analysis, frequency response, and introduction to filters.',
    avgGPA: 2.78, difficultyRating: 3.4, workloadHours: 13, reviewCount: 142,
    prerequisites: ['ECE 20001'], corequisites: ['ECE 20008'],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'signals', 'power'],
    interestTags: ['circuits', 'analog', 'physics'], level: 20000,
    professors: ['Mark Johnson', 'Byunghoo Jung'], typicalDays: ['MWF', 'TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 15, B: 26, C: 32, D: 16, F: 11 },
    reviews: [
      { id: 'r3', rating: 3, difficulty: 4, workload: 13, comment: 'Harder than 20001. Frequency response takes time to understand.', professor: 'Mark Johnson', semester: 'Spring 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c3', code: 'ECE 20007', name: 'Electrical Engineering Fundamentals Lab I', credits: 1,
    description: 'Laboratory experiments covering circuit analysis techniques, use of test equipment, and introduction to electronic components.',
    avgGPA: 3.45, difficultyRating: 2.2, workloadHours: 4, reviewCount: 98,
    prerequisites: [], corequisites: ['ECE 20001'],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'embedded'],
    interestTags: ['circuits', 'hands-on'], level: 20000,
    professors: ['Lab Staff'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: true,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 0, isProjectBased: true, isExamBased: false, homeworkIntensity: 'light',
    isCodingHeavy: false, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: true,
    requirementCategory: 'core',
    gradeDistribution: { A: 45, B: 35, C: 15, D: 3, F: 2 },
    reviews: []
  },
  {
    id: 'c4', code: 'ECE 20875', name: 'Python for Data Science', credits: 3,
    description: 'Introduction to Python programming with applications in data analysis, visualization, and basic machine learning. Covers NumPy, Pandas, Matplotlib, and scikit-learn.',
    avgGPA: 3.25, difficultyRating: 2.5, workloadHours: 10, reviewCount: 203,
    prerequisites: [], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software', 'ml'],
    interestTags: ['programming', 'data', 'math'], level: 20000,
    professors: ['David Inouye', 'Stanley Chan'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: true,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'breadth',
    gradeDistribution: { A: 35, B: 32, C: 22, D: 7, F: 4 },
    reviews: [
      { id: 'r4', rating: 5, difficulty: 2, workload: 8, comment: 'Great intro to Python and data science. Very practical skills.', professor: 'David Inouye', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  // 26000-level courses
  {
    id: 'c5', code: 'ECE 26400', name: 'Advanced C Programming', credits: 3,
    description: 'Advanced C programming concepts including pointers, dynamic memory allocation, file I/O, data structures, and software engineering principles.',
    avgGPA: 2.92, difficultyRating: 3.5, workloadHours: 14, reviewCount: 178,
    prerequisites: ['CS 15900'], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software', 'embedded'],
    interestTags: ['programming', 'systems'], level: 26000,
    professors: ['Yung-Hsiang Lu', 'Cheng-Kok Koh'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 22, B: 30, C: 28, D: 12, F: 8 },
    reviews: [
      { id: 'r5', rating: 4, difficulty: 4, workload: 14, comment: 'Challenging but essential for embedded systems. Start projects early.', professor: 'Yung-Hsiang Lu', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  // 27000-level courses
  {
    id: 'c6', code: 'ECE 27000', name: 'Introduction to Digital System Design', credits: 4,
    description: 'Boolean algebra, combinational and sequential logic design, finite state machines, programmable logic devices, and hardware description languages (Verilog).',
    avgGPA: 2.95, difficultyRating: 3.3, workloadHours: 14, reviewCount: 165,
    prerequisites: [], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['hardware', 'embedded', 'vlsi'],
    interestTags: ['digital', 'circuits', 'fpga'], level: 27000,
    professors: ['Cheng-Kok Koh', 'Vijay Raghunathan'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: true,
    requirementCategory: 'core',
    gradeDistribution: { A: 24, B: 30, C: 26, D: 12, F: 8 },
    reviews: [
      { id: 'r6', rating: 4, difficulty: 3, workload: 14, comment: 'Fun course if you like hardware. Labs can be time-consuming.', professor: 'Cheng-Kok Koh', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  // 30000-level courses
  {
    id: 'c7', code: 'ECE 30100', name: 'Signals and Systems', credits: 3,
    description: 'Continuous and discrete-time signals and systems. Convolution, Fourier series, Fourier transform, Laplace transform, Z-transform, and system analysis.',
    avgGPA: 2.58, difficultyRating: 4.2, workloadHours: 15, reviewCount: 189,
    prerequisites: ['ECE 20002', 'MA 26600'], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['signals', 'communications', 'ml'],
    interestTags: ['math', 'dsp', 'theory'], level: 30000,
    professors: ['Mireille Boutin', 'Charlie Bouman', 'Ilias Bilionis'], typicalDays: ['MWF', 'TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 12, B: 22, C: 34, D: 18, F: 14 },
    reviews: [
      { id: 'r7', rating: 3, difficulty: 5, workload: 16, comment: 'Very math-heavy. Make sure your differential equations are solid.', professor: 'Mireille Boutin', semester: 'Fall 2024', source: 'BoilerGrades' },
      { id: 'r8', rating: 4, difficulty: 4, workload: 14, comment: 'Bouman explains things well. Watch the lecture recordings.', professor: 'Charlie Bouman', semester: 'Spring 2024', source: 'RateMyProfessor' },
    ]
  },
  {
    id: 'c8', code: 'ECE 30200', name: 'Probabilistic Methods in ECE', credits: 3,
    description: 'Probability theory, random variables, probability distributions, stochastic processes, and statistical inference for engineering applications.',
    avgGPA: 2.72, difficultyRating: 3.8, workloadHours: 13, reviewCount: 134,
    prerequisites: ['MA 26500'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['ml', 'signals', 'communications'],
    interestTags: ['math', 'statistics', 'theory'], level: 30000,
    professors: ['Mark Bell', 'James Lehnert'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 16, B: 26, C: 32, D: 16, F: 10 },
    reviews: [
      { id: 'r9', rating: 3, difficulty: 4, workload: 13, comment: 'Essential for ML track. Study the examples carefully.', professor: 'Mark Bell', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c9', code: 'ECE 30411', name: 'Electromagnetics I', credits: 3,
    description: 'Vector analysis, electrostatics, magnetostatics, and time-varying electromagnetic fields. Maxwells equations and wave propagation basics.',
    avgGPA: 2.65, difficultyRating: 4.0, workloadHours: 14, reviewCount: 112,
    prerequisites: ['PHYS 27200', 'MA 26200'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['hardware', 'communications', 'rf'],
    interestTags: ['physics', 'math', 'theory'], level: 30000,
    professors: ['Dan Jiao', 'Peter Bermel'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 14, B: 24, C: 34, D: 17, F: 11 },
    reviews: []
  },
  // 36000-level courses
  {
    id: 'c10', code: 'ECE 36200', name: 'Microprocessor Systems and Interfacing', credits: 4,
    description: 'Microprocessor architecture, assembly language programming, hardware interfacing, interrupts, timers, and I/O peripherals using ARM processors.',
    avgGPA: 2.88, difficultyRating: 3.6, workloadHours: 15, reviewCount: 145,
    prerequisites: ['ECE 27000', 'ECE 26400'], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['embedded', 'hardware', 'software'],
    interestTags: ['architecture', 'programming', 'systems'], level: 36000,
    professors: ['James Krogmeier', 'Mark Johnson'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: true,
    requirementCategory: 'core',
    gradeDistribution: { A: 20, B: 32, C: 28, D: 12, F: 8 },
    reviews: [
      { id: 'r10', rating: 4, difficulty: 4, workload: 16, comment: 'Best course for learning embedded systems. Labs are long but rewarding.', professor: 'James Krogmeier', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c11', code: 'ECE 36800', name: 'Data Structures', credits: 3,
    description: 'Fundamental data structures including arrays, linked lists, stacks, queues, trees, graphs, hash tables, and algorithm analysis.',
    avgGPA: 2.95, difficultyRating: 3.4, workloadHours: 12, reviewCount: 167,
    prerequisites: ['ECE 26400'], corequisites: [],
    semesters: ['Fall', 'Spring', 'Summer'], careerTags: ['software'],
    interestTags: ['programming', 'algorithms'], level: 36000,
    professors: ['Yung-Hsiang Lu', 'Saurabh Bagchi'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 24, B: 30, C: 26, D: 12, F: 8 },
    reviews: [
      { id: 'r11', rating: 4, difficulty: 3, workload: 12, comment: 'Essential for software careers. Projects help understand concepts.', professor: 'Yung-Hsiang Lu', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  // 40000-level courses
  {
    id: 'c12', code: 'ECE 40862', name: 'Software Testing', credits: 3,
    description: 'Software testing techniques, test-driven development, unit testing, integration testing, and test automation frameworks.',
    avgGPA: 3.18, difficultyRating: 2.9, workloadHours: 10, reviewCount: 87,
    prerequisites: ['ECE 36800'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software'],
    interestTags: ['programming', 'quality'], level: 40000,
    professors: ['Xiangyu Zhang'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 32, B: 35, C: 22, D: 7, F: 4 },
    reviews: []
  },
  {
    id: 'c13', code: 'ECE 43700', name: 'Introduction to VLSI Design', credits: 3,
    description: 'MOS transistor theory, CMOS logic design, standard cell design methodology, layout techniques, and timing analysis.',
    avgGPA: 2.82, difficultyRating: 3.9, workloadHours: 14, reviewCount: 98,
    prerequisites: ['ECE 27000'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['vlsi', 'hardware'],
    interestTags: ['circuits', 'digital', 'chip-design'], level: 43000,
    professors: ['Kaushik Roy', 'Sumeet Gupta'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 18, B: 30, C: 30, D: 14, F: 8 },
    reviews: [
      { id: 'r12', rating: 4, difficulty: 4, workload: 14, comment: 'Great intro to chip design. Cadence tools have a learning curve.', professor: 'Kaushik Roy', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c14', code: 'ECE 44000', name: 'Digital Integrated Circuits', credits: 3,
    description: 'Analysis and design of digital integrated circuits. CMOS inverter, logic gates, sequential circuits, and memory design.',
    avgGPA: 2.75, difficultyRating: 4.0, workloadHours: 14, reviewCount: 76,
    prerequisites: ['ECE 20002', 'ECE 27000'], corequisites: [],
    semesters: ['Fall'], careerTags: ['vlsi', 'hardware'],
    interestTags: ['circuits', 'digital'], level: 44000,
    professors: ['Kaushik Roy'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 16, B: 26, C: 32, D: 16, F: 10 },
    reviews: []
  },
  {
    id: 'c15', code: 'ECE 46100', name: 'Software Engineering', credits: 3,
    description: 'Software development methodologies, requirements engineering, design patterns, testing, and project management. Agile and Scrum practices.',
    avgGPA: 3.15, difficultyRating: 2.8, workloadHours: 10, reviewCount: 112,
    prerequisites: ['ECE 36800'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software'],
    interestTags: ['programming', 'teamwork', 'management'], level: 46000,
    professors: ['Xiaokang Qiu', 'James Davis'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 30, B: 38, C: 22, D: 6, F: 4 },
    reviews: [
      { id: 'r13', rating: 4, difficulty: 2, workload: 10, comment: 'Good for learning industry practices. Team project is the main work.', professor: 'Xiaokang Qiu', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c16', code: 'ECE 46300', name: 'Introduction to Computer Communication Networks', credits: 3,
    description: 'Network protocols, TCP/IP stack, routing, switching, and network security. Socket programming and network applications.',
    avgGPA: 2.98, difficultyRating: 3.3, workloadHours: 12, reviewCount: 134,
    prerequisites: ['ECE 36800'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software', 'communications'],
    interestTags: ['networking', 'systems'], level: 46000,
    professors: ['Sanjay Rao', 'Chunyi Peng'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 24, B: 32, C: 26, D: 12, F: 6 },
    reviews: []
  },
  {
    id: 'c17', code: 'ECE 46900', name: 'Object-Oriented Programming with C++', credits: 3,
    description: 'Object-oriented programming principles, C++ language features, templates, STL, and software design patterns.',
    avgGPA: 3.02, difficultyRating: 3.2, workloadHours: 12, reviewCount: 145,
    prerequisites: ['ECE 26400'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software'],
    interestTags: ['programming', 'design'], level: 46000,
    professors: ['Yung-Hsiang Lu'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 26, B: 32, C: 26, D: 10, F: 6 },
    reviews: []
  },
  // 49000-level courses
  {
    id: 'c18', code: 'ECE 49500', name: 'Introduction to Machine Learning', credits: 3,
    description: 'Fundamentals of machine learning including supervised and unsupervised learning, neural networks, decision trees, SVMs, and model evaluation.',
    avgGPA: 3.08, difficultyRating: 3.5, workloadHours: 13, reviewCount: 187,
    prerequisites: ['ECE 30200', 'ECE 20875'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['ml', 'software'],
    interestTags: ['programming', 'math', 'ai'], level: 49000,
    professors: ['Stanley Chan', 'David Inouye'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 28, B: 34, C: 24, D: 9, F: 5 },
    reviews: [
      { id: 'r14', rating: 5, difficulty: 3, workload: 12, comment: 'Excellent introduction to ML. Dr. Chan is a great teacher.', professor: 'Stanley Chan', semester: 'Fall 2024', source: 'BoilerGrades' },
      { id: 'r15', rating: 4, difficulty: 4, workload: 14, comment: 'Good balance of theory and practice. Projects are interesting.', professor: 'David Inouye', semester: 'Spring 2024', source: 'RateMyProfessor' },
    ]
  },
  {
    id: 'c19', code: 'ECE 49595', name: 'Computer Vision', credits: 3,
    description: 'Image processing, feature detection, object recognition, deep learning for vision, and 3D reconstruction.',
    avgGPA: 3.12, difficultyRating: 3.6, workloadHours: 13, reviewCount: 98,
    prerequisites: ['ECE 30100', 'ECE 20875'], corequisites: [],
    semesters: ['Spring'], careerTags: ['ml', 'software', 'robotics'],
    interestTags: ['programming', 'math', 'vision'], level: 49000,
    professors: ['Avinash Kak', 'Qiang Qiu'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 30, B: 32, C: 24, D: 9, F: 5 },
    reviews: []
  },
  // 50000-level courses (Graduate)
  {
    id: 'c20', code: 'ECE 50024', name: 'Machine Learning', credits: 3,
    description: 'Graduate-level machine learning covering theory and algorithms. PAC learning, VC dimension, kernel methods, and optimization.',
    avgGPA: 3.28, difficultyRating: 4.0, workloadHours: 15, reviewCount: 123,
    prerequisites: ['ECE 49500'], corequisites: [],
    semesters: ['Fall'], careerTags: ['ml', 'software'],
    interestTags: ['programming', 'math', 'theory'], level: 50000,
    professors: ['David Inouye', 'Jean Honorio'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 35, B: 35, C: 20, D: 6, F: 4 },
    reviews: []
  },
  {
    id: 'c21', code: 'ECE 50863', name: 'Deep Learning', credits: 3,
    description: 'Advanced deep learning architectures including CNNs, RNNs, transformers, GANs, and self-supervised learning. PyTorch implementation.',
    avgGPA: 3.22, difficultyRating: 3.6, workloadHours: 14, reviewCount: 156,
    prerequisites: ['ECE 49500'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['ml', 'software'],
    interestTags: ['programming', 'math', 'ai'], level: 50000,
    professors: ['Qiang Qiu', 'Avinash Kak'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 34, B: 36, C: 20, D: 6, F: 4 },
    reviews: [
      { id: 'r16', rating: 5, difficulty: 4, workload: 14, comment: 'Hands-on deep learning. Project-based learning is effective.', professor: 'Qiang Qiu', semester: 'Fall 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c22', code: 'ECE 55900', name: 'Microprocessor Architectures', credits: 3,
    description: 'Advanced computer architecture including pipelining, caches, branch prediction, out-of-order execution, and multicore processors.',
    avgGPA: 2.92, difficultyRating: 3.7, workloadHours: 13, reviewCount: 89,
    prerequisites: ['ECE 36200'], corequisites: [],
    semesters: ['Fall'], careerTags: ['hardware', 'embedded', 'software'],
    interestTags: ['architecture', 'systems'], level: 55000,
    professors: ['Anand Raghunathan', 'Vijay Raghunathan'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 24, B: 34, C: 26, D: 10, F: 6 },
    reviews: []
  },
  {
    id: 'c23', code: 'ECE 57000', name: 'Artificial Intelligence', credits: 3,
    description: 'Classical AI including search algorithms, game playing, constraint satisfaction, logic, planning, and knowledge representation.',
    avgGPA: 3.05, difficultyRating: 3.5, workloadHours: 12, reviewCount: 134,
    prerequisites: ['ECE 36800'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['ml', 'software', 'robotics'],
    interestTags: ['programming', 'theory', 'ai'], level: 57000,
    professors: ['Yung-Hsiang Lu'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 28, B: 34, C: 24, D: 9, F: 5 },
    reviews: []
  },
  {
    id: 'c24', code: 'ECE 59500', name: 'Reinforcement Learning', credits: 3,
    description: 'Theory and applications of reinforcement learning including MDPs, Q-learning, policy gradient methods, and deep RL.',
    avgGPA: 3.18, difficultyRating: 3.8, workloadHours: 14, reviewCount: 76,
    prerequisites: ['ECE 49500'], corequisites: [],
    semesters: ['Spring'], careerTags: ['ml', 'robotics'],
    interestTags: ['math', 'programming', 'ai'], level: 59000,
    professors: ['Vaneet Aggarwal', 'Bruno Ribeiro'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 32, B: 36, C: 22, D: 6, F: 4 },
    reviews: [
      { id: 'r17', rating: 4, difficulty: 4, workload: 14, comment: 'Challenging but rewarding. Theory-heavy with good practical projects.', professor: 'Vaneet Aggarwal', semester: 'Spring 2024', source: 'BoilerGrades' },
    ]
  },
  {
    id: 'c25', code: 'ECE 59500', name: 'Natural Language Processing', credits: 3,
    description: 'NLP fundamentals including text processing, language models, transformers, and applications like sentiment analysis and machine translation.',
    avgGPA: 3.15, difficultyRating: 3.5, workloadHours: 13, reviewCount: 67,
    prerequisites: ['ECE 49500'], corequisites: [],
    semesters: ['Fall'], careerTags: ['ml', 'software'],
    interestTags: ['programming', 'ai', 'language'], level: 59000,
    professors: ['Dan Goldwasser'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 1, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 30, B: 38, C: 22, D: 6, F: 4 },
    reviews: []
  },
  // Additional core/required courses
  {
    id: 'c26', code: 'ECE 29401', name: 'Junior Seminar', credits: 0,
    description: 'Professional development seminar covering career planning, resume writing, technical communication, and ethics.',
    avgGPA: 3.85, difficultyRating: 1.2, workloadHours: 2, reviewCount: 245,
    prerequisites: [], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software', 'hardware', 'ml'],
    interestTags: ['career', 'communication'], level: 29000,
    professors: ['Various Faculty'], typicalDays: ['W'],
    hasMorningSection: false, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: true,
    numExams: 0, isProjectBased: false, isExamBased: false, homeworkIntensity: 'light',
    isCodingHeavy: false, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 90, B: 8, C: 2, D: 0, F: 0 },
    reviews: []
  },
  {
    id: 'c27', code: 'ECE 39401', name: 'Senior Seminar', credits: 0,
    description: 'Continuation of professional development with focus on senior design preparation and career readiness.',
    avgGPA: 3.82, difficultyRating: 1.3, workloadHours: 2, reviewCount: 198,
    prerequisites: ['ECE 29401'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software', 'hardware', 'ml'],
    interestTags: ['career', 'design'], level: 39000,
    professors: ['Various Faculty'], typicalDays: ['W'],
    hasMorningSection: false, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: true, hasHybridOption: true,
    numExams: 0, isProjectBased: false, isExamBased: false, homeworkIntensity: 'light',
    isCodingHeavy: false, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: false,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'core',
    gradeDistribution: { A: 88, B: 10, C: 2, D: 0, F: 0 },
    reviews: []
  },
  {
    id: 'c28', code: 'ECE 47700', name: 'Senior Design', credits: 3,
    description: 'Capstone design project. Teams design, build, and test an engineering system. Includes written and oral presentations.',
    avgGPA: 3.35, difficultyRating: 3.0, workloadHours: 12, reviewCount: 187,
    prerequisites: ['ECE 39401'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['software', 'hardware', 'embedded'],
    interestTags: ['design', 'teamwork', 'hands-on'], level: 47000,
    professors: ['Various Faculty'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: true,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 0, isProjectBased: true, isExamBased: false, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: true, isTechElective: false, isGenEd: false, isLabCredit: false,
    requirementCategory: 'capstone',
    gradeDistribution: { A: 40, B: 40, C: 15, D: 4, F: 1 },
    reviews: [
      { id: 'r18', rating: 5, difficulty: 3, workload: 12, comment: 'Best class at Purdue. Actually build something real with your team.', professor: 'Various Faculty', semester: 'Spring 2024', source: 'BoilerGrades' },
    ]
  },
  // More electives
  {
    id: 'c29', code: 'ECE 56900', name: 'Introduction to Robotic Systems', credits: 3,
    description: 'Robot kinematics, dynamics, motion planning, control, and perception. Hands-on projects with robotic systems.',
    avgGPA: 3.08, difficultyRating: 3.4, workloadHours: 12, reviewCount: 87,
    prerequisites: ['ECE 30100'], corequisites: [],
    semesters: ['Fall'], careerTags: ['robotics', 'embedded', 'ml'],
    interestTags: ['programming', 'control', 'hands-on'], level: 56000,
    professors: ['Raymond DeCarlo'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 28, B: 36, C: 24, D: 8, F: 4 },
    reviews: []
  },
  {
    id: 'c30', code: 'ECE 53800', name: 'Digital Signal Processing', credits: 3,
    description: 'Digital filter design, FFT algorithms, multirate signal processing, and applications in audio and communications.',
    avgGPA: 2.78, difficultyRating: 3.9, workloadHours: 14, reviewCount: 112,
    prerequisites: ['ECE 30100'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['signals', 'communications', 'embedded'],
    interestTags: ['dsp', 'math', 'programming'], level: 53000,
    professors: ['Charlie Bouman', 'Mireille Boutin'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 18, B: 28, C: 32, D: 14, F: 8 },
    reviews: []
  },
  {
    id: 'c31', code: 'ECE 60872', name: 'Fault-Tolerant Computer System Design', credits: 3,
    description: 'Reliability modeling, fault detection, error correction codes, and design of dependable systems.',
    avgGPA: 3.25, difficultyRating: 3.4, workloadHours: 12, reviewCount: 54,
    prerequisites: ['ECE 36200'], corequisites: [],
    semesters: ['Spring'], careerTags: ['hardware', 'embedded', 'software'],
    interestTags: ['systems', 'reliability'], level: 60000,
    professors: ['Saurabh Bagchi'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'moderate',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 35, B: 38, C: 20, D: 5, F: 2 },
    reviews: []
  },
  {
    id: 'c32', code: 'ECE 60146', name: 'Control Systems', credits: 3,
    description: 'Classical and modern control theory. State-space methods, stability analysis, and controller design.',
    avgGPA: 2.85, difficultyRating: 3.8, workloadHours: 13, reviewCount: 98,
    prerequisites: ['ECE 30100'], corequisites: [],
    semesters: ['Fall', 'Spring'], careerTags: ['robotics', 'embedded', 'hardware'],
    interestTags: ['control', 'math', 'systems'], level: 60000,
    professors: ['Shreyas Sundaram', 'Inseok Hwang'], typicalDays: ['MWF'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: true, hasOnlineOption: false, hasHybridOption: false,
    numExams: 3, isProjectBased: false, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: false, isMathHeavy: true, examIntensity: 'high', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 20, B: 30, C: 30, D: 13, F: 7 },
    reviews: []
  },
  {
    id: 'c33', code: 'ECE 60827', name: 'Parallel Computing', credits: 3,
    description: 'Parallel algorithms, GPU programming with CUDA, distributed computing, and performance optimization.',
    avgGPA: 3.12, difficultyRating: 3.5, workloadHours: 13, reviewCount: 76,
    prerequisites: ['ECE 36800'], corequisites: [],
    semesters: ['Fall'], careerTags: ['software', 'ml', 'hardware'],
    interestTags: ['programming', 'systems', 'gpu'], level: 60000,
    professors: ['Milind Kulkarni'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: false, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 30, B: 35, C: 24, D: 7, F: 4 },
    reviews: []
  },
  {
    id: 'c34', code: 'ECE 69500', name: 'Generative AI', credits: 3,
    description: 'Modern generative models including VAEs, GANs, diffusion models, and large language models. Theory and applications.',
    avgGPA: 3.32, difficultyRating: 3.7, workloadHours: 14, reviewCount: 45,
    prerequisites: ['ECE 50863'], corequisites: [],
    semesters: ['Spring'], careerTags: ['ml', 'software'],
    interestTags: ['programming', 'ai', 'research'], level: 69000,
    professors: ['Qiang Qiu'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 0, isProjectBased: true, isExamBased: false, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'low', hasGroupProjects: true,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 40, B: 38, C: 16, D: 4, F: 2 },
    reviews: []
  },
  {
    id: 'c35', code: 'ECE 50024', name: 'Statistical Machine Learning', credits: 3,
    description: 'Statistical foundations of machine learning. Bayesian methods, graphical models, and probabilistic inference.',
    avgGPA: 3.18, difficultyRating: 4.1, workloadHours: 15, reviewCount: 89,
    prerequisites: ['ECE 30200', 'ECE 49500'], corequisites: [],
    semesters: ['Spring'], careerTags: ['ml', 'software'],
    interestTags: ['math', 'statistics', 'theory'], level: 50000,
    professors: ['Jean Honorio'], typicalDays: ['TR'],
    hasMorningSection: true, hasAfternoonSection: true, hasEveningSection: false,
    hasFridayClass: false, hasOnlineOption: false, hasHybridOption: false,
    numExams: 2, isProjectBased: true, isExamBased: true, homeworkIntensity: 'heavy',
    isCodingHeavy: true, isMathHeavy: true, examIntensity: 'medium', hasGroupProjects: false,
    isMajorRequirement: false, isTechElective: true, isGenEd: false, isLabCredit: false,
    requirementCategory: 'depth',
    gradeDistribution: { A: 32, B: 36, C: 22, D: 6, F: 4 },
    reviews: []
  },
];

// Helper function to find a course by code
export function findCourseByCode(code: string): DemoCourse | undefined {
  return DEMO_COURSES.find(c => c.code.toLowerCase() === code.toLowerCase());
}

// Helper function to get courses count
export function getCourseCount(): number {
  return DEMO_COURSES.length;
}
