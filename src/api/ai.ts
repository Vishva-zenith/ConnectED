/**
 * ConnectED AI Service API Client
 * Connects to FastAPI backend (/api/ai/doubt) with automatic fallback
 */

export interface AISolveResult {
  status: string;
  source: string;
  answer: string;
  is_live_ai: boolean;
}

export async function generateCareerRoadmap(career: string): Promise<AISolveResult> {
  const response = await fetch('/api/ai/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ career })
  });
  if (!response.ok) throw new Error('The career roadmap service did not respond.');
  return await response.json() as AISolveResult;
}

export async function askAIDoubt(question: string, subject: string = "General Engineering", context: string = ""): Promise<AISolveResult> {
  const response = await fetch('/api/ai/doubt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, subject, context })
  });
  if (!response.ok) throw new Error('The backend AI service did not respond. Start FastAPI and try again.');
  return await response.json() as AISolveResult;
}

export async function analyzeProjectWithAI(title: string, description: string): Promise<AISolveResult> {
  const response = await fetch('/api/ai/project-advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  if (!response.ok) throw new Error('The backend project advisor did not respond.');
  return await response.json() as AISolveResult;
}
