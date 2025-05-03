import { useState, useEffect } from 'react';
import usePythonApi from './usePythonApi';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

/**
 * Hook pour gérer l'authentification des utilisateurs
 * @returns Fonctions d'authentification et état de l'utilisateur
 */
export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const api = usePythonApi();

  // Initialiser l'authentification
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Récupérer le token du stockage local
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          await fetchUserProfile(storedToken);
        }
      } catch (err) {
        console.error('Erreur d\'initialisation de l\'authentification:', err);
        // En cas d'erreur, réinitialiser l'authentification
        logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    if (!initialized) {
      initAuth();
    }
  }, [initialized]);

  /**
   * Récupère le profil de l'utilisateur avec le token
   * @param authToken - Token d'authentification
   */
  const fetchUserProfile = async (authToken: string) => {
    try {
      const userData = await api.get<User>('auth/profile', undefined, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setUser(userData);
    } catch (err) {
      throw new Error('Failed to fetch user profile');
    }
  };

  /**
   * Connecte un utilisateur avec ses identifiants
   * @param credentials - Email et mot de passe
   * @returns Promise avec les données utilisateur
   */
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('auth/login', credentials);
      
      // Stocker le token et configurer l'utilisateur
      setToken(response.token);
      setUser(response.user);
      
      // Enregistrer le token dans le stockage local
      localStorage.setItem('authToken', response.token);
      
      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscrit un nouvel utilisateur
   * @param userData - Données d'inscription
   * @returns Promise avec les données utilisateur
   */
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('auth/register', userData);
      
      // Stocker le token et configurer l'utilisateur
      setToken(response.token);
      setUser(response.user);
      
      // Enregistrer le token dans le stockage local
      localStorage.setItem('authToken', response.token);
      
      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  const isAuthenticated = (): boolean => {
    return !!user && !!token;
  };

  /**
   * Obtient les en-têtes d'autorisation pour les requêtes API
   */
  const getAuthHeaders = (): Record<string, string> => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getAuthHeaders
  };
} 