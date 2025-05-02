import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cloud,
  ShoppingCart,
  BookOpen,
  User,
  Menu,
  X,
  Leaf,
  LineChart,
  Settings,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { path: '/farms', name: 'Exploitations', icon: <Leaf size={20} /> },
    { path: '/weather', name: 'Météo', icon: <Cloud size={20} /> },
    { path: '/marketplace', name: 'Marketplace', icon: <ShoppingCart size={20} /> },
    { path: '/resources', name: 'Ressources', icon: <BookOpen size={20} /> },
    { path: '/analytics', name: 'Analyses', icon: <LineChart size={20} /> },
    { path: '/profile', name: 'Profil', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-30 bg-primary text-white p-2 rounded-md shadow-glow-sm"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed md:sticky top-0 left-0 z-20 w-60 h-screen bg-surface border-r border-primary/15 text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close on mobile */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10 bg-surface-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-md shadow-glow-sm">
                <Leaf size={20} />
              </div>
              <span className="ml-2 text-lg font-light text-white">AgriTech</span>
            </Link>
            <button
              onClick={onToggle}
              className="md:hidden text-text-secondary hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Toggle button visible only on desktop */}
            <button
              onClick={onToggle}
              className="hidden md:flex text-text-secondary hover:text-white transition-colors"
            >
              <ChevronLeft size={18} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto thin-scrollbar bg-gradient-to-b from-surface-2 to-surface">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-primary font-medium shadow-glow-sm border-l-2 border-primary'
                      : 'text-text-secondary hover:bg-primary/5 hover:text-white'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
              >
                <span className="mr-3 transition-all duration-200">{item.icon}</span>
                <span className="transition-all duration-200">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 mt-auto border-t border-primary/10 bg-surface-2 backdrop-blur-sm">
            <div className="flex items-center p-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Jean Dupont</p>
                <p className="text-xs text-text-secondary">Expert Agricole</p>
              </div>
              <button className="ml-auto p-2 text-text-secondary hover:text-primary transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
