import { Coffee, Clock, Phone, Mail, MapPin, Camera, Languages } from 'lucide-react';
import { useSettings } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';

const languages: { code: Language; label: string }[] = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
];

export default function Footer() {
  const { t, lang, setLang } = useLanguage();
  const contact = useSettings().data ?? { address: '', phone: '', email: '', instagram: '', hours: [] };

  return (
    <footer className="w-full pt-14 md:pt-28 pb-20 md:pb-0 bg-wood-darkest border-t border-wood-mid/20 animate-fade-in">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-wood-text font-display font-bold text-2xl">
              <Coffee className="w-7 h-7 text-wood-text" />
              Egi-Coffee
            </div>
            <p className="mt-3 text-sm text-wood-text/70 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-sm text-wood-text/80 hover:text-wood-text transition-colors"
            >
              <Camera className="w-4 h-4" />
              {contact.instagram}
            </a>
          </div>

          {/* Language toggle */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-label font-bold uppercase tracking-widest text-wood-text mb-4">
              <Languages className="w-4 h-4" />
              {t('common.language')}
            </h4>
            <div className="flex w-fit rounded-md bg-wood-darkest/60 border border-wood-mid/40 p-0.5">
              {languages.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={[
                    'px-4 py-1.5 rounded-xs text-sm font-label font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer',
                    lang === code
                      ? 'bg-wood-text text-wood-darkest shadow'
                      : 'text-wood-text/70 hover:text-wood-text',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-label font-bold uppercase tracking-widest text-wood-text mb-4">
              {t('footer.info')}
            </h4>
            <ul className="space-y-3 text-sm text-wood-text/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" />
                {contact.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" />
                {contact.email}
              </li>
            </ul>
          </div>

          {/* Jam buka */}
          <div>
            <h4 className="text-sm font-label font-bold uppercase tracking-widest text-wood-text mb-4">
              {t('footer.hours')}
            </h4>
            <ul className="space-y-3 text-sm text-wood-text/70">
              {contact.hours.map((h) => (
                <li key={h.day} className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    <span className="block text-wood-text/90">{h.day}</span>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-wood-mid/20">
          <p className="max-w-6xl mx-auto px-5 py-5 text-center text-xs text-wood-text/50">
            {t('footer.rights', { year: String(new Date().getFullYear()) })}
          </p>
        </div>
    </footer>
  );
}