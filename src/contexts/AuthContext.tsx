import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
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

// URL de base pour l'API avec gestion d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// Configuration axios avec intercepteur pour gestion d'erreurs
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour ajouter automatiquement le token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      window.location.reload(); // Refresh pour déclencher la déconnexion
    }
    return Promise.reject(error);
  }
);

// Provider component optimisé
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction de nettoyage d'erreur optimisée
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction de déconnexion optimisée
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  }, []);

  // Vérifier le token au chargement avec gestion d'erreurs améliorée
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await apiClient.get('/auth/me');
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Token invalide ou expiré
        localStorage.removeItem('auth_token');
        console.error('Failed to validate token:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status !== 401) {
            setError('Erreur de connexion au serveur');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fonction de connexion optimisée avec gestion d'erreurs détaillée
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Réponse du serveur invalide');
      }
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour l'état utilisateur
      setUser(userData);
      
      return true;
    } catch (err: any) {
      let errorMessage = 'Erreur de connexion';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Erreur du serveur, veuillez réessayer plus tard';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Connexion timeout, vérifiez votre connexion internet';
        } else if (!err.response) {
          errorMessage = 'Impossible de contacter le serveur';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction d'inscription optimisée avec validation côté client
  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Validation côté client pour feedback immédiat
    if (!name.trim() || name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      setIsLoading(false);
      return false;
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format d\'email invalide');
      setIsLoading(false);
      return false;
    }
    
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return false;
    }
    
    try {
      const response = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Réponse du serveur invalide');
      }
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour l'état utilisateur
      setUser(userData);
      
      return true;
    } catch (err: any) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 409) {
          errorMessage = 'Cet email est déjà utilisé';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Erreur du serveur, veuillez réessayer plus tard';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Connexion timeout, vérifiez votre connexion internet';
        } else if (!err.response) {
          errorMessage = 'Impossible de contacter le serveur';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mémoïsation de la valeur du contexte pour éviter les re-renders inutiles
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError
  }), [user, isLoading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé optimisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 