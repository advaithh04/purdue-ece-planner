import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COURSES } from '@/lib/demo-courses';

function getFilteredDemoCourses(level: string | null, sort: string, search: string | null, limit: number) {
  let courses = [...DEMO_COURSES];

  // Filter by level
  if (level && level !== 'all') {
    const levelNum = parseInt(level);
    courses = courses.filter(c => c.level >= levelNum && c.level < levelNum + 10000);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    courses = courses.filter(c =>
      c.code.toLowerCase().includes(searchLower) ||
      c.name.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  switch (sort) {
    case 'gpa':
      courses.sort((a, b) => (b.avgGPA || 0) - (a.avgGPA || 0));
      break;
    case 'difficulty':
      courses.sort((a, b) => (a.difficultyRating || 5) - (b.difficultyRating || 5));
      break;
    case 'reviews':
      courses.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
    default:
      courses.sort((a, b) => a.code.localeCompare(b.code));
  }

  return courses.slice(0, limit);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get('level');
  const sort = searchParams.get('sort') || 'code';
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '500');

  try {
    const prisma = (await import('@/lib/prisma')).default;
    if (!process.env.DATABASE_URL) throw new Error('No database');

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
    // Fallback to demo data with filters applied
    const courses = getFilteredDemoCourses(level, sort, search, limit);
    return NextResponse.json({ courses });
  }
}
