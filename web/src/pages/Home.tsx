import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import Product from '../components/Product';
import Button from '../components/reusable/Button';
import Card from '../components/reusable/Card';
import { resolveImage } from '../utils/image';
import { useNews, useProducts } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import type { PageId } from '../types';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function Home({ onNavigate }: HomeProps) {
  const { t, lang } = useLanguage();
  const products = useProducts();
  const news = useNews();

  const features = [
    { icon: 'fa-mug-hot', title: t('features.single.title'), desc: t('features.single.desc') },
    { icon: 'fa-clock', title: t('features.open.title'), desc: t('features.open.desc') },
    { icon: 'fa-location-dot', title: t('features.cozy.title'), desc: t('features.cozy.desc') },
  ];

  return (
    <div className="w-full flex flex-col gap-14 md:gap-20">
      {/* Hero */}
      <Hero onNavigate={onNavigate} />

      {/* Keunggulan */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in delay-100">
        {features.map(({ icon, title, desc }) => (
          <Card key={title} hoverable className="text-center animate-slide-up">
            <div className="mx-auto mb-3 w-12 h-12 rounded-md bg-wood-dark/60 border border-wood-mid/30 flex items-center justify-center">
              <i className={`fa-solid ${icon} text-2xl text-wood-text`} aria-hidden="true" />
            </div>
            <h3 className="text-lg display-h3 text-wood-text">{title}</h3>
            <p className="mt-1 text-sm text-wood-text/70">{desc}</p>
          </Card>
        ))}
      </section>

      {/* Carousel */}
      <Carousel />

      {/* Produk unggulan */}
      {products.error ? (
        <div className="w-full max-w-6xl mx-auto text-center text-sm text-wood-text/60">
          {t('common.apiError')}: {products.error}
        </div>
      ) : (
        <Product products={products.data ?? []} limit={3} loading={products.loading} />
      )}

      <div className="w-full max-w-6xl mx-auto text-center -mt-4 animate-fade-in">
        <Button onClick={() => onNavigate('menu')}>
          {t('common.viewAllMenu')}
          <i className="fa-solid fa-arrow-right text-base" aria-hidden="true" />
        </Button>
      </div>

      {/* Preview berita */}
      <section className="w-full max-w-6xl mx-auto animate-fade-in">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl md:text-4xl display-h2 text-wood-text">
            {t('home.newsTitle')}
          </h2>
          <button
            onClick={() => onNavigate('news')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-label font-bold text-wood-text/80 hover:text-wood-text transition-colors cursor-pointer"
          >
            {t('common.viewAll')}
            <i className="fa-solid fa-arrow-right text-base" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.error && (
            <div className="col-span-full text-center text-sm text-wood-text/60">
              {t('common.apiError')}: {news.error}
            </div>
          )}
          {(news.data ?? []).slice(0, 3).map((item) => (
            <Card key={item.id} hoverable className="flex flex-col animate-slide-up">
              <div className="relative aspect-[16/9] mb-4">
                <img
                  src={resolveImage(item.image)}
                  alt={item.title[lang]}
                  loading="lazy"
                  className="absolute -inset-x-5 -top-5 h-[calc(100%+1.25rem)] w-[calc(100%+2.5rem)] object-cover rounded-t-md rounded-b-none"
                />
              </div>
              <span className="text-[11px] font-label font-bold uppercase tracking-widest text-wood-text/50">
                {formatDate(item.date)}
              </span>
              <h3 className="mt-1 text-lg display-h3 text-wood-text">
                {item.title[lang]}
              </h3>
              <p className="mt-2 text-sm text-wood-text/70 leading-relaxed flex-1">
                {item.excerpt[lang]}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-6xl mx-auto animate-fade-in">
        <div className="relative overflow-hidden rounded-lg bg-wood-dark/75 border border-wood-mid/40 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl display-h2 text-wood-text">
            {t('home.ctaTitle')}
          </h2>
          <p className="mt-3 text-wood-text/75 max-w-lg mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => onNavigate('contact')}>
              {t('common.contactUs')}
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('menu')}>
              {t('common.viewMenu')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}