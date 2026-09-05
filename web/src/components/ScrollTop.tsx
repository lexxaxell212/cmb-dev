import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const movingToMid = useRef(true);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      if (window.scrollY <= 8) {
        setVisible(false);
        movingToMid.current = true;
      } else if (max > 0 && window.scrollY >= max * 0.8) {
        setVisible(true);
      } else if (movingToMid.current) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;

    if (movingToMid.current) {
      window.scrollTo({ top: max * 0.5, behavior: 'smooth' });
      movingToMid.current = false;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={[
        'fixed right-4 bottom-24 md:right-8 md:bottom-8 z-50',
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-3',
        'bg-wood-darkest border border-amber-600/60 text-amber-600 font-label font-bold uppercase tracking-wider',
        'transition-all duration-300 hover:scale-[1.05] active:scale-95',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}