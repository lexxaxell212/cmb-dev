import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import Skeleton from './reusable/Skeleton';

interface CarouselProps {
  slides?: string[];
  autoPlay?: boolean;
  intervalMs?: number;
}

const DEFAULT_SLIDES = ['hero-1', 'hero-2', 'hero-3', 'hero-4'];

export default function Carousel({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  intervalMs = 4000,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const { t } = useLanguage();

  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const goPrev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (!autoPlay || count <= 1 || paused) return;
    const timer = setInterval(goNext, intervalMs);
    return () => clearInterval(timer);
  }, [autoPlay, count, intervalMs, goNext, paused]);

  return (
    <div className="relative w-full max-w-6xl mx-auto animate-fade-in">
      <div
        className="relative overflow-hidden rounded-lg border border-wood-mid/40 shadow-lg shadow-wood-darkest/50"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((id) => (
            <div key={id} className="w-full shrink-0">
              <Skeleton
                className="aspect-[16/9] md:aspect-[21/9] w-full rounded-none"
                icon={<Coffee className="w-12 h-12 md:w-16 md:h-16 text-wood-light/60" />}
                label={`${t('common.slide')} ${id}`}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm bg-wood-darkest/80 border border-wood-mid/40 p-2.5 text-wood-text hover:bg-wood-darkest transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-wood-darkest/80 border border-wood-mid/40 p-2.5 text-wood-text hover:bg-wood-darkest transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
          {slides.map((id, i) => (
            <button
              key={id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                'h-2 rounded-[2px] transition-all duration-300 cursor-pointer',
                i === index
                  ? 'w-4 bg-wood-text'
                  : 'w-2 bg-wood-text/40 hover:bg-wood-text/70',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}