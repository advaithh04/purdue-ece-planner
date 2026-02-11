import type { Course, UserPreferences } from '@prisma/client';
import type { RecommendationScore, RecommendationWeights, RecommendationFactors } from '@/types';

// Default weights for recommendation scoring
const DEFAULT_WEIGHTS: RecommendationWeights = {
  careerMatch: 0.25,
  difficultyMatch: 0.15,
  gpaOptimal: 0.20,
  prerequisiteReady: 0.15,
  workloadFit: 0.15,
  interestMatch: 0.10,
};

export function calculateRecommendationScores(
  courses: Course[],
  preferences: UserPreferences,
  completedCourses: string[],
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): RecommendationScore[] {
  const scores: RecommendationScore[] = [];

  for (const course of courses) {
    // Skip already completed courses
    if (completedCourses.includes(course.code)) {
      continue;
    }

    const factors = calculateFactors(course, preferences, completedCourses);
    const score = calculateWeightedScore(factors, weights);

    scores.push({
      course,
      score,
      rank: 0, // Will be set after sorting
      factors,
    });
  }

  // Sort by score descending and assign ranks
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((s, index) => {
    s.rank = index + 1;
  });

  return scores;
}

function calculateFactors(
  course: Course,
  preferences: UserPreferences,
  completedCourses: string[]
): RecommendationFactors {
  return {
    careerMatch: calculateCareerMatch(course, preferences),
    difficultyMatch: calculateDifficultyMatch(course, preferences),
    gpaOptimal: calculateGPAOptimal(course, preferences),
    prerequisiteReady: checkPrerequisitesReady(course, completedCourses),
    workloadFit: calculateWorkloadFit(course, preferences),
    interestMatch: calculateInterestMatch(course, preferences),
  };
}

function calculateCareerMatch(course: Course, preferences: UserPreferences): number {
  if (!preferences.careerGoals || preferences.careerGoals.length === 0) {
    return 50; // Neutral if no preferences set
  }

  const courseTags = course.careerTags || [];
  if (courseTags.length === 0) {
    return 40; // Slight penalty for uncategorized courses
  }

  const matchCount = courseTags.filter((tag) =>
    preferences.careerGoals.includes(tag)
  ).length;

  // Score based on percentage of matches
  const matchPercent = matchCount / Math.max(preferences.careerGoals.length, 1);

  // 0 matches = 20, all match = 100
  return 20 + matchPercent * 80;
}

function calculateDifficultyMatch(course: Course, preferences: UserPreferences): number {
  if (!preferences.preferredDifficulty) {
    return 50; // Neutral if no preference
  }

  const courseDifficulty = course.difficultyRating || 3; // Default to moderate

  // Map preference to target difficulty
  const difficultyMap: Record<string, number> = {
    easy: 2,
    moderate: 3,
    challenging: 4,
  };

  const preferredDiff = difficultyMap[preferences.preferredDifficulty] || 3;

  // Calculate how close the course is to preferred difficulty
  const difference = Math.abs(courseDifficulty - preferredDiff);

  // Perfect match = 100, 1 level off = 70, 2 levels = 40, 3+ levels = 20
  if (difference === 0) return 100;
  if (difference <= 1) return 70;
  if (difference <= 2) return 40;
  return 20;
}

function calculateGPAOptimal(course: Course, preferences: UserPreferences): number {
  if (!preferences.targetGPA || !course.avgGPA) {
    return 50; // Neutral if no target or no GPA data
  }

  const targetGPA = preferences.targetGPA;
  const courseGPA = course.avgGPA;

  // If course GPA is above target, it's favorable
  if (courseGPA >= targetGPA) {
    // Higher is better, but diminishing returns
    const buffer = courseGPA - targetGPA;
    return Math.min(100, 70 + buffer * 30);
  }

  // If course GPA is below target, calculate risk
  const deficit = targetGPA - courseGPA;

  // Small deficit = still okay, large deficit = risky
  if (deficit <= 0.3) return 60;
  if (deficit <= 0.5) return 45;
  if (deficit <= 0.8) return 30;
  return 20;
}

function checkPrerequisitesReady(course: Course, completedCourses: string[]): number {
  const prerequisites = course.prerequisites || [];

  if (prerequisites.length === 0) {
    return 100; // No prerequisites, always ready
  }

  // Check how many prerequisites are satisfied
  const completedSet = new Set(completedCourses.map((c) => c.toUpperCase().replace(/\s+/g, '')));

  const satisfiedCount = prerequisites.filter((prereq) => {
    const normalizedPrereq = prereq.toUpperCase().replace(/\s+/g, '');
    return completedSet.has(normalizedPrereq);
  }).length;

  const satisfiedPercent = satisfiedCount / prerequisites.length;

  // All satisfied = 100, partial = scaled, none = 0
  return Math.round(satisfiedPercent * 100);
}

function calculateWorkloadFit(course: Course, preferences: UserPreferences): number {
  if (!preferences.maxWorkloadHours || !course.workloadHours) {
    return 50; // Neutral if no data
  }

  const maxHours = preferences.maxWorkloadHours;
  const courseHours = course.workloadHours;

  if (courseHours <= maxHours * 0.7) {
    // Well under budget - good but might be too easy
    return 80;
  }

  if (courseHours <= maxHours) {
    // Within budget - perfect
    return 100;
  }

  // Over budget - penalize based on how much
  const overPercent = (courseHours - maxHours) / maxHours;

  if (overPercent <= 0.2) return 60;
  if (overPercent <= 0.5) return 40;
  return 20;
}

function calculateInterestMatch(course: Course, preferences: UserPreferences): number {
  if (!preferences.interests || preferences.interests.length === 0) {
    return 50; // Neutral if no interests set
  }

  const courseTags = course.interestTags || [];
  if (courseTags.length === 0) {
    return 40; // Slight penalty for uncategorized
  }

  const matchCount = courseTags.filter((tag) =>
    preferences.interests.includes(tag)
  ).length;

  // Score based on any matches (interest matching is more flexible)
  if (matchCount === 0) return 30;
  if (matchCount === 1) return 60;
  if (matchCount === 2) return 80;
  return 100;
}

function calculateWeightedScore(factors: RecommendationFactors, weights: RecommendationWeights): number {
  const score =
    factors.careerMatch * weights.careerMatch +
    factors.difficultyMatch * weights.difficultyMatch +
    factors.gpaOptimal * weights.gpaOptimal +
    factors.prerequisiteReady * weights.prerequisiteReady +
    factors.workloadFit * weights.workloadFit +
    factors.interestMatch * weights.interestMatch;

  // Normalize to 0-100
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function getTopRecommendations(
  scores: RecommendationScore[],
  limit: number = 10,
  minPrereqScore: number = 50
): RecommendationScore[] {
  return scores
    .filter((s) => s.factors.prerequisiteReady >= minPrereqScore)
    .slice(0, limit);
}

export function filterByCareerPath(
  scores: RecommendationScore[],
  careerPath: string
): RecommendationScore[] {
  return scores.filter((s) => s.course.careerTags?.includes(careerPath));
}

export default { calculateRecommendationScores, getTopRecommendations, filterByCareerPath };
