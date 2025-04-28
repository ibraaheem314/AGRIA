import React from 'react';
import Sidebar from '../Sidebar';
import NavbarApp from './NavbarApp';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from './PageTransition';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-b from-dark to-darker text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
      </div>

      {/* Sidebar with subtle animation */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Sidebar />
      </motion.div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-screen ml-64 relative z-10">
        <NavbarApp />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <PageTransition transitionType="fade">
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darker to-transparent pointer-events-none" />
    </div>
  );
};

export default DashboardLayout;
