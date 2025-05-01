import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, Check, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();
    
    // Validation simple
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    const success = await register(name, email, password);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  // Vérifier la force du mot de passe
  const getPasswordStrength = (): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: '', color: 'bg-neutral-700' };
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    let text = '';
    let color = '';
    
    switch (strength) {
      case 0:
      case 1:
        text = 'Faible';
        color = 'bg-red-500';
        break;
      case 2:
        text = 'Moyen';
        color = 'bg-yellow-500';
        break;
      case 3:
        text = 'Bon';
        color = 'bg-green-400';
        break;
      case 4:
        text = 'Excellent';
        color = 'bg-green-500';
        break;
    }
    
    return { strength, text, color };
  };
  
  const passwordStrength = getPasswordStrength();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#151918]/95 to-[#0D1211]/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Créer un compte</h2>
        <p className="text-neutral-400">Rejoignez la communauté agricole innovante</p>
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
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
            Nom complet
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <User size={18} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        
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
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
            Mot de passe
          </label>
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
          
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <div className="h-1 flex-1 rounded-full bg-neutral-700 overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2 text-neutral-400">{passwordStrength.text}</span>
              </div>
              
              <ul className="space-y-1 mt-2 text-xs">
                <li className="flex items-center text-neutral-400">
                  {password.length >= 8 ? (
                    <Check size={14} className="mr-1 text-green-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 flex items-center justify-center text-neutral-500">·</span>
                  )}
                  Au moins 8 caractères
                </li>
                <li className="flex items-center text-neutral-400">
                  {password.match(/[A-Z]/) ? (
                    <Check size={14} className="mr-1 text-green-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 flex items-center justify-center text-neutral-500">·</span>
                  )}
                  Au moins une majuscule
                </li>
                <li className="flex items-center text-neutral-400">
                  {password.match(/[0-9]/) ? (
                    <Check size={14} className="mr-1 text-green-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 flex items-center justify-center text-neutral-500">·</span>
                  )}
                  Au moins un chiffre
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <Lock size={18} />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 bg-neutral-800 border-neutral-700 rounded text-primary focus:ring-primary/50"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-neutral-400">
            J'accepte les <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
          </label>
        </div>
        
        <Button 
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          Créer un compte
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-neutral-400 text-sm">
            Déjà inscrit?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary hover:text-primary-400 transition-colors font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm; 