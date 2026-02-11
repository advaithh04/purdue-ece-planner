import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateRecommendationScores, getTopRecommendations } from '@/engine/matcher';

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

    if (!preferences) {
      return NextResponse.json(
        { error: 'Please complete the questionnaire first' },
        { status: 400 }
      );
    }

    // Get all courses
    const courses = await prisma.course.findMany();

    // Get user's planned and completed courses
    const plannedCourses = await prisma.plannedCourse.findMany({
      where: { userId: session.user.id },
    });

    const completedCourses = [
      ...(preferences.completedCourses || []),
      ...plannedCourses.filter((p) => p.status === 'completed').map((p) => p.courseCode),
    ];

    // Calculate recommendations
    const scores = calculateRecommendationScores(courses, preferences, completedCourses);
    const topRecommendations = getTopRecommendations(scores, 20);

    return NextResponse.json({
      recommendations: topRecommendations.map((rec) => ({
        course: {
          id: rec.course.id,
          code: rec.course.code,
          name: rec.course.name,
          credits: rec.course.credits,
          avgGPA: rec.course.avgGPA,
          difficultyRating: rec.course.difficultyRating,
          careerTags: rec.course.careerTags,
        },
        score: rec.score,
        rank: rec.rank,
        factors: rec.factors,
      })),
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
