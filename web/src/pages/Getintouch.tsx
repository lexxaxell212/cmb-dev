import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import Card from '../components/reusable/Card';
import Button from '../components/reusable/Button';
import { useSettings } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export default function Getintouch() {
  const { t } = useLanguage();
  const contact = useSettings().data ?? {
    address: '',
    phone: '',
    email: '',
    instagram: '',
    whatsapp: '',
    hours: [],
  };
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const infoItems = [
    {
      icon: MapPin,
      labelKey: 'contact.label.address' as const,
      value: contact.address,
    },
    {
      icon: Phone,
      labelKey: 'contact.label.phone' as const,
      value: contact.phone,
    },
    {
      icon: Mail,
      labelKey: 'contact.label.email' as const,
      value: contact.email,
    },
    {
      icon: Camera,
      labelKey: 'contact.label.instagram' as const,
      value: contact.instagram,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-14 md:gap-20 animate-fade-in">
      <header className="w-full max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl display-h1 text-wood-text">
          {t('contact.title')}
        </h1>
        <p className="mt-3 text-wood-text/75 max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </header>

      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Info */}
        <div className="space-y-4">
          {infoItems.map(({ icon: Icon, labelKey, value }) => (
            <Card key={labelKey} hoverable className="flex items-center gap-4 animate-slide-up">
              <div className="w-12 h-12 rounded-md bg-wood-dark/60 border border-wood-mid/40 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-wood-text" strokeWidth={2.25} />
              </div>
              <div>
                <p className="text-xs font-label font-bold uppercase tracking-widest text-wood-text/50">
                  {t(labelKey)}
                </p>
                <p className="text-wood-text">{value}</p>
              </div>
            </Card>
          ))}

          <Card className="animate-slide-up delay-100">
            <h3 className="flex items-center gap-2 display-h3 text-wood-text mb-3">
              <Clock className="w-5 h-5" />
              {t('contact.hours')}
            </h3>
            <ul className="space-y-2 text-sm text-wood-text/80">
              {contact.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </Card>

          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-700/70 hover:bg-amber-700 text-wood-text font-label font-bold px-5 py-3 transition-all duration-200 hover:scale-[1.05] active:scale-95 border border-wood-darkest/40"
          >
            <MessageCircle className="w-5 h-5" />
            {t('contact.whatsapp')}
          </a>
        </div>

        {/* Form */}
        <Card className="animate-slide-up">
          <h2 className="text-xl md:text-2xl display-h2 text-wood-text mb-5">
            {t('contact.formTitle')}
          </h2>

          {sent && (
            <div className="mb-5 flex items-center gap-2 rounded-md bg-wood-dark/50 border border-amber-600/40 px-4 py-3 text-sm text-wood-text animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              {t('contact.form.success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-label font-bold text-wood-text/85 mb-1.5">
                {t('contact.form.name')}
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('contact.form.placeholder.name')}
                className="w-full rounded-md bg-wood-darkest/50 border border-wood-mid/30 px-4 py-3 text-sm text-wood-text placeholder:text-wood-text/40 focus:outline-none focus:border-wood-text/70 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-label font-bold text-wood-text/85 mb-1.5">
                {t('contact.form.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t('contact.form.placeholder.email')}
                className="w-full rounded-md bg-wood-darkest/50 border border-wood-mid/30 px-4 py-3 text-sm text-wood-text placeholder:text-wood-text/40 focus:outline-none focus:border-wood-text/70 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-label font-bold text-wood-text/85 mb-1.5">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('contact.form.placeholder.message')}
                className="w-full rounded-md bg-wood-darkest/50 border border-wood-mid/30 px-4 py-3 text-sm text-wood-text placeholder:text-wood-text/40 focus:outline-none focus:border-wood-text/70 transition-colors resize-none"
              />
            </div>

            <Button type="submit" fullWidth>
              <Send className="w-4 h-4" />
              {t('contact.form.submit')}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}