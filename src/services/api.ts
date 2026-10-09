import { Skill, JobApplication, ServerHealth, Mentor, MentorshipBooking, Opportunity, ProjectPortfolioItem, ProgressShareConsent } from '../types';

const API_BASE = 'http://localhost:5000/api';

export async function checkServerHealth(): Promise<ServerHealth | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSkillsFromServer(): Promise<Skill[] | null> {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function addSkillToServer(skill: Partial<Skill>): Promise<{ success: boolean; skill?: Skill; skills?: Skill[] }> {
  try {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function updateSkillOnServer(skillId: string, updates: Partial<Skill>): Promise<{ success: boolean; skills?: Skill[] }> {
  try {
    const res = await fetch(`${API_BASE}/skills/${skillId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function deleteSkillFromServer(skillId: string): Promise<{ success: boolean; skills?: Skill[] }> {
  try {
    const res = await fetch(`${API_BASE}/skills/${skillId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function submitQuizAnswers(topic: string, score: number, totalQuestions: number, answers: any[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/quiz-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, score, totalQuestions, answers })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function submitJobApplication(opportunityId: string, opportunityTitle: string, company: string, matchScore: number): Promise<{ success: boolean; application?: JobApplication; applications?: JobApplication[] }> {
  try {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId, opportunityTitle, company, matchScore })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchApplications(): Promise<JobApplication[]> {
  try {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function postTeacherIntervention(studentId: string, studentName: string, note: string, actionType: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, studentName, note, actionType })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function postCustomData(title: string, category: string, payload: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/custom-input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, payload })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function askAiTutor(prompt: string, topic: string, language: string, apiKey?: string): Promise<{ success: boolean; answer?: string; apiUsed?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, topic, language, apiKey })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to connect to AI server' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }
  return data;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function fetchCurrentUser(token: string): Promise<{ user: { id: string; name: string; email: string } } | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function sendOtpApi(email: string, type: 'register' | 'login' = 'register'): Promise<{ success: boolean; message: string; otpPreview?: string }> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, type })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }
  return data;
}

export async function verifyOtpApi(payload: { name?: string; email: string; password?: string; otp: string }): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string } }> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Invalid or expired OTP');
  }
  return data;
}

export async function googleLoginApi(account: { email: string; name: string; avatarUrl?: string }): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string; avatarUrl?: string } }> {
  const res = await fetch(`${API_BASE}/auth/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Google authentication failed');
  }
  return data;
}

export async function fetchMentors(): Promise<Mentor[]> {
  try {
    const res = await fetch(`${API_BASE}/mentors`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function bookMentorshipSession(booking: Partial<MentorshipBooking>): Promise<{ success: boolean; booking?: MentorshipBooking; bookings?: MentorshipBooking[] }> {
  try {
    const res = await fetch(`${API_BASE}/mentors/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchMyMentorshipBookings(): Promise<MentorshipBooking[]> {
  try {
    const res = await fetch(`${API_BASE}/mentors/bookings`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchOpportunitiesApi(): Promise<Opportunity[]> {
  try {
    const res = await fetch(`${API_BASE}/opportunities`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function postCustomOpportunityApi(opp: Partial<Opportunity>): Promise<{ success: boolean; opportunity?: Opportunity; opportunities?: Opportunity[] }> {
  try {
    const res = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opp)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchPortfolioProjectsApi(): Promise<ProjectPortfolioItem[]> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/projects`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function savePortfolioProjectApi(proj: Partial<ProjectPortfolioItem>): Promise<{ success: boolean; project?: ProjectPortfolioItem; projects?: ProjectPortfolioItem[] }> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proj)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchProgressShareApi(): Promise<ProgressShareConsent | null> {
  try {
    const res = await fetch(`${API_BASE}/progress-share`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveProgressShareApi(payload: Partial<ProgressShareConsent>): Promise<{ success: boolean; progressShare?: ProgressShareConsent }> {
  try {
    const res = await fetch(`${API_BASE}/progress-share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}



