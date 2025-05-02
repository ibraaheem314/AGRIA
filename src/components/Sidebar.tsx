import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  Calendar,
  Sprout,
  Droplets,
  Thermometer,
  Sun,
  Moon,
  MapPin,
  Tractor,
  PackageCheck
} from 'lucide-react';

// Interface pour les composants SVG personnalisés
interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// Composant Seeds personnalisé
const Seeds = ({ size = 24, className, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    <path d="M9 9a3 3 0 0 0 6 0" />
    <path d="M9 15a3 3 0 0 0 6 0" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
  </svg>
);

// Composant Shovel personnalisé
const Shovel = ({ size = 24, className, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2 22l5-5" />
    <path d="M18 6l.7-.7A1 1 0 0 0 18.3 4l-6.44 6.44a1 1 0 0 0 0 1.42l.28.28a1 1 0 0 0 1.42 0L20 5.71a1 1 0 0 0-1.31-1.3L18 5z" />
    <path d="M6.58 17.42L17.42 6.58" />
  </svg>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('Automne');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { path: '/cultures', name: 'Cultures', icon: <Sprout size={20} /> },
    { path: '/parcelles', name: 'Parcelles', icon: <MapPin size={20} /> },
    { path: '/materiels', name: 'Matériel', icon: <Tractor size={20} /> },
    { path: '/stocks', name: 'Stocks & Récoltes', icon: <PackageCheck size={20} /> },
    { path: '/meteo', name: 'Météo & Climat', icon: <Cloud size={20} /> },
    { path: '/calendrier', name: 'Calendrier cultural', icon: <Calendar size={20} /> },
    { path: '/marche', name: 'Ventes & Marché', icon: <ShoppingCart size={20} /> },
    { path: '/ressources', name: 'Ressources', icon: <BookOpen size={20} /> },
    { path: '/analyses', name: 'Analyses & Rapports', icon: <LineChart size={20} /> },
    { path: '/profile', name: 'Mon profil', icon: <User size={20} /> },
  ];

  const currentSeasonIcon = () => {
    switch(currentSeason) {
      case 'Printemps': return <Sprout size={16} className="text-season-spring" />;
      case 'Été': return <Sun size={16} className="text-season-summer" />;
      case 'Automne': return <Leaf size={16} className="text-season-autumn" />;
      case 'Hiver': return <Moon size={16} className="text-season-winter" />;
      default: return <Leaf size={16} />;
    }
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 bg-primary hover:bg-primary-600 text-white p-2 rounded-md shadow-glow-sm transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 z-20 w-64 h-screen bg-neutral-900/95 backdrop-blur-sm border-r border-soil-light/20 text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close on mobile */}
          <div className="flex items-center justify-between p-4 border-b border-soil-light/20 bg-soil-dark/30">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg shadow-glow-sm flex items-center justify-center">
                <Sprout size={20} className="text-white" />
              </div>
              <div className="ml-2">
                <span className="text-lg font-medium text-white">AgriTech</span>
                <span className="block text-xs text-primary/80 font-medium">Maraîchage saisonnier</span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-text-tertiary hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Season indicator */}
          <div className="px-4 py-3 bg-neutral-900/70 border-b border-soil-light/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentSeasonIcon()}
                <span className="text-sm font-medium text-text-secondary">Saison: {currentSeason}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Printemps' ? 'bg-season-spring ring-1 ring-season-spring' : 'bg-season-spring/30'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Été' ? 'bg-season-summer ring-1 ring-season-summer' : 'bg-season-summer/30'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Automne' ? 'bg-season-autumn ring-1 ring-season-autumn' : 'bg-season-autumn/30'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Hiver' ? 'bg-season-winter ring-1 ring-season-winter' : 'bg-season-winter/30'}`}></span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="px-4 py-3 bg-soil-dark/10 border-b border-soil-light/10 flex justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center text-primary">
                <Droplets size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium">52%</span>
              <span className="text-[10px] text-text-tertiary">Humidité</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-accent">
                <Thermometer size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium">12°C</span>
              <span className="text-[10px] text-text-tertiary">Temp.</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-season-autumn">
                <Sprout size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium">5</span>
              <span className="text-[10px] text-text-tertiary">Cultures</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
            <div className="space-y-1 px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white font-medium shadow-glow-sm'
                        : 'text-text-secondary hover:bg-soil-dark/40 hover:text-white'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="mt-6 px-3">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 py-2">
                Ressources
              </div>
              <div className="mt-2 space-y-1">
                <a href="#" className="flex items-center px-3 py-2.5 rounded-md text-text-secondary hover:bg-soil-dark/40 hover:text-white transition-all">
                  <BookOpen size={18} className="mr-3" />
                  <span className="text-sm">Guide du maraîcher</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2.5 rounded-md text-text-secondary hover:bg-soil-dark/40 hover:text-white transition-all">
                  <Calendar size={18} className="mr-3" />
                  <span className="text-sm">Calendrier de semis</span>
                </a>
              </div>
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-soil-light/20 bg-soil-dark/30">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Jean Dupont</p>
                <p className="text-xs text-text-tertiary">Maraîcher · Île-de-France</p>
              </div>
              <button className="ml-auto p-2 text-text-tertiary hover:text-primary transition-colors rounded-full hover:bg-soil-dark/50">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
