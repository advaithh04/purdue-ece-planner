import type { Course } from '@prisma/client';

interface PrerequisiteNode {
  code: string;
  course?: Course;
  prerequisites: PrerequisiteNode[];
  depth: number;
}

interface PrerequisiteChain {
  targetCourse: string;
  chain: string[];
  totalCourses: number;
  totalCredits: number;
  estimatedSemesters: number;
}

export function buildPrerequisiteTree(
  course: Course,
  allCourses: Map<string, Course>,
  maxDepth: number = 5
): PrerequisiteNode {
  function buildNode(courseCode: string, depth: number): PrerequisiteNode {
    if (depth > maxDepth) {
      return { code: courseCode, prerequisites: [], depth };
    }

    const currentCourse = allCourses.get(normalizeCode(courseCode));
    const prereqs = currentCourse?.prerequisites || [];

    return {
      code: courseCode,
      course: currentCourse,
      prerequisites: prereqs.map((p) => buildNode(p, depth + 1)),
      depth,
    };
  }

  return buildNode(course.code, 0);
}

export function getPrerequisiteChain(
  targetCourse: Course,
  allCourses: Map<string, Course>,
  completedCourses: string[]
): PrerequisiteChain {
  const completedSet = new Set(completedCourses.map(normalizeCode));
  const chain: string[] = [];
  const visited = new Set<string>();

  function collectPrereqs(code: string) {
    const normalizedCode = normalizeCode(code);

    if (visited.has(normalizedCode) || completedSet.has(normalizedCode)) {
      return;
    }

    visited.add(normalizedCode);

    const course = allCourses.get(normalizedCode);
    if (!course) return;

    // First collect prerequisites of this course
    for (const prereq of course.prerequisites || []) {
      collectPrereqs(prereq);
    }

    // Then add this course (to maintain dependency order)
    if (!completedSet.has(normalizedCode)) {
      chain.push(code);
    }
  }

  collectPrereqs(targetCourse.code);

  // Calculate metrics
  let totalCredits = 0;
  for (const code of chain) {
    const course = allCourses.get(normalizeCode(code));
    if (course) {
      totalCredits += course.credits;
    }
  }

  // Estimate semesters (assuming ~15 credits per semester average)
  const estimatedSemesters = Math.ceil(totalCredits / 15);

  return {
    targetCourse: targetCourse.code,
    chain,
    totalCourses: chain.length,
    totalCredits,
    estimatedSemesters,
  };
}

export function checkPrerequisitesSatisfied(
  course: Course,
  completedCourses: string[]
): { satisfied: boolean; missing: string[] } {
  const completedSet = new Set(completedCourses.map(normalizeCode));
  const missing: string[] = [];

  for (const prereq of course.prerequisites || []) {
    if (!completedSet.has(normalizeCode(prereq))) {
      missing.push(prereq);
    }
  }

  return {
    satisfied: missing.length === 0,
    missing,
  };
}

export function getAvailableCourses(
  allCourses: Course[],
  completedCourses: string[]
): Course[] {
  const completedSet = new Set(completedCourses.map(normalizeCode));

  return allCourses.filter((course) => {
    // Skip already completed courses
    if (completedSet.has(normalizeCode(course.code))) {
      return false;
    }

    // Check all prerequisites are satisfied
    const prereqs = course.prerequisites || [];
    return prereqs.every((prereq) => completedSet.has(normalizeCode(prereq)));
  });
}

export function suggestNextCourses(
  allCourses: Course[],
  completedCourses: string[],
  targetCredits: number = 15
): Course[] {
  const available = getAvailableCourses(allCourses, completedCourses);

  // Sort by:
  // 1. Courses that unlock more future courses (more valuable)
  // 2. Lower level courses first
  // 3. Higher GPA courses as tiebreaker

  const courseValue = new Map<string, number>();

  for (const course of available) {
    let value = 0;

    // Count how many courses this unlocks
    for (const other of allCourses) {
      if (other.prerequisites?.includes(course.code)) {
        value += 10;
      }
    }

    // Prefer lower level courses
    const level = course.level || 20000;
    value += (50000 - level) / 1000;

    // GPA bonus
    value += (course.avgGPA || 3.0) * 5;

    courseValue.set(course.code, value);
  }

  available.sort((a, b) => {
    const valueA = courseValue.get(a.code) || 0;
    const valueB = courseValue.get(b.code) || 0;
    return valueB - valueA;
  });

  // Select courses up to target credits
  const selected: Course[] = [];
  let totalCredits = 0;

  for (const course of available) {
    if (totalCredits + course.credits <= targetCredits) {
      selected.push(course);
      totalCredits += course.credits;
    }

    if (totalCredits >= targetCredits) break;
  }

  return selected;
}

function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/\s+/g, '');
}

export function visualizePrerequisites(node: PrerequisiteNode, indent: string = ''): string {
  let result = `${indent}${node.code}`;

  if (node.course) {
    result += ` (${node.course.credits} cr)`;
  }

  result += '\n';

  for (const prereq of node.prerequisites) {
    result += visualizePrerequisites(prereq, indent + '  ');
  }

  return result;
}

export default {
  buildPrerequisiteTree,
  getPrerequisiteChain,
  checkPrerequisitesSatisfied,
  getAvailableCourses,
  suggestNextCourses,
  visualizePrerequisites,
};
