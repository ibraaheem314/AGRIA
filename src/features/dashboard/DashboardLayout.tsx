import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/components/Sidebar';
import NavbarApp from '../shared/components/NavbarApp';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavbarApp />
        
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 