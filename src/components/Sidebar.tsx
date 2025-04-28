import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  Cloud,
  ShoppingCart,
  BookOpen,
  User,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/farms', name: 'Farms', icon: <Home size={20} /> },
    { path: '/weather', name: 'Weather', icon: <Cloud size={20} /> },
    { path: '/marketplace', name: 'Marketplace', icon: <ShoppingCart size={20} /> },
    { path: '/resources', name: 'Resources', icon: <BookOpen size={20} /> },
    { path: '/profile', name: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 bg-primary text-black p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-[#0B0F0E] text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close on mobile */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-black p-2 rounded-md">
                <Home size={20} />
              </div>
              <span className="ml-2 text-lg font-semibold text-white">AgriTech</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:bg-white/10'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="px-6 py-4 border-t border-neutral-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Farmer</p>
                <p className="text-xs text-gray-400">Farm Manager</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
