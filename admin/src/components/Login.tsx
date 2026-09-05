import { useState } from 'react';
import { login, setSession, getBaseUrl, setBaseUrl } from '../api';
import { Button, Field, inputClass } from './ui';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [baseUrl, setBase] = useState(getBaseUrl());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    setBaseUrl(baseUrl);
    try {
      const result = await login(baseUrl, username, password);
      setSession(result.token, result.username);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-wood-mid bg-wood-dark p-7"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-wood-text">Egi-Coffee</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Admin Panel
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-accent bg-wood-darkest/60 px-3 py-2 text-sm text-amber-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Field label="API URL">
            <input
              className={inputClass}
              value={baseUrl}
              onChange={(e) => setBase(e.target.value)}
              placeholder="http://localhost:3000/api"
              autoComplete="off"
            />
          </Field>
          <Field label="Username">
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          <Button type="submit" disabled={busy}>
            {busy ? 'Memproses...' : 'Masuk'}
          </Button>
        </div>
      </form>
    </div>
  );
}