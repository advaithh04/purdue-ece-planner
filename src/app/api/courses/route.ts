import { NextRequest, NextResponse } from 'next/server';

// Fallback course data for demo
const DEMO_COURSES = [
  { id: 'c1', code: 'ECE 20001', name: 'Electrical Engineering Fundamentals I', credits: 3, avgGPA: 2.85, difficultyRating: 3.2, workloadHours: 12, reviewCount: 156, careerTags: ['hardware', 'embedded', 'signals'], level: 20000 },
  { id: 'c2', code: 'ECE 20002', name: 'Electrical Engineering Fundamentals II', credits: 3, avgGPA: 2.78, difficultyRating: 3.4, workloadHours: 13, reviewCount: 142, careerTags: ['hardware', 'signals', 'power'], level: 20000 },
  { id: 'c3', code: 'ECE 20875', name: 'Python for Data Science', credits: 3, avgGPA: 3.25, difficultyRating: 2.5, workloadHours: 10, reviewCount: 203, careerTags: ['software', 'ml'], level: 20000 },
  { id: 'c4', code: 'ECE 26400', name: 'Advanced C Programming', credits: 3, avgGPA: 2.92, difficultyRating: 3.5, workloadHours: 14, reviewCount: 178, careerTags: ['software', 'embedded'], level: 26000 },
  { id: 'c5', code: 'ECE 27000', name: 'Introduction to Digital System Design', credits: 4, avgGPA: 2.95, difficultyRating: 3.3, workloadHours: 14, reviewCount: 165, careerTags: ['hardware', 'embedded', 'vlsi'], level: 27000 },
  { id: 'c6', code: 'ECE 30100', name: 'Signals and Systems', credits: 3, avgGPA: 2.58, difficultyRating: 4.2, workloadHours: 15, reviewCount: 189, careerTags: ['signals', 'communications', 'ml'], level: 30000 },
  { id: 'c7', code: 'ECE 30200', name: 'Probabilistic Methods in ECE', credits: 3, avgGPA: 2.72, difficultyRating: 3.8, workloadHours: 13, reviewCount: 134, careerTags: ['ml', 'signals'], level: 30000 },
  { id: 'c8', code: 'ECE 36200', name: 'Microprocessor Systems and Interfacing', credits: 4, avgGPA: 2.88, difficultyRating: 3.6, workloadHours: 15, reviewCount: 145, careerTags: ['embedded', 'hardware', 'software'], level: 36000 },
  { id: 'c9', code: 'ECE 36800', name: 'Data Structures', credits: 3, avgGPA: 2.95, difficultyRating: 3.4, workloadHours: 12, reviewCount: 167, careerTags: ['software'], level: 36000 },
  { id: 'c10', code: 'ECE 43700', name: 'Introduction to VLSI Design', credits: 3, avgGPA: 2.82, difficultyRating: 3.9, workloadHours: 14, reviewCount: 98, careerTags: ['vlsi', 'hardware'], level: 43000 },
  { id: 'c11', code: 'ECE 46100', name: 'Software Engineering', credits: 3, avgGPA: 3.15, difficultyRating: 2.8, workloadHours: 10, reviewCount: 112, careerTags: ['software'], level: 46000 },
  { id: 'c12', code: 'ECE 49500', name: 'Introduction to Machine Learning', credits: 3, avgGPA: 3.08, difficultyRating: 3.5, workloadHours: 13, reviewCount: 187, careerTags: ['ml', 'software'], level: 49000 },
  { id: 'c13', code: 'ECE 50863', name: 'Deep Learning', credits: 3, avgGPA: 3.22, difficultyRating: 3.6, workloadHours: 14, reviewCount: 156, careerTags: ['ml', 'software'], level: 50000 },
  { id: 'c14', code: 'ECE 55900', name: 'Microprocessor Architectures', credits: 3, avgGPA: 2.92, difficultyRating: 3.7, workloadHours: 13, reviewCount: 89, careerTags: ['hardware', 'embedded', 'software'], level: 55000 },
  { id: 'c15', code: 'ECE 59500', name: 'Reinforcement Learning', credits: 3, avgGPA: 3.18, difficultyRating: 3.8, workloadHours: 14, reviewCount: 76, careerTags: ['ml', 'robotics'], level: 59000 },
];

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
