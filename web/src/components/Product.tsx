import { useMemo, useState } from 'react';
import { Coffee, CupSoda, Croissant, Flame } from 'lucide-react';
import Card from './reusable/Card';
import Skeleton from './reusable/Skeleton';
import { resolveImage } from '../utils/image';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/translations';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  description: {
    id: string;
    en: string;
  };
  tags: string[];
  isBestSeller: boolean;
}

export type Category = 'all' | 'coffee' | 'non-coffee' | 'pastry';

const categoryTabs: {
  id: Category;
  labelKey: TranslationKey;
  icon: typeof Coffee;
}[] = [
  { id: 'all', labelKey: 'product.category.all', icon: Coffee },
  { id: 'coffee', labelKey: 'product.category.coffee', icon: Coffee },
  { id: 'non-coffee', labelKey: 'product.category.nonCoffee', icon: CupSoda },
  { id: 'pastry', labelKey: 'product.category.pastry', icon: Croissant },
];

const categoryHeader: Record<Category, TranslationKey> = {
  all: 'product.header.all',
  coffee: 'product.header.coffee',
  'non-coffee': 'product.header.nonCoffee',
  pastry: 'product.header.pastry',
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

interface ProductProps {
  products: ProductItem[];
  initialCategory?: Category;
  showFilter?: boolean;
  limit?: number;
  loading?: boolean;
}

export default function Product({
  products,
  initialCategory = 'all',
  showFilter = false,
  limit,
  loading = false,
}: ProductProps) {
  const { t, lang } = useLanguage();
  const [category, setCategory] = useState<Category>(initialCategory);

  const filtered = useMemo(() => {
    let list =
      category === 'all'
        ? products
        : products.filter((p) => p.category === category);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [products, category, limit]);

  return (
    <section className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-4xl display-h2 text-wood-text">
            {t(categoryHeader[category])}
          </h2>
          <p className="mt-2 text-wood-text/70">{t('product.subtitle')}</p>
        </div>

        {showFilter && (
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={[
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs md:text-sm font-label font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer border',
                  category === id
                    ? 'bg-wood-text text-wood-darkest border-wood-text'
                    : 'bg-wood-dark/40 text-wood-text/75 border-wood-mid/30 hover:bg-wood-dark/60 hover:text-wood-text',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
                {t(labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center">
        {loading &&
          Array.from({ length: limit ?? 3 }).map((_, i) => (
            <Card key={`skeleton-${i}`} hoverable className="flex flex-col animate-slide-up">
              <Skeleton className="aspect-[4/3] -mx-5 -mt-5 mb-4 rounded-b-none" />
              <div className="mt-3 h-5 w-3/4 rounded bg-wood-dark/50 animate-pulse" />
              <div className="mt-2 h-3 w-full rounded bg-wood-dark/50 animate-pulse" />
              <div className="mt-1 h-3 w-2/3 rounded bg-wood-dark/50 animate-pulse" />
            </Card>
          ))}
        {filtered.map((product) => (
          <Card key={product.id} hoverable className="flex flex-col animate-slide-up">
            <div className="relative -mx-5 -mt-5 mb-4">
              <img
                src={resolveImage(product.image)}
                alt={product.name}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-t-md rounded-b-none object-cover"
              />
              {product.isBestSeller && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-xs bg-wood-text text-wood-darkest px-3 py-1 text-[10px] font-label font-bold uppercase tracking-wider shadow">
                  <Flame className="w-3 h-3" />
                  {t('common.bestSeller')}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-start justify-between gap-2">
              <h3 className="text-lg display-h3 text-wood-text">
                {product.name}
              </h3>
              <p className="text-base font-bold text-wood-text whitespace-nowrap">
                {currencyFormatter.format(product.price)}
              </p>
            </div>

            <p className="mt-1.5 text-sm text-wood-text/70 leading-relaxed flex-1">
              {product.description[lang]}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs bg-wood-dark/60 border border-wood-mid/30 px-2.5 py-0.5 text-[11px] text-wood-text/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}