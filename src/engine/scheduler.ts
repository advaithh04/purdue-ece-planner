import type { Course, PlannedCourse } from '@prisma/client';

interface ScheduleConflict {
  type: 'prerequisite' | 'corequisite' | 'overload' | 'duplicate';
  severity: 'error' | 'warning';
  message: string;
  courses: string[];
}

interface SemesterAnalysis {
  semester: string;
  courses: string[];
  totalCredits: number;
  avgDifficulty: number;
  estimatedWorkload: number;
  conflicts: ScheduleConflict[];
  recommendations: string[];
}

interface ScheduleAnalysis {
  semesters: SemesterAnalysis[];
  totalCredits: number;
  estimatedGPA: number;
  overallConflicts: ScheduleConflict[];
  isValid: boolean;
}

export function analyzeSchedule(
  plannedCourses: PlannedCourse[],
  courseData: Map<string, Course>,
  completedCourses: string[]
): ScheduleAnalysis {
  // Group courses by semester
  const semesterMap = new Map<string, PlannedCourse[]>();

  for (const planned of plannedCourses) {
    const existing = semesterMap.get(planned.semester) || [];
    existing.push(planned);
    semesterMap.set(planned.semester, existing);
  }

  // Sort semesters chronologically
  const sortedSemesters = Array.from(semesterMap.keys()).sort((a, b) => {
    return getSemesterOrder(a) - getSemesterOrder(b);
  });

  const semesterAnalyses: SemesterAnalysis[] = [];
  const allConflicts: ScheduleConflict[] = [];
  const coursesUpToSemester = new Set(completedCourses.map(normalizeCode));

  let totalCredits = 0;
  let weightedGPASum = 0;

  for (const semester of sortedSemesters) {
    const semesterCourses = semesterMap.get(semester) || [];
    const analysis = analyzeSemester(
      semester,
      semesterCourses,
      courseData,
      coursesUpToSemester
    );

    semesterAnalyses.push(analysis);
    allConflicts.push(...analysis.conflicts);

    // Update running totals
    for (const courseCode of analysis.courses) {
      const course = courseData.get(normalizeCode(courseCode));
      if (course) {
        totalCredits += course.credits;
        weightedGPASum += (course.avgGPA || 3.0) * course.credits;
        coursesUpToSemester.add(normalizeCode(courseCode));
      }
    }
  }

  const estimatedGPA = totalCredits > 0 ? weightedGPASum / totalCredits : 0;
  const isValid = allConflicts.every((c) => c.severity !== 'error');

  return {
    semesters: semesterAnalyses,
    totalCredits,
    estimatedGPA,
    overallConflicts: allConflicts,
    isValid,
  };
}

function analyzeSemester(
  semester: string,
  plannedCourses: PlannedCourse[],
  courseData: Map<string, Course>,
  completedBefore: Set<string>
): SemesterAnalysis {
  const conflicts: ScheduleConflict[] = [];
  const recommendations: string[] = [];
  const courseCodes = plannedCourses.map((p) => p.courseCode);

  let totalCredits = 0;
  let totalDifficulty = 0;
  let totalWorkload = 0;
  let courseCount = 0;

  // Check for duplicates
  const seen = new Set<string>();
  for (const code of courseCodes) {
    const normalized = normalizeCode(code);
    if (seen.has(normalized)) {
      conflicts.push({
        type: 'duplicate',
        severity: 'error',
        message: `${code} is scheduled multiple times`,
        courses: [code],
      });
    }
    seen.add(normalized);
  }

  // Analyze each course
  for (const courseCode of courseCodes) {
    const course = courseData.get(normalizeCode(courseCode));

    if (!course) {
      recommendations.push(`Course ${courseCode} not found in database`);
      continue;
    }

    totalCredits += course.credits;
    totalDifficulty += course.difficultyRating || 3;
    totalWorkload += course.workloadHours || 10;
    courseCount++;

    // Check prerequisites
    for (const prereq of course.prerequisites || []) {
      const prereqNormalized = normalizeCode(prereq);
      const prereqInSemester = courseCodes.some(
        (c) => normalizeCode(c) === prereqNormalized
      );

      if (!completedBefore.has(prereqNormalized) && !prereqInSemester) {
        conflicts.push({
          type: 'prerequisite',
          severity: 'error',
          message: `${courseCode} requires ${prereq} which is not completed`,
          courses: [courseCode, prereq],
        });
      }

      if (prereqInSemester) {
        conflicts.push({
          type: 'corequisite',
          severity: 'warning',
          message: `${courseCode} and its prerequisite ${prereq} are in the same semester`,
          courses: [courseCode, prereq],
        });
      }
    }
  }

  // Check for overload
  if (totalCredits > 18) {
    conflicts.push({
      type: 'overload',
      severity: 'warning',
      message: `${totalCredits} credits exceeds typical maximum of 18`,
      courses: courseCodes,
    });
  }

  if (totalCredits < 12 && courseCodes.length > 0) {
    recommendations.push('Consider adding more courses to meet full-time requirements');
  }

  const avgDifficulty = courseCount > 0 ? totalDifficulty / courseCount : 0;

  if (avgDifficulty > 3.5) {
    recommendations.push('This semester has high average difficulty - consider balancing with easier courses');
  }

  return {
    semester,
    courses: courseCodes,
    totalCredits,
    avgDifficulty,
    estimatedWorkload: totalWorkload,
    conflicts,
    recommendations,
  };
}

export function detectScheduleConflicts(
  courseA: Course,
  courseB: Course
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  // Check if A requires B or vice versa
  if (courseA.prerequisites?.includes(courseB.code)) {
    conflicts.push({
      type: 'prerequisite',
      severity: 'error',
      message: `${courseA.code} requires ${courseB.code} as prerequisite`,
      courses: [courseA.code, courseB.code],
    });
  }

  if (courseB.prerequisites?.includes(courseA.code)) {
    conflicts.push({
      type: 'prerequisite',
      severity: 'error',
      message: `${courseB.code} requires ${courseA.code} as prerequisite`,
      courses: [courseA.code, courseB.code],
    });
  }

  return conflicts;
}

export function calculateGPAImpact(
  currentGPA: number,
  currentCredits: number,
  plannedCourses: Course[]
): { projectedGPA: number; gpaRange: { min: number; max: number } } {
  let plannedCredits = 0;
  let expectedPoints = 0;
  let minPoints = 0;
  let maxPoints = 0;

  for (const course of plannedCourses) {
    plannedCredits += course.credits;

    const avgGPA = course.avgGPA || 3.0;
    expectedPoints += avgGPA * course.credits;

    // Estimate range based on difficulty
    const difficulty = course.difficultyRating || 3;
    const variance = difficulty * 0.2;

    minPoints += Math.max(0, avgGPA - variance) * course.credits;
    maxPoints += Math.min(4.0, avgGPA + variance) * course.credits;
  }

  const totalCredits = currentCredits + plannedCredits;
  const currentPoints = currentGPA * currentCredits;

  const projectedGPA = totalCredits > 0 ? (currentPoints + expectedPoints) / totalCredits : 0;

  const minGPA = totalCredits > 0 ? (currentPoints + minPoints) / totalCredits : 0;

  const maxGPA = totalCredits > 0 ? (currentPoints + maxPoints) / totalCredits : 0;

  return {
    projectedGPA,
    gpaRange: { min: minGPA, max: maxGPA },
  };
}

function getSemesterOrder(semester: string): number {
  const parts = semester.split(' ');
  const term = parts[0];
  const year = parseInt(parts[1]) || 2024;

  const termOrder = term === 'Spring' ? 0 : term === 'Summer' ? 1 : 2;
  return year * 10 + termOrder;
}

function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/\s+/g, '');
}

export default {
  analyzeSchedule,
  detectScheduleConflicts,
  calculateGPAImpact,
};
