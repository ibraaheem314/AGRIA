import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-400 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-neutral-800">
        {/* Branding */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">
            Agri<span className="text-primary">Tech</span>
          </h3>
          <p className="text-sm text-gray-500">
            L’intelligence artificielle au service d’une agriculture durable, productive et responsable.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Tarifs</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Mon compte</Link></li>
          </ul>
        </div>

        {/* Contact rapide */}
        <div>
          <h4 className="text-white font-semibold mb-4">Besoin d’aide ?</h4>
          <p className="text-sm text-gray-500 mb-2">Contactez-nous par email :</p>
          <a href="mailto:contact@agritech.ai" className="text-primary hover:underline text-sm">
            contact@agritech.ai
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-neutral-800 mt-6">
        &copy; {new Date().getFullYear()} AgriTech. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
