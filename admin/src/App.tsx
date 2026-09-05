import { useCallback, useEffect, useState } from 'react';
import Login from './components/Login';
import Products from './views/Products';
import News from './views/News';
import Settings from './views/Settings';
import { clearSession, getUsername, isAuthenticated, setOnUnauthorized } from './api';

type Tab = 'products' | 'news' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Produk' },
  { id: 'news', label: 'Berita' },
  { id: 'settings', label: 'Pengaturan' },
];

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [tab, setTab] = useState<Tab>('products');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setOnUnauthorized(() => setAuthed(false));
    return () => setOnUnauthorized(null);
  }, []);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
  };

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="flex items-center justify-between border-b border-wood-mid/30 py-4">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold tracking-wide text-wood-text">
            <i className="fa-solid fa-mug-hot text-2xl text-accent" aria-hidden="true" />
            Coffee Manual Brew
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-wood-text/60">
            {getUsername() && `Masuk sebagai ${getUsername()}`}
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-md border border-wood-mid/50 px-3 py-1.5 text-sm text-wood-text/80 hover:text-wood-text cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket text-base" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </header>

      <nav className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'rounded-md px-4 py-2 text-sm font-semibold cursor-pointer transition-colors',
              tab === t.id
                ? 'bg-accent text-wood-darkest'
                : 'border border-wood-mid/40 text-wood-text/70 hover:text-wood-text',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mt-6">
        {tab === 'products' && <Products key={reloadKey} onChanged={refresh} />}
        {tab === 'news' && <News key={reloadKey} onChanged={refresh} />}
        {tab === 'settings' && <Settings key={reloadKey} />}
      </main>
    </div>
  );
}