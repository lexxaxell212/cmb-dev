import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  contentClassName?: string; // Untuk kustomisasi flex alignment (misal: items-start, justify-start, dll)
}

export default function Layout({ 
  children, 
  contentClassName = "items-center justify-center" // Default tetap di tengah jika tidak diubah
}: LayoutProps) {
  return (
    <main className="m-0 p-0 font-sans min-h-screen relative bg-wood-texture bg-cover bg-center">
      {/* Konten Halaman dengan Flexbox yang Dinamis.
          NOTE: background kayu ada di <main> (ikut scroll), BUKAN layer
          position:fixed — layer fixed telat reflow saat bar Chrome collapse,
          sehingga body #241710 gelap terlihat sebagai band gelap waktu scroll. */}
      <div className={`relative z-10 w-full min-h-screen flex flex-col ${contentClassName} p-4 md:p-8 pt-24 md:pt-28 pb-24 md:pb-28`}>
        {children}
      </div>
    </main>
  );
}
