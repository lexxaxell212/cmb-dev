import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Quote } from '../types';
import Modal from '../components/Modal';
import { Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';
import { useI18n } from '../i18n';

const empty = { text: { id: '', en: '' } };

export default function Quotes({ onChanged }: { onChanged: () => void }) {
  const toast = useToast();
  const { t } = useI18n();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [form, setForm] = useState({ ...empty });

  useEffect(() => {
    api<Quote[]>('/quotes')
      .then(setQuotes)
      .catch((err) => toast.error(err instanceof Error ? err.message : t('quotes.loadError')))
      .finally(() => setLoading(false));
  }, [toast, t]);

  const openAdd = () => {
    setForm({ text: { id: '', en: '' } });
    setModal({ open: true, id: '' });
  };

  const openEdit = (q: Quote) => {
    setForm({ text: { ...q.text } });
    setModal({ open: true, id: q.id });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.id.trim()) {
      toast.error(t('quotes.contentRequired'));
      return;
    }
    try {
      if (modal.id) {
        await api(`/quotes/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success(t('quotes.updated'));
      } else {
        await api('/quotes', { method: 'POST', body: JSON.stringify(form) });
        toast.success(t('quotes.added'));
      }
      setModal({ open: false, id: '' });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('quotes.saveError'));
    }
  };

  const remove = async (q: Quote) => {
    if (!window.confirm(t('quotes.confirmDelete').replace('{0}', q.text.id))) return;
    try {
      await api(`/quotes/${encodeURIComponent(q.id)}`, { method: 'DELETE' });
      toast.success(t('quotes.deleted').replace('{0}', q.text.id));
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('quotes.deleteError'));
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">{t('quotes.title')}</h2>
        <Button onClick={openAdd}>
          <i className="fa-solid fa-plus text-base" aria-hidden="true" />
          {t('quotes.add')}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">{t('quotes.col.no')}</th>
              <th className="px-4 py-3">{t('quotes.col.id')}</th>
              <th className="px-4 py-3">{t('quotes.col.en')}</th>
              <th className="px-4 py-3 text-right">{t('quotes.col.action')}</th>
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
            {!loading && quotes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  {t('quotes.empty')}
                </td>
              </tr>
            )}
            {quotes.map((q, i) => (
              <tr key={q.id} className="border-t border-wood-mid/30 hover:bg-wood-darkest/40">
                <td className="px-4 py-3 text-wood-text/60">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-wood-text">{q.text.id}</td>
                <td className="px-4 py-3 text-wood-text/70">{q.text.en}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => openEdit(q)}>
                      <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" onClick={() => remove(q)}>
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
          title={modal.id ? t('quotes.editTitle') : t('quotes.addTitle')}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label={t('quotes.field.id')}>
              <textarea
                className={inputClass}
                rows={2}
                value={form.text.id}
                onChange={(e) => setForm({ ...form, text: { ...form.text, id: e.target.value } })}
                required
              />
            </Field>
            <Field label={t('quotes.field.en')}>
              <textarea
                className={inputClass}
                rows={2}
                value={form.text.en}
                onChange={(e) => setForm({ ...form, text: { ...form.text, en: e.target.value } })}
              />
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
    </section>
  );
}