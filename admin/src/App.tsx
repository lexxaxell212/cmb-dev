import { useCallback, useEffect, useState } from 'react';
import Login from './components/Login';
import Products from './views/Products';
import News from './views/News';
import Settings from './views/Settings';
import Quotes from './views/Quotes';
import { clearSession, isAuthenticated, setOnUnauthorized } from './api';
import { useI18n, type TranslationKey } from './i18n';

type Tab = 'products' | 'news' | 'info' | 'quotes';

const TABS: { id: Tab; labelKey: TranslationKey; icon: string }[] = [
  { id: 'products', labelKey: 'tab.products', icon: 'fa-mug-hot' },
  { id: 'news', labelKey: 'tab.news', icon: 'fa-newspaper' },
  { id: 'info', labelKey: 'tab.info', icon: 'fa-circle-info' },
  { id: 'quotes', labelKey: 'tab.quotes', icon: 'fa-quote-left' },
];

export default function App() {
  const { t, lang, setLang } = useI18n();
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
    <div className="mx-auto max-w-6xl px-4 pb-28">
      <header className="relative border-b border-wood-mid/30 py-5 text-center">
        <div className="text-xl font-bold tracking-wide text-wood-text">
          <i className="fa-solid fa-mug-hot text-2xl text-accent" aria-hidden="true" />
          Coffee Manual Brew
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
          {t('brand.subtitle')}
        </div>

        <button
          onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
          className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-md border border-wood-mid/50 px-3 py-1.5 text-sm font-bold text-wood-text/80 hover:text-wood-text cursor-pointer transition-colors"
          aria-label={t('lang.label')}
          title={t('lang.label')}
        >
          <i className="fa-solid fa-language text-base" aria-hidden="true" />
          <span className="uppercase tracking-wide">{lang === 'id' ? 'ID' : 'EN'}</span>
        </button>
      </header>

      <main className="mt-6">
        {tab === 'products' && <Products key={reloadKey} onChanged={refresh} />}
        {tab === 'news' && <News key={reloadKey} onChanged={refresh} />}
        {tab === 'info' && <Settings key={reloadKey} onLogout={handleLogout} />}
        {tab === 'quotes' && <Quotes key={reloadKey} onChanged={refresh} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-wood-mid/30 bg-[#2a1a12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-stretch justify-around gap-1 px-3 py-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={[
                'flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-2 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors',
                tab === item.id
                  ? 'bg-accent/20 text-accent'
                  : 'text-wood-text/60 hover:text-wood-text',
              ].join(' ')}
              aria-current={tab === item.id ? 'page' : undefined}
            >
              <i className={`fa-solid ${item.icon} text-lg`} aria-hidden="true" />
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}