import { useState } from 'react';
import { login, setSession, getBaseUrl, setBaseUrl } from '../api';
import { Button, Field, inputClass } from './ui';
import { useI18n } from '../i18n';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const { t, lang, setLang } = useI18n();
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
      setError(err instanceof Error ? err.message : t('login.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <button
        onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md border border-wood-mid/50 px-3 py-1.5 text-sm font-bold text-wood-text/80 hover:text-wood-text cursor-pointer transition-colors"
        aria-label={t('lang.label')}
        title={t('lang.label')}
      >
        <i className="fa-solid fa-language text-base" aria-hidden="true" />
        <span className="uppercase tracking-wide">{lang === 'id' ? 'ID' : 'EN'}</span>
      </button>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-wood-mid bg-wood-dark p-7"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-wood-text">Coffee Manual Brew</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            {t('brand.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-accent bg-wood-darkest/60 px-3 py-2 text-sm text-amber-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Field label={t('login.apiUrl')}>
            <input
              className={inputClass}
              value={baseUrl}
              onChange={(e) => setBase(e.target.value)}
              placeholder="https://coffee-admin.dzfee.id/api"
              autoComplete="off"
            />
          </Field>
          <Field label={t('login.username')}>
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label={t('login.password')}>
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
            {busy ? t('login.busy') : t('login.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}