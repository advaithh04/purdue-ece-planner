import { Course, Review, UserPreferences, PlannedCourse, User } from '@prisma/client';

// Extended types with relations
export interface CourseWithReviews extends Course {
  reviews: Review[];
}

export interface UserWithPreferences extends User {
  preferences: UserPreferences | null;
  plannedCourses: PlannedCourse[];
}

// Recommendation types
export interface RecommendationScore {
  course: Course;
  score: number;
  rank: number;
  factors: RecommendationFactors;
  explanation?: string;
}

export interface RecommendationFactors {
  careerMatch: number;        // 0-100
  difficultyMatch: number;    // 0-100
  gpaOptimal: number;         // 0-100
  prerequisiteReady: number;  // 0 or 100
  workloadFit: number;        // 0-100
  interestMatch: number;      // 0-100
}

export interface RecommendationWeights {
  careerMatch: number;
  difficultyMatch: number;
  gpaOptimal: number;
  prerequisiteReady: number;
  workloadFit: number;
  interestMatch: number;
}

// Planner types
export interface SemesterPlan {
  semester: string;
  year: number;
  courses: PlannedCourseWithDetails[];
  totalCredits: number;
  avgDifficulty: number;
  estimatedWorkload: number;
}

export interface PlannedCourseWithDetails extends PlannedCourse {
  course?: Course;
}

// Questionnaire types
export interface QuestionnaireResponse {
  careerGoals: string[];
  interests: string[];
  targetGPA: number | null;
  maxWorkloadHours: number | null;
  preferredDifficulty: string;
  completedCourses: string[];
  currentSemester: string;
  graduationSemester: string;
}

// Scraper types
export interface ScrapedCourse {
  code: string;
  name: string;
  credits: number;
  description?: string;
  prerequisites?: string[];
  corequisites?: string[];
  semesters?: string[];
}

export interface ScrapedGradeData {
  courseCode: string;
  avgGPA: number;
  distribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  semester?: string;
  professor?: string;
}

export interface ScrapedReview {
  courseCode: string;
  rating: number;
  difficulty: number;
  workload?: number;
  comment?: string;
  professor?: string;
  source: string;
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface CourseFilters {
  department?: string;
  level?: number;
  minGPA?: number;
  maxDifficulty?: number;
  semester?: string;
  careerTags?: string[];
  search?: string;
}

// Career and interest options
export const CAREER_GOALS = [
  { value: 'embedded', label: 'Embedded Systems' },
  { value: 'software', label: 'Software Engineering' },
  { value: 'hardware', label: 'Hardware Design' },
  { value: 'ml', label: 'Machine Learning / AI' },
  { value: 'signals', label: 'Signal Processing' },
  { value: 'power', label: 'Power Systems' },
  { value: 'communications', label: 'Communications' },
  { value: 'vlsi', label: 'VLSI Design' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'controls', label: 'Control Systems' },
] as const;

export const INTERESTS = [
  { value: 'circuits', label: 'Circuits & Electronics' },
  { value: 'programming', label: 'Programming' },
  { value: 'math', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'dsp', label: 'Digital Signal Processing' },
  { value: 'analog', label: 'Analog Design' },
  { value: 'digital', label: 'Digital Logic' },
  { value: 'networking', label: 'Computer Networks' },
  { value: 'os', label: 'Operating Systems' },
  { value: 'architecture', label: 'Computer Architecture' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Prefer Easier Courses' },
  { value: 'moderate', label: 'Balanced Difficulty' },
  { value: 'challenging', label: 'Prefer Challenging Courses' },
] as const;
