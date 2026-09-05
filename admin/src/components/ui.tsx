import type { ReactNode } from 'react';

const styles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-200 border',
  primary: 'bg-accent border-accent text-wood-darkest hover:bg-accent-dark hover:border-accent-dark',
  ghost: 'bg-transparent border-wood-mid/50 text-wood-text/80 hover:text-wood-text hover:border-wood-mid',
  danger:
    'bg-transparent border-accent/50 text-amber-400 hover:bg-accent/15',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: { variant?: keyof typeof styles } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${styles.base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-wood-text/60">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full rounded-md border border-wood-mid/40 bg-wood-darkest/60 px-3 py-2 text-sm text-wood-text placeholder:text-wood-text/40 focus:outline-none focus:border-accent';

export function Alert({
  type,
  children,
}: {
  type: 'error' | 'ok' | 'info';
  children: ReactNode;
}) {
  const border = type === 'error' ? 'border-accent' : type === 'ok' ? 'border-green-600/60' : 'border-wood-mid/40';
  return (
    <div className={`mb-4 rounded-md border ${border} bg-wood-dark/70 px-4 py-3 text-sm`}>
      {children}
    </div>
  );
}