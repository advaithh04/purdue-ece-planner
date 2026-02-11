import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COURSES, findCourseByCode } from '@/lib/demo-courses';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const courseCode = decodeURIComponent(params.code);

  try {
    if (!process.env.DATABASE_URL) throw new Error('No database');
    const prisma = (await import('@/lib/prisma')).default;

    const course = await prisma.course.findUnique({
      where: { code: courseCode },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!course) {
      // Try demo data fallback
      const demoCourse = findCourseByCode(courseCode);
      if (demoCourse) return NextResponse.json(demoCourse);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    // Fallback to demo data
    const demoCourse = findCourseByCode(courseCode);
    if (demoCourse) return NextResponse.json(demoCourse);
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
}
