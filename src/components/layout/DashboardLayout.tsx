import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';
import PageTransition from './PageTransition';
import { Leaf, Sun, Sprout, Moon } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentSeason = 'Automne';

  // Fonction pour obtenir l'icône et les couleurs de la saison actuelle
  const getSeasonStyles = () => {
    switch(currentSeason) {
      case 'Printemps':
        return {
          icon: <Sprout size={16} className="text-season-spring mr-2" />,
          bgColor: 'bg-season-spring/5',
          borderColor: 'border-season-spring/20',
          textColor: 'text-season-spring'
        };
      case 'Été':
        return {
          icon: <Sun size={16} className="text-season-summer mr-2" />,
          bgColor: 'bg-season-summer/5',
          borderColor: 'border-season-summer/20',
          textColor: 'text-season-summer'
        };
      case 'Automne':
        return {
          icon: <Leaf size={16} className="text-season-autumn mr-2" />,
          bgColor: 'bg-season-autumn/5',
          borderColor: 'border-season-autumn/20',
          textColor: 'text-season-autumn'
        };
      case 'Hiver':
        return {
          icon: <Moon size={16} className="text-season-winter mr-2" />,
          bgColor: 'bg-season-winter/5',
          borderColor: 'border-season-winter/20',
          textColor: 'text-season-winter'
        };
      default:
        return {
          icon: <Leaf size={16} className="text-primary mr-2" />,
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20',
          textColor: 'text-primary'
        };
    }
  };

  const seasonStyles = getSeasonStyles();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark relative">
      {/* Background pattern - grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
      </div>
      
      {/* Background pattern - garden */}
      <div className="fixed inset-0 pointer-events-none opacity-15">
        <div className="absolute top-0 left-0 w-full h-full bg-garden-pattern" />
      </div>
      
      {/* Soil texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-soil-texture" />
      </div>

      {/* Wave pattern at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <div className="w-full h-24 bg-wave-pattern opacity-20" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 md:ml-0 relative z-10">
        <main className="py-6 px-3 md:px-6">
          <PageTransition transitionType="fade">
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Season indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-neutral-900/90 backdrop-blur-sm py-2 px-4 rounded-full border border-soil-light/30 shadow-glow-sm">
        <div className="flex items-center">
          {seasonStyles.icon}
          <span className={`text-xs ${seasonStyles.textColor} font-medium`}>Saison actuelle: {currentSeason}</span>
          <div className="ml-3 flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${currentSeason === 'Printemps' ? 'bg-season-spring ring-1 ring-season-spring' : 'bg-season-spring/30'}`}></span>
            <span className={`w-2 h-2 rounded-full ${currentSeason === 'Été' ? 'bg-season-summer ring-1 ring-season-summer' : 'bg-season-summer/30'}`}></span>
            <span className={`w-2 h-2 rounded-full ${currentSeason === 'Automne' ? 'bg-season-autumn ring-1 ring-season-autumn animate-pulse' : 'bg-season-autumn/30'}`}></span>
            <span className={`w-2 h-2 rounded-full ${currentSeason === 'Hiver' ? 'bg-season-winter ring-1 ring-season-winter' : 'bg-season-winter/30'}`}></span>
          </div>
        </div>
      </div>

      {/* Gradient overlay at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darker to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default DashboardLayout;
