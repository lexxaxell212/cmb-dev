import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-wood-text text-wood-darkest border border-wood-darkest/30 hover:bg-wood-light active:bg-wood-light',
  secondary:
    'bg-wood-dark text-wood-text border border-wood-darkest/40 hover:bg-wood-mid',
  ghost:
    'bg-transparent text-wood-text border border-wood-mid/60 hover:bg-wood-dark/60',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-label font-bold tracking-wide uppercase cursor-pointer transition-all duration-200 hover:scale-[1.05] active:scale-95 ${
        fullWidth ? 'w-full' : ''
      } ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}