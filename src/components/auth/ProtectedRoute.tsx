import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Mode démonstration désactivé - authentification requise pour l'accès à l'IA
  const isDemoMode = false;
  
  // Si le processus de vérification d'authentification est en cours, afficher un spinner
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute; 