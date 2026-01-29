import React from 'react';
import Hero from '../components/Hero';
import HomeServicesSection from '../components/home/HomeServicesSection';
import HomeFeaturedProjectsSection from '../components/home/HomeFeaturedProjectsSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HomeServicesSection />
      <HomeFeaturedProjectsSection />
    </div>
  );
};

export default HomePage;