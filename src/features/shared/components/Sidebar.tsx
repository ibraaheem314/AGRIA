import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudRain,
  Map,
  BarChart2,
  PieChart,
  Settings,
  Users,
  MessageCircle,
  Leaf,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  
  const linkGroups = [
    {
      title: 'Main',
      links: [
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/weather', icon: <CloudRain size={20} />, label: 'Weather' },
        { to: '/maps', icon: <Map size={20} />, label: 'Maps' },
        { to: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
      ],
    },
    {
      title: 'Management',
      links: [
        { to: '/crops', icon: <Leaf size={20} />, label: 'Crops' },
        { to: '/farms', icon: <PieChart size={20} />, label: 'Farms' },
        { to: '/team', icon: <Users size={20} />, label: 'Team' },
      ],
    },
    {
      title: 'Support',
      links: [
        { to: '/community', icon: <MessageCircle size={20} />, label: 'Community' },
        { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
        { to: '/help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
      ],
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:w-64 w-64 bg-dark border-r border-primary/20 flex flex-col`}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-primary/20 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center">
            <div className="mr-2 w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            {isOpen && <span className="text-white text-xl font-light">AGRITECH</span>}
          </Link>
          
          <button
            onClick={onToggle}
            className="md:flex hidden items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-white hover:bg-primary/20"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-2 styled-scrollbar">
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {isOpen && <div className="px-4 mb-2 text-xs text-text-tertiary uppercase tracking-wider">{group.title}</div>}
              
              {group.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.to}
                  className={`
                    flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-colors duration-200
                    ${isActive(link.to) 
                      ? 'bg-primary/20 text-white border border-primary/30' 
                      : 'text-gray-400 hover:text-white hover:bg-primary/10'}
                  `}
                >
                  <div className={`${isActive(link.to) ? 'text-primary' : ''}`}>
                    {link.icon}
                  </div>
                  {isOpen && <span className="ml-3">{link.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* User profile section */}
        <div className="border-t border-primary/20 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-medium">JD</span>
            </div>
            
            {isOpen && (
              <div className="ml-3">
                <div className="text-sm font-medium text-white">John Doe</div>
                <div className="text-xs text-text-tertiary">Farm Manager</div>
              </div>
            )}
          </div>
          
          {isOpen && (
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-text-secondary hover:text-white border border-primary/20 rounded-lg transition-colors hover:bg-primary/10">
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 