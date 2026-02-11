import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COURSES } from '@/lib/demo-courses';

export async function GET(request: NextRequest) {
  try {
    // Try database first
    const prisma = (await import('@/lib/prisma')).default;
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level');
    const sort = searchParams.get('sort') || 'code';
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = {};
    if (level && level !== 'all') {
      const levelNum = parseInt(level);
      where.level = { gte: levelNum, lt: levelNum + 10000 };
    }
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { code: 'asc' };
    switch (sort) {
      case 'gpa': orderBy = { avgGPA: 'desc' }; break;
      case 'difficulty': orderBy = { difficultyRating: 'asc' }; break;
      case 'reviews': orderBy = { reviewCount: 'desc' }; break;
      default: orderBy = { code: 'asc' };
    }

    const courses = await prisma.course.findMany({
      where, orderBy, take: limit,
      select: { id: true, code: true, name: true, credits: true, avgGPA: true, difficultyRating: true, workloadHours: true, reviewCount: true, careerTags: true, level: true },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Courses API error, using demo data:', error);
    // Fallback to demo data
    return NextResponse.json({ courses: DEMO_COURSES });
  }
}
