'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Check, Loader2, Target, BookOpen, Clock, Sparkles } from 'lucide-react';
import { CAREER_GOALS, INTERESTS, DIFFICULTY_LEVELS } from '@/types';

const STEPS = ['Career Goals', 'Interests', 'Preferences', 'Completed Courses'];

export default function QuestionnairePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [careerGoals, setCareerGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [targetGPA, setTargetGPA] = useState('');
  const [maxWorkloadHours, setMaxWorkloadHours] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState('moderate');
  const [completedCoursesText, setCompletedCoursesText] = useState('');
  const [currentSemester, setCurrentSemester] = useState('Spring 2024');
  const [graduationSemester, setGraduationSemester] = useState('Spring 2026');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/questionnaire');
    }
  }, [status, router]);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch('/api/preferences');
        if (res.ok) {
          const { preferences } = await res.json();
          if (preferences) {
            setCareerGoals(preferences.careerGoals || []);
            setInterests(preferences.interests || []);
            setTargetGPA(preferences.targetGPA?.toString() || '');
            setMaxWorkloadHours(preferences.maxWorkloadHours?.toString() || '');
            setPreferredDifficulty(preferences.preferredDifficulty || 'moderate');
            setCompletedCoursesText((preferences.completedCourses || []).join(', '));
            setCurrentSemester(preferences.currentSemester || 'Spring 2024');
            setGraduationSemester(preferences.graduationSemester || 'Spring 2026');
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadPreferences();
    }
  }, [status]);

  const toggleCareerGoal = (value: string) => {
    setCareerGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const completedCourses = completedCoursesText
        .split(/[,\n]/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoals,
          interests,
          targetGPA: targetGPA || null,
          maxWorkloadHours: maxWorkloadHours || null,
          preferredDifficulty,
          completedCourses,
          currentSemester,
          graduationSemester,
        }),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Academic Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Help us personalize your course recommendations
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
          <span className="font-medium">{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Career Goals */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purdue-gold/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purdue-gold" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">What are your career goals?</h2>
                  <p className="text-sm text-muted-foreground">Select all that interest you</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CAREER_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleCareerGoal(goal.value)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      careerGoals.includes(goal.value)
                        ? 'border-purdue-gold bg-purdue-gold/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.label}</span>
                      {careerGoals.includes(goal.value) && (
                        <Check className="h-4 w-4 text-purdue-gold" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {careerGoals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {careerGoals.map((goal) => (
                    <Badge key={goal} variant="secondary">
                      {CAREER_GOALS.find((g) => g.value === goal)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">What topics interest you?</h2>
                  <p className="text-sm text-muted-foreground">Select all that apply</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.value}
                    onClick={() => toggleInterest(interest.value)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      interests.includes(interest.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{interest.label}</span>
                      {interests.includes(interest.value) && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Set your preferences</h2>
                  <p className="text-sm text-muted-foreground">Help us match courses to your goals</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetGPA">Target GPA</Label>
                    <Input
                      id="targetGPA"
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      placeholder="e.g., 3.5"
                      value={targetGPA}
                      onChange={(e) => setTargetGPA(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workload">Max Hours/Week</Label>
                    <Input
                      id="workload"
                      type="number"
                      min="10"
                      max="60"
                      placeholder="e.g., 40"
                      value={maxWorkloadHours}
                      onChange={(e) => setMaxWorkloadHours(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Difficulty</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setPreferredDifficulty(level.value)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          preferredDifficulty === level.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <span className="text-sm font-medium">{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSem">Current Semester</Label>
                    <Input
                      id="currentSem"
                      placeholder="e.g., Spring 2024"
                      value={currentSemester}
                      onChange={(e) => setCurrentSemester(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradSem">Expected Graduation</Label>
                    <Input
                      id="gradSem"
                      placeholder="e.g., Spring 2026"
                      value={graduationSemester}
                      onChange={(e) => setGraduationSemester(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Completed Courses */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Courses you have completed</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter course codes separated by commas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="completed">Completed Course Codes</Label>
                  <textarea
                    id="completed"
                    className="w-full h-32 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="ECE 20001, ECE 20002, ECE 27000..."
                    value={completedCoursesText}
                    onChange={(e) => setCompletedCoursesText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps us filter out courses you have already taken and check prerequisites
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button variant="purdue" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
