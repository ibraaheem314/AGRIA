import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, BarChart, CloudRain, MapPin, Grid } from 'lucide-react';
import Button from '../ui/Button';

const NavbarApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <Grid size={18} /> },
    { path: '/weather', name: 'Weather', icon: <CloudRain size={18} /> },
    { path: '/maps', name: 'Maps', icon: <MapPin size={18} /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart size={18} /> },
  ];

  return (
    <header className="bg-white border-t-4 border-t-green-500 border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <div className="mr-2 w-8 h-8 bg-green-500 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-medium">A</span>
            </div>
            <span className="text-gray-800 text-xl font-medium tracking-wide">AGRITECH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex h-full">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-5 flex items-center h-full border-b-2 transition-colors duration-300 ${
                  isActive(item.path) 
                    ? 'border-green-500 text-gray-800 font-medium' 
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-green-300'
                }`}
              >
                <span className="flex items-center">
                  <span className={`mr-2 ${isActive(item.path) ? 'text-green-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 relative hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </button>
            
            {/* Login link */}
            <Link 
              to="/login" 
              className="hidden md:block text-gray-700 font-medium hover:text-green-600 transition-colors"
            >
              Accédez à votre compte
            </Link>
            
            {/* Demo button */}
            <Button 
              variant="primary" 
              size="sm"
              className="ml-2 hidden md:flex bg-green-500 hover:bg-green-600 text-white shadow-sm font-medium"
              onClick={() => navigate('/demo')}
            >
              Accédez à la demo
            </Button>

            {/* Mobile Menu Button */}
            <button 
              className="ml-2 p-2 md:hidden text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 bg-white shadow-lg">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center py-2 px-4 ${
                  isActive(item.path) 
                    ? 'text-green-600 font-medium bg-green-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-green-500' : 'text-gray-500'}`}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-col px-4 py-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-gray-300 text-gray-700 hover:border-gray-400 font-medium"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Connexion
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="w-full bg-green-500 hover:bg-green-600 text-white shadow-sm font-medium"
                  onClick={() => {
                    navigate('/demo');
                    setIsMenuOpen(false);
                  }}
                >
                  Accédez à la demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarApp;
