import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGPA(gpa: number | null | undefined): string {
  if (gpa === null || gpa === undefined) return 'N/A';
  return gpa.toFixed(2);
}

export function getGPAColor(gpa: number | null | undefined): string {
  if (gpa === null || gpa === undefined) return 'text-gray-500';
  if (gpa >= 3.5) return 'text-green-600';
  if (gpa >= 3.0) return 'text-blue-600';
  if (gpa >= 2.5) return 'text-yellow-600';
  return 'text-red-600';
}

export function getDifficultyLabel(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) return 'Unknown';
  if (rating <= 2) return 'Easy';
  if (rating <= 3) return 'Moderate';
  if (rating <= 4) return 'Challenging';
  return 'Very Hard';
}

export function getDifficultyColor(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) return 'bg-gray-200';
  if (rating <= 2) return 'bg-green-200 text-green-800';
  if (rating <= 3) return 'bg-yellow-200 text-yellow-800';
  if (rating <= 4) return 'bg-orange-200 text-orange-800';
  return 'bg-red-200 text-red-800';
}

export function parseCourseCode(code: string): { department: string; number: string } {
  const parts = code.trim().split(/\s+/);
  return {
    department: parts[0] || 'ECE',
    number: parts[1] || code,
  };
}

export function getSemesterOrder(semester: string): number {
  const [term, year] = semester.split(' ');
  const yearNum = parseInt(year) || 2024;
  const termOrder = term === 'Spring' ? 0 : term === 'Summer' ? 1 : 2;
  return yearNum * 10 + termOrder;
}

export function generateSemesters(start: string, count: number): string[] {
  const semesters: string[] = [];
  const [startTerm, startYear] = start.split(' ');
  let year = parseInt(startYear) || 2024;
  let termIndex = startTerm === 'Spring' ? 0 : startTerm === 'Summer' ? 1 : 2;

  const terms = ['Spring', 'Summer', 'Fall'];

  for (let i = 0; i < count; i++) {
    // Skip summer for simplicity unless already started in summer
    if (terms[termIndex] === 'Summer' && i > 0) {
      termIndex = (termIndex + 1) % 3;
      if (termIndex === 0) year++;
    }

    semesters.push(`${terms[termIndex]} ${year}`);
    termIndex = (termIndex + 1) % 3;
    if (termIndex === 0) year++;
  }

  return semesters;
}

export function calculateGPAImpact(
  currentGPA: number,
  currentCredits: number,
  newCourseGPA: number,
  newCourseCredits: number
): number {
  const totalPoints = currentGPA * currentCredits + newCourseGPA * newCourseCredits;
  const totalCredits = currentCredits + newCourseCredits;
  return totalPoints / totalCredits;
}

export function gradeToPoints(grade: string): number {
  const gradeMap: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };
  return gradeMap[grade.toUpperCase()] ?? 0;
}
