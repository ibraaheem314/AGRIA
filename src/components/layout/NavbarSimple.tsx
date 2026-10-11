import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, MessageCircle, Cloud, User, LogOut, Users, Package, Info, HelpCircle, Phone } from 'lucide-react';
import Button from '../ui/Button';

const NavbarSimple = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAIClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo - Style AMINI */}
        <Link to={isAuthenticated ? "/chat" : "/"} className="flex items-center group">
          <div className="mr-3 w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center transition-all duration-300 group-hover:bg-green-600">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="text-lg font-medium text-gray-900 tracking-tight">AGRIA</span>
        </Link>

        {/* Navigation - Style minimaliste */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Liens publics */}
          <button
            onClick={handleAIClick}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/chat') || isActive('/dashboard')
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Assistant IA
          </button>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/about')
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            À propos
          </Link>

          <Link
            to="/faq"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/faq')
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            FAQ
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/contact')
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact
          </Link>

          {/* Liens privés - Seulement si connecté */}
          {isAuthenticated && (
            <>
              <Link
                to="/weather"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/weather')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Météo
              </Link>

              <Link
                to="/consultants"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/consultants')
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                Experts
              </Link>

              <Link
                to="/marketplace"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/marketplace')
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Boutique
              </Link>
            </>
          )}
        </nav>

        {/* Actions - Style épuré */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/profile')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profil
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-sm px-4 py-2 rounded-full font-medium"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Style minimaliste */}
      <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100">
        {isAuthenticated ? (
          /* Navigation complète pour utilisateurs connectés - Sans duplication profil */
          <nav className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-4 gap-1 text-center">
            <button
              onClick={handleAIClick}
              className={`text-xs font-medium transition-colors ${
                isActive('/chat') || isActive('/dashboard')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assistant
            </button>

            <Link
              to="/weather"
              className={`text-xs font-medium transition-colors ${
                isActive('/weather')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Météo
            </Link>

            <Link
              to="/consultants"
              className={`text-xs font-medium transition-colors ${
                isActive('/consultants')
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Experts
            </Link>

            <Link
              to="/marketplace"
              className={`text-xs font-medium transition-colors ${
                isActive('/marketplace')
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Boutique
            </Link>
          </nav>
        ) : (
          /* Navigation étendue pour visiteurs */
          <nav className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-4 gap-1 text-center">
            <button
              onClick={handleAIClick}
              className={`text-xs font-medium transition-colors ${
                isActive('/chat') || isActive('/dashboard')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assistant IA
            </button>

            <Link
              to="/about"
              className={`text-xs font-medium transition-colors ${
                isActive('/about')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              À propos
            </Link>

            <Link
              to="/faq"
              className={`text-xs font-medium transition-colors ${
                isActive('/faq')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQ
            </Link>

            <Link
              to="/contact"
              className={`text-xs font-medium transition-colors ${
                isActive('/contact')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavbarSimple; 