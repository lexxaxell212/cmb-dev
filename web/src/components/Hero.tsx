import { ArrowRight, Leaf } from 'lucide-react';
import Button from './reusable/Button';
import { useLanguage } from '../i18n/LanguageContext';
import type { PageId } from '../types';
import heroDesktop from '../assets/images/dekstop-hero.webp';
import icedCoffee from '../assets/images/iced-coffee.png';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -mx-4 md:-mx-8 relative overflow-hidden animate-fade-in">
      {/* Background — full-bleed, spills out of Layout padding like a bootstrap container-fluid */}
      <img
        src={heroDesktop}
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-wood-darkest/75 md:bg-gradient-to-r md:from-wood-darkest/95 md:via-wood-darkest/80 md:to-wood-darkest/45 z-[1]" />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 lg:py-32 grid lg:grid-cols-2 gap-10 items-center z-10">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-sm bg-wood-dark/60 border border-wood-mid/40 px-4 py-1.5 text-xs md:text-sm font-label font-bold text-wood-text tracking-widest uppercase">
            <Leaf className="w-4 h-4 text-wood-text" />
            {t('hero.badge')}
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl xl:text-6xl display-h1 text-wood-text">
            {t('hero.title1')}
            <span className="block text-wood-text italic">{t('hero.title2')}</span>
          </h1>

          <p className="mt-5 text-wood-text/85 max-w-md mx-auto lg:mx-0 leading-relaxed">
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

        {/* Product image overlay — explicitly above the background */}
        <div className="hidden lg:flex justify-center">
          <img
            src={icedCoffee}
            alt="Iced Coffee"
            className="w-72 xl:w-80 drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-slide-up"
          />
        </div>
      </div>
    </section>
  );
}