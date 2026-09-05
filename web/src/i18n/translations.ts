const id = {
  'nav.home': 'Home',
  'nav.menu': 'Menu',
  'nav.news': 'News',
  'nav.contact': 'Contact',

  'common.bestSeller': 'Best Seller',
  'common.imageComingSoon': 'Gambar segera hadir',
  'common.slide': 'Slide',
  'common.viewMenu': 'Lihat Menu',
  'common.contactUs': 'Hubungi Kami',
  'common.viewAllMenu': 'Lihat Semua Menu',
  'common.viewAll': 'Lihat semua',
  'common.expand': 'Baca lengkapnya',
  'common.collapse': 'Tutup',
  'common.language': 'Bahasa',
  'common.apiError': 'Gagal memuat data',

  'hero.badge': 'Kedai Kopi Spesial',
  'hero.title1': 'Tempat Bersantai',
  'hero.title2': 'dengan Secangkir Kopi',
  'hero.subtitle':
    'Nikmati kopi single origin pilihan, pastry fresh dari oven, dan suasana hangat ala rumah yang bikin betah berlama-lama.',

  'features.single.title': 'Biji Single Origin',
  'features.single.desc': 'Dipanggang lokal, rasa autentik setiap cup.',
  'features.open.title': 'Buka Setiap Hari',
  'features.open.desc': '09.00 - 23.00, tempatmu bersantai kapan pun.',
  'features.cozy.title': 'Cozy di Pusat Kota',
  'features.cozy.desc': 'Lokasi strategis dengan suasana hangat.',

  'product.subtitle':
    'Sajian dengan bahan pilihan, diseduh dengan penuh perhatian.',
  'product.category.all': 'Semua',
  'product.category.coffee': 'Kopi',
  'product.category.nonCoffee': 'Non Kopi',
  'product.category.pastry': 'Pastry',
  'product.header.coffee': 'Pilihan Kopi Kami',
  'product.header.nonCoffee': 'Non Coffee Favorites',
  'product.header.pastry': 'Fresh Pastry & Dessert',
  'product.header.all': 'Menu Andalan Kami',

  'menu.title': 'Menu Kami',
  'menu.subtitle':
    'Dari espresso hingga pastry hangat, semua disiapkan fresh setiap hari. Pilih kategori untuk mempermudah pencarian.',
  'menu.spinTitle': 'Kopi apa hari ini?',
  'menu.spinLabel': '★ Roda Takdir ★',
  'menu.spinSubtitle':
    'Bingung milih kopi? Putar roda takdir, biar kecepatan putaran yang menentukan pilihanmu hari ini.',
  'menu.spinButton': 'Putar Roda',
  'menu.spinAgain': 'Putar Lagi',
  'menu.spinSpinning': 'Memutar…',
  'menu.spinResult': 'Pilihan kamu hari ini',

  'news.title': 'Kabar Coffee Manual Brew',
  'news.subtitle':
    'Update terbaru, produk baru, hingga event seru dari kami.',

  'home.newsTitle': 'Kabar Terbaru',
  'home.ctaTitle': 'Yang Penting Ngopi Dulu!',
  'home.ctaSubtitle':
    'Pesan menu favoritmu atau sekadar mampir mencoba single origin terbaru kami. Sampai jumpa di Coffee Manual Brew!',

  'footer.tagline':
    'Specialty coffee & fresh pastry di Yogyakarta. Diseduh dengan hati, dinikmati dengan santai.',
  'footer.nav': 'Navigasi',
  'footer.info': 'Informasi',
  'footer.hours': 'Jam Buka',
  'footer.rights': '© {year} Coffee Manual Brew. Semua hak dilindungi.',

  'contact.title': 'Get in Touch',
  'contact.subtitle':
    'Ada pertanyaan, kritik, atau mau booking meja? Kami siap bantu.',
  'contact.label.address': 'Alamat',
  'contact.label.phone': 'Telepon',
  'contact.label.email': 'Email',
  'contact.label.instagram': 'Instagram',
  'contact.hours': 'Jam Buka',
  'contact.whatsapp': 'Chat WhatsApp',
  'contact.orderShopeeFood': 'Pesan via ShopeeFood',
  'contact.orderGrabFood': 'Pesan via GrabFood',
  'contact.formTitle': 'Kirim Pesan',
  'contact.form.name': 'Nama',
  'contact.form.email': 'Email',
  'contact.form.message': 'Pesan',
  'contact.form.placeholder.name': 'Nama kamu',
  'contact.form.placeholder.email': 'email@contoh.com',
  'contact.form.placeholder.message': 'Tulis pesanmu di sini...',
  'contact.form.success':
    'Pesan terkirim! Kami akan membalas secepatnya.',
  'contact.form.submit': 'Kirim Pesan',
} as const;

export type TranslationKey = keyof typeof id;

const en: Record<TranslationKey, string> = {
  'nav.home': 'Home',
  'nav.menu': 'Menu',
  'nav.news': 'News',
  'nav.contact': 'Contact',

  'common.bestSeller': 'Best Seller',
  'common.imageComingSoon': 'Image coming soon',
  'common.slide': 'Slide',
  'common.viewMenu': 'View Menu',
  'common.contactUs': 'Contact Us',
  'common.viewAllMenu': 'View All Menu',
  'common.viewAll': 'View all',
  'common.expand': 'Read more',
  'common.collapse': 'Close',
  'common.language': 'Language',
  'common.apiError': 'Failed to load data',

  'hero.badge': 'Specialty Coffee Shop',
  'hero.title1': 'Unwind and Relax',
  'hero.title2': 'with a Cup of Coffee',
  'hero.subtitle':
    'Enjoy our handpicked single origin coffee, fresh from the oven pastries, and a warm homey atmosphere to linger in.',

  'features.single.title': 'Single Origin Beans',
  'features.single.desc': 'Locally roasted, authentic flavor in every cup.',
  'features.open.title': 'Open Every Day',
  'features.open.desc': '09.00 - 23.00, your cozy spot anytime.',
  'features.cozy.title': 'Cozy in the City Center',
  'features.cozy.desc': 'Strategic location with a warm atmosphere.',

  'product.subtitle': 'Made with selected ingredients, brewed with care.',
  'product.category.all': 'All',
  'product.category.coffee': 'Coffee',
  'product.category.nonCoffee': 'Non Coffee',
  'product.category.pastry': 'Pastry',
  'product.header.coffee': 'Our Coffee Selection',
  'product.header.nonCoffee': 'Non Coffee Favorites',
  'product.header.pastry': 'Fresh Pastry & Dessert',
  'product.header.all': 'Our Signature Menu',

  'menu.title': 'Our Menu',
  'menu.subtitle':
    'From espresso to warm pastries, everything is made fresh daily. Pick a category to browse easily.',
  'menu.spinTitle': "What's your coffee today?",
  'menu.spinLabel': '★ Wheel of Fate ★',
  'menu.spinSubtitle':
    'Can\'t decide? Spin the wheel of fate — the spinning speed decides which coffee picks you today.',
  'menu.spinButton': 'Spin the Wheel',
  'menu.spinAgain': 'Spin Again',
  'menu.spinSpinning': 'Spinning…',
  'menu.spinResult': 'Your pick today',

  'news.title': 'Coffee Manual Brew News',
  'news.subtitle':
    'Latest updates, new products, and fun events from us.',

  'home.newsTitle': 'Latest News',
  'home.ctaTitle': 'Coffee First, Everything Else Later!',
  'home.ctaSubtitle':
    'Order your favorite or drop by to try our newest single origin. See you at Coffee Manual Brew!',

  'footer.tagline':
    'Specialty coffee & fresh pastry in Yogyakarta. Brewed with heart, enjoyed at leisure.',
  'footer.nav': 'Navigation',
  'footer.info': 'Information',
  'footer.hours': 'Opening Hours',
  'footer.rights': '© {year} Coffee Manual Brew. All rights reserved.',

  'contact.title': 'Get in Touch',
  'contact.subtitle':
    'Questions, feedback, or want to book a table? We are happy to help.',
  'contact.label.address': 'Address',
  'contact.label.phone': 'Phone',
  'contact.label.email': 'Email',
  'contact.label.instagram': 'Instagram',
  'contact.hours': 'Opening Hours',
  'contact.whatsapp': 'Chat on WhatsApp',
  'contact.orderShopeeFood': 'Order via ShopeeFood',
  'contact.orderGrabFood': 'Order via GrabFood',
  'contact.formTitle': 'Send a Message',
  'contact.form.name': 'Name',
  'contact.form.email': 'Email',
  'contact.form.message': 'Message',
  'contact.form.placeholder.name': 'Your name',
  'contact.form.placeholder.email': 'email@example.com',
  'contact.form.placeholder.message': 'Write your message here...',
  'contact.form.success': 'Message sent! We will get back to you soon.',
  'contact.form.submit': 'Send Message',
};

export const translations = {
  id,
  en,
} as Record<'id' | 'en', Record<TranslationKey, string>>;

export type Language = 'id' | 'en';

export const LANG_STORAGE_KEY = 'egicoffee-lang';