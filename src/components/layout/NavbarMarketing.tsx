import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Menu, X, Leaf } from 'lucide-react';

const NavbarMarketing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' 
          : 'bg-gradient-to-b from-black/50 to-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="mr-2 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-green-500/30">
            <Leaf size={20} className="text-white" />
          </div>
          <span className={`text-xl font-medium tracking-wide ${scrolled ? 'text-green-800' : 'text-white'}`}>AGRITECH</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/platform" className={`uppercase text-sm tracking-wider transition-colors font-medium ${scrolled ? 'text-gray-800 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>
            Plateforme
          </Link>
          <Link to="/resources" className={`uppercase text-sm tracking-wider transition-colors font-medium ${scrolled ? 'text-gray-800 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>
            Ressources
          </Link>
          <Link to="/about" className={`uppercase text-sm tracking-wider transition-colors font-medium ${scrolled ? 'text-gray-800 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>
            À propos
          </Link>
          <Link to="/contact" className={`uppercase text-sm tracking-wider transition-colors font-medium ${scrolled ? 'text-gray-800 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm"
            className={`hidden md:flex transition-all duration-300 ${
              scrolled 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-white text-green-700 hover:bg-white/90'
            }`}
            onClick={() => navigate('/demo')}
          >
            Accédez à la demo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`hidden md:flex transition-all duration-300 ${
              scrolled 
                ? 'border-green-600 text-green-700 hover:bg-green-50' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
            onClick={() => navigate('/login')}
          >
            Mon compte
          </Button>
          <button 
            className={`md:hidden p-2 rounded-lg ${
              scrolled ? 'text-green-700 hover:bg-green-50' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-5 border-t border-gray-200 animate-in">
          <div className="space-y-4">
            <Link 
              to="/platform" 
              className="block py-3 text-gray-800 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plateforme
            </Link>
            <Link 
              to="/resources" 
              className="block py-3 text-gray-800 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ressources
            </Link>
            <Link
              to="/about" 
              className="block py-3 text-gray-800 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-gray-800 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 flex flex-col gap-3 border-t border-gray-200 mt-4">
              <Button 
                variant="primary" 
                size="sm"
                className="w-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                onClick={() => {
                  navigate('/demo');
                  setMobileMenuOpen(false);
                }}
              >
                Accédez à la demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-green-600 text-green-700 hover:bg-green-50 transition-all duration-300"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                Mon compte
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarMarketing;
