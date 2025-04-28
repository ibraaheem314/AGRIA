import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarMarketing from './NavbarMarketing';
import Footer from '../Footer';
import PageTransition from './PageTransition';

const MarketingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-dark to-darker text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
      </div>

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
      
      {/* Gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darker to-transparent pointer-events-none" />
    </div>
  );
};

export default MarketingLayout;
