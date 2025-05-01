import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Si le processus de vérification d'authentification est en cours, afficher un spinner
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0c1412] to-[#0c1816]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  // en conservant l'URL d'origine pour pouvoir y retourner après connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute; 