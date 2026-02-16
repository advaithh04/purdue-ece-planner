import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEMO_COURSES, findCourseByCode } from '@/lib/demo-courses';

// In-memory storage for demo mode (resets on server restart)
const demoPlannedCourses: Map<string, any[]> = new Map();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try database first
    if (process.env.DATABASE_URL) {
      try {
        const prisma = (await import('@/lib/prisma')).default;
        const plannedCourses = await prisma.plannedCourse.findMany({
          where: { userId: session.user.id },
          orderBy: [{ year: 'asc' }, { semester: 'asc' }],
        });

        const courseCodes = plannedCourses.map((p) => p.courseCode);
        const courses = await prisma.course.findMany({
          where: { code: { in: courseCodes } },
        });

        const courseMap = new Map(courses.map((c) => [c.code, c]));

        const plannedWithDetails = plannedCourses.map((planned) => ({
          ...planned,
          course: courseMap.get(planned.courseCode) || null,
        }));

        return NextResponse.json({ plannedCourses: plannedWithDetails });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Demo mode fallback
    const userPlanned = demoPlannedCourses.get(session.user.id) || [];
    const plannedWithDetails = userPlanned.map((planned) => ({
      ...planned,
      course: findCourseByCode(planned.courseCode),
    }));

    return NextResponse.json({ plannedCourses: plannedWithDetails });
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
      return NextResponse.json({ error: 'courseCode and semester are required' }, { status: 400 });
    }

    const yearMatch = semester.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

    // Try database first
    if (process.env.DATABASE_URL) {
      try {
        const prisma = (await import('@/lib/prisma')).default;
        const courseExists = await prisma.course.findUnique({ where: { code: courseCode } });

        if (!courseExists) {
          return NextResponse.json({ error: 'Course not found' }, { status: 400 });
        }

        const plannedCourse = await prisma.plannedCourse.upsert({
          where: { userId_courseCode_semester: { userId: session.user.id, courseCode, semester } },
          update: { status, year, updatedAt: new Date() },
          create: { userId: session.user.id, courseCode, semester, year, status },
        });

        return NextResponse.json({ success: true, plannedCourse });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Demo mode fallback
    const course = findCourseByCode(courseCode);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 400 });
    }

    const userPlanned = demoPlannedCourses.get(session.user.id) || [];
    const existing = userPlanned.findIndex(p => p.courseCode === courseCode && p.semester === semester);

    const newPlanned = {
      id: `demo-${Date.now()}`,
      userId: session.user.id,
      courseCode,
      semester,
      year,
      status,
    };

    if (existing >= 0) {
      userPlanned[existing] = newPlanned;
    } else {
      userPlanned.push(newPlanned);
    }

    demoPlannedCourses.set(session.user.id, userPlanned);
    return NextResponse.json({ success: true, plannedCourse: newPlanned });
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

    // Try database first
    if (process.env.DATABASE_URL) {
      try {
        const prisma = (await import('@/lib/prisma')).default;
        const existing = await prisma.plannedCourse.findFirst({ where: { id, userId: session.user.id } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const updateData: any = { updatedAt: new Date() };
        if (semester) {
          updateData.semester = semester;
          const yearMatch = semester.match(/\d{4}/);
          if (yearMatch) updateData.year = parseInt(yearMatch[0]);
        }
        if (status) updateData.status = status;
        if (grade !== undefined) updateData.grade = grade;

        const updated = await prisma.plannedCourse.update({ where: { id }, data: updateData });
        return NextResponse.json({ success: true, plannedCourse: updated });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Demo mode fallback
    const userPlanned = demoPlannedCourses.get(session.user.id) || [];
    const idx = userPlanned.findIndex(p => p.id === id);
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (semester) {
      userPlanned[idx].semester = semester;
      const yearMatch = semester.match(/\d{4}/);
      if (yearMatch) userPlanned[idx].year = parseInt(yearMatch[0]);
    }
    if (status) userPlanned[idx].status = status;
    if (grade !== undefined) userPlanned[idx].grade = grade;

    demoPlannedCourses.set(session.user.id, userPlanned);
    return NextResponse.json({ success: true, plannedCourse: userPlanned[idx] });
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

    // Try database first
    if (process.env.DATABASE_URL) {
      try {
        const prisma = (await import('@/lib/prisma')).default;
        const existing = await prisma.plannedCourse.findFirst({ where: { id, userId: session.user.id } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await prisma.plannedCourse.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Demo mode fallback
    const userPlanned = demoPlannedCourses.get(session.user.id) || [];
    const idx = userPlanned.findIndex(p => p.id === id);
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    userPlanned.splice(idx, 1);
    demoPlannedCourses.set(session.user.id, userPlanned);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Planner DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
