import type { ReactNode } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SkeletonProps {
  className?: string;
  icon?: ReactNode;
  label?: string;
}

export default function Skeleton({
  className = '',
  icon,
  label,
}: SkeletonProps) {
  const { t } = useLanguage();
  const displayLabel = label ?? t('common.imageComingSoon');

  return (
    <div
      className={[
        'relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-md bg-wood-dark/60 border border-wood-mid/30 text-wood-text/70 animate-pulse',
        className,
      ].join(' ')}
    >
      {icon}
      <span className="text-xs font-label font-bold tracking-widest uppercase">{displayLabel}</span>
    </div>
  );
}