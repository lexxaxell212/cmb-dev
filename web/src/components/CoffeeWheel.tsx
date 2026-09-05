import { useEffect, useState } from 'react';
import Card from './reusable/Card';
import { resolveImage } from '../utils/image';
import { useLanguage } from '../i18n/LanguageContext';
import type { ProductItem } from './Product';

const SPIN_DURATION_MS = 3000;
const SLICE_COLORS = ['#6b4526', '#46301c'];
const AMBER = '#d4a05a';
const CREAM = '#f4ebd0';
const DARK = '#241710';
const R = 138;
const HUB = 34;
const LABEL_R = 84;

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function radial(radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

interface CoffeeWheelProps {
  products: ProductItem[];
}

export default function CoffeeWheel({ products }: CoffeeWheelProps) {
  const { t } = useLanguage();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ProductItem | null>(null);

  // Matikan mode "spinning" setelah durasi putaran selesai
  useEffect(() => {
    if (!spinning) return;
    const timer = setTimeout(() => setSpinning(false), SPIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [spinning]);

  const n = products.length;
  if (n < 2) return null;

  const step = 360 / n;

  const handleSpin = () => {
    if (spinning) return;

    // Kecepatan awal acak (rad/s); dengan friksi konstan roda mereda
    // dalam ±3 detik dan total sudut putaran = 1.5 * kecepatan.
    // Kecepatan inilah yang menentukan pemenang.
    const w = 7.5 + Math.random() * 7.5;
    const physAngle = (1.5 * w * 180) / Math.PI;
    const turns = Math.max(4, Math.floor(physAngle / 360));

    const resting = ((360 - (physAngle % 360)) % 360 + 360) % 360;
    const winner = Math.floor(resting / step) % n;
    const selected = products[winner];

    const center = (winner + 0.5) * step;
    const align = ((360 - center) % 360 + 360) % 360;
    const delta = (align - (rotation % 360) + 360) % 360;
    const next = rotation + turns * 360 + delta;

    setResult(selected);
    setRotation(next);
    setSpinning(true);
  };

  const slices = products.map((product, i) => {
    const a0 = i * step;
    const a1 = a0 + step;
    const mid = a0 + step / 2;
    const p1 = radial(R, a0);
    const p2 = radial(R, a1);
    const label = radial(LABEL_R, mid);
    const large = a1 - a0 > 180 ? 1 : 0;
    const name =
      product.name.length > 10 ? `${product.name.slice(0, 9)}…` : product.name;

    return {
      product,
      path: `M0,0 L${p1.x},${p1.y} A${R},${R} 0 ${large} 1 ${p2.x},${p2.y} Z`,
      fill: product.isBestSeller ? AMBER : SLICE_COLORS[i % 2],
      labelRotate: `rotate(${mid}, ${label.x}, ${label.y})`,
      labelX: label.x,
      labelY: label.y,
      name,
    };
  });

  return (
    <section className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl display-h2 text-wood-text">
          {t('menu.spinTitle')}
        </h2>
        <p className="mt-2 text-wood-text/70 max-w-xl mx-auto">
          {t('menu.spinSubtitle')}
        </p>
      </div>

      <div className="relative mx-auto max-w-2xl rounded-md border border-wood-mid/40 bg-wood-dark/75 p-6 md:p-10 shadow-md shadow-wood-darkest/30 flex flex-col items-center gap-8">
        {/* Panah penunjuk */}
        <span
          className={[
            'absolute top-0 left-1/2 -translate-x-1/2 z-10',
            'border-l-[10px] border-r-[10px] border-t-[16px]',
            'border-l-transparent border-r-transparent border-t-[#d4a05a]',
            'drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]',
            spinning ? 'animate-wheel-hint' : '',
          ].join(' ')}
        />

        {/* Roda */}
        <div className="relative">
          <svg
            viewBox="-150 -150 300 300"
            className="w-72 sm:w-80 md:w-96 h-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          >
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '0 0',
                transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)`,
              }}
            >
              {slices.map(({ product, path, fill }) => (
                <path
                  key={product.id}
                  d={path}
                  fill={fill}
                  stroke={DARK}
                  strokeWidth={2}
                />
              ))}
              {slices.map(({ product, labelRotate, labelX, labelY, name }) => (
                <text
                  key={`label-${product.id}`}
                  transform={labelRotate}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={n > 10 ? 9.5 : 11}
                  fontFamily="'Courier Prime', monospace"
                  fontWeight="700"
                  fill={product.isBestSeller ? DARK : CREAM}
                  opacity={0.92}
                >
                  {name}
                </text>
              ))}
              <circle r={HUB} fill={AMBER} />
              <circle r={HUB - 7} fill={DARK} />
              <circle r={HUB - 14} fill="none" stroke={AMBER} strokeWidth={2} />
            </g>
          </svg>
        </div>

        {/* Tombol pemicu */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className={[
            'inline-flex items-center gap-2 rounded-md px-6 py-3',
            'text-sm font-label font-bold uppercase tracking-widest',
            'bg-wood-text text-wood-darkest border border-wood-text',
            'transition-all duration-200 cursor-pointer',
            spinning
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
          ].join(' ')}
        >
          {spinning ? (
            <i className="fa-solid fa-circle-notch animate-spin text-base" aria-hidden="true" />
          ) : (
            <i className="fa-solid fa-rotate-right text-base" aria-hidden="true" />
          )}
          {spinning ? t('menu.spinSpinning') : result ? t('menu.spinAgain') : t('menu.spinButton')}
        </button>

        {/* Hasil pilihan */}
        {result && (
          <Card
            key={`${result.id}-${rotation}`}
            hoverable
            className="w-full sm:w-96 flex items-center gap-4 animate-slide-up"
          >
            <img
              src={resolveImage(result.image)}
              alt={result.name}
              className="w-20 h-20 rounded-md object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-label font-bold uppercase tracking-widest text-wood-light">
                <i className="fa-solid fa-circle-check text-xs text-amber-600 mr-1.5" aria-hidden="true" />
                {t('menu.spinResult')}
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <h3 className="text-lg display-h3 text-wood-text truncate">
                  {result.name}
                </h3>
                <p className="text-sm font-bold text-wood-text whitespace-nowrap">
                  {currencyFormatter.format(result.price)}
                </p>
              </div>
              {result.isBestSeller && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-xs bg-wood-dark/60 border border-wood-mid/30 px-2 py-0.5 text-[10px] font-label font-bold uppercase text-wood-text/80">
                  <i className="fa-solid fa-fire text-xs text-amber-600" aria-hidden="true" />
                  {t('common.bestSeller')}
                </span>
              )}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}