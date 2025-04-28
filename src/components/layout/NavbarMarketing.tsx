import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const NavbarMarketing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0B0F0E]/90 backdrop-blur-md shadow-lg border-b border-neutral-800/70' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Agri</span>Tech
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm">
          <a href="#features" className="text-gray-300 hover:text-primary transition-colors duration-200">Solutions</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-primary transition-colors duration-200">Comment ça marche</a>
          <Link to="/why" className="text-gray-300 hover:text-primary transition-colors duration-200">Pourquoi AgriTech</Link>
          <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors duration-200">Contact</Link>
          <Link
            to="/dashboard"
            className="text-primary border border-primary/80 px-4 py-1.5 rounded-lg font-medium hover:bg-primary/10 transition-colors duration-200"
          >
            Mon compte
          </Link>
          <Link
            to="/contact"
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 rounded-lg font-semibold hover:shadow-md hover:shadow-primary/20 transition-all duration-200"
          >
            Essayez gratuitement
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden px-6 pb-6 pt-2 bg-[#0B0F0E]/95 backdrop-blur-md border-t border-neutral-800 space-y-4 text-sm"
        >
          <a href="#features" className="block py-2 text-gray-300 hover:text-primary">Solutions</a>
          <a href="#how-it-works" className="block py-2 text-gray-300 hover:text-primary">Comment ça marche</a>
          <Link to="/why" className="block py-2 text-gray-300 hover:text-primary">Pourquoi AgriTech</Link>
          <Link to="/contact" className="block py-2 text-gray-300 hover:text-primary">Contact</Link>
          <Link
            to="/dashboard"
            className="block py-2.5 mt-4 text-center border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
          >
            Mon compte
          </Link>
          <Link
            to="/contact"
            className="block py-2.5 text-center bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-md hover:shadow-primary/20 transition-all duration-200"
          >
            Essayez gratuitement
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavbarMarketing;
