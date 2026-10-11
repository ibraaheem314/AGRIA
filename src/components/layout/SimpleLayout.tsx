import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarSimple from './NavbarSimple';
import Footer from './Footer';

const SimpleLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <NavbarSimple />
      
      {/* Main content */}
      <div className="relative z-10 flex-1">
        <main>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SimpleLayout; 