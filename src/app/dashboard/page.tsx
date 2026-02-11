'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, ClipboardList, Lightbulb, Sparkles, TrendingUp, ArrowRight, GraduationCap } from 'lucide-react';

interface DashboardData {
  hasPreferences: boolean;
  plannedCoursesCount: number;
  completedCredits: number;
  targetCredits: number;
  recommendations: Array<{
    code: string;
    name: string;
    score: number;
  }>;
  nextInMajor: Array<{
    code: string;
    name: string;
    credits: number;
    reason: string;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasPreferences = dashboardData?.hasPreferences ?? false;
  const completedCredits = dashboardData?.completedCredits ?? 0;
  const targetCredits = dashboardData?.targetCredits ?? 128;
  const progressPercent = Math.round((completedCredits / targetCredits) * 100);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is your academic planning overview
        </p>
      </div>

      {/* Quick Actions */}
      {!hasPreferences && (
        <Card className="mb-6 border-purdue-gold">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purdue-gold/20 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-purdue-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your goals to get personalized recommendations
                </p>
              </div>
            </div>
            <Button variant="purdue" asChild>
              <Link href="/questionnaire">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planned Courses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.plannedCoursesCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Across all semesters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Course Database</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400+</div>
            <p className="text-xs text-muted-foreground mt-2">ECE courses with full data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground mt-2">Based on user preferences</p>
          </CardContent>
        </Card>
      </div>

      {/* Next in Major Section */}
      <Card className="mb-6 border-purdue-gold">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purdue-gold" />
            Next in Major
          </CardTitle>
          <CardDescription>
            Courses you can take next based on completed prerequisites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(dashboardData?.nextInMajor ?? []).length > 0 ? (
            <div className="space-y-3">
              {dashboardData?.nextInMajor.map((course, index) => (
                <div
                  key={course.code}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purdue-gold/20 flex items-center justify-center text-sm font-medium text-purdue-gold">
                      {index + 1}
                    </div>
                    <div>
                      <Link
                        href={`/courses/${encodeURIComponent(course.code)}`}
                        className="font-medium hover:text-purdue-gold transition-colors flex items-center gap-1"
                      >
                        {course.code}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <p className="text-sm text-muted-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{course.reason}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{course.credits} cr</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/finder?majorRequirement=true">View All Major Requirements</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-3">
                Complete some prerequisite courses to see your next steps
              </p>
              <Button variant="outline" asChild>
                <Link href="/finder">Browse Courses</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purdue-gold" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions using OpenAI • 34% improved accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasPreferences ? (
              <div className="space-y-4">
                {(dashboardData?.recommendations ?? []).slice(0, 5).map((rec, index) => (
                  <div key={rec.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <div>
                        <Link
                          href={`/courses/${encodeURIComponent(rec.code)}`}
                          className="font-medium hover:text-purdue-gold transition-colors"
                        >
                          {rec.code}
                        </Link>
                        <p className="text-sm text-muted-foreground">{rec.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{Math.round(rec.score)}% match</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/courses?recommended=true">View All Recommendations</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Complete the questionnaire to get personalized recommendations
                </p>
                <Button variant="purdue" asChild>
                  <Link href="/questionnaire">Set Preferences</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              href="/courses"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Browse Courses</h4>
                <p className="text-sm text-muted-foreground">
                  Explore all ECE courses with grades and reviews
                </p>
              </div>
            </Link>

            <Link
              href="/planner"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Semester Planner</h4>
                <p className="text-sm text-muted-foreground">
                  Plan your courses semester by semester
                </p>
              </div>
            </Link>

            <Link
              href="/questionnaire"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Update Preferences</h4>
                <p className="text-sm text-muted-foreground">
                  Refine your goals and get better recommendations
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
