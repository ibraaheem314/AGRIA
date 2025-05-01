import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };
  
  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1412] to-[#0c1816] flex flex-col">
      {/* Fond avec motif de grille */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%236ce89f\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>
      
      {/* Élément décoratif - cercle lumineux */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary opacity-10 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-1/4 right-1/4 w-1/2 h-1/2 bg-blue-500 opacity-10 blur-[150px] rounded-full"></div>
      
      {/* Header */}
      <header className="py-8 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="flex justify-center lg:justify-start">
            <a href="/" className="flex items-center">
              <img src="/logo.svg" alt="AgriTech Logo" className="h-8" />
              <span className="ml-2 text-xl font-bold text-white">AgriTech</span>
            </a>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {showRegister ? (
            <RegisterForm 
              onSuccess={handleRegisterSuccess} 
              onLoginClick={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm 
              onSuccess={handleLoginSuccess} 
              onRegisterClick={() => setShowRegister(true)}
            />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-neutral-500 text-sm relative z-10">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} AgriTech. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login; 