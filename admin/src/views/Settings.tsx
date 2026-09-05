import { getBaseUrl, getUsername } from '../api';
import { Button } from '../components/ui';
import { useI18n, type Lang } from '../i18n';

const LANGUAGES: { id: Lang; labelKey: 'settings.langId' | 'settings.langEn' }[] = [
  { id: 'id', labelKey: 'settings.langId' },
  { id: 'en', labelKey: 'settings.langEn' },
];

export default function Settings({ onLogout }: { onLogout: () => void }) {
  const { t, lang, setLang } = useI18n();
  const username = getUsername();

  return (
    <section className="max-w-2xl">
      <h2 className="mb-4 text-xl font-bold text-wood-text">{t('settings.title')}</h2>

      <div className="flex flex-col gap-4 rounded-lg border border-wood-mid/40 bg-wood-dark/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-wood-mid/50 bg-wood-darkest/60">
              <i className="fa-solid fa-user text-lg text-accent" aria-hidden="true" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-wood-text/60">
                {t('settings.account')}
              </div>
              <div className="text-sm text-wood-text">
                {t('nav.loggedInAs')} <span className="font-bold">{username}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket text-base" aria-hidden="true" />
            {t('nav.logout')}
          </Button>
        </div>

        <div className="border-t border-wood-mid/30 pt-4 text-xs text-wood-text/60">
          <span className="uppercase tracking-wider text-wood-text/50">{t('info.apiUrl')}: </span>
          {getBaseUrl()}
        </div>

        <div className="border-t border-wood-mid/30 pt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-wood-text/60">
            {t('settings.lang')}
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={[
                  'inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-semibold cursor-pointer transition-colors',
                  lang === l.id
                    ? 'bg-accent border-accent text-wood-darkest'
                    : 'border-wood-mid/50 text-wood-text/70 hover:text-wood-text',
                ].join(' ')}
              >
                <i className="fa-solid fa-globe text-sm" aria-hidden="true" />
                {t(l.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}