import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarMarketing from './NavbarMarketing';
import Footer from '../Footer';
import PageTransition from './PageTransition';

const MarketingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Motifs décoratifs subtils */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
      </div>
      
      {/* Cercles décoratifs */}
      <div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full border border-green-500/10 opacity-30 -z-10" style={{ transform: 'translate(-300px, -300px)' }} />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full border border-blue-500/10 opacity-30 -z-10" style={{ transform: 'translate(250px, 250px)' }} />
      
      {/* Motif héro - uniquement sur la section supérieure */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-green-900 to-green-700 opacity-10 -z-20" />

      {/* Navbar */}
      <NavbarMarketing />
      
      {/* Main content with transition */}
      <main className="flex-1 relative z-10">
        <PageTransition transitionType="fade">
          <Outlet />
        </PageTransition>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MarketingLayout;
