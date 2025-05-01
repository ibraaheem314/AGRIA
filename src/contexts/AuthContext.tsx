import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'premium';
  createdAt: string;
  farms?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// URL de base pour l'API
const API_URL = 'http://localhost:8000/api';

// Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Token invalide ou expiré
        localStorage.removeItem('auth_token');
        console.error('Failed to validate token:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour l'état utilisateur
      setUser(userData);
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour l'état utilisateur
      setUser(userData);
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Définir les valeurs à fournir au contexte
  const contextValue = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 