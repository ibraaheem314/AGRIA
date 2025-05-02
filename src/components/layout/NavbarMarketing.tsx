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
        scrolled ? 'bg-primary-800/90 backdrop-blur-sm shadow-lg border-b border-primary-700/30' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="mr-2 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-glow-primary">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-light tracking-wide">AGRITECH</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/platform" className="text-white/90 uppercase text-sm tracking-wider hover:text-white transition-colors font-light">
            Plateforme
          </Link>
          <Link to="/resources" className="text-white/90 uppercase text-sm tracking-wider hover:text-white transition-colors font-light">
            Ressources
          </Link>
          <Link to="/about" className="text-white/90 uppercase text-sm tracking-wider hover:text-white transition-colors font-light">
            À propos
          </Link>
          <Link to="/contact" className="text-white/90 uppercase text-sm tracking-wider hover:text-white transition-colors font-light">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm"
            className="hidden md:flex bg-white text-primary-700 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            onClick={() => navigate('/demo')}
          >
            Accédez à la demo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex border-white/30 text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => navigate('/login')}
          >
            Mon compte
          </Button>
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-800/95 backdrop-blur-md px-4 py-5 border-t border-primary-700/30 animate-in">
          <div className="space-y-4">
            <Link 
              to="/platform" 
              className="block py-3 text-white hover:text-primary-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plateforme
            </Link>
            <Link 
              to="/resources" 
              className="block py-3 text-white hover:text-primary-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ressources
            </Link>
            <Link
              to="/about" 
              className="block py-3 text-white hover:text-primary-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-white hover:text-primary-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 flex flex-col gap-3 border-t border-primary-700/30 mt-4">
              <Button 
                variant="primary" 
                size="sm"
                className="w-full bg-white text-primary-700 hover:bg-white/90 transition-all duration-300"
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
                className="w-full border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
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
