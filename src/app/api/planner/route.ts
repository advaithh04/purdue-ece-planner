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

    const plannedCourses = await prisma.plannedCourse.findMany({
      where: { userId: session.user.id },
      orderBy: [{ year: 'asc' }, { semester: 'asc' }],
    });

    // Get course details for planned courses
    const courseCodes = plannedCourses.map((p) => p.courseCode);
    const courses = await prisma.course.findMany({
      where: { code: { in: courseCodes } },
    });

    const courseMap = new Map(courses.map((c) => [c.code, c]));

    const plannedWithDetails = plannedCourses.map((planned) => ({
      ...planned,
      course: courseMap.get(planned.courseCode) || null,
    }));

    // Group by semester
    const semesterGroups: Record<string, typeof plannedWithDetails> = {};
    for (const planned of plannedWithDetails) {
      const key = planned.semester;
      if (!semesterGroups[key]) {
        semesterGroups[key] = [];
      }
      semesterGroups[key].push(planned);
    }

    return NextResponse.json({
      plannedCourses: plannedWithDetails,
      semesterGroups,
    });
  } catch (error) {
    console.error('Planner GET error:', error);
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
    const { courseCode, semester, status = 'planned' } = body;

    if (!courseCode || !semester) {
      return NextResponse.json(
        { error: 'courseCode and semester are required' },
        { status: 400 }
      );
    }

    // Validate that the course exists in the database
    const courseExists = await prisma.course.findUnique({
      where: { code: courseCode },
    });

    if (!courseExists) {
      return NextResponse.json(
        { error: 'Course not found. Please select a valid course from the list.' },
        { status: 400 }
      );
    }

    // Extract year from semester (e.g., "Fall 2024" -> 2024)
    const yearMatch = semester.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

    const plannedCourse = await prisma.plannedCourse.upsert({
      where: {
        userId_courseCode_semester: {
          userId: session.user.id,
          courseCode,
          semester,
        },
      },
      update: {
        status,
        year,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        courseCode,
        semester,
        year,
        status,
      },
    });

    return NextResponse.json({ success: true, plannedCourse });
  } catch (error) {
    console.error('Planner POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, semester, status, grade } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.plannedCourse.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (semester) {
      updateData.semester = semester;
      const yearMatch = semester.match(/\d{4}/);
      if (yearMatch) {
        updateData.year = parseInt(yearMatch[0]);
      }
    }
    if (status) updateData.status = status;
    if (grade !== undefined) updateData.grade = grade;

    const updated = await prisma.plannedCourse.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, plannedCourse: updated });
  } catch (error) {
    console.error('Planner PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.plannedCourse.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.plannedCourse.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
