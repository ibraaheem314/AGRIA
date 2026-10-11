import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Section principale du footer */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Colonne 1: Marque & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AGRIA</span>
            </div>
            
            <p className="text-gray-300 font-light leading-relaxed">
              Révolutionnez votre agriculture avec l'intelligence artificielle. 
              Des conseils personnalisés pour optimiser vos rendements.
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
                { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
                { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
                { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Colonne 2: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Navigation</h3>
            <ul className="space-y-4">
              {[
                { name: "Accueil", href: "/" },
                { name: "À propos", href: "/about" },
                { name: "Assistant IA", href: "/chat" },
                { name: "Experts", href: "/consultants" },
                { name: "Marketplace", href: "/marketplace" },
                { name: "Météo", href: "/weather" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { name: "FAQ", href: "/faq" },
                { name: "Contact", href: "/contact" },
                { name: "Guide d'utilisation", href: "#" },
                { name: "Centre d'aide", href: "#" },
                { name: "Signaler un bug", href: "#" },
                { name: "Formations", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4: Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:contact@agria.com" 
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    contact@agria.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <a 
                    href="tel:+33123456789" 
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-gray-300">
                    123 Avenue de l'Agriculture<br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Newsletter */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <p className="text-sm text-gray-300 mb-3">
                Recevez nos conseils agricoles
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
                />
                <button className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} AGRIA. Tous droits réservés.
            </div>
            
            <div className="flex gap-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Conditions d'utilisation
              </Link>
              <Link 
                to="/cookies" 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
          
          {/* Badge "Made in France" */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400">
              <span className="text-base">🇫🇷</span>
              <span>Conçu et développé en France avec passion pour l'agriculture</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 