export type Category = 'coffee' | 'non-coffee' | 'pastry';

export interface Localized {
  id: string;
  en: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  currency: string;
  image: string;
  description: Localized;
  tags: string[];
  isBestSeller: boolean;
}

export interface NewsItem {
  id: string;
  title: Localized;
  date: string;
  category: Localized;
  excerpt: Localized;
  content: { id: string[]; en: string[] };
  image: string;
}

export interface Hour {
  day: string;
  time: string;
}

export interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  shopeefood: string;
  grabfood: string;
  hours: Hour[];
}