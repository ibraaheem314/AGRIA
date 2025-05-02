import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Button from "../../shared/ui/components/Button";
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();
    
    // Validation simple
    if (!email || !password) {
      setFormError('Veuillez remplir tous les champs');
      return;
    }
    
    const success = await login(email, password);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#151918]/95 to-[#0D1211]/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
        <p className="text-neutral-400">Accédez à votre tableau de bord AgriTech</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {(error || formError) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start"
          >
            <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5" />
            <span className="text-red-200 text-sm">{error || formError}</span>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
              Mot de passe
            </label>
            <a href="#" className="text-xs text-primary hover:text-primary-400 transition-colors">
              Mot de passe oublié?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 bg-neutral-800 border-neutral-700 rounded text-primary focus:ring-primary/50"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-neutral-400">
            Se souvenir de moi
          </label>
        </div>
        
        <Button 
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          Se connecter
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-neutral-400 text-sm">
            Pas encore de compte?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-primary hover:text-primary-400 transition-colors font-medium"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm; 