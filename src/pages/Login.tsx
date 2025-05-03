import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MailCheck, Lock, ArrowRight, LogIn, User } from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtenir l'URL de redirection après connexion
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
    // Simulation d'une connexion en mode démo
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark to-darker">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30 shadow-glow-sm">
            <LogIn className="h-8 w-8 text-primary icon-highlight" />
          </div>
          <h2 className="text-3xl font-medium text-white mb-2 text-on-dark">Connectez-vous</h2>
          <p className="text-white/85 font-light">Accédez à votre compte AgriTech</p>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-md rounded-xl shadow-glow-sm p-8 border border-primary/20">
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-900/30 border border-red-700/40 text-red-400 font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailCheck size={18} className="text-white/60 icon-highlight" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-primary/30 rounded-md bg-dark/80 shadow-sm focus:ring-primary focus:border-primary text-white focus:outline-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-white/60 icon-highlight" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-primary/30 rounded-md bg-dark/80 shadow-sm focus:ring-primary focus:border-primary text-white focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Se souvenir de moi
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-400 hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                variant="primary"
                type="submit"
                className="w-full py-3 flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
            
            {/* Bouton de démonstration */}
            <div className="mt-4 text-center">
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-surface/80 text-xs text-white/70 font-medium">ou</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4 border-primary/30 hover:bg-primary/10 hover:border-primary/60 font-medium"
                onClick={handleDemoLogin}
              >
                <User size={16} className="mr-2 icon-highlight" />
                Accéder en mode démo
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-white/80">
              Pas encore de compte?{' '}
              <Link to="/dashboard" className="text-primary hover:text-primary-400 font-medium hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 