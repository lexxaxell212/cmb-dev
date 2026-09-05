import { useState } from 'react';
import Layout from './layouts/Layout';
import NavBottom from './components/NavBottom';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import News from './pages/News';
import Getintouch from './pages/Getintouch';
import type { PageId } from './types';

export default function App() {
  const [page, setPage] = useState<PageId>('home');

  const handleNavigate = (next: PageId) => {
    if (next === page) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageMap: Record<PageId, React.ReactNode> = {
    home: <Home onNavigate={handleNavigate} />,
    menu: <Menu />,
    news: <News />,
    contact: <Getintouch />,
  };

  return (
    <>
      <Layout contentClassName="items-center justify-start">
        <NavBottom page={page} onNavigate={handleNavigate} />

        <div key={page} className="w-full">
          {pageMap[page]}
        </div>
      </Layout>

      <Footer />
      <ScrollTop />
    </>
  );
}