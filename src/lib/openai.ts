import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors when API key isn't available
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openaiClient;
}

export interface CourseExplanationRequest {
  course: {
    code: string;
    name: string;
    description?: string;
    credits: number;
    avgGPA?: number;
    difficultyRating?: number;
    workloadHours?: number;
  };
  userPreferences?: {
    careerGoals: string[];
    interests: string[];
    targetGPA?: number;
  };
  context?: 'recommendation' | 'detail' | 'comparison';
}

export async function generateCourseExplanation(request: CourseExplanationRequest): Promise<string> {
  const { course, userPreferences, context = 'detail' } = request;

  const systemPrompt = `You are an academic advisor for Purdue ECE students. Provide concise, helpful explanations about courses.
Be specific about why a course might be good for certain career paths or interests.
Keep responses under 200 words and focus on practical value.`;

  let userPrompt = '';

  if (context === 'recommendation' && userPreferences) {
    userPrompt = `Explain why ${course.code} (${course.name}) would be a good choice for a student interested in ${userPreferences.careerGoals.join(', ')}.

Course details:
- Credits: ${course.credits}
- Average GPA: ${course.avgGPA?.toFixed(2) || 'N/A'}
- Difficulty: ${course.difficultyRating?.toFixed(1) || 'N/A'}/5
- Workload: ${course.workloadHours || 'N/A'} hours/week
- Description: ${course.description || 'N/A'}

Student interests: ${userPreferences.interests.join(', ')}
Target GPA: ${userPreferences.targetGPA || 'Not specified'}

Provide a personalized explanation of why this course fits their goals.`;
  } else {
    userPrompt = `Provide a brief overview of ${course.code} (${course.name}) for Purdue ECE students.

Course details:
- Credits: ${course.credits}
- Average GPA: ${course.avgGPA?.toFixed(2) || 'N/A'}
- Difficulty: ${course.difficultyRating?.toFixed(1) || 'N/A'}/5
- Workload: ${course.workloadHours || 'N/A'} hours/week
- Description: ${course.description || 'N/A'}

Include: what students learn, career relevance, and tips for success.`;
  }

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate explanation.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Unable to generate explanation at this time.';
  }
}

export async function generateScheduleAdvice(
  plannedCourses: Array<{ code: string; name: string; credits: number; difficulty?: number }>,
  semester: string
): Promise<string> {
  const totalCredits = plannedCourses.reduce((sum, c) => sum + c.credits, 0);
  const avgDifficulty = plannedCourses.reduce((sum, c) => sum + (c.difficulty || 3), 0) / plannedCourses.length;

  const prompt = `A Purdue ECE student is planning to take these courses in ${semester}:
${plannedCourses.map(c => `- ${c.code}: ${c.name} (${c.credits} credits, difficulty ${c.difficulty || 'unknown'}/5)`).join('\n')}

Total credits: ${totalCredits}
Average difficulty: ${avgDifficulty.toFixed(1)}/5

Provide brief advice (under 150 words) about this course load. Consider workload balance, prerequisite chains, and time management.`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an academic advisor helping Purdue ECE students plan their semesters.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate advice.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Unable to generate advice at this time.';
  }
}

export default getOpenAIClient;
