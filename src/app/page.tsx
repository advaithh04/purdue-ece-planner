import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Calendar, LineChart, Sparkles, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 purdue-gradient opacity-5" />
        <div className="container relative">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
              <Sparkles className="mr-2 h-4 w-4 text-purdue-gold" />
              AI-Powered Academic Planning
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Smart{' '}
              <span className="text-purdue-gold">ECE Course</span>{' '}
              Advisor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Plan your Purdue ECE curriculum with intelligent recommendations based on your career goals,
              GPA targets, and learning preferences. Make informed decisions with real grade data and student reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="purdue" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/finder">Course Finder</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything You Need to Plan Your Success</h2>
            <p className="text-muted-foreground mt-2">
              Powerful tools designed specifically for Purdue ECE students
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="course-card">
              <CardHeader>
                <Brain className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>Smart Recommendations</CardTitle>
                <CardDescription>
                  OpenAI-powered course suggestions with 34% improved accuracy based on your goals and academic history
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="course-card">
              <CardHeader>
                <LineChart className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>GPA Insights</CardTitle>
                <CardDescription>
                  Real grade distributions and difficulty ratings from thousands of student records
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="course-card">
              <CardHeader>
                <Calendar className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>Visual Planner</CardTitle>
                <CardDescription>
                  Drag-and-drop semester planning with automatic conflict detection and workload balancing
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="course-card">
              <CardHeader>
                <Target className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>Career Alignment</CardTitle>
                <CardDescription>
                  Match courses to your career path whether it is embedded systems, ML, hardware, or software
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="course-card">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>Course Reviews</CardTitle>
                <CardDescription>
                  Aggregated reviews from RateMyProfessor, Reddit, and student feedback
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="course-card">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-purdue-gold mb-2" />
                <CardTitle>AI Explanations</CardTitle>
                <CardDescription>
                  Get personalized explanations for why each course fits your goals using OpenAI
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to your optimized course plan</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purdue-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Tell Us Your Goals</h3>
              <p className="text-muted-foreground">
                Complete a quick questionnaire about your career interests, GPA targets, and workload preferences
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purdue-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Recommendations</h3>
              <p className="text-muted-foreground">
                Our engine analyzes 400+ courses to find the perfect matches for your unique profile
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purdue-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Plan Your Semesters</h3>
              <p className="text-muted-foreground">
                Use our visual planner to map out your entire academic journey with confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <Card className="purdue-gradient text-black">
            <CardContent className="flex flex-col items-center text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your ECE Journey?</h2>
              <p className="text-lg mb-6 opacity-80 max-w-xl">
                Explore 75+ ECE courses with real GPA data and difficulty ratings
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/courses">Explore All Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded purdue-gradient flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-black" />
            </div>
            <span className="font-semibold">Purdue ECE Planner</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Not affiliated with Purdue University. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
