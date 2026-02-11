'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, BookOpen, TrendingUp, Clock, Star, Filter, Loader2 } from 'lucide-react';
import { formatGPA, getGPAColor, getDifficultyLabel, getDifficultyColor } from '@/lib/utils';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  avgGPA: number | null;
  difficultyRating: number | null;
  workloadHours: number | null;
  reviewCount: number;
  careerTags: string[];
  level: number | null;
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'code');

  useEffect(() => {
    fetchCourses();
  }, [levelFilter, sortBy]);

  async function fetchCourses() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter && levelFilter !== 'all') params.set('level', levelFilter);
      if (sortBy) params.set('sort', sortBy);
      if (search) params.set('search', search);

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCourses = courses.filter((course) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      course.code.toLowerCase().includes(searchLower) ||
      course.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ECE Course Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Browse all Purdue ECE courses with GPA data and difficulty ratings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Course Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="20000">20000 Level</SelectItem>
            <SelectItem value="30000">30000 Level</SelectItem>
            <SelectItem value="40000">40000 Level</SelectItem>
            <SelectItem value="50000">50000+ Level</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">Course Code</SelectItem>
            <SelectItem value="gpa">Highest GPA</SelectItem>
            <SelectItem value="difficulty">Easiest First</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${encodeURIComponent(course.code)}`}
            >
              <Card className="h-full course-card cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {course.name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{course.credits} cr</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* GPA */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Avg GPA
                      </span>
                      <span className={`font-semibold ${getGPAColor(course.avgGPA)}`}>
                        {formatGPA(course.avgGPA)}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Difficulty
                      </span>
                      <Badge className={getDifficultyColor(course.difficultyRating)}>
                        {getDifficultyLabel(course.difficultyRating)}
                      </Badge>
                    </div>

                    {/* Workload */}
                    {course.workloadHours && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Workload
                        </span>
                        <span className="text-sm">{course.workloadHours} hrs/week</span>
                      </div>
                    )}

                    {/* Career Tags */}
                    {course.careerTags && course.careerTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.careerTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredCourses.length > 0 && (
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purdue-gold" />
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
