import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { PageId } from '../types';

interface NavBottomProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems = [
  { id: 'home' as const, labelKey: 'nav.home' as const, icon: 'fa-house' },
  { id: 'menu' as const, labelKey: 'nav.menu' as const, icon: 'fa-mug-hot' },
  { id: 'news' as const, labelKey: 'nav.news' as const, icon: 'fa-newspaper' },
  { id: 'contact' as const, labelKey: 'nav.contact' as const, icon: 'fa-phone' },
];

const MOBILE_SHOW_AFTER = 100;
const MOBILE_HIDE_BELOW = 60;

export default function NavBottom({ page, onNavigate }: NavBottomProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible((prev) => {
        const y = window.scrollY;
        const next = y > MOBILE_SHOW_AFTER || (prev && y > MOBILE_HIDE_BELOW);
        return prev === next ? prev : next;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  return (
    <>
      {/* Header — desktop (md ke atas) */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 animate-slide-down">
        <nav className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
<button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-wood-text text-xl font-display font-bold tracking-wide"
          >
            <span className="text-wood-text">Coffee Manual Brew</span>
          </button>
          <div className="flex items-center gap-1 rounded-md bg-wood-darkest border border-wood-mid/40 p-1">
            {navItems.map(({ id, labelKey }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={[
                  'px-4 py-2 rounded-xs text-sm font-label font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer',
                  page === id
                    ? 'text-amber-600'
                    : 'text-wood-text/75 hover:text-wood-text hover:text-amber-600/80',
                ].join(' ')}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Bottom nav — mobile (di bawah md): muncul setelah scroll 100px (deadband 60px supaya tidak berkedip) */}
      <nav
        className={[
          'md:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ease-in-out',
          visible ? 'translate-y-0' : 'translate-y-[110%]',
        ].join(' ')}
      >
        <div className="mx-3 mb-3 rounded-md bg-wood-darkest border border-wood-mid/40 shadow-md shadow-wood-darkest/60 p-1.5 flex justify-around">
          {navItems.map(({ id, labelKey, icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={[
                'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xs text-[11px] font-label font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer',
                page === id
                  ? 'text-amber-600'
                  : 'text-wood-text/70 hover:text-amber-600/80',
              ].join(' ')}
            >
              <i
                className={`fa-solid ${icon} text-[22px] leading-none ${page === id ? 'text-amber-600' : ''}`}
                aria-hidden="true"
              />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}