import { Coffee, ArrowRight, Leaf } from 'lucide-react';
import Button from './reusable/Button';
import Skeleton from './reusable/Skeleton';
import { useLanguage } from '../i18n/LanguageContext';
import type { PageId } from '../types';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t, lang } = useLanguage();

  return (
    <section className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in">
      {/* Copy */}
      <div className="order-2 lg:order-1 text-center lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-sm bg-wood-dark/60 border border-wood-mid/40 px-4 py-1.5 text-xs md:text-sm font-label font-bold text-wood-text tracking-widest uppercase">
          <Leaf className="w-4 h-4 text-wood-text" />
          {t('hero.badge')}
        </span>

        <h1 className="mt-5 text-4xl md:text-5xl xl:text-6xl display-h1 text-wood-text">
          {t('hero.title1')}
          <span className="block text-wood-text italic">{t('hero.title2')}</span>
        </h1>

        <p className="mt-5 text-wood-text/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <Button onClick={() => onNavigate('menu')}>
            {t('common.viewMenu')}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('contact')}>
            {t('common.contactUs')}
          </Button>
        </div>
      </div>

      {/* Skeleton gambar hero */}
      <div className="order-1 lg:order-2">
        <Skeleton
          className="aspect-[4/3] lg:aspect-square w-full shadow-md shadow-wood-darkest/50"
          icon={<Coffee className="w-14 h-14 md:w-20 md:h-20 text-wood-light/60" />}
          label={lang === 'en' ? 'Hero Image' : 'Gambar Hero'}
        />
      </div>
    </section>
  );
}