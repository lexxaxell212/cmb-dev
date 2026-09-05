import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { api } from '../api';
import type { Hour, Settings as SettingsType } from '../types';
import { Alert, Button, Field, inputClass } from '../components/ui';

const empty: SettingsType = {
  address: '',
  phone: '',
  email: '',
  whatsapp: '',
  instagram: '',
  hours: [],
};

export default function Settings() {
  const [form, setForm] = useState<SettingsType>({ ...empty });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api<SettingsType>('/settings')
      .then((s) => setForm({ ...empty, ...s, hours: s.hours.map((h) => ({ ...h })) }))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat pengaturan'))
      .finally(() => setLoaded(true));
  }, []);

  const setField = (key: keyof Omit<SettingsType, 'hours'>) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setHour = (index: number, key: keyof Hour) => (value: string) =>
    setForm((f) => ({
      ...f,
      hours: f.hours.map((h, i) => (i === index ? { ...h, [key]: value } : h)),
    }));

  const addHour = () => setForm((f) => ({ ...f, hours: [...f.hours, { day: '', time: '' }] }));

  const removeHour = (index: number) =>
    setForm((f) => ({ ...f, hours: f.hours.filter((_, i) => i !== index) }));

  const save = async () => {
    setError('');
    setMessage('');
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          hours: form.hours.filter((h) => h.day.trim() && h.time.trim()),
        }),
      });
      setMessage('Pengaturan disimpan.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan');
    }
  };

  if (!loaded) return <p className="text-wood-text/60">Memuat...</p>;

  return (
    <section className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">Pengaturan Kontak & Jam Buka</h2>
        <Button onClick={save}>
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="ok">{message}</Alert>}

      <div className="flex flex-col gap-4 rounded-lg border border-wood-mid/40 bg-wood-dark/60 p-5">
        <Field label="Alamat">
          <input className={inputClass} value={form.address} onChange={(e) => setField('address')(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telepon">
            <input className={inputClass} value={form.phone} onChange={(e) => setField('phone')(e.target.value)} />
          </Field>
          <Field label="Email">
            <input className={inputClass} value={form.email} onChange={(e) => setField('email')(e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} value={form.whatsapp} onChange={(e) => setField('whatsapp')(e.target.value)} />
          </Field>
          <Field label="Instagram">
            <input className={inputClass} value={form.instagram} onChange={(e) => setField('instagram')(e.target.value)} />
          </Field>
        </div>

        <h3 className="mt-2 border-b border-wood-mid/40 pb-2 text-sm font-bold uppercase tracking-wider text-wood-text/70">
          Jam Buka
        </h3>
        <div className="flex flex-col gap-3">
          {form.hours.map((h, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
              <input
                className={inputClass}
                placeholder="Hari (cth: Senin - Jumat)"
                value={h.day}
                onChange={(e) => setHour(i, 'day')(e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Jam (cth: 08.00 - 22.00)"
                value={h.time}
                onChange={(e) => setHour(i, 'time')(e.target.value)}
              />
              <Button variant="danger" onClick={() => removeHour(i)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Button variant="ghost" onClick={addHour}>
            <Plus className="w-4 h-4" />
            Tambah Baris Jam
          </Button>
        </div>
      </div>
    </section>
  );
}