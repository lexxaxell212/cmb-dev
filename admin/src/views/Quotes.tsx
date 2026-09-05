import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Quote } from '../types';
import Modal from '../components/Modal';
import { Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';

const empty = { text: { id: '', en: '' } };

export default function Quotes({ onChanged }: { onChanged: () => void }) {
  const toast = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [form, setForm] = useState({ ...empty });

  useEffect(() => {
    api<Quote[]>('/quotes')
      .then(setQuotes)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Gagal memuat kata-kata'))
      .finally(() => setLoading(false));
  }, [toast]);

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
      toast.error('Isi kata-kata dalam Bahasa Indonesia wajib ada.');
      return;
    }
    try {
      if (modal.id) {
        await api(`/quotes/${encodeURIComponent(modal.id)}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        toast.success('Kata-kata diperbarui.');
      } else {
        await api('/quotes', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Kata-kata ditambahkan.');
      }
      setModal({ open: false, id: '' });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan kata-kata');
    }
  };

  const remove = async (q: Quote) => {
    if (!window.confirm(`Hapus kata-kata "${q.text.id}"?`)) return;
    try {
      await api(`/quotes/${encodeURIComponent(q.id)}`, { method: 'DELETE' });
      toast.success(`Kata-kata "${q.text.id}" dihapus.`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus kata-kata');
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">Kata-kata Kopi</h2>
        <Button onClick={openAdd}>
          <i className="fa-solid fa-plus text-base" aria-hidden="true" />
          Tambah Kata-kata
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-wood-mid/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wood-darkest/60 text-left text-xs uppercase tracking-wider text-wood-text/60">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Bahasa Indonesia</th>
              <th className="px-4 py-3">English</th>
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
            {!loading && quotes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-wood-text/60">
                  Belum ada kata-kata.
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
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => remove(q)}>
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
          title={modal.id ? 'Edit Kata-kata' : 'Tambah Kata-kata'}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
        >
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Kata-kata (Bahasa Indonesia)">
              <textarea
                className={inputClass}
                rows={2}
                value={form.text.id}
                onChange={(e) => setForm({ ...form, text: { ...form.text, id: e.target.value } })}
                required
              />
            </Field>
            <Field label="Kata-kata (English)">
              <textarea
                className={inputClass}
                rows={2}
                value={form.text.en}
                onChange={(e) => setForm({ ...form, text: { ...form.text, en: e.target.value } })}
              />
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