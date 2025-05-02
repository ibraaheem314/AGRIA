import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from './PageTransition';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-dashboard-pattern opacity-3" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <motion.div 
        className="flex-1 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <main className="p-4 md:p-6 transition-all">
          <PageTransition transitionType="fade">
            <Outlet />
          </PageTransition>
        </main>

        {/* Footer Credits */}
        <div className="px-6 py-3 text-center text-text-tertiary text-xs">
          <span>AgriTech Dashboard • Version 1.0.0</span>
        </div>
      </motion.div>

      {/* Gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darker to-transparent pointer-events-none" />
      
      {/* Radial gradient accent */}
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent opacity-30 blur-3xl pointer-events-none rounded-full" />
    </div>
  );
};

export default DashboardLayout;
