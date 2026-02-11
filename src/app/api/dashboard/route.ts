import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Get planned courses
    const plannedCourses = await prisma.plannedCourse.findMany({
      where: { userId: session.user.id },
    });

    // Calculate completed credits (courses with status 'completed')
    const completedCourses = plannedCourses.filter((c) => c.status === 'completed');
    const completedCourseCodes = completedCourses.map((c) => c.courseCode);

    let completedCredits = 0;
    if (completedCourseCodes.length > 0) {
      const courses = await prisma.course.findMany({
        where: { code: { in: completedCourseCodes } },
        select: { credits: true },
      });
      completedCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    }

    // Get top recommendations if user has preferences
    let recommendations: Array<{ code: string; name: string; score: number }> = [];

    if (preferences) {
      // Simple recommendation logic - will be enhanced with the full recommendation engine
      const availableCourses = await prisma.course.findMany({
        where: {
          code: {
            notIn: [...(preferences.completedCourses || []), ...plannedCourses.map((c) => c.courseCode)],
          },
        },
        take: 10,
        orderBy: { avgGPA: 'desc' },
      });

      recommendations = availableCourses.map((course) => ({
        code: course.code,
        name: course.name,
        score: calculateSimpleScore(course, preferences),
      }));

      recommendations.sort((a, b) => b.score - a.score);
    }

    // Get next courses in major sequence
    const nextInMajor = await getNextMajorCourses(completedCourseCodes, plannedCourses.map(c => c.courseCode));

    return NextResponse.json({
      hasPreferences: !!preferences,
      plannedCoursesCount: plannedCourses.length,
      completedCredits,
      targetCredits: 128, // Standard ECE degree requirement
      recommendations: recommendations.slice(0, 5),
      nextInMajor,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getNextMajorCourses(
  completedCourses: string[],
  plannedCourses: string[]
): Promise<Array<{ code: string; name: string; credits: number; reason: string }>> {
  // Get all major requirement courses
  const majorCourses = await prisma.course.findMany({
    where: {
      isMajorRequirement: true,
      code: {
        notIn: [...completedCourses, ...plannedCourses],
      },
    },
    orderBy: { level: 'asc' },
  });

  const nextCourses: Array<{ code: string; name: string; credits: number; reason: string; priority: number }> = [];

  for (const course of majorCourses) {
    // Check if all prerequisites are completed
    const prereqsMet = course.prerequisites.length === 0 ||
      course.prerequisites.every(prereq => completedCourses.includes(prereq));

    if (prereqsMet) {
      // Determine the reason for recommendation
      let reason = '';
      let priority = 0;

      if (course.prerequisites.length === 0) {
        reason = 'No prerequisites required';
        priority = course.level || 20000;
      } else {
        const recentlyCompleted = course.prerequisites.filter(p => completedCourses.includes(p));
        if (recentlyCompleted.length > 0) {
          reason = `Prereqs completed: ${recentlyCompleted.join(', ')}`;
          priority = (course.level || 20000) - 5000; // Prioritize courses with recently completed prereqs
        }
      }

      // Add requirement category info
      if (course.requirementCategory) {
        reason += ` • ${course.requirementCategory.charAt(0).toUpperCase() + course.requirementCategory.slice(1)} requirement`;
      }

      nextCourses.push({
        code: course.code,
        name: course.name,
        credits: course.credits,
        reason,
        priority,
      });
    }
  }

  // Sort by priority (lower level courses first, then by those with completed prereqs)
  nextCourses.sort((a, b) => a.priority - b.priority);

  // Return top 5 next courses
  return nextCourses.slice(0, 5).map(({ code, name, credits, reason }) => ({
    code,
    name,
    credits,
    reason,
  }));
}

function calculateSimpleScore(
  course: { avgGPA: number | null; careerTags: string[]; interestTags: string[]; difficultyRating: number | null },
  preferences: { careerGoals: string[]; interests: string[]; preferredDifficulty: string | null; targetGPA: number | null }
): number {
  let score = 50; // Base score

  // Career match
  const careerMatch = course.careerTags.filter((tag) => preferences.careerGoals.includes(tag)).length;
  score += careerMatch * 15;

  // Interest match
  const interestMatch = course.interestTags.filter((tag) => preferences.interests.includes(tag)).length;
  score += interestMatch * 10;

  // GPA consideration
  if (course.avgGPA && preferences.targetGPA) {
    if (course.avgGPA >= preferences.targetGPA) {
      score += 10;
    }
  }

  // Difficulty preference
  if (course.difficultyRating && preferences.preferredDifficulty) {
    const diffMap: Record<string, number> = { easy: 2, moderate: 3, challenging: 4 };
    const preferred = diffMap[preferences.preferredDifficulty] || 3;
    const diff = Math.abs((course.difficultyRating || 3) - preferred);
    score -= diff * 5;
  }

  return Math.min(100, Math.max(0, score));
}
