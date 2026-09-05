import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={[
        'relative rounded-md border border-wood-mid/40 bg-wood-dark/75 p-5 shadow-md shadow-wood-darkest/30',
        hoverable
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-wood-light/50'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}