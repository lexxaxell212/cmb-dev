import { useState } from 'react';
import { CalendarDays, Coffee, Tag, ChevronDown } from 'lucide-react';
import Card from '../components/reusable/Card';
import Skeleton from '../components/reusable/Skeleton';
import { useNews } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function News() {
  const { t, lang } = useLanguage();
  const news = useNews();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  return (
    <div className="w-full flex flex-col gap-14 md:gap-20 animate-fade-in">
      <header className="w-full max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl display-h1 text-wood-text">
          {t('news.title')}
        </h1>
        <p className="mt-3 text-wood-text/75 max-w-xl mx-auto">
          {t('news.subtitle')}
        </p>
      </header>

      <section className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {news.error && (
            <p className="col-span-full text-center text-sm text-wood-text/60">
              {t('common.apiError')}: {news.error}
            </p>
          )}
          {news.loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="flex flex-col">
                <Skeleton className="aspect-[16/9] -m-5 mb-4 rounded-b-none" />
                <div className="mt-3 h-6 w-2/3 rounded bg-wood-dark/50 animate-pulse" />
                <div className="mt-2 h-3 w-full rounded bg-wood-dark/50 animate-pulse" />
                <div className="mt-1 h-3 w-5/6 rounded bg-wood-dark/50 animate-pulse" />
              </Card>
            ))}
          {(news.data ?? []).map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <Card key={item.id} hoverable className="flex flex-col animate-slide-up">
                <Skeleton
                  className="aspect-[16/9] -m-5 mb-4 rounded-b-none"
                  icon={<Coffee className="w-10 h-10 text-wood-light/60" />}
                  label={item.title[lang]}
                />

                <div className="flex flex-wrap items-center gap-3 text-xs text-wood-text/60">
                  <span className="inline-flex items-center gap-1.5 font-label font-bold">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xs bg-wood-dark/60 border border-wood-mid/30 px-2.5 py-0.5 text-wood-text/80 font-label font-bold uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    {item.category[lang]}
                  </span>
                </div>

                <h2 className="mt-3 text-xl display-h2 text-wood-text">
                  {item.title[lang]}
                </h2>
                <p className="mt-2 text-sm text-wood-text/70 leading-relaxed flex-1">
                  {item.excerpt[lang]}
                </p>

                {isExpanded && (
                  <div className="mt-3 space-y-2 text-sm text-wood-text/80 leading-relaxed animate-slide-up">
                    {item.content[lang].map((paragraph) => (
                      <p key={`${item.id}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => toggle(item.id)}
                  className="mt-4 self-start inline-flex items-center gap-1.5 text-sm font-label font-bold text-wood-text/85 hover:text-wood-text transition-colors cursor-pointer"
                >
                  {isExpanded ? t('common.collapse') : t('common.expand')}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}