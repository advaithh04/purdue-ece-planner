import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      careerGoals,
      interests,
      targetGPA,
      maxWorkloadHours,
      preferredDifficulty,
      completedCourses,
      currentSemester,
      graduationSemester,
    } = body;

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        careerGoals: careerGoals || [],
        interests: interests || [],
        targetGPA: targetGPA ? parseFloat(targetGPA) : null,
        maxWorkloadHours: maxWorkloadHours ? parseInt(maxWorkloadHours) : null,
        preferredDifficulty: preferredDifficulty || null,
        completedCourses: completedCourses || [],
        currentSemester: currentSemester || null,
        graduationSemester: graduationSemester || null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        careerGoals: careerGoals || [],
        interests: interests || [],
        targetGPA: targetGPA ? parseFloat(targetGPA) : null,
        maxWorkloadHours: maxWorkloadHours ? parseInt(maxWorkloadHours) : null,
        preferredDifficulty: preferredDifficulty || null,
        completedCourses: completedCourses || [],
        currentSemester: currentSemester || null,
        graduationSemester: graduationSemester || null,
      },
    });

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Preferences POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
