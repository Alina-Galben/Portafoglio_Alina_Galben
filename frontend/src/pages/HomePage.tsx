import React from 'react';
import Hero from '../components/Hero';
import HomeServicesSection from '../components/home/HomeServicesSection';
import HomeFeaturedProjectsSection from '../components/home/HomeFeaturedProjectsSection';
import HomeWhyChooseMeSection from '../components/home/HomeWhyChooseMeSection';
import HomeMethodApproachSection from '../components/home/HomeMethodApproachSection';
import HomeMiniAboutSection from '../components/home/HomeMiniAboutSection';
import HomeFinalCTASection from '../components/home/HomeFinalCTASection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HomeWhyChooseMeSection />
      <HomeMethodApproachSection />
      <HomeMiniAboutSection />
      <HomeServicesSection />
      <HomeFeaturedProjectsSection />
      <HomeFinalCTASection />
    </div>
  );
};

export default HomePage;