import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../api';
import type { Category, Product } from '../types';
import Modal from '../components/Modal';
import { Alert, Button, Field, inputClass } from '../components/ui';

const CATEGORY_LABELS: Record<Category, string> = {
  coffee: 'Kopi',
  'non-coffee': 'Non Kopi',
  pastry: 'Pastry',
};

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  category: 'coffee',
  price: 0,
  currency: 'IDR',
  image: '',
  description: { id: '', en: '' },
  tags: [],
  isBestSeller: false,
};

export default function Products({ onChanged }: { onChanged: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ open: boolean; id: string; edit: Product | null }>({
    open: false,
    id: '',
    edit: null,
  });
  const [form, setForm] = useState({ ...emptyProduct });

  useEffect(() => {
    api<Product[]>('/products')
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat produk'))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm({ ...emptyProduct });
    setModal({ open: true, id: '', edit: null });
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      currency: 'IDR',
      image: p.image,
      description: { ...p.description },
      tags: [...p.tags],
      isBestSeller: p.isBestSeller,
    });
    setModal({ open: true, id: p.id, edit: p });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError('');
    try {
      if (modal.id) {
        await api(`/products/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(form) });
      }
      setModal({ open: false, id: '', edit: null });
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan produk');
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Hapus produk "${p.name}"?`)) return;
    setError('');
    try {
      await api(`/products/${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">Produk</h2>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Best Seller</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-wood-text/60">
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-wood-text/60">
                  Belum ada produk.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-wood-mid/30 hover:bg-wood-darkest/40">
                <td className="px-4 py-3 font-semibold text-wood-text">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded border border-wood-mid/40 px-2 py-0.5 text-xs text-wood-text/70">
                    {CATEGORY_LABELS[p.category] || p.category}
                  </span>
                </td>
                <td className="px-4 py-3">Rp {p.price.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3">
                  {p.isBestSeller && (
                    <span className="rounded bg-accent px-2 py-0.5 text-[11px] font-bold uppercase text-wood-darkest">
                      Best Seller
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => openEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => remove(p)}>
                      <Trash2 className="w-3.5 h-3.5" />
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
          title={modal.id ? 'Edit Produk' : 'Tambah Produk'}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Nama">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Kategori">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              >
                <option value="coffee">Kopi</option>
                <option value="non-coffee">Non Kopi</option>
                <option value="pastry">Pastry</option>
              </select>
            </Field>
            <Field label="Harga (IDR)">
              <input
                className={inputClass}
                type="number"
                min={0}
                step={500}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
                required
              />
            </Field>
            <Field label="URL Gambar (opsional)">
              <input
                className={inputClass}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Field>
            <Field label="Deskripsi (Indonesia)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description.id}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, id: e.target.value } })
                }
              />
            </Field>
            <Field label="Deskripsi (English)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description.en}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, en: e.target.value } })
                }
              />
            </Field>
            <Field label="Tags (pisahkan dengan koma)">
              <input
                className={inputClass}
                value={form.tags.join(', ')}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
                }
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
              />
              Best Seller
            </label>
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