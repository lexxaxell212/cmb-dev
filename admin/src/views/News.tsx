import { useEffect, useState } from 'react';
import { api } from '../api';
import type { NewsItem } from '../types';
import Modal from '../components/Modal';
import ImageInput from '../components/ImageInput';
import { Alert, Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';

const empty = {
  title: { id: '', en: '' },
  date: new Date().toISOString().slice(0, 10),
  category: { id: '', en: '' },
  excerpt: { id: '', en: '' },
  content: { id: [] as string[], en: [] as string[] },
  image: '',
};

export default function News({ onChanged }: { onChanged: () => void }) {
  const toast = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [form, setForm] = useState({ ...empty });

  useEffect(() => {
    api<NewsItem[]>('/news')
      .then(setNews)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat berita'))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm({ ...empty, content: { id: [], en: [] } });
    setModal({ open: true, id: '' });
  };

  const openEdit = (n: NewsItem) => {
    setForm({
      title: { ...n.title },
      date: n.date,
      category: { ...n.category },
      excerpt: { ...n.excerpt },
      content: { id: [...n.content.id], en: [...n.content.en] },
      image: n.image,
    });
    setModal({ open: true, id: n.id });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.id.trim()) {
      toast.error('Judul berita wajib diisi.');
      return;
    }
    try {
      if (modal.id) {
        await api(`/news/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success('Berita diperbarui.');
      } else {
        await api('/news', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Berita ditambahkan.');
      }
      setModal({ open: false, id: '' });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan berita');
    }
  };

  const remove = async (n: NewsItem) => {
    if (!window.confirm(`Hapus berita "${n.title.id}"?`)) return;
    try {
      await api(`/news/${encodeURIComponent(n.id)}`, { method: 'DELETE' });
      toast.success(`Berita "${n.title.id}" dihapus.`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus berita');
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">Berita</h2>
        <Button onClick={openAdd}>
          <i className="fa-solid fa-plus text-base" aria-hidden="true" />
          Tambah Berita
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && news.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  Belum ada berita.
                </td>
              </tr>
            )}
            {news.map((n) => (
              <tr key={n.id} className="border-t border-wood-mid/30 hover:bg-wood-darkest/40">
                <td className="px-4 py-3 font-semibold text-wood-text">{n.title.id || n.title.en}</td>
                <td className="px-4 py-3 text-wood-text/70">{n.date}</td>
                <td className="px-4 py-3">
                  <span className="rounded border border-wood-mid/40 px-2 py-0.5 text-xs text-wood-text/70">
                    {n.category.id || n.category.en}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => openEdit(n)}>
                      <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => remove(n)}>
                      <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <Modal
          title={modal.id ? 'Edit Berita' : 'Tambah Berita'}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Judul (Indonesia)">
              <input
                className={inputClass}
                value={form.title.id}
                onChange={(e) => setForm({ ...form, title: { ...form.title, id: e.target.value } })}
                required
              />
            </Field>
            <Field label="Judul (English)">
              <input
                className={inputClass}
                value={form.title.en}
                onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
                required
              />
            </Field>
            <Field label="Tanggal">
              <input
                className={inputClass}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kategori (Indonesia)">
                <input
                  className={inputClass}
                  value={form.category.id}
                  onChange={(e) => setForm({ ...form, category: { ...form.category, id: e.target.value } })}
                />
              </Field>
              <Field label="Kategori (English)">
                <input
                  className={inputClass}
                  value={form.category.en}
                  onChange={(e) => setForm({ ...form, category: { ...form.category, en: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Ringkasan (Indonesia)">
              <textarea
                className={inputClass}
                rows={2}
                value={form.excerpt.id}
                onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, id: e.target.value } })}
              />
            </Field>
            <Field label="Ringkasan (English)">
              <textarea
                className={inputClass}
                rows={2}
                value={form.excerpt.en}
                onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, en: e.target.value } })}
              />
            </Field>
            <Field label="Isi Lengkap (Indonesia) — satu paragraf per baris">
              <textarea
                className={inputClass}
                rows={5}
                value={form.content.id.join('\n')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: { ...form.content, id: e.target.value.split('\n') },
                  })
                }
              />
            </Field>
            <Field label="Isi Lengkap (English) — satu paragraf per baris">
              <textarea
                className={inputClass}
                rows={5}
                value={form.content.en.join('\n')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: { ...form.content, en: e.target.value.split('\n') },
                  })
                }
              />
            </Field>
            <Field label="Gambar">
              <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModal((m) => ({ ...m, open: false }))}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}