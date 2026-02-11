'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  Calendar,
  GraduationCap,
  Code,
  Calculator,
  Users,
  Laptop,
  Sun,
  Moon,
} from 'lucide-react';
import { formatGPA, getGPAColor, getDifficultyLabel, getDifficultyColor } from '@/lib/utils';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string | null;
  avgGPA: number | null;
  difficultyRating: number | null;
  workloadHours: number | null;
  reviewCount: number;
  prerequisites: string[];
  semesters: string[];
  careerTags: string[];
  interestTags: string[];
  level: number | null;
  professors: string[];
  typicalDays: string[];
  hasMorningSection: boolean;
  hasAfternoonSection: boolean;
  hasEveningSection: boolean;
  hasFridayClass: boolean;
  hasOnlineOption: boolean;
  hasHybridOption: boolean;
  numExams: number | null;
  isProjectBased: boolean;
  isExamBased: boolean;
  homeworkIntensity: string | null;
  isCodingHeavy: boolean;
  isMathHeavy: boolean;
  examIntensity: string | null;
  hasGroupProjects: boolean;
  isMajorRequirement: boolean;
  isTechElective: boolean;
  isGenEd: boolean;
  isLabCredit: boolean;
  requirementCategory: string | null;
}

interface FilterCriteria {
  // Basic filters
  minCredits: string;
  maxCredits: string;
  minGPA: string;
  maxGPA: string;
  maxWorkloadHours: string;
  maxDifficulty: string;
  noPrerequisites: boolean;
  semesterOffered: string;
  courseLevel: string;
  careerTags: string[];
  searchText: string;
  // Professor filter
  professor: string;
  // Schedule convenience filters
  noFridayClasses: boolean;
  noMorningClasses: boolean;
  onlyTueThu: boolean;
  onlyOnlineHybrid: boolean;
  // Exam/Assignment intensity
  maxExams: string;
  projectBased: boolean;
  examBased: boolean;
  homeworkIntensity: string;
  codingHeavy: boolean;
  mathHeavy: boolean;
  examIntensity: string;
  hasGroupProjects: boolean;
  // Degree requirements
  majorRequirement: boolean;
  techElective: boolean;
  genEd: boolean;
  labCredit: boolean;
}

const CAREER_OPTIONS = [
  { value: 'embedded', label: 'Embedded Systems' },
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'signals', label: 'Signal Processing' },
  { value: 'communications', label: 'Communications' },
  { value: 'vlsi', label: 'VLSI' },
  { value: 'controls', label: 'Controls' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'power', label: 'Power Systems' },
];

const LEVEL_OPTIONS = [
  { value: '20000', label: '20000-Level (Sophomore)' },
  { value: '30000', label: '30000-Level (Junior)' },
  { value: '40000', label: '40000-Level (Senior)' },
  { value: '50000', label: '50000+ (Graduate)' },
];

export default function CourseFinderPage() {
  const [filters, setFilters] = useState<FilterCriteria>({
    minCredits: '',
    maxCredits: '',
    minGPA: '',
    maxGPA: '',
    maxWorkloadHours: '',
    maxDifficulty: 'any',
    noPrerequisites: false,
    semesterOffered: 'any',
    courseLevel: 'any',
    careerTags: [],
    searchText: '',
    professor: '',
    noFridayClasses: false,
    noMorningClasses: false,
    onlyTueThu: false,
    onlyOnlineHybrid: false,
    maxExams: 'any',
    projectBased: false,
    examBased: false,
    homeworkIntensity: 'any',
    codingHeavy: false,
    mathHeavy: false,
    examIntensity: 'any',
    hasGroupProjects: false,
    majorRequirement: false,
    techElective: false,
    genEd: false,
    labCredit: false,
  });

  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showCoursesByLevel, setShowCoursesByLevel] = useState<string | null>(null);

  const updateFilter = (key: keyof FilterCriteria, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCareerTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      careerTags: prev.careerTags.includes(tag)
        ? prev.careerTags.filter((t) => t !== tag)
        : [...prev.careerTags, tag],
    }));
  };

  const searchCourses = async () => {
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();

      // Basic filters
      if (filters.minCredits) params.set('minCredits', filters.minCredits);
      if (filters.maxCredits) params.set('maxCredits', filters.maxCredits);
      if (filters.minGPA) params.set('minGPA', filters.minGPA);
      if (filters.maxGPA) params.set('maxGPA', filters.maxGPA);
      if (filters.maxWorkloadHours) params.set('maxWorkloadHours', filters.maxWorkloadHours);
      if (filters.maxDifficulty !== 'any') params.set('maxDifficulty', filters.maxDifficulty);
      if (filters.noPrerequisites) params.set('noPrerequisites', 'true');
      if (filters.semesterOffered !== 'any') params.set('semester', filters.semesterOffered);
      if (filters.courseLevel !== 'any') params.set('level', filters.courseLevel);
      if (filters.careerTags.length > 0) params.set('careerTags', filters.careerTags.join(','));
      if (filters.searchText) params.set('search', filters.searchText);
      if (filters.professor) params.set('professor', filters.professor);

      // Schedule convenience filters
      if (filters.noFridayClasses) params.set('noFridayClasses', 'true');
      if (filters.noMorningClasses) params.set('noMorningClasses', 'true');
      if (filters.onlyTueThu) params.set('onlyTueThu', 'true');
      if (filters.onlyOnlineHybrid) params.set('onlyOnlineHybrid', 'true');

      // Exam/Assignment intensity
      if (filters.maxExams !== 'any') params.set('maxExams', filters.maxExams);
      if (filters.projectBased) params.set('projectBased', 'true');
      if (filters.examBased) params.set('examBased', 'true');
      if (filters.homeworkIntensity !== 'any') params.set('homeworkIntensity', filters.homeworkIntensity);
      if (filters.codingHeavy) params.set('codingHeavy', 'true');
      if (filters.mathHeavy) params.set('mathHeavy', 'true');
      if (filters.examIntensity !== 'any') params.set('examIntensity', filters.examIntensity);
      if (filters.hasGroupProjects) params.set('hasGroupProjects', 'true');

      // Degree requirements
      if (filters.majorRequirement) params.set('majorRequirement', 'true');
      if (filters.techElective) params.set('techElective', 'true');
      if (filters.genEd) params.set('genEd', 'true');
      if (filters.labCredit) params.set('labCredit', 'true');

      const res = await fetch(`/api/finder?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.courses || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      minCredits: '',
      maxCredits: '',
      minGPA: '',
      maxGPA: '',
      maxWorkloadHours: '',
      maxDifficulty: 'any',
      noPrerequisites: false,
      semesterOffered: 'any',
      courseLevel: 'any',
      careerTags: [],
      searchText: '',
      professor: '',
      noFridayClasses: false,
      noMorningClasses: false,
      onlyTueThu: false,
      onlyOnlineHybrid: false,
      maxExams: 'any',
      projectBased: false,
      examBased: false,
      homeworkIntensity: 'any',
      codingHeavy: false,
      mathHeavy: false,
      examIntensity: 'any',
      hasGroupProjects: false,
      majorRequirement: false,
      techElective: false,
      genEd: false,
      labCredit: false,
    });
    setResults([]);
    setSearched(false);
  };

  const fetchCoursesByLevel = async (level: string) => {
    if (showCoursesByLevel === level) {
      setShowCoursesByLevel(null);
      return;
    }
    setShowCoursesByLevel(level);
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/finder?level=${level}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.courses || []);
      }
    } catch (error) {
      console.error('Fetch by level failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeFilterCount = [
    filters.minCredits,
    filters.maxCredits,
    filters.minGPA,
    filters.maxGPA,
    filters.maxWorkloadHours,
    filters.maxDifficulty !== 'any',
    filters.noPrerequisites,
    filters.semesterOffered !== 'any',
    filters.courseLevel !== 'any',
    filters.careerTags.length > 0,
    filters.searchText,
    filters.noFridayClasses,
    filters.noMorningClasses,
    filters.onlyTueThu,
    filters.onlyOnlineHybrid,
    filters.maxExams !== 'any',
    filters.projectBased,
    filters.examBased,
    filters.homeworkIntensity !== 'any',
    filters.codingHeavy,
    filters.mathHeavy,
    filters.examIntensity !== 'any',
    filters.hasGroupProjects,
    filters.majorRequirement,
    filters.techElective,
    filters.genEd,
    filters.labCredit,
  ].filter(Boolean).length;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SlidersHorizontal className="h-8 w-8 text-purdue-gold" />
          Course Finder
        </h1>
        <p className="text-muted-foreground mt-1">
          Search 400+ courses with personalized filtering algorithms
        </p>
      </div>

      {/* Quick Level Buttons + Find Courses Button */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">Browse by Level</Label>
        <div className="flex flex-wrap gap-2 items-center">
          {LEVEL_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={showCoursesByLevel === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => fetchCoursesByLevel(option.value)}
            >
              {option.label}
            </Button>
          ))}
          <div className="h-6 w-px bg-border mx-2" />
          <Button onClick={searchCourses} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Find Courses
          </Button>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Requirements
                </span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount} active</Badge>
                )}
              </CardTitle>
              <CardDescription>Set your course criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="multiple" defaultValue={['basic', 'schedule', 'intensity', 'degree']} className="w-full">
                {/* Basic Filters */}
                <AccordionItem value="basic">
                  <AccordionTrigger className="text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Basic Filters
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {/* Search Text */}
                    <div className="space-y-2">
                      <Label>Search by Name/Code</Label>
                      <Input
                        placeholder="e.g., signals, ECE 30100"
                        value={filters.searchText}
                        onChange={(e) => updateFilter('searchText', e.target.value)}
                      />
                    </div>

                    {/* Credits */}
                    <div className="space-y-2">
                      <Label>Credits</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          placeholder="Min"
                          min="0"
                          max="6"
                          value={filters.minCredits}
                          onChange={(e) => updateFilter('minCredits', e.target.value)}
                          className="w-20"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          min="0"
                          max="6"
                          value={filters.maxCredits}
                          onChange={(e) => updateFilter('maxCredits', e.target.value)}
                          className="w-20"
                        />
                      </div>
                    </div>

                    {/* GPA Range */}
                    <div className="space-y-2">
                      <Label>Average GPA Range</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="4"
                          placeholder="Min"
                          value={filters.minGPA}
                          onChange={(e) => updateFilter('minGPA', e.target.value)}
                          className="w-20"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="4"
                          placeholder="Max"
                          value={filters.maxGPA}
                          onChange={(e) => updateFilter('maxGPA', e.target.value)}
                          className="w-20"
                        />
                      </div>
                    </div>

                    {/* Max Workload */}
                    <div className="space-y-2">
                      <Label>Max Workload (hours/week)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        placeholder="e.g., 15"
                        value={filters.maxWorkloadHours}
                        onChange={(e) => updateFilter('maxWorkloadHours', e.target.value)}
                      />
                    </div>

                    {/* Max Difficulty */}
                    <div className="space-y-2">
                      <Label>Max Difficulty</Label>
                      <Select
                        value={filters.maxDifficulty}
                        onValueChange={(v) => updateFilter('maxDifficulty', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any difficulty</SelectItem>
                          <SelectItem value="2">Easy (up to 2)</SelectItem>
                          <SelectItem value="3">Moderate (up to 3)</SelectItem>
                          <SelectItem value="4">Challenging (up to 4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Course Level */}
                    <div className="space-y-2">
                      <Label>Course Level</Label>
                      <Select
                        value={filters.courseLevel}
                        onValueChange={(v) => updateFilter('courseLevel', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any level</SelectItem>
                          {LEVEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Semester */}
                    <div className="space-y-2">
                      <Label>Semester Offered</Label>
                      <Select
                        value={filters.semesterOffered}
                        onValueChange={(v) => updateFilter('semesterOffered', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any semester</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* No Prerequisites */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noPrereq"
                        checked={filters.noPrerequisites}
                        onCheckedChange={(checked) => updateFilter('noPrerequisites', checked === true)}
                      />
                      <Label htmlFor="noPrereq" className="cursor-pointer">No prerequisites</Label>
                    </div>

                    {/* Career Focus */}
                    <div className="space-y-2">
                      <Label>Career Focus</Label>
                      <div className="flex flex-wrap gap-1">
                        {CAREER_OPTIONS.map((option) => (
                          <Badge
                            key={option.value}
                            variant={filters.careerTags.includes(option.value) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleCareerTag(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Schedule Convenience Filters */}
                <AccordionItem value="schedule">
                  <AccordionTrigger className="text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Convenience
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noFriday"
                        checked={filters.noFridayClasses}
                        onCheckedChange={(checked) => updateFilter('noFridayClasses', checked === true)}
                      />
                      <Label htmlFor="noFriday" className="cursor-pointer">No Friday classes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noMorning"
                        checked={filters.noMorningClasses}
                        onCheckedChange={(checked) => updateFilter('noMorningClasses', checked === true)}
                      />
                      <Label htmlFor="noMorning" className="cursor-pointer flex items-center gap-1">
                        <Sun className="h-3 w-3" /> No morning classes (before 10 AM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tueThu"
                        checked={filters.onlyTueThu}
                        onCheckedChange={(checked) => updateFilter('onlyTueThu', checked === true)}
                      />
                      <Label htmlFor="tueThu" className="cursor-pointer">Only Tue/Thu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlineHybrid"
                        checked={filters.onlyOnlineHybrid}
                        onCheckedChange={(checked) => updateFilter('onlyOnlineHybrid', checked === true)}
                      />
                      <Label htmlFor="onlineHybrid" className="cursor-pointer flex items-center gap-1">
                        <Laptop className="h-3 w-3" /> Online / Hybrid available
                      </Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Exam/Assignment Intensity */}
                <AccordionItem value="intensity">
                  <AccordionTrigger className="text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Exam & Assignment Intensity
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {/* Max Exams */}
                    <div className="space-y-2">
                      <Label>Maximum Number of Exams</Label>
                      <Select
                        value={filters.maxExams}
                        onValueChange={(v) => updateFilter('maxExams', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="0">No exams</SelectItem>
                          <SelectItem value="1">1 exam max</SelectItem>
                          <SelectItem value="2">2 exams max</SelectItem>
                          <SelectItem value="3">3 exams max</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Exam Intensity */}
                    <div className="space-y-2">
                      <Label>Exam Intensity</Label>
                      <Select
                        value={filters.examIntensity}
                        onValueChange={(v) => updateFilter('examIntensity', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any intensity</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Homework Intensity */}
                    <div className="space-y-2">
                      <Label>Homework Load</Label>
                      <Select
                        value={filters.homeworkIntensity}
                        onValueChange={(v) => updateFilter('homeworkIntensity', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Course Style */}
                    <div className="space-y-2">
                      <Label>Course Style</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="projectBased"
                          checked={filters.projectBased}
                          onCheckedChange={(checked) => updateFilter('projectBased', checked === true)}
                        />
                        <Label htmlFor="projectBased" className="cursor-pointer">Project-based</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="examBased"
                          checked={filters.examBased}
                          onCheckedChange={(checked) => updateFilter('examBased', checked === true)}
                        />
                        <Label htmlFor="examBased" className="cursor-pointer">Exam-based</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="groupProjects"
                          checked={filters.hasGroupProjects}
                          onCheckedChange={(checked) => updateFilter('hasGroupProjects', checked === true)}
                        />
                        <Label htmlFor="groupProjects" className="cursor-pointer flex items-center gap-1">
                          <Users className="h-3 w-3" /> Has group projects
                        </Label>
                      </div>
                    </div>

                    {/* Content Type */}
                    <div className="space-y-2">
                      <Label>Content Focus</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="codingHeavy"
                          checked={filters.codingHeavy}
                          onCheckedChange={(checked) => updateFilter('codingHeavy', checked === true)}
                        />
                        <Label htmlFor="codingHeavy" className="cursor-pointer flex items-center gap-1">
                          <Code className="h-3 w-3" /> Coding-heavy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mathHeavy"
                          checked={filters.mathHeavy}
                          onCheckedChange={(checked) => updateFilter('mathHeavy', checked === true)}
                        />
                        <Label htmlFor="mathHeavy" className="cursor-pointer flex items-center gap-1">
                          <Calculator className="h-3 w-3" /> Math-heavy
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Degree Requirements */}
                <AccordionItem value="degree">
                  <AccordionTrigger className="text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Degree Progress (Help Me Graduate!)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="majorReq"
                        checked={filters.majorRequirement}
                        onCheckedChange={(checked) => updateFilter('majorRequirement', checked === true)}
                      />
                      <Label htmlFor="majorReq" className="cursor-pointer font-medium text-green-600">
                        Counts for major requirement
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="techElective"
                        checked={filters.techElective}
                        onCheckedChange={(checked) => updateFilter('techElective', checked === true)}
                      />
                      <Label htmlFor="techElective" className="cursor-pointer">
                        Counts as technical elective
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="genEd"
                        checked={filters.genEd}
                        onCheckedChange={(checked) => updateFilter('genEd', checked === true)}
                      />
                      <Label htmlFor="genEd" className="cursor-pointer">
                        Counts as gen-ed
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="labCredit"
                        checked={filters.labCredit}
                        onCheckedChange={(checked) => updateFilter('labCredit', checked === true)}
                      />
                      <Label htmlFor="labCredit" className="cursor-pointer">
                        Counts as lab credit
                      </Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!searched ? (
            <Card>
              <CardContent className="py-16 text-center">
                <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-xl mb-2">Set Your Requirements</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Use the filters on the left to specify your course requirements,
                  or click a level button above to browse all courses at that level.
                </p>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <XCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-xl mb-2">No Courses Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No courses match all your requirements. Try relaxing some filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                  Found <span className="font-semibold text-foreground">{results.length}</span> matching course{results.length !== 1 ? 's' : ''}
                </p>
              </div>

              {results.map((course) => (
                <Link key={course.id} href={`/courses/${encodeURIComponent(course.code)}`}>
                  <Card className="course-card cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">{course.code}</h3>
                            <Badge variant="outline">{course.credits} cr</Badge>
                            {course.prerequisites.length === 0 && (
                              <Badge variant="success" className="text-xs">No Prereqs</Badge>
                            )}
                            {/* Requirements badges */}
                            {course.isMajorRequirement && (
                              <Badge className="text-xs bg-red-600 text-white">Major Req</Badge>
                            )}
                            {course.isTechElective && (
                              <Badge className="text-xs bg-blue-600 text-white">Tech Elective</Badge>
                            )}
                            {course.isLabCredit && (
                              <Badge variant="secondary" className="text-xs">Lab Credit</Badge>
                            )}
                            {course.isGenEd && (
                              <Badge className="text-xs bg-purple-600 text-white">Gen-Ed</Badge>
                            )}
                            {course.requirementCategory && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {course.requirementCategory}
                              </Badge>
                            )}
                            {course.hasOnlineOption && (
                              <Badge variant="outline" className="text-xs">
                                <Laptop className="h-3 w-3 mr-1" />Online
                              </Badge>
                            )}
                          </div>

                          {/* Course Characteristics - Always Show */}
                          {(() => {
                            const characteristics: string[] = [];
                            if (!course.hasFridayClass) characteristics.push('No Friday');
                            if (!course.hasMorningSection) characteristics.push('No Morning');
                            if (course.hasOnlineOption) characteristics.push('Online');
                            if (course.hasHybridOption) characteristics.push('Hybrid');
                            if (course.isProjectBased) characteristics.push('Project-Based');
                            if (course.isCodingHeavy) characteristics.push('Coding-Heavy');
                            if (course.isMathHeavy) characteristics.push('Math-Heavy');
                            if (course.hasGroupProjects) characteristics.push('Group Projects');
                            if (course.numExams !== null && course.numExams === 0) characteristics.push('No Exams');
                            if (course.examIntensity === 'low') characteristics.push('Low Exam Intensity');
                            if (course.homeworkIntensity === 'light') characteristics.push('Light HW');

                            // Check which characteristics match active filters (for green highlight)
                            const matchedFilters: string[] = [];
                            if (filters.noFridayClasses && !course.hasFridayClass) matchedFilters.push('No Friday');
                            if (filters.noMorningClasses && !course.hasMorningSection) matchedFilters.push('No Morning');
                            if (filters.onlyOnlineHybrid && (course.hasOnlineOption || course.hasHybridOption)) matchedFilters.push(course.hasOnlineOption ? 'Online' : 'Hybrid');
                            if (filters.projectBased && course.isProjectBased) matchedFilters.push('Project-Based');
                            if (filters.codingHeavy && course.isCodingHeavy) matchedFilters.push('Coding-Heavy');
                            if (filters.mathHeavy && course.isMathHeavy) matchedFilters.push('Math-Heavy');
                            if (filters.hasGroupProjects && course.hasGroupProjects) matchedFilters.push('Group Projects');

                            return characteristics.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {characteristics.map((char) => (
                                  <Badge
                                    key={char}
                                    className={`text-xs ${matchedFilters.includes(char) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                  >
                                    {matchedFilters.includes(char) && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {char}
                                  </Badge>
                                ))}
                              </div>
                            ) : null;
                          })()}
                          <p className="text-muted-foreground mb-2">{course.name}</p>

                          {/* Professors - filter out placeholder names */}
                          {(() => {
                            const realProfessors = course.professors?.filter(p =>
                              !['Various Faculty', 'Lab Staff', 'Various TAs', 'Senior Design Staff'].includes(p)
                            ) || [];
                            return realProfessors.length > 0 ? (
                              <p className="text-xs text-muted-foreground mb-1">
                                <span className="font-medium">Professors:</span> {realProfessors.join(', ')}
                              </p>
                            ) : null;
                          })()}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {course.semesters.map((sem) => (
                              <Badge key={sem} variant="secondary" className="text-xs">
                                {sem}
                              </Badge>
                            ))}
                            {course.isCodingHeavy && (
                              <Badge variant="outline" className="text-xs">
                                <Code className="h-3 w-3 mr-1" />Coding
                              </Badge>
                            )}
                            {course.isMathHeavy && (
                              <Badge variant="outline" className="text-xs">
                                <Calculator className="h-3 w-3 mr-1" />Math
                              </Badge>
                            )}
                            {course.isProjectBased && (
                              <Badge variant="outline" className="text-xs">Project-based</Badge>
                            )}
                            {course.careerTags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag === 'ml' ? 'ML' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </Badge>
                            ))}
                          </div>

                          {/* Prerequisites - clickable links */}
                          {course.prerequisites.length > 0 && (
                            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
                              <span>Prerequisites:</span>
                              {course.prerequisites.map((prereq, idx) => (
                                <span key={prereq}>
                                  <span
                                    className="text-blue-600 hover:underline cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      window.location.href = `/courses/${encodeURIComponent(prereq)}`;
                                    }}
                                  >
                                    {prereq}
                                  </span>
                                  {idx < course.prerequisites.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex md:flex-col gap-4 md:gap-2 md:text-right">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className={`font-semibold ${getGPAColor(course.avgGPA)}`}>
                              {formatGPA(course.avgGPA)} GPA
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <Badge className={getDifficultyColor(course.difficultyRating)}>
                              {getDifficultyLabel(course.difficultyRating)}
                            </Badge>
                          </div>
                          {course.workloadHours && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{course.workloadHours} hrs/wk</span>
                            </div>
                          )}
                          {course.numExams !== null && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {course.numExams} exam{course.numExams !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
