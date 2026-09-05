import Product from '../components/Product';
import { useProducts } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export default function Menu() {
  const { t } = useLanguage();
  const products = useProducts();

  return (
    <div className="w-full flex flex-col gap-14 md:gap-20 animate-fade-in">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl display-h1 text-wood-text">
          {t('menu.title')}
        </h1>
        <p className="mt-3 text-wood-text/75 max-w-xl mx-auto">
          {t('menu.subtitle')}
        </p>
      </header>

      {/* Daftar menu dengan filter */}
      {products.error ? (
        <p className="w-full max-w-6xl mx-auto text-center text-sm text-wood-text/60">
          {t('common.apiError')}: {products.error}
        </p>
      ) : (
        <Product products={products.data ?? []} showFilter loading={products.loading} />
      )}
    </div>
  );
}