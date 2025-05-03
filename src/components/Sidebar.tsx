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
        className="md:hidden fixed top-4 left-4 z-30 bg-green-600 hover:bg-green-700 text-white p-2 rounded-md shadow-sm transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 z-20 w-64 h-screen bg-white/95 backdrop-blur-sm border-r border-gray-200 text-gray-800 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close on mobile */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg shadow-sm flex items-center justify-center">
                <Sprout size={20} className="text-white" />
              </div>
              <div className="ml-2">
                <span className="text-lg font-medium text-gray-800">AgriTech</span>
                <span className="block text-xs text-gray-600 font-medium">Maraîchage saisonnier</span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Season indicator */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{currentSeasonIcon()}</span>
                <span className="text-sm font-medium text-gray-700">Saison: {currentSeason}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Printemps' ? 'bg-season-spring ring-1 ring-season-spring shadow-sm' : 'bg-season-spring/40'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Été' ? 'bg-season-summer ring-1 ring-season-summer shadow-sm' : 'bg-season-summer/40'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Automne' ? 'bg-season-autumn ring-1 ring-season-autumn shadow-sm animate-pulse' : 'bg-season-autumn/40'}`}></span>
                <span className={`w-2 h-2 rounded-full ${currentSeason === 'Hiver' ? 'bg-season-winter ring-1 ring-season-winter shadow-sm' : 'bg-season-winter/40'}`}></span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center text-blue-600">
                <Droplets size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium data-value text-gray-800">52%</span>
              <span className="text-[10px] text-gray-500">Humidité</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-amber-600">
                <Thermometer size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium data-value text-gray-800">12°C</span>
              <span className="text-[10px] text-gray-500">Temp.</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-green-600">
                <Sprout size={16} />
              </div>
              <span className="text-xs block mt-1 font-medium data-value text-gray-800">5</span>
              <span className="text-[10px] text-gray-500">Cultures</span>
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
                        ? 'bg-green-600 text-white font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Ressources
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  to="/ressources/guide"
                  className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <BookOpen size={18} className="mr-3 text-green-600" />
                  <span className="text-sm">Guide du maraîcher</span>
                </Link>
                <Link
                  to="/ressources/calendrier-semis"
                  className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <Calendar size={18} className="mr-3 text-green-600" />
                  <span className="text-sm">Calendrier de semis</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                <User size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Jean Dupont</p>
                <p className="text-xs text-gray-500">Maraîcher · Île-de-France</p>
              </div>
              <button className="ml-auto p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100">
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
