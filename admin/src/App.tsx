import { useCallback, useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './views/Dashboard';
import Products from './views/Products';
import News from './views/News';
import Info from './views/Info';
import Settings from './views/Settings';
import Quotes from './views/Quotes';
import {
  clearSession,
  isAuthenticated,
  isTokenExpired,
  setOnUnauthorized,
} from './api';
import { useI18n, type TranslationKey } from './i18n';

type Tab = 'dashboard' | 'products' | 'news' | 'info' | 'settings' | 'quotes';

const TABS: { id: Tab; labelKey: TranslationKey; icon: string }[] = [
  { id: 'dashboard', labelKey: 'tab.dashboard', icon: 'fa-chart-pie' },
  { id: 'products', labelKey: 'tab.products', icon: 'fa-mug-hot' },
  { id: 'news', labelKey: 'tab.news', icon: 'fa-newspaper' },
  { id: 'info', labelKey: 'tab.info', icon: 'fa-circle-info' },
  { id: 'settings', labelKey: 'tab.settings', icon: 'fa-gear' },
  { id: 'quotes', labelKey: 'tab.quotes', icon: 'fa-quote-left' },
];

export default function App() {
  const { t, lang } = useI18n();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const endSession = useCallback(() => {
    clearSession();
    setAuthed(false);
  }, []);

  useEffect(() => {
    setOnUnauthorized(endSession);
    return () => setOnUnauthorized(null);
  }, [endSession]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const checkExpiry = () => {
      if (isAuthenticated() && isTokenExpired()) endSession();
    };
    const id = window.setInterval(checkExpiry, 30000);
    window.addEventListener('focus', checkExpiry);
    window.addEventListener('popstate', checkExpiry);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', checkExpiry);
      window.removeEventListener('popstate', checkExpiry);
      window.removeEventListener('keydown', onKey);
    };
  }, [endSession]);

  const handleLogout = endSession;

  const selectTab = (id: Tab) => setTab(id);

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  const today = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <header className="border-b border-wood-mid/30 py-5 text-center">
        <div className="text-xl font-bold tracking-wide text-wood-text">
          <i className="fa-solid fa-mug-hot text-2xl text-accent" aria-hidden="true" />
          Coffee Manual Brew
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
          {t('brand.subtitle')}
        </div>
      </header>

      <main className="mt-6">
        {tab === 'dashboard' && <Dashboard key={reloadKey} />}
        {tab === 'products' && <Products key={reloadKey} onChanged={refresh} />}
        {tab === 'news' && <News key={reloadKey} onChanged={refresh} />}
        {tab === 'info' && <Info key={reloadKey} />}
        {tab === 'settings' && <Settings key={reloadKey} onLogout={handleLogout} />}
        {tab === 'quotes' && <Quotes key={reloadKey} onChanged={refresh} />}
      </main>

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!sidebarOpen}
        aria-label={t('nav.menu')}
        className={[
          'fixed inset-0 z-40 transition-opacity duration-300 ease-in-out',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <div
          className={[
            'absolute inset-0 bg-black/60 transition-opacity duration-300 ease-in-out',
            sidebarOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={[
            'absolute inset-y-0 left-0 flex w-64 flex-col border-r border-wood-mid/40 bg-[#221510] shadow-xl transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-between border-b border-wood-mid/30 px-4 py-4">
            <div className="text-sm font-bold text-wood-text">
              <i className="fa-solid fa-mug-hot text-accent" aria-hidden="true" />
              Coffee Manual Brew
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label={t('nav.menu')}
              className="rounded p-1 text-wood-text/60 hover:text-wood-text cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => selectTab(item.id)}
                aria-current={tab === item.id ? 'page' : undefined}
                className={[
                  'mb-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors',
                  tab === item.id
                    ? 'bg-accent/20 text-accent'
                    : 'text-wood-text/70 hover:bg-wood-darkest/50 hover:text-wood-text',
                ].join(' ')}
              >
                <i className={`fa-solid ${item.icon} w-5 text-base`} aria-hidden="true" />
                {t(item.labelKey)}
              </button>
            ))}
          </nav>
        </aside>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[45] border-t border-wood-mid/30 bg-[#2a1a12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={t('nav.menu')}
            className="inline-flex items-center gap-2 rounded-md border border-wood-mid/50 px-3 py-2 text-sm font-bold text-wood-text/80 hover:text-wood-text cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-bars text-lg" aria-hidden="true" />
            <span className="hidden sm:inline uppercase tracking-wide">{t('nav.menu')}</span>
          </button>
          <span className="inline-flex items-center gap-2 text-sm text-wood-text/70">
            <i className="fa-solid fa-calendar-days text-base text-accent" aria-hidden="true" />
            {today}
          </span>
        </div>
      </nav>
    </div>
  );
}