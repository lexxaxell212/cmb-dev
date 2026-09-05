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
    <main className="m-0 p-0 font-sans relative">
      {/* Background kayu kini di <html> (root) — melukis canvas penuh tanpa
          position:fixed / 100vh, jadi tidak muncul band gelap saat bar
          Chrome collapse, dan tetap menutup walau konten lebih pendek
          dari viewport. */}
      <div className={`relative z-10 w-full min-h-screen flex flex-col ${contentClassName} p-4 md:p-8 pt-24 md:pt-28 pb-24 md:pb-28`}>
        {children}
      </div>
    </main>
  );
}
