const TOKEN_KEY = 'admin-token';
const USER_KEY = 'admin-user';

export function getBaseUrl(): string {
  return localStorage.getItem('admin-api') || 'https://coffee-admin.dzfee.id/api';
}

export function setBaseUrl(url: string): void {
  localStorage.setItem('admin-api', url.trim().replace(/\/+$/, ''));
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getUsername(): string {
  return localStorage.getItem(USER_KEY) || '';
}

export function setSession(token: string, username: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export class ApiError extends Error {}

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: (() => void) | null): void {
  onUnauthorized = fn;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(getBaseUrl() + path, {
    ...options,
    headers: { ...headers, ...((options.headers as Record<string, string>) || {}) },
  });

  if (res.status === 401) {
    onUnauthorized?.();
    throw new ApiError('Sesi berakhir. Silakan login ulang.');
  }

  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    const message = (data as { error?: string })?.error || `HTTP ${res.status}`;
    throw new ApiError(message);
  }

  return data as T;
}

export async function login(
  baseUrl: string,
  username: string,
  password: string,
): Promise<{ token: string; username: string }> {
  const res = await fetch(baseUrl.replace(/\/+$/, '') + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    token?: string;
    username?: string;
    error?: string;
  };
  if (!res.ok || !data.token) {
    throw new ApiError(data.error || 'Login gagal');
  }
  return { token: data.token, username: data.username || username };
}