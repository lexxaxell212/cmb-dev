import { useEffect, useState } from 'react';
import { api } from '../api';
import type { NewsItem } from '../types';
import Modal from '../components/Modal';
import ImageInput from '../components/ImageInput';
import ConfirmDialog from '../components/ConfirmDialog';
import { Alert, Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';
import { useI18n } from '../i18n';

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
  const { t } = useI18n();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [form, setForm] = useState({ ...empty });
  const [confirmTarget, setConfirmTarget] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api<NewsItem[]>('/news')
      .then(setNews)
      .catch((err) => setError(err instanceof Error ? err.message : t('news.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

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
      toast.error(t('news.titleRequired'));
      return;
    }
    try {
      if (modal.id) {
        await api(`/news/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success(t('news.updated'));
      } else {
        await api('/news', { method: 'POST', body: JSON.stringify(form) });
        toast.success(t('news.added'));
      }
      setModal({ open: false, id: '' });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('news.saveError'));
    }
  };

  const remove = (n: NewsItem) => setConfirmTarget(n);

  const confirmRemove = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await api(`/news/${encodeURIComponent(confirmTarget.id)}`, { method: 'DELETE' });
      const label = confirmTarget.title.id || confirmTarget.title.en;
      toast.success(t('news.deleted').replace('{0}', label));
      setConfirmTarget(null);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('news.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">{t('news.title')}</h2>
        <Button onClick={openAdd}>
          <i className="fa-solid fa-plus text-base" aria-hidden="true" />
          {t('news.add')}
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">{t('news.col.title')}</th>
              <th className="px-4 py-3">{t('news.col.date')}</th>
              <th className="px-4 py-3">{t('news.col.category')}</th>
              <th className="px-4 py-3 text-right">{t('news.col.action')}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!loading && news.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  {t('news.empty')}
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
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" onClick={() => remove(n)}>
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
          title={modal.id ? t('news.editTitle') : t('news.addTitle')}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label={t('news.field.titleId')}>
              <input
                className={inputClass}
                value={form.title.id}
                onChange={(e) => setForm({ ...form, title: { ...form.title, id: e.target.value } })}
                required
              />
            </Field>
            <Field label={t('news.field.titleEn')}>
              <input
                className={inputClass}
                value={form.title.en}
                onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
                required
              />
            </Field>
            <Field label={t('news.field.date')}>
              <input
                className={inputClass}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('news.field.catId')}>
                <input
                  className={inputClass}
                  value={form.category.id}
                  onChange={(e) => setForm({ ...form, category: { ...form.category, id: e.target.value } })}
                />
              </Field>
              <Field label={t('news.field.catEn')}>
                <input
                  className={inputClass}
                  value={form.category.en}
                  onChange={(e) => setForm({ ...form, category: { ...form.category, en: e.target.value } })}
                />
              </Field>
            </div>
            <Field label={t('news.field.excerptId')}>
              <textarea
                className={inputClass}
                rows={2}
                value={form.excerpt.id}
                onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, id: e.target.value } })}
              />
            </Field>
            <Field label={t('news.field.excerptEn')}>
              <textarea
                className={inputClass}
                rows={2}
                value={form.excerpt.en}
                onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, en: e.target.value } })}
              />
            </Field>
            <Field label={t('news.field.contentId')}>
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
            <Field label={t('news.field.contentEn')}>
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
            <Field label={t('news.field.image')}>
              <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModal((m) => ({ ...m, open: false }))}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        busy={deleting}
        title={t('news.title')}
        message={t('news.confirmDelete').replace(
          '{0}',
          confirmTarget?.title.id || confirmTarget?.title.en || ''
        )}
        onConfirm={confirmRemove}
        onCancel={() => setConfirmTarget(null)}
      />
    </section>
  );
}