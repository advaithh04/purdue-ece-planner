'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  Loader2,
  GripVertical,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { formatGPA, getGPAColor, generateSemesters } from '@/lib/utils';

interface CourseOption {
  code: string;
  name: string;
  credits: number;
}

interface PlannedCourse {
  id: string;
  courseCode: string;
  semester: string;
  status: string;
  grade: string | null;
  course: {
    id: string;
    code: string;
    name: string;
    credits: number;
    avgGPA: number | null;
    difficultyRating: number | null;
    workloadHours: number | null;
  } | null;
}

interface SemesterGroup {
  semester: string;
  courses: PlannedCourse[];
  totalCredits: number;
  avgDifficulty: number;
  projectedGPA: number;
}

export default function PlannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plannedCourses, setPlannedCourses] = useState<PlannedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCourse, setAddingCourse] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newSemester, setNewSemester] = useState('Fall 2024');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Course search state
  const [availableCourses, setAvailableCourses] = useState<CourseOption[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const semesters = generateSemesters('Spring 2024', 8);

  // Fetch available courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setAvailableCourses(data.courses?.map((c: any) => ({
            code: c.code,
            name: c.name,
            credits: c.credits,
          })) || []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    }
    fetchCourses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCourseDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter courses based on search
  const filteredCourses = availableCourses.filter(course =>
    course.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.name.toLowerCase().includes(courseSearch.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/planner');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPlan();
    }
  }, [status]);

  async function fetchPlan() {
    setLoading(true);
    try {
      const res = await fetch('/api/planner');
      if (res.ok) {
        const data = await res.json();
        setPlannedCourses(data.plannedCourses || []);
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addCourse() {
    if (!selectedCourse) {
      setAddError('Please select a course from the list');
      return;
    }
    setAddingCourse(true);
    setAddError(null);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: selectedCourse.code,
          semester: newSemester,
        }),
      });
      if (res.ok) {
        setSelectedCourse(null);
        setCourseSearch('');
        fetchPlan();
      } else {
        const data = await res.json();
        setAddError(data.error || 'Failed to add course');
      }
    } catch (error) {
      console.error('Failed to add course:', error);
      setAddError('Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  }

  function selectCourse(course: CourseOption) {
    setSelectedCourse(course);
    setCourseSearch(course.code);
    setShowCourseDropdown(false);
    setAddError(null);
  }

  function clearSelectedCourse() {
    setSelectedCourse(null);
    setCourseSearch('');
    setAddError(null);
  }

  async function removeCourse(id: string) {
    try {
      const res = await fetch(`/api/planner?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlannedCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to remove course:', error);
    }
  }

  async function updateCourse(id: string, updates: { semester?: string; status?: string }) {
    try {
      const res = await fetch('/api/planner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        fetchPlan();
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  }

  async function generateAdvice() {
    setLoadingAdvice(true);
    try {
      // For now, generate client-side advice based on schedule
      const totalCredits = plannedCourses.reduce((sum, c) => sum + (c.course?.credits || 3), 0);
      const avgDifficulty =
        plannedCourses.reduce((sum, c) => sum + (c.course?.difficultyRating || 3), 0) /
        Math.max(plannedCourses.length, 1);

      let advice = '';
      if (plannedCourses.length === 0) {
        advice = 'Start by adding some courses to your plan. Visit the course browser to explore available options.';
      } else if (totalCredits > 60) {
        advice = `Your plan includes ${totalCredits} total credits. Make sure to balance your workload across semesters. Consider spreading difficult courses across different semesters.`;
      } else if (avgDifficulty > 3.5) {
        advice = `Your planned courses have a high average difficulty (${avgDifficulty.toFixed(1)}/5). Consider mixing in some easier courses to maintain balance and protect your GPA.`;
      } else {
        advice = `Your plan looks well-balanced with ${totalCredits} credits planned. Review the prerequisite requirements to ensure proper sequencing.`;
      }

      setAiAdvice(advice);
    } catch (error) {
      console.error('Failed to generate advice:', error);
    } finally {
      setLoadingAdvice(false);
    }
  }

  // Group courses by semester
  const semesterGroups: SemesterGroup[] = semesters.map((semester) => {
    const courses = plannedCourses.filter((c) => c.semester === semester);
    const totalCredits = courses.reduce((sum, c) => sum + (c.course?.credits || 3), 0);
    const avgDifficulty =
      courses.length > 0
        ? courses.reduce((sum, c) => sum + (c.course?.difficultyRating || 3), 0) / courses.length
        : 0;
    const projectedGPA =
      courses.length > 0
        ? courses.reduce((sum, c) => sum + (c.course?.avgGPA || 3.0) * (c.course?.credits || 3), 0) /
          Math.max(totalCredits, 1)
        : 0;

    return { semester, courses, totalCredits, avgDifficulty, projectedGPA };
  });

  const totalPlannedCredits = plannedCourses.reduce((sum, c) => sum + (c.course?.credits || 3), 0);

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Semester Planner</h1>
          <p className="text-muted-foreground mt-1">
            Optimized scheduling with conflict detection algorithms
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Planned</p>
            <p className="text-2xl font-bold">{totalPlannedCredits} Credits</p>
          </div>
        </div>
      </div>

      {/* Add Course Form */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a course (e.g., ECE 30100 or Signals)"
                  value={courseSearch}
                  onChange={(e) => {
                    setCourseSearch(e.target.value);
                    setShowCourseDropdown(true);
                    if (selectedCourse && e.target.value !== selectedCourse.code) {
                      setSelectedCourse(null);
                    }
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  className="pl-10 pr-10"
                />
                {selectedCourse && (
                  <button
                    onClick={clearSelectedCourse}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* Course Dropdown */}
              {showCourseDropdown && courseSearch && !selectedCourse && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <button
                        key={course.code}
                        onClick={() => selectCourse(course)}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex justify-between items-center"
                      >
                        <div>
                          <span className="font-medium">{course.code}</span>
                          <span className="text-muted-foreground text-sm ml-2">{course.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{course.credits} cr</Badge>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No courses found matching "{courseSearch}"
                    </div>
                  )}
                </div>
              )}
              {selectedCourse && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Selected: {selectedCourse.name} ({selectedCourse.credits} credits)
                </p>
              )}
              {addError && (
                <p className="text-xs text-red-600 mt-1">{addError}</p>
              )}
            </div>
            <Select value={newSemester} onValueChange={setNewSemester}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addCourse} disabled={addingCourse || !selectedCourse}>
              {addingCourse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Advice */}
      <Card className="mb-6 border-purdue-gold/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purdue-gold" />
              AI Schedule Optimizer
            </CardTitle>
            <Button variant="outline" size="sm" onClick={generateAdvice} disabled={loadingAdvice}>
              {loadingAdvice ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Schedule'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Powered by OpenAI for personalized recommendations</p>
        </CardHeader>
        {aiAdvice && (
          <CardContent>
            <p className="text-muted-foreground">{aiAdvice}</p>
          </CardContent>
        )}
      </Card>

      {/* Semester Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {semesterGroups.map((group) => (
          <Card key={group.semester} className={group.courses.length > 0 ? '' : 'opacity-60'}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{group.semester}</CardTitle>
                  <CardDescription>
                    {group.totalCredits > 0 ? `${group.totalCredits} credits` : 'No courses'}
                  </CardDescription>
                </div>
                {group.totalCredits > 17 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Heavy
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {group.courses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Drop courses here
                </p>
              ) : (
                <div className="space-y-2">
                  {group.courses.map((planned) => (
                    <div
                      key={planned.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 group"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                        <div>
                          <Link
                            href={`/courses/${encodeURIComponent(planned.courseCode)}`}
                            className="font-medium text-sm hover:text-purdue-gold"
                          >
                            {planned.courseCode}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {planned.course?.credits || 3} cr
                            {planned.course?.avgGPA && (
                              <span className={`ml-2 ${getGPAColor(planned.course.avgGPA)}`}>
                                GPA: {formatGPA(planned.course.avgGPA)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                        onClick={() => removeCourse(planned.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  {/* Semester Stats */}
                  {group.courses.length > 0 && (
                    <div className="pt-2 mt-2 border-t text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Proj. GPA
                        </span>
                        <span className={getGPAColor(group.projectedGPA)}>
                          {group.projectedGPA.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Difficulty
                        </span>
                        <span>{group.avgDifficulty.toFixed(1)}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {plannedCourses.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Start Planning Your Semesters</h3>
            <p className="text-muted-foreground mb-4">
              Add courses above or browse the catalog to build your schedule
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
