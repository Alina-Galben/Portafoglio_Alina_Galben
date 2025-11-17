import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

const Layout: React.FC = () => {
  const { isMobile } = useDeviceOptimization();
  const location = useLocation();

  useEffect(() => {
    // Fai uno scroll immediato all'inizio (top: 0, left: 0)
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${isMobile ? 'touch-manipulation' : ''}`}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;