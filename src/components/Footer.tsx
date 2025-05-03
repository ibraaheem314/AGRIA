import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-12 relative overflow-hidden">
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 -z-10"></div>
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full border border-green-200/30 opacity-30 -z-10" style={{ transform: 'translate(-250px, 250px)' }}></div>
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full border border-blue-200/30 opacity-30 -z-10" style={{ transform: 'translate(300px, -300px)' }}></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-10">
          <div className="mb-10 lg:mb-0 max-w-xs">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white mr-3">
                <span className="font-bold text-xl">A</span>
              </div>
              <h3 className="text-xl font-bold text-green-900">AGRITECH</h3>
            </div>
            <p className="text-gray-600 mb-8">
              Solutions d'agriculture durable alimentées par les technologies modernes pour un avenir meilleur.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-green-900">Plateforme</h4>
              <ul className="space-y-4">
                <li><Link to="/platform" className="text-gray-600 hover:text-green-700 transition-colors">Vue d'ensemble</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-green-700 transition-colors">Solutions</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-green-700 transition-colors">Comment ça marche</button></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-green-700 transition-colors">Tarifs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-green-900">Ressources</h4>
              <ul className="space-y-4">
                <li><Link to="/resources" className="text-gray-600 hover:text-green-700 transition-colors">Blog</Link></li>
                <li><Link to="/resources" className="text-gray-600 hover:text-green-700 transition-colors">Documentation</Link></li>
                <li><Link to="/resources" className="text-gray-600 hover:text-green-700 transition-colors">Études de cas</Link></li>
                <li><Link to="/resources" className="text-gray-600 hover:text-green-700 transition-colors">Webinars</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-green-900">À propos</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-600 hover:text-green-700 transition-colors">Entreprise</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-green-700 transition-colors">Équipe</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-green-700 transition-colors">Partenaires</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-green-700 transition-colors">Carrières</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-green-900">Contact</h4>
              <ul className="space-y-4">
                <li><Link to="/contact" className="text-gray-600 hover:text-green-700 transition-colors">Nous contacter</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-green-700 transition-colors">Support</Link></li>
                <li><a href="mailto:info@agritech.com" className="text-gray-600 hover:text-green-700 transition-colors">info@agritech.com</a></li>
                <li><a href="tel:+33123456789" className="text-gray-600 hover:text-green-700 transition-colors">+33 1 23 45 67 89</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} AgriTech. Tous droits réservés.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex space-x-6 mr-6">
              <a href="#" className="text-sm text-gray-600 hover:text-green-700 transition-colors">Confidentialité</a>
              <a href="#" className="text-sm text-gray-600 hover:text-green-700 transition-colors">Conditions</a>
              <a href="#" className="text-sm text-gray-600 hover:text-green-700 transition-colors">Cookies</a>
            </div>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
