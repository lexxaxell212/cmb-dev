import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'id' | 'en';

const STORAGE_KEY = 'admin-lang';

const id = {
  'brand.subtitle': 'Admin Panel',
  'lang.label': 'Bahasa antarmuka',
  'lang.id': 'Indonesia',
  'lang.en': 'English',
  'nav.loggedInAs': 'Masuk sebagai',
  'nav.logout': 'Keluar',
  'nav.menu': 'Menu',
  'tab.dashboard': 'Dashboard',
  'tab.products': 'Produk',
  'tab.news': 'Berita',
  'tab.info': 'Informasi',
  'tab.settings': 'Pengaturan',
  'tab.quotes': 'Kata-kata',

  'dashboard.title': 'Dashboard',
  'dashboard.products': 'Produk',
  'dashboard.bestsellers': 'Produk Best Seller',
  'dashboard.news': 'Berita',
  'dashboard.quotes': 'Kata-kata',
  'dashboard.hours': 'Jam Buka',
  'dashboard.category': 'Kategori',
  'dashboard.byCategory': 'Per kategori',
  'dashboard.loadError': 'Gagal memuat statistik',
  'dashboard.total': 'Total',

  'login.apiUrl': 'API URL',
  'login.username': 'Username',
  'login.password': 'Password',
  'login.busy': 'Memproses...',
  'login.submit': 'Masuk',
  'login.failed': 'Login gagal',

  'info.title': 'Informasi',
  'info.account': 'Akun',
  'info.apiUrl': 'API URL server',
  'info.save': 'Simpan Pengaturan',
  'info.address': 'Alamat',
  'info.phone': 'Telepon',
  'info.email': 'Email',
  'info.whatsapp': 'WhatsApp',
  'info.instagram': 'Instagram',
  'info.shopeefood': 'ShopeeFood (URL)',
  'info.grabfood': 'GrabFood (URL)',
  'info.hours': 'Jam Buka',
  'info.hours.day': 'Hari (cth: Senin - Jumat)',
  'info.hours.time': 'Jam (cth: 08.00 - 22.00)',
  'info.addHour': 'Tambah Baris Jam',
  'info.loadError': 'Gagal memuat pengaturan',
  'info.saved': 'Pengaturan disimpan.',
  'info.saveError': 'Gagal menyimpan pengaturan',

  'settings.title': 'Pengaturan',
  'settings.account': 'Akun',
  'settings.lang': 'Bahasa antarmuka',
  'settings.langId': 'Indonesia',
  'settings.langEn': 'English',

  'products.title': 'Produk',
  'products.add': 'Tambah Produk',
  'products.editTitle': 'Edit Produk',
  'products.addTitle': 'Tambah Produk',
  'products.col.name': 'Nama',
  'products.col.category': 'Kategori',
  'products.col.price': 'Harga',
  'products.col.bestseller': 'Best Seller',
  'products.col.action': 'Aksi',
  'products.empty': 'Belum ada produk.',
  'products.field.category': 'Kategori',
  'products.field.price': 'Harga (IDR)',
  'products.field.image': 'Gambar',
  'products.field.descId': 'Deskripsi (Indonesia)',
  'products.field.descEn': 'Deskripsi (English)',
  'products.field.tags': 'Tags (pisahkan dengan koma)',
  'products.field.bestseller': 'Best Seller',
  'products.loadError': 'Gagal memuat produk',
  'products.nameRequired': 'Nama produk wajib diisi.',
  'products.updated': 'Produk diperbarui.',
  'products.added': 'Produk ditambahkan.',
  'products.saveError': 'Gagal menyimpan produk',
  'products.confirmDelete': 'Hapus produk "{0}"?',
  'products.deleted': 'Produk "{0}" dihapus.',
  'products.deleteError': 'Gagal menghapus produk',
  'cat.coffee': 'Kopi',
  'cat.nonCoffee': 'Non Kopi',
  'cat.pastry': 'Pastry',

  'news.title': 'Berita',
  'news.add': 'Tambah Berita',
  'news.editTitle': 'Edit Berita',
  'news.addTitle': 'Tambah Berita',
  'news.col.title': 'Judul',
  'news.col.date': 'Tanggal',
  'news.col.category': 'Kategori',
  'news.col.action': 'Aksi',
  'news.empty': 'Belum ada berita.',
  'news.field.titleId': 'Judul (Indonesia)',
  'news.field.titleEn': 'Judul (English)',
  'news.field.date': 'Tanggal',
  'news.field.catId': 'Kategori (Indonesia)',
  'news.field.catEn': 'Kategori (English)',
  'news.field.excerptId': 'Ringkasan (Indonesia)',
  'news.field.excerptEn': 'Ringkasan (English)',
  'news.field.contentId': 'Isi Lengkap (Indonesia) — satu paragraf per baris',
  'news.field.contentEn': 'Isi Lengkap (English) — satu paragraf per baris',
  'news.field.image': 'Gambar',
  'news.loadError': 'Gagal memuat berita',
  'news.titleRequired': 'Judul berita wajib diisi.',
  'news.updated': 'Berita diperbarui.',
  'news.added': 'Berita ditambahkan.',
  'news.saveError': 'Gagal menyimpan berita',
  'news.confirmDelete': 'Hapus berita "{0}"?',
  'news.deleted': 'Berita "{0}" dihapus.',
  'news.deleteError': 'Gagal menghapus berita',

  'quotes.title': 'Kata-kata Kopi',
  'quotes.add': 'Tambah Kata-kata',
  'quotes.editTitle': 'Edit Kata-kata',
  'quotes.addTitle': 'Tambah Kata-kata',
  'quotes.col.no': 'No',
  'quotes.col.id': 'Bahasa Indonesia',
  'quotes.col.en': 'English',
  'quotes.col.action': 'Aksi',
  'quotes.empty': 'Belum ada kata-kata.',
  'quotes.field.id': 'Kata-kata (Bahasa Indonesia)',
  'quotes.field.en': 'Kata-kata (English)',
  'quotes.loadError': 'Gagal memuat kata-kata',
  'quotes.contentRequired': 'Isi kata-kata dalam Bahasa Indonesia wajib ada.',
  'quotes.updated': 'Kata-kata diperbarui.',
  'quotes.added': 'Kata-kata ditambahkan.',
  'quotes.saveError': 'Gagal menyimpan kata-kata',
  'quotes.confirmDelete': 'Hapus kata-kata "{0}"?',
  'quotes.deleted': 'Kata-kata "{0}" dihapus.',
  'quotes.deleteError': 'Gagal menghapus kata-kata',

  'common.edit': 'Edit',
  'common.delete': 'Hapus',
  'common.cancel': 'Batal',
  'common.save': 'Simpan',
  'common.loading': 'Memuat...',
};

const en: Record<keyof typeof id, string> = {
  'brand.subtitle': 'Admin Panel',
  'lang.label': 'Interface language',
  'lang.id': 'Indonesia',
  'lang.en': 'English',
  'nav.loggedInAs': 'Signed in as',
  'nav.logout': 'Log out',
  'nav.menu': 'Menu',
  'tab.dashboard': 'Dashboard',
  'tab.products': 'Products',
  'tab.news': 'News',
  'tab.info': 'Information',
  'tab.settings': 'Settings',
  'tab.quotes': 'Quotes',

  'dashboard.title': 'Dashboard',
  'dashboard.products': 'Products',
  'dashboard.bestsellers': 'Best Seller Products',
  'dashboard.news': 'News',
  'dashboard.quotes': 'Quotes',
  'dashboard.hours': 'Opening Hours',
  'dashboard.category': 'Category',
  'dashboard.byCategory': 'By category',
  'dashboard.loadError': 'Failed to load statistics',
  'dashboard.total': 'Total',

  'login.apiUrl': 'API URL',
  'login.username': 'Username',
  'login.password': 'Password',
  'login.busy': 'Processing...',
  'login.submit': 'Sign in',
  'login.failed': 'Sign in failed',

  'info.title': 'Information',
  'info.account': 'Account',
  'info.apiUrl': 'API server URL',
  'info.save': 'Save Settings',
  'info.address': 'Address',
  'info.phone': 'Phone',
  'info.email': 'Email',
  'info.whatsapp': 'WhatsApp',
  'info.instagram': 'Instagram',
  'info.shopeefood': 'ShopeeFood (URL)',
  'info.grabfood': 'GrabFood (URL)',
  'info.hours': 'Opening Hours',
  'info.hours.day': 'Day (e.g. Mon - Fri)',
  'info.hours.time': 'Time (e.g. 08.00 - 22.00)',
  'info.addHour': 'Add Hour Row',
  'info.loadError': 'Failed to load settings',
  'info.saved': 'Settings saved.',
  'info.saveError': 'Failed to save settings',

  'settings.title': 'Settings',
  'settings.account': 'Account',
  'settings.lang': 'Interface language',
  'settings.langId': 'Indonesia',
  'settings.langEn': 'English',

  'products.title': 'Products',
  'products.add': 'Add Product',
  'products.editTitle': 'Edit Product',
  'products.addTitle': 'Add Product',
  'products.col.name': 'Name',
  'products.col.category': 'Category',
  'products.col.price': 'Price',
  'products.col.bestseller': 'Best Seller',
  'products.col.action': 'Actions',
  'products.empty': 'No products yet.',
  'products.field.category': 'Category',
  'products.field.price': 'Price (IDR)',
  'products.field.image': 'Image',
  'products.field.descId': 'Description (Indonesia)',
  'products.field.descEn': 'Description (English)',
  'products.field.tags': 'Tags (comma separated)',
  'products.field.bestseller': 'Best Seller',
  'products.loadError': 'Failed to load products',
  'products.nameRequired': 'Product name is required.',
  'products.updated': 'Product updated.',
  'products.added': 'Product added.',
  'products.saveError': 'Failed to save product',
  'products.confirmDelete': 'Delete product "{0}"?',
  'products.deleted': 'Product "{0}" deleted.',
  'products.deleteError': 'Failed to delete product',
  'cat.coffee': 'Coffee',
  'cat.nonCoffee': 'Non Coffee',
  'cat.pastry': 'Pastry',

  'news.title': 'News',
  'news.add': 'Add News',
  'news.editTitle': 'Edit News',
  'news.addTitle': 'Add News',
  'news.col.title': 'Title',
  'news.col.date': 'Date',
  'news.col.category': 'Category',
  'news.col.action': 'Actions',
  'news.empty': 'No news yet.',
  'news.field.titleId': 'Title (Indonesia)',
  'news.field.titleEn': 'Title (English)',
  'news.field.date': 'Date',
  'news.field.catId': 'Category (Indonesia)',
  'news.field.catEn': 'Category (English)',
  'news.field.excerptId': 'Excerpt (Indonesia)',
  'news.field.excerptEn': 'Excerpt (English)',
  'news.field.contentId': 'Full content (Indonesia) — one paragraph per line',
  'news.field.contentEn': 'Full content (English) — one paragraph per line',
  'news.field.image': 'Image',
  'news.loadError': 'Failed to load news',
  'news.titleRequired': 'News title is required.',
  'news.updated': 'News updated.',
  'news.added': 'News added.',
  'news.saveError': 'Failed to save news',
  'news.confirmDelete': 'Delete news "{0}"?',
  'news.deleted': 'News "{0}" deleted.',
  'news.deleteError': 'Failed to delete news',

  'quotes.title': 'Coffee Quotes',
  'quotes.add': 'Add Quote',
  'quotes.editTitle': 'Edit Quote',
  'quotes.addTitle': 'Add Quote',
  'quotes.col.no': 'No',
  'quotes.col.id': 'Indonesian',
  'quotes.col.en': 'English',
  'quotes.col.action': 'Actions',
  'quotes.empty': 'No quotes yet.',
  'quotes.field.id': 'Quote (Indonesian)',
  'quotes.field.en': 'Quote (English)',
  'quotes.loadError': 'Failed to load quotes',
  'quotes.contentRequired': 'Quote content in Indonesian is required.',
  'quotes.updated': 'Quote updated.',
  'quotes.added': 'Quote added.',
  'quotes.saveError': 'Failed to save quote',
  'quotes.confirmDelete': 'Delete quote "{0}"?',
  'quotes.deleted': 'Quote "{0}" deleted.',
  'quotes.deleteError': 'Failed to delete quote',

  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.loading': 'Loading...',
};

export type TranslationKey = keyof typeof id;

export function initialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'en' || saved === 'id' ? saved : 'id';
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = lang === 'en' ? en : id;
  const t = (key: TranslationKey) => dict[key];
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}