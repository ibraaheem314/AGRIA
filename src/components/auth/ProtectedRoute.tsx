import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Mode démonstration activé - permettre l'accès à toutes les routes pour la démo
  const isDemoMode = true; // Toujours en mode démonstration pour faciliter l'accès
  
  // Si le processus de vérification d'authentification est en cours, afficher un spinner
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-dark to-darker">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas authentifié et que nous ne sommes pas en mode démo,
  // rediriger vers la page de connexion en conservant l'URL d'origine
  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si l'utilisateur est authentifié ou en mode démo, afficher le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute; 