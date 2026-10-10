import { Skill, JobApplication, ServerHealth, Mentor, MentorshipBooking, Opportunity, ProjectPortfolioItem, ProgressShareConsent, LiveStreamEvent, LearnerProfile } from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('careergrowth_token') || localStorage.getItem('skillbridge_token');
}

export function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('careergrowth_token');
  localStorage.removeItem('careergrowth_user_name');
  localStorage.removeItem('skillbridge_token');
  localStorage.removeItem('skillbridge_user_name');
  window.dispatchEvent(new CustomEvent('careergrowth:unauthorized'));
}

async function authFetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...init,
    headers
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

export async function checkServerHealth(): Promise<ServerHealth | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchProfileFromServer(): Promise<LearnerProfile | null> {
  try {
    const res = await authFetch('/profile');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveProfileToServer(profile: Partial<LearnerProfile>): Promise<{ success: boolean; profile?: LearnerProfile }> {
  try {
    const res = await authFetch('/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchSkillsFromServer(): Promise<Skill[] | null> {
  try {
    const res = await authFetch('/skills');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function addSkillToServer(skill: Partial<Skill>): Promise<{ success: boolean; skill?: Skill; skills?: Skill[] }> {
  try {
    const res = await authFetch('/skills', {
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
    const res = await authFetch(`/skills/${skillId}`, {
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
    const res = await authFetch(`/skills/${skillId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function submitQuizAnswers(topic: string, score: number, totalQuestions: number, answers: any[]): Promise<any> {
  try {
    const res = await authFetch('/quiz-submissions', {
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
    const res = await authFetch('/applications', {
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
    const res = await authFetch('/applications');
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function postTeacherIntervention(studentId: string, studentName: string, note: string, actionType: string): Promise<any> {
  try {
    const res = await authFetch('/interventions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, studentName, note, actionType })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchTeacherAnalytics(): Promise<any> {
  try {
    const res = await authFetch('/teacher/analytics');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchInstitutionAnalytics(): Promise<any> {
  try {
    const res = await authFetch('/institution/analytics');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function postCustomData(title: string, category: string, payload: any): Promise<any> {
  try {
    const res = await authFetch('/custom-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, payload })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function askAiTutor(prompt: string, topic: string, language: string): Promise<{ success: boolean; answer?: string; apiUsed?: string; error?: string }> {
  try {
    const res = await authFetch('/ai-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, topic, language })
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to connect to AI server' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string; role: any } }> {
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

export async function registerUser(name: string, email: string, password: string, role = 'student'): Promise<{ token: string; user: { id: string; name: string; email: string; role: any } }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function fetchCurrentUser(token: string): Promise<{ user: { id: string; name: string; email: string; role: any } } | null> {
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

export async function sendOtpApi(email: string, type: 'register' | 'login' = 'register'): Promise<{ success: boolean; message: string; otpPreview?: string; demoNotice?: string }> {
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

export async function verifyOtpApi(payload: { name?: string; email: string; password?: string; otp: string; role?: string }): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string; role: any } }> {
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

export async function googleLoginApi(account: { email: string; name: string; avatarUrl?: string; role?: string }): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string; role: any; avatarUrl?: string } }> {
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
    const res = await authFetch('/mentors/book', {
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
    const res = await authFetch('/mentors/bookings');
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

export async function refreshOpportunitiesApi(): Promise<{ success: boolean; message?: string; freshCount?: number; opportunities?: Opportunity[]; freshIngested?: Opportunity[] }> {
  try {
    const res = await authFetch('/opportunities/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return { success: false };
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function postCustomOpportunityApi(opp: Partial<Opportunity>): Promise<{ success: boolean; opportunity?: Opportunity; opportunities?: Opportunity[] }> {
  try {
    const res = await authFetch('/opportunities', {
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
    const res = await authFetch('/portfolio/projects');
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function savePortfolioProjectApi(proj: Partial<ProjectPortfolioItem>): Promise<{ success: boolean; project?: ProjectPortfolioItem; projects?: ProjectPortfolioItem[] }> {
  try {
    const res = await authFetch('/portfolio/projects', {
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
    const res = await authFetch('/progress-share');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveProgressShareApi(payload: Partial<ProgressShareConsent>): Promise<{ success: boolean; progressShare?: ProgressShareConsent }> {
  try {
    const res = await authFetch('/progress-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export function subscribeToLiveStream(
  onEvent: (event: LiveStreamEvent) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !window.EventSource) {
    return () => {};
  }

  const streamUrl = `${API_BASE}/live/stream`;
  let eventSource: EventSource | null = null;
  let isClosed = false;

  const eventTypes = ['initial_state', 'new_opportunity', 'opportunity_tick', 'live_activity', 'system_stats'];

  const connect = () => {
    if (isClosed) return;
    try {
      eventSource = new EventSource(streamUrl);

      eventTypes.forEach(evtType => {
        eventSource?.addEventListener(evtType, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            onEvent({ type: evtType, ...data } as LiveStreamEvent);
          } catch (err) {
            console.warn(`Error parsing live event ${evtType}:`, err);
          }
        });
      });

      eventSource.onerror = (err) => {
        if (onError) onError(err);
      };
    } catch (e) {
      if (onError) onError(e);
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}

export async function triggerManualExternalFetch(): Promise<{
  success: boolean;
  opportunity?: Opportunity;
  opportunities?: Opportunity[];
  message?: string;
}> {
  try {
    const res = await authFetch('/opportunities/fetch-external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchLiveUpdatesApi(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/live/updates`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
