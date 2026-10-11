import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Leaf, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    if (!acceptTerms) {
      return;
    }
    
    const success = await register(formData.name, formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 8;

  return (
    <div className="min-h-screen bg-white">
      {/* Container uniforme avec la page Login */}
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
              Rejoignez AGRIA
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Créez votre compte pour accéder à l'IA agricole
            </p>
          </motion.div>

          {/* Formulaire d'inscription */}
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
              {/* Nom complet */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                    placeholder="jean@exemple.com"
                  />
                </div>
              </div>
              
              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${passwordValid ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${passwordValid ? 'text-green-600' : 'text-gray-500'}`}>
                      Au moins 8 caractères
                    </span>
                  </div>
                )}
              </div>
              
              {/* Confirmer mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 font-light"
                    placeholder="Répétez le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${passwordsMatch ? 'text-green-500' : 'text-red-400'}`} />
                    <span className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Accepter les conditions */}
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2 mt-1"
                />
                <label htmlFor="accept-terms" className="ml-3 text-sm text-gray-600 font-light">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                    Conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                    Politique de confidentialité
                  </Link>
                </label>
              </div>
              
              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading || !passwordsMatch || !passwordValid || !acceptTerms}
                className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-full hover:bg-gray-800 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création du compte...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            {/* Lien de connexion */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-light">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 font-light">
              En créant un compte, vous rejoignez plus de 10 000 agriculteurs qui font confiance à AGRIA
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 