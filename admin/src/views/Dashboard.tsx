import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Category, NewsItem, Product, Quote, Settings } from '../types';
import { Alert } from '../components/ui';
import { useI18n } from '../i18n';

interface Stats {
  products: number;
  bestsellers: number;
  news: number;
  quotes: number;
  hours: number;
  categories: Record<Category, number>;
}

export default function Dashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Product[]>('/products'),
      api<NewsItem[]>('/news'),
      api<Quote[]>('/quotes'),
      api<Settings>('/settings'),
    ])
      .then(([products, news, quotes, settings]) => {
        const categories: Record<Category, number> = {
          coffee: 0,
          'non-coffee': 0,
          pastry: 0,
        };
        for (const p of products) categories[p.category] = (categories[p.category] || 0) + 1;
        setStats({
          products: products.length,
          bestsellers: products.filter((p) => p.isBestSeller).length,
          news: news.length,
          quotes: quotes.length,
          hours: settings.hours.filter((h) => h.day.trim() && h.time.trim()).length,
          categories,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : t('dashboard.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  const cards = stats
    ? [
        { label: t('dashboard.products'), value: stats.products, icon: 'fa-mug-hot' as const },
        { label: t('dashboard.bestsellers'), value: stats.bestsellers, icon: 'fa-fire' as const },
        { label: t('dashboard.news'), value: stats.news, icon: 'fa-newspaper' as const },
        { label: t('dashboard.quotes'), value: stats.quotes, icon: 'fa-quote-left' as const },
        { label: t('dashboard.hours'), value: stats.hours, icon: 'fa-clock' as const },
      ]
    : [];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-wood-text">{t('dashboard.title')}</h2>

      {error && <Alert type="error">{error}</Alert>}

      {loading && <p className="text-wood-text/60">{t('common.loading')}</p>}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-4 rounded-lg border border-wood-mid/40 bg-wood-dark/60 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/15 border border-accent/30">
                <i className={`fa-solid ${c.icon} text-xl text-accent`} aria-hidden="true" />
              </span>
              <div>
                <div className="text-2xl font-bold text-wood-text">{c.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-wood-text/60">
                  {c.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div className="mt-6 rounded-lg border border-wood-mid/40 bg-wood-dark/60 p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-wood-text/70">
            {t('dashboard.byCategory')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(['coffee', 'non-coffee', 'pastry'] as Category[]).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 rounded-md border border-wood-mid/40 bg-wood-darkest/50 px-3 py-1.5 text-sm text-wood-text/80"
              >
                <i className="fa-solid fa-tag text-xs text-accent" aria-hidden="true" />
                {t(cat === 'coffee' ? 'cat.coffee' : cat === 'non-coffee' ? 'cat.nonCoffee' : 'cat.pastry')}
                <span className="font-bold text-wood-text">{stats.categories[cat]}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}