import { useEffect, useRef, useState } from 'react';
import Card from './reusable/Card';
import { resolveImage } from '../utils/image';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuotes } from '../services/api';
import type { ProductItem } from './Product';

const SPIN_DURATION_MS = 3000;
// Posisi panah di SVG: 0° = kanan (arah sumbu +x), jadi puncak roda = 270°.
const POINTER_ANGLE = 270;
const SLICE_COLORS = ['#6b4526', '#46301c'];
const AMBER = '#d4a05a';
const WINNER_FILL = '#f0bd74';
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
  const { t, lang } = useLanguage();
  const quotes = useQuotes();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ProductItem | null>(null);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [quote, setQuote] = useState<{ id: string; text: { id: string; en: string } } | null>(null);
  const pending = useRef<{ product: ProductItem; idx: number } | null>(null);

  const pickQuote = () => {
    const list = quotes.data ?? [];
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  };

  // Pilih satu kata-kata acak begitu daftarnya tiba
  useEffect(() => {
    if (quotes.data && quotes.data.length > 0) {
      Promise.resolve()
        .then(() => setQuote(pickQuote()))
        .catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes.data]);

  // Setelah putaran selesai barulah hasil ditampilkan
  useEffect(() => {
    if (!spinning) return;
    const timer = setTimeout(() => {
      setSpinning(false);
      if (pending.current) {
        setResult(pending.current.product);
        setWinnerIdx(pending.current.idx);
        pending.current = null;
      }
    }, SPIN_DURATION_MS);
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

    // Sudut yang berakhir tepat di bawah panah (puncak = 270°)
    const resting = (POINTER_ANGLE - (physAngle % 360) + 360) % 360;
    const winner = Math.floor(resting / step) % n;
    const selected = products[winner];

    // Roda diputar ke sudut yang menempatkan pusat irisan pemenang di 270°
    const center = (winner + 0.5) * step;
    const align = (POINTER_ANGLE - center + 360) % 360;
    const delta = (align - (rotation % 360) + 360) % 360;
    const next = rotation + turns * 360 + delta;

    // Sembunyikan hasil lama selama berputar; tampilkan lagi saat berhenti
    pending.current = { product: selected, idx: winner };
    setResult(null);
    setWinnerIdx(null);
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
    const highlight = winnerIdx === i && !spinning;

    return {
      product,
      path: `M0,0 L${p1.x},${p1.y} A${R},${R} 0 ${large} 1 ${p2.x},${p2.y} Z`,
      fill: highlight
        ? WINNER_FILL
        : product.isBestSeller
          ? AMBER
          : SLICE_COLORS[i % 2],
      stroke: highlight ? CREAM : DARK,
      strokeWidth: highlight ? 3.5 : 2,
      labelRotate: `rotate(${mid}, ${label.x}, ${label.y})`,
      labelX: label.x,
      labelY: label.y,
      name,
      nameFill: highlight || product.isBestSeller ? DARK : CREAM,
    };
  });

  return (
    <section className="w-full max-w-6xl mx-auto animate-fade-in">
      {/* Panel signage retro */}
      <div className="relative rounded-lg border-2 border-wood-light/40 bg-wood-dark/80 p-4 md:p-8 shadow-xl shadow-wood-darkest/50">
        {/* Sekrup pengikat di tiap sudut papan */}
        <span className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400/90 shadow-[0_0_0_1px_rgba(0,0,0,0.55)]" aria-hidden="true" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400/90 shadow-[0_0_0_1px_rgba(0,0,0,0.55)]" aria-hidden="true" />
        <span className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full bg-amber-400/90 shadow-[0_0_0_1px_rgba(0,0,0,0.55)]" aria-hidden="true" />
        <span className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-400/90 shadow-[0_0_0_1px_rgba(0,0,0,0.55)]" aria-hidden="true" />

        {/* Mat dalam (double-frame) */}
        <div className="rounded-md border border-wood-mid/40 p-5 md:p-8">
          {/* Kepala papan */}
          <div className="text-center">
            <p className="text-[11px] font-label font-bold uppercase tracking-[0.35em] text-wood-light">
              {t('menu.spinLabel')}
            </p>
            <h2 className="mt-2 text-2xl md:text-4xl display-h2 text-wood-text">
              {t('menu.spinTitle')}
            </h2>
            <p className="mt-2 text-wood-text/70 max-w-xl mx-auto text-sm md:text-base">
              {t('menu.spinSubtitle')}
            </p>
            <div className="mx-auto mt-5 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-14 bg-wood-mid/50" />
              <i className="fa-solid fa-mug-hot text-sm text-amber-600" aria-hidden="true" />
              <span className="h-px w-14 bg-wood-mid/50" />
            </div>
          </div>

          {/* Roda di kiri, kontrol + hasil di kanan saat md+ */}
          <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-12">
            {/* Roda + tombol pemicu */}
            <div className="relative flex shrink-0 flex-col items-center gap-6">
              <span
                className={[
                  'absolute -top-1 left-1/2 -translate-x-1/2 z-10',
                  'border-l-[10px] border-r-[10px] border-t-[16px]',
                  'border-l-transparent border-r-transparent border-t-[#d4a05a]',
                  'drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]',
                  spinning ? 'animate-wheel-hint' : '',
                ].join(' ')}
              />
              <svg
                viewBox="-150 -150 300 300"
                className="w-64 sm:w-72 md:w-80 h-auto drop-shadow-[0_18px_36px_rgba(0,0,0,0.5)]"
              >
                <g
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '0 0',
                    transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)`,
                  }}
                >
                  {slices.map(({ product, path, fill, stroke, strokeWidth }) => (
                    <path
                      key={product.id}
                      d={path}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  ))}
                  {slices.map(({ product, labelRotate, labelX, labelY, name, nameFill }) => (
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
                      fill={nameFill}
                      opacity={0.92}
                    >
                      {name}
                    </text>
                  ))}
                  {/* Cincin luar bergaris — kesan mesin jadul */}
                  <circle r={144} fill="none" stroke={AMBER} strokeWidth={6} strokeDasharray="3 7" opacity={0.85} />
                  <circle r={130} fill="none" stroke={DARK} strokeWidth={2} opacity={0.5} />
                  {/* Medali tengah (bullseye) */}
                  <circle r={HUB} fill={AMBER} />
                  <circle r={HUB - 7} fill={DARK} />
                  <circle r={HUB - 16} fill={AMBER} />
                  <circle r={HUB - 20} fill={DARK} />
                </g>
              </svg>
              <button
                onClick={handleSpin}
                disabled={spinning}
                className={[
                  'inline-flex items-center gap-2 rounded-md px-6 py-3',
                  'text-sm font-label font-bold uppercase tracking-widest',
                  'bg-wood-text text-wood-darkest border border-wood-text',
                  'shadow-[0_4px_0_rgba(0,0,0,0.35)]',
                  'transition-all duration-150 ease-out',
                  spinning
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-none',
                ].join(' ')}
              >
                <i className="fa-solid fa-rotate-right text-base" aria-hidden="true" />
                {spinning ? t('menu.spinSpinning') : result ? t('menu.spinAgain') : t('menu.spinButton')}
              </button>
            </div>

            {/* Kolom kanan: kata-kata kosong atau kartu hasil */}
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 md:flex-1 md:py-8">
              {!result && quote && (
                <div className="relative w-full max-w-md rounded-md border-2 border-dashed border-amber-600/40 bg-wood-darkest/40 px-6 py-8 flex flex-col items-center text-center animate-fade-in">
                  <i className="fa-solid fa-quote-left text-xl text-amber-600/80" aria-hidden="true" />
                  <p className="mt-4 font-display italic text-wood-text/90 leading-relaxed">
                    “{quote.text[lang]}”
                  </p>
                  <p className="mt-4 text-[10px] font-label font-bold uppercase tracking-[0.3em] text-wood-light">
                    {t('menu.spinQuoteLabel')}
                  </p>
                </div>
              )}

              {/* Hasil pilihan + stempel retro */}
              {result && (
                <div className="relative w-full max-w-md animate-slide-up">
                  <span className="absolute -top-3 -right-1 z-20 rotate-6 rounded-sm border-2 border-dashed border-amber-600/80 bg-wood-darkest/95 px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-widest text-amber-500 shadow-md">
                    {t('menu.spinResult')}
                  </span>
                  <Card
                    key={`${result.id}-${rotation}`}
                    hoverable
                    className="w-full flex flex-col"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={resolveImage(result.image)}
                        alt={result.name}
                        className="w-20 h-20 rounded-md object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
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
                    </div>
                    {result.description[lang] && (
                      <p className="mt-3 pt-3 border-t border-wood-mid/30 text-sm text-wood-text/75 leading-relaxed">
                        {result.description[lang]}
                      </p>
                    )}
                    {result.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-xs bg-wood-dark/60 border border-wood-mid/30 px-2.5 py-0.5 text-[11px] text-wood-text/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}