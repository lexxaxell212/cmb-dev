import { useCallback, useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './views/Dashboard';
import Products from './views/Products';
import News from './views/News';
import Info from './views/Info';
import Settings from './views/Settings';
import Quotes from './views/Quotes';
import { clearSession, isAuthenticated, setOnUnauthorized } from './api';
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
  const { t } = useI18n();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [tab, setTab] = useState<Tab>('dashboard');
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
    <div className="mx-auto max-w-6xl px-4 pb-28">
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-wood-mid/30 bg-[#2a1a12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1 px-3 py-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-label={t(item.labelKey)}
              aria-current={tab === item.id ? 'page' : undefined}
              className={[
                'flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-2 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors md:text-xs',
                tab === item.id
                  ? 'bg-accent/20 text-accent'
                  : 'text-wood-text/60 hover:text-wood-text',
              ].join(' ')}
            >
              <i className={`fa-solid ${item.icon} text-lg`} aria-hidden="true" />
              <span className="hidden md:inline">{t(item.labelKey)}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}