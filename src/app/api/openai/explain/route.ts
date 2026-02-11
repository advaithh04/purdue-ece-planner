import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateCourseExplanation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { courseCode } = body;

    if (!courseCode) {
      return NextResponse.json({ error: 'courseCode is required' }, { status: 400 });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { code: courseCode },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get user preferences if logged in
    let userPreferences = null;
    if (session?.user?.id) {
      const prefs = await prisma.userPreferences.findUnique({
        where: { userId: session.user.id },
      });
      if (prefs) {
        userPreferences = {
          careerGoals: prefs.careerGoals,
          interests: prefs.interests,
          targetGPA: prefs.targetGPA || undefined,
        };
      }
    }

    // Generate explanation
    const explanation = await generateCourseExplanation({
      course: {
        code: course.code,
        name: course.name,
        description: course.description || undefined,
        credits: course.credits,
        avgGPA: course.avgGPA || undefined,
        difficultyRating: course.difficultyRating || undefined,
        workloadHours: course.workloadHours || undefined,
      },
      userPreferences: userPreferences || undefined,
      context: userPreferences ? 'recommendation' : 'detail',
    });

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('OpenAI explain API error:', error);

    // Return a fallback explanation if OpenAI fails
    return NextResponse.json({
      explanation:
        'Unable to generate AI analysis at this time. Please check the course details and reviews for more information.',
    });
  }
}
