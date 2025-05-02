import React from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-6">AGRITECH</h3>
            <p className="text-gray-400 max-w-xs">
              Sustainable agriculture solutions powered by modern technology
          </p>
        </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/platform" className="text-gray-400 hover:text-white">Overview</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white">Solutions</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white">How it works</button></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Use Cases</Link></li>
              </ul>
            </div>
            
        <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">Company</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">Team</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">Partners</Link></li>
          </ul>
        </div>

        <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Get in touch</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><a href="mailto:info@agritech.com" className="text-gray-400 hover:text-white">info@agritech.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} AgriTech. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
