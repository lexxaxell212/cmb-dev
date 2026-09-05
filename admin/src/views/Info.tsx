import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Hour, Settings as SettingsType } from '../types';
import { Alert, Button, Field, inputClass } from '../components/ui';
import { useToast } from '../Toast';
import { useI18n } from '../i18n';

const empty: SettingsType = {
  address: '',
  phone: '',
  email: '',
  whatsapp: '',
  instagram: '',
  shopeefood: '',
  grabfood: '',
  hours: [],
};

export default function Info() {
  const toast = useToast();
  const { t } = useI18n();
  const [form, setForm] = useState<SettingsType>({ ...empty });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<SettingsType>('/settings')
      .then((s) => setForm({ ...empty, ...s, hours: s.hours.map((h) => ({ ...h })) }))
      .catch((err) => setError(err instanceof Error ? err.message : t('info.loadError')))
      .finally(() => setLoaded(true));
  }, [t]);

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
    try {
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          hours: form.hours.filter((h) => h.day.trim() && h.time.trim()),
        }),
      });
      toast.success(t('info.saved'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('info.saveError'));
    }
  };

  if (!loaded) return <p className="text-wood-text/60">{t('common.loading')}</p>;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-wood-text">{t('info.title')}</h2>
        <Button onClick={save}>
          <i className="fa-solid fa-floppy-disk text-base" aria-hidden="true" />
          {t('info.save')}
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex flex-col gap-4 rounded-lg border border-wood-mid/40 bg-wood-dark/60 p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label={t('info.address')}>
            <input className={inputClass} value={form.address} onChange={(e) => setField('address')(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('info.phone')}>
              <input className={inputClass} value={form.phone} onChange={(e) => setField('phone')(e.target.value)} />
            </Field>
            <Field label={t('info.email')}>
              <input className={inputClass} value={form.email} onChange={(e) => setField('email')(e.target.value)} />
            </Field>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t('info.whatsapp')}>
            <input className={inputClass} value={form.whatsapp} onChange={(e) => setField('whatsapp')(e.target.value)} />
          </Field>
          <Field label={t('info.instagram')}>
            <input className={inputClass} value={form.instagram} onChange={(e) => setField('instagram')(e.target.value)} />
          </Field>
          <Field label={t('info.shopeefood')}>
            <input className={inputClass} value={form.shopeefood} onChange={(e) => setField('shopeefood')(e.target.value)} placeholder="https://shopee.co.id/..." />
          </Field>
          <Field label={t('info.grabfood')}>
            <input className={inputClass} value={form.grabfood} onChange={(e) => setField('grabfood')(e.target.value)} placeholder="https://food.grab.com/id/..." />
          </Field>
        </div>

        <h3 className="mt-2 border-b border-wood-mid/40 pb-2 text-sm font-bold uppercase tracking-wider text-wood-text/70">
          {t('info.hours')}
        </h3>
        <div className="flex flex-col gap-3">
          {form.hours.map((h, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
              <input
                className={inputClass}
                placeholder={t('info.hours.day')}
                value={h.day}
                onChange={(e) => setHour(i, 'day')(e.target.value)}
              />
              <input
                className={inputClass}
                placeholder={t('info.hours.time')}
                value={h.time}
                onChange={(e) => setHour(i, 'time')(e.target.value)}
              />
              <Button variant="danger" onClick={() => removeHour(i)}>
                <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Button variant="ghost" onClick={addHour}>
            <i className="fa-solid fa-plus text-base" aria-hidden="true" />
            {t('info.addHour')}
          </Button>
        </div>
      </div>
    </section>
  );
}