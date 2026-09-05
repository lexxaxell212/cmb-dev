import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Category, Product } from '../types';
import Modal from '../components/Modal';
import ImageInput from '../components/ImageInput';
import { Alert, Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';
import { useI18n } from '../i18n';

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
  const toast = useToast();
  const { t } = useI18n();
  const CATEGORY_LABELS: Record<Category, string> = {
    coffee: t('cat.coffee'),
    'non-coffee': t('cat.nonCoffee'),
    pastry: t('cat.pastry'),
  };
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
      .catch((err) => setError(err instanceof Error ? err.message : t('products.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

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
    if (!form.name.trim()) {
      toast.error(t('products.nameRequired'));
      return;
    }
    try {
      if (modal.id) {
        await api(`/products/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success(t('products.updated'));
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(form) });
        toast.success(t('products.added'));
      }
      setModal({ open: false, id: '', edit: null });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('products.saveError'));
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(t('products.confirmDelete').replace('{0}', p.name))) return;
    try {
      await api(`/products/${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      toast.success(t('products.deleted').replace('{0}', p.name));
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('products.deleteError'));
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">{t('products.title')}</h2>
        <Button onClick={openAdd}>
          <i className="fa-solid fa-plus text-base" aria-hidden="true" />
          {t('products.add')}
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">{t('products.col.name')}</th>
              <th className="px-4 py-3">{t('products.col.category')}</th>
              <th className="px-4 py-3">{t('products.col.price')}</th>
              <th className="px-4 py-3">{t('products.col.bestseller')}</th>
              <th className="px-4 py-3 text-right">{t('products.col.action')}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-wood-text/60">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-wood-text/60">
                  {t('products.empty')}
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
                      <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" onClick={() => remove(p)}>
                      <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
                      {t('common.delete')}
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
          title={modal.id ? t('products.editTitle') : t('products.addTitle')}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label={t('products.col.name')}>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label={t('products.field.category')}>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              >
                <option value="coffee">{t('cat.coffee')}</option>
                <option value="non-coffee">{t('cat.nonCoffee')}</option>
                <option value="pastry">{t('cat.pastry')}</option>
              </select>
            </Field>
            <Field label={t('products.field.price')}>
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
            <Field label={t('products.field.image')}>
              <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            </Field>
            <Field label={t('products.field.descId')}>
              <textarea
                className={inputClass}
                rows={3}
                value={form.description.id}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, id: e.target.value } })
                }
              />
            </Field>
            <Field label={t('products.field.descEn')}>
              <textarea
                className={inputClass}
                rows={3}
                value={form.description.en}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, en: e.target.value } })
                }
              />
            </Field>
            <Field label={t('products.field.tags')}>
              <input
                className={inputClass}
                value={form.tags.join(', ')}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })
                }
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
              />
              {t('products.field.bestseller')}
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModal((m) => ({ ...m, open: false }))}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}