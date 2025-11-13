import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

const Layout: React.FC = () => {
  const { isMobile } = useDeviceOptimization();

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