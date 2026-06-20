import API_BASE from './config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

interface AuthResponse {
  access_token: string;
  user: User;
}

const TOKEN_KEY = 'hr_token';
const USER_KEY = 'hr_user';

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

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle<AuthResponse>(res);
  saveSession(data);
  return data.user;
}

export async function bootstrapAdmin(email: string, password: string, name: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/bootstrap-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, role: 'admin' }),
  });
  const data = await handle<AuthResponse>(res);
  saveSession(data);
  return data.user;
}

export async function registerUser(email: string, password: string, name: string, role: 'admin' | 'employee'): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ email, password, name, role }),
  });
  return handle<User>(res);
}

export function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeader() });
  return handle<User>(res);
}