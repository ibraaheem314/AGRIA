import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };
  
  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container uniforme avec la Home page */}
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center min-h-screen py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Header minimaliste */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="mx-auto w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-8">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight mb-4">
              Bon retour !
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Connectez-vous à votre compte AGRIA
            </p>
          </motion.div>

          {/* Formulaire minimaliste */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-light"
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field - Style minimaliste */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                  placeholder="votre@email.com"
                />
              </div>
              
              {/* Password Field - Style minimaliste */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 font-light">
                    Se souvenir de moi
                  </label>
                </div>
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-green-600 hover:text-gray-900 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              
              {/* Submit Button - Style AMINI */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-full hover:bg-gray-800 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {/* Divider minimaliste */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500 font-light">ou</span>
                </div>
              </div>
              
              {/* Demo Button - Style outline minimaliste */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-full hover:bg-gray-50 hover:border-gray-400 focus:outline-none transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Accéder en mode démo
              </button>
            </form>
            
            {/* Sign up link minimaliste */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-light">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Footer minimaliste */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 font-light">
              En vous connectant, vous acceptez nos{' '}
              <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Politique de confidentialité
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 