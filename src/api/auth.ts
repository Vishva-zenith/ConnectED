export interface AuthUser {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  careerGoal: string;
  reputationPoints: number;
}

interface AuthResponse {
  status: string;
  user: AuthUser;
}

async function requestAuth(path: string, payload: Record<string, string>): Promise<AuthUser> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Unable to connect to the backend.');
  }
  return (data as AuthResponse).user;
}

export function loginUser(email: string, password: string): Promise<AuthUser> {
  return requestAuth('login', { email, password });
}

export function signupUser(payload: Record<string, string>): Promise<AuthUser> {
  return requestAuth('signup', payload);
}
