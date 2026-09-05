import { useCallback, useEffect, useState } from 'react';
import type { ProductItem } from '../components/Product';

export interface NewsItem {
  id: string;
  title: { id: string; en: string };
  date: string;
  category: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string[]; en: string[] };
  image: string;
}

export interface ContactHour {
  day: string;
  time: string;
}

export interface ContactSettings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  hours: ContactHour[];
}

const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || '/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  return res.json();
}

export const fetchProducts = (): Promise<ProductItem[]> => request<ProductItem[]>('/products');
export const fetchNews = (): Promise<NewsItem[]> => request<NewsItem[]>('/news');
export const fetchSettings = (): Promise<ContactSettings> => request<ContactSettings>('/settings');

export interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => void;
}

export function useResource<T>(fetcher: () => Promise<T>): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat data dari server');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, tick]);

  const reload = useCallback(() => {
    setError('');
    setLoading(true);
    setTick((n) => n + 1);
  }, []);

  return { data, loading, error, reload };
}

export const useProducts = () => useResource(fetchProducts);
export const useNews = () => useResource(fetchNews);
export const useSettings = () => useResource(fetchSettings);