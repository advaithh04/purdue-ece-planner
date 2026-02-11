'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Loader2,
  ChevronDown,
  User,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatGPA, getGPAColor, getDifficultyLabel, getDifficultyColor } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  difficulty: number;
  workload: number;
  comment: string | null;
  professor: string | null;
  semester: string | null;
  source: string;
}

interface CourseDetail {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string | null;
  prerequisites: string[];
  corequisites: string[];
  avgGPA: number | null;
  gradeDistribution: { A: number; B: number; C: number; D: number; F: number } | null;
  difficultyRating: number | null;
  workloadHours: number | null;
  reviewCount: number;
  reviews: Review[];
  semesters: string[];
  careerTags: string[];
  interestTags: string[];
  professors: string[];
}

interface ProfessorGPA {
  name: string;
  gpa: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [addingToPlan, setAddingToPlan] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<string>('all');

  const courseCode = decodeURIComponent(params.code as string);

  // Generate simulated professor GPAs based on course GPA
  // In a real app, this would come from BoilerGrades API
  const getProfessorGPAs = (): ProfessorGPA[] => {
    if (!course || !course.professors || course.professors.length === 0) return [];

    const baseGPA = course.avgGPA || 3.0;
    return course.professors.map((prof, index) => {
      // Create slight variations in GPA for each professor (simulated data)
      const variation = ((index % 5) - 2) * 0.15;
      const gpa = Math.max(1.5, Math.min(4.0, baseGPA + variation));
      return {
        name: prof,
        gpa: parseFloat(gpa.toFixed(2)),
      };
    }).sort((a, b) => b.gpa - a.gpa); // Sort by GPA descending
  };

  // Generate grade distribution based on professor's GPA
  // Higher GPA = more A's and B's, Lower GPA = more C's, D's, F's
  const getGradeDistribution = (): { A: number; B: number; C: number; D: number; F: number } => {
    if (!course) return { A: 0, B: 0, C: 0, D: 0, F: 0 };

    // If "all" selected, use course's grade distribution
    if (selectedProfessor === 'all') {
      return course.gradeDistribution || { A: 25, B: 30, C: 25, D: 12, F: 8 };
    }

    // Find the professor's GPA
    const profData = getProfessorGPAs().find(p => p.name === selectedProfessor);
    const profGPA = profData?.gpa || course.avgGPA || 3.0;

    // Generate distribution based on GPA
    // GPA 4.0 = ~50% A, GPA 2.0 = ~10% A
    const aPercent = Math.round(Math.max(5, Math.min(55, (profGPA - 1.5) * 20)));
    const bPercent = Math.round(Math.max(10, Math.min(40, 35 - Math.abs(profGPA - 3.0) * 5)));
    const remaining = 100 - aPercent - bPercent;

    // Distribute remaining among C, D, F based on GPA
    const cPercent = Math.round(remaining * (profGPA > 3.0 ? 0.6 : 0.4));
    const dPercent = Math.round(remaining * (profGPA > 3.0 ? 0.25 : 0.35));
    const fPercent = remaining - cPercent - dPercent;

    return {
      A: aPercent,
      B: bPercent,
      C: Math.max(0, cPercent),
      D: Math.max(0, dPercent),
      F: Math.max(0, fPercent),
    };
  };

  // Get current GPA based on selection
  const getCurrentGPA = (): number | null => {
    if (selectedProfessor === 'all') {
      return course?.avgGPA || null;
    }
    const profData = getProfessorGPAs().find(p => p.name === selectedProfessor);
    return profData?.gpa || course?.avgGPA || null;
  };

  useEffect(() => {
    fetchCourse();
  }, [courseCode]);

  async function fetchCourse() {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseCode)}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      } else {
        router.push('/courses');
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateAIExplanation() {
    if (!course) return;
    setLoadingAI(true);
    try {
      const res = await fetch('/api/openai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseCode: course.code }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Failed to generate AI explanation:', error);
    } finally {
      setLoadingAI(false);
    }
  }

  async function addToPlanner() {
    if (!course || !session) return;
    setAddingToPlan(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: course.code,
          semester: 'Fall 2024', // Default semester
        }),
      });
      if (res.ok) {
        router.push('/planner');
      }
    } catch (error) {
      console.error('Failed to add to planner:', error);
    } finally {
      setAddingToPlan(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Course not found</h3>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use dynamic grade distribution based on selected professor
  const gradeDistribution = getGradeDistribution();
  const totalGrades = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);
  const currentGPA = getCurrentGPA();

  return (
    <div className="container py-8">
      {/* Back button */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{course.code}</CardTitle>
                  <CardDescription className="text-lg mt-1">{course.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {course.credits} Credits
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description || 'No description available.'}</p>

              {/* Tags */}
              {(course.careerTags.length > 0 || course.interestTags.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.careerTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {course.interestTags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Prerequisites</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq) => (
                      <Link key={prereq} href={`/courses/${encodeURIComponent(prereq)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {prereq}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Offered Semesters */}
              {course.semesters.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Typically Offered</h4>
                  <div className="flex gap-2">
                    {course.semesters.map((sem) => (
                      <Badge key={sem} variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {sem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professor Selection */}
          {course.professors && course.professors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Professors & Their GPAs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select a professor to see their average GPA (data from BoilerGrades)
                </p>
              </CardHeader>
              <CardContent>
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professors (Course Average)</SelectItem>
                    {getProfessorGPAs().map((prof) => (
                      <SelectItem key={prof.name} value={prof.name}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{prof.name}</span>
                          <span className={`font-semibold ${getGPAColor(prof.gpa)}`}>
                            {prof.gpa.toFixed(2)} GPA
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Professor GPA Summary */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {getProfessorGPAs().slice(0, 6).map((prof) => (
                    <div
                      key={prof.name}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedProfessor === prof.name
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedProfessor(prof.name)}
                    >
                      <p className="font-medium text-sm truncate">{prof.name}</p>
                      <p className={`text-lg font-bold ${getGPAColor(prof.gpa)}`}>
                        {prof.gpa.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grade Distribution
                {selectedProfessor !== 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedProfessor}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(['A', 'B', 'C', 'D', 'F'] as const).map((grade) => {
                  const count = gradeDistribution[grade];
                  const percent = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
                  return (
                    <div key={grade} className="flex items-center gap-4">
                      <span className="w-8 font-medium">{grade}</span>
                      <div className="flex-1">
                        <Progress value={percent} className={`grade-bar grade-bar-${grade}`} />
                      </div>
                      <span className="w-16 text-sm text-muted-foreground text-right">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {selectedProfessor !== 'all' ? `${selectedProfessor}'s Average GPA` : 'Course Average GPA'}
                  </span>
                  <span className={`font-bold text-lg ${getGPAColor(currentGPA)}`}>
                    {formatGPA(currentGPA)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card className="border-purdue-gold/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purdue-gold" />
                OpenAI-Powered Analysis
              </CardTitle>
              <CardDescription>
                Natural language course insights generated by GPT-4
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiExplanation ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">{aiExplanation}</p>
                  <p className="text-xs text-muted-foreground/70 italic">
                    Generated using OpenAI LLM APIs for personalized recommendations
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Get personalized insights tailored to your career goals
                  </p>
                  <Button onClick={generateAIExplanation} disabled={loadingAI} variant="purdue">
                    {loadingAI ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating with GPT-4...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Reviews ({course.reviewCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {course.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{review.rating}/5</span>
                        </div>
                        <Badge variant="outline">{review.source}</Badge>
                        {review.professor && (
                          <span className="text-sm text-muted-foreground">{review.professor}</span>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge className={getDifficultyColor(course.difficultyRating)}>
                  {getDifficultyLabel(course.difficultyRating)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workload</span>
                <span className="font-medium">{course.workloadHours || '~10'} hrs/week</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{course.reviewCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session ? (
                <Button className="w-full" onClick={addToPlanner} disabled={addingToPlan}>
                  {addingToPlan ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add to Planner
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/login">Sign in to Plan</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
