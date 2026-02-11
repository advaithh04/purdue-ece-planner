import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runAllScrapers, scrapePurdueCatalog, scrapeGradeDistributions, scrapeRatings } from '@/scrapers';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add admin check here
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { source = 'all' } = body;

    let result;

    switch (source) {
      case 'catalog':
        const courses = await scrapePurdueCatalog();
        result = { source: 'catalog', count: courses.length };
        break;

      case 'grades':
        const grades = await scrapeGradeDistributions();
        result = { source: 'grades', count: grades.length };
        break;

      case 'ratings':
        const reviews = await scrapeRatings();
        result = { source: 'ratings', count: reviews.length };
        break;

      default:
        const allResults = await runAllScrapers();
        result = allResults;
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Scraper API error:', error);
    return NextResponse.json(
      { error: 'Scraper failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return scraper status/logs
  try {
    const { prisma } = await import('@/lib/prisma');

    const logs = await prisma.scraperLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Scraper logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
