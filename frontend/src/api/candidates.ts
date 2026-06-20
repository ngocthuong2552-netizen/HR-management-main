import API_BASE from './config';
import { authHeader } from './auth';

export interface CandidateAPI {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experience: number;
  education: string;
  skills: string[];
  certifications: string[];
  stage: string;
  matching_score?: number | null;
  source: string;
  applied_date: string;
  notes: string;
  location: string;
  expected_salary?: number | null;
  cv_text?: string | null;
  category?: string | null;
  talent_pool?: boolean;
}

export interface EmailLog {
  id: string;
  candidate_id: string;
  candidate_email: string;
  template: string;
  subject: string;
  body: string;
  status: string;
  sent_by: string;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  label: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function listCandidates(params: { stage?: string; search?: string } = {}): Promise<CandidateAPI[]> {
  const qs = new URLSearchParams();
  if (params.stage) qs.set('stage', params.stage);
  if (params.search) qs.set('search', params.search);
  qs.set('limit', '500');
  const res = await fetch(`${API_BASE}/api/candidates/?${qs.toString()}`, { headers: authHeader() });
  return handle(res);
}

export async function createCandidate(payload: Partial<CandidateAPI>): Promise<CandidateAPI> {
  const res = await fetch(`${API_BASE}/api/candidates/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateCandidate(id: string, payload: Partial<CandidateAPI>): Promise<CandidateAPI> {
  const res = await fetch(`${API_BASE}/api/candidates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteCandidate(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/candidates/${id}`, { method: 'DELETE', headers: authHeader() });
  return handle(res);
}

export async function getEmailTemplates(): Promise<{ templates: EmailTemplate[] }> {
  const res = await fetch(`${API_BASE}/api/candidates/email-templates`, { headers: authHeader() });
  return handle(res);
}

export async function previewEmail(
  candidateId: string,
  payload: { template: string; [key: string]: string | undefined }
): Promise<{ subject: string; body: string }> {
  const res = await fetch(`${API_BASE}/api/candidates/${candidateId}/emails/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function sendEmail(
  candidateId: string,
  payload: { template: string; subject?: string; body?: string; [key: string]: string | undefined }
): Promise<EmailLog> {
  const res = await fetch(`${API_BASE}/api/candidates/${candidateId}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function getEmailHistory(candidateId: string): Promise<EmailLog[]> {
  const res = await fetch(`${API_BASE}/api/candidates/${candidateId}/emails`, { headers: authHeader() });
  return handle(res);
}