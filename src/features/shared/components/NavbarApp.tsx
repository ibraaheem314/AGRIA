import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, BarChart, CloudRain, MapPin, Grid } from 'lucide-react';
import Button from './Button';

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
    <header className="bg-dark border-b border-primary/20 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <div className="mr-2 w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <span className="text-white text-xl font-light">AGRITECH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex h-full">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-5 flex items-center h-full border-b-2 transition-colors duration-300 ${
                  isActive(item.path) 
                    ? 'border-primary text-white' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-primary/30'
                }`}
              >
                <span className="flex items-center">
                  <span className={`mr-2 ${isActive(item.path) ? 'text-primary' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            
            {/* Login link */}
            <Link 
              to="/login" 
              className="hidden md:block text-white hover:text-primary transition-colors"
            >
              Accédez à votre compte
            </Link>
            
            {/* Demo button */}
            <Button 
              variant="primary" 
              size="sm"
              className="ml-2 hidden md:flex"
              onClick={() => navigate('/demo')}
            >
              Accédez à la demo
            </Button>

            {/* Mobile Menu Button */}
            <button 
              className="ml-2 p-2 md:hidden text-gray-400 hover:text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-primary/20 bg-gradient-to-b from-dark to-darker">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center py-2 px-4 ${isActive(item.path) ? 'text-primary' : 'text-gray-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-primary/10">
              <div className="flex flex-col px-4 py-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-white/20"
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
                  className="w-full bg-primary hover:bg-primary-600"
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