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
    <main className="m-0 p-0 font-sans min-h-screen relative bg-cover bg-center">
      {/* Background Kayu & Noise (Tetap konsisten di semua halaman) */}
      <div className="fixed inset-0 bg-wood-texture bg-cover bg-center pointer-events-none"></div>

      {/* Konten Halaman dengan Flexbox yang Dinamis */}
      <div className={`relative z-10 w-full min-h-screen flex flex-col ${contentClassName} p-4 md:p-8 pt-24 md:pt-28 pb-24 md:pb-28`}>
        {children}
      </div>
    </main>
  );
}
