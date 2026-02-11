import type { Course } from '@prisma/client';

interface GPAOptimizationResult {
  recommendedCourses: Course[];
  projectedGPA: number;
  totalCredits: number;
  averageDifficulty: number;
  reasoning: string[];
}

interface OptimizationConstraints {
  targetGPA: number;
  maxCredits: number;
  minCredits: number;
  maxDifficulty: number;
  requiredCourses?: string[];
  excludedCourses?: string[];
}

export function optimizeForGPA(
  availableCourses: Course[],
  constraints: OptimizationConstraints
): GPAOptimizationResult {
  const reasoning: string[] = [];

  // Filter courses based on constraints
  let candidates = availableCourses.filter((course) => {
    // Exclude specific courses
    if (constraints.excludedCourses?.includes(course.code)) {
      return false;
    }

    // Filter by difficulty
    if (constraints.maxDifficulty && (course.difficultyRating || 3) > constraints.maxDifficulty) {
      return false;
    }

    return true;
  });

  // Include required courses first
  const required: Course[] = [];
  if (constraints.requiredCourses) {
    for (const reqCode of constraints.requiredCourses) {
      const course = candidates.find((c) => c.code === reqCode);
      if (course) {
        required.push(course);
        candidates = candidates.filter((c) => c.code !== reqCode);
      }
    }
  }

  // Calculate required credits and space remaining
  const requiredCredits = required.reduce((sum, c) => sum + c.credits, 0);
  const remainingCredits = constraints.maxCredits - requiredCredits;

  if (requiredCredits > constraints.maxCredits) {
    reasoning.push(`Required courses (${requiredCredits} credits) exceed maximum (${constraints.maxCredits} credits)`);
    return {
      recommendedCourses: required,
      projectedGPA: calculateProjectedGPA(required),
      totalCredits: requiredCredits,
      averageDifficulty: calculateAvgDifficulty(required),
      reasoning,
    };
  }

  // Score remaining candidates
  interface ScoredCourse {
    course: Course;
    score: number;
    gpaContribution: number;
  }

  const scored: ScoredCourse[] = candidates.map((course) => {
    const avgGPA = course.avgGPA || 3.0;
    const difficulty = course.difficultyRating || 3;

    // Score based on:
    // 1. How much the course GPA exceeds target (primary)
    // 2. Lower difficulty is better (secondary)
    // 3. Credit efficiency (tertiary)

    let score = 0;

    // GPA contribution score (0-50 points)
    const gpaBuffer = avgGPA - constraints.targetGPA;
    score += Math.max(0, Math.min(50, (gpaBuffer + 1) * 25));

    // Difficulty score (0-30 points, lower is better)
    score += (5 - difficulty) * 6;

    // Credit efficiency (0-20 points, 3 credits is optimal)
    const creditOptimality = Math.abs(course.credits - 3);
    score += (3 - creditOptimality) * 5;

    return {
      course,
      score,
      gpaContribution: avgGPA * course.credits,
    };
  });

  // Sort by score (higher is better)
  scored.sort((a, b) => b.score - a.score);

  // Greedy selection
  const selected = [...required];
  let totalCredits = requiredCredits;

  for (const { course } of scored) {
    if (totalCredits + course.credits <= constraints.maxCredits) {
      selected.push(course);
      totalCredits += course.credits;

      if (totalCredits >= constraints.minCredits && selected.length >= 4) {
        // Good stopping point
        break;
      }
    }
  }

  // Generate reasoning
  const projectedGPA = calculateProjectedGPA(selected);
  const avgDifficulty = calculateAvgDifficulty(selected);

  if (projectedGPA >= constraints.targetGPA) {
    reasoning.push(`Selected courses project to ${projectedGPA.toFixed(2)} GPA, meeting target of ${constraints.targetGPA}`);
  } else {
    reasoning.push(`Projected GPA of ${projectedGPA.toFixed(2)} is below target of ${constraints.targetGPA}`);
    reasoning.push('Consider substituting difficult courses with easier alternatives');
  }

  if (avgDifficulty > 3.5) {
    reasoning.push('Warning: High average difficulty may make target GPA harder to achieve');
  }

  if (totalCredits < constraints.minCredits) {
    reasoning.push(`Only ${totalCredits} credits selected, below minimum of ${constraints.minCredits}`);
  }

  return {
    recommendedCourses: selected,
    projectedGPA,
    totalCredits,
    averageDifficulty: avgDifficulty,
    reasoning,
  };
}

export function findGPABoostCourses(
  availableCourses: Course[],
  currentGPA: number,
  currentCredits: number,
  targetGPA: number,
  maxCourses: number = 5
): Course[] {
  // Find courses that would improve GPA toward target
  const neededImprovement = targetGPA - currentGPA;

  if (neededImprovement <= 0) {
    // Already at or above target, return highest GPA courses for maintenance
    return availableCourses
      .filter((c) => c.avgGPA && c.avgGPA >= targetGPA)
      .sort((a, b) => (b.avgGPA || 0) - (a.avgGPA || 0))
      .slice(0, maxCourses);
  }

  // Calculate what GPA is needed in new courses to reach target
  // targetGPA = (currentGPA * currentCredits + newGPA * newCredits) / (currentCredits + newCredits)
  // Assuming ~15 credits of new courses:
  const newCredits = 15;
  const neededNewGPA =
    (targetGPA * (currentCredits + newCredits) - currentGPA * currentCredits) / newCredits;

  // Find courses with GPA above needed threshold
  const candidates = availableCourses
    .filter((c) => c.avgGPA && c.avgGPA >= Math.min(neededNewGPA, 3.5))
    .sort((a, b) => {
      // Sort by GPA / difficulty ratio (efficiency)
      const effA = (a.avgGPA || 3) / (a.difficultyRating || 3);
      const effB = (b.avgGPA || 3) / (b.difficultyRating || 3);
      return effB - effA;
    });

  return candidates.slice(0, maxCourses);
}

export function analyzeGPARisk(courses: Course[]): {
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
} {
  const factors: string[] = [];

  const avgGPA = calculateProjectedGPA(courses);
  const avgDifficulty = calculateAvgDifficulty(courses);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  // Check for high difficulty courses
  const hardCourses = courses.filter((c) => (c.difficultyRating || 3) >= 4);
  if (hardCourses.length >= 3) {
    factors.push(`${hardCourses.length} courses have high difficulty ratings`);
  }

  // Check for low GPA courses
  const lowGPACourses = courses.filter((c) => (c.avgGPA || 3) < 2.7);
  if (lowGPACourses.length > 0) {
    factors.push(`${lowGPACourses.length} courses have historically low average GPAs`);
  }

  // Check credit load
  if (totalCredits > 17) {
    factors.push(`Heavy credit load of ${totalCredits} credits`);
  }

  // Check combination effects
  if (avgDifficulty > 3.5 && totalCredits >= 15) {
    factors.push('Combination of high difficulty and full credit load');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  if (factors.length >= 3 || (avgDifficulty > 4 && totalCredits >= 15)) {
    riskLevel = 'high';
  } else if (factors.length >= 1) {
    riskLevel = 'medium';
  }

  return { riskLevel, factors };
}

function calculateProjectedGPA(courses: Course[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const credits = course.credits;
    const gpa = course.avgGPA || 3.0;
    totalPoints += gpa * credits;
    totalCredits += credits;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function calculateAvgDifficulty(courses: Course[]): number {
  if (courses.length === 0) return 0;

  const totalDifficulty = courses.reduce(
    (sum, c) => sum + (c.difficultyRating || 3),
    0
  );

  return totalDifficulty / courses.length;
}

export default {
  optimizeForGPA,
  findGPABoostCourses,
  analyzeGPARisk,
};
