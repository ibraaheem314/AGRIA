import { useState } from 'react';

const API_BASE_URL = '/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

/**
 * Hook pour simplifier les interactions avec l'API Python du backend
 * @returns Fonctions pour interagir avec l'API et états associés
 */
export default function usePythonApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any | null>(null);

  /**
   * Effectue un appel API générique
   * @param endpoint - Point de terminaison de l'API
   * @param options - Options de la requête
   * @returns Promise avec les données de réponse
   */
  const apiCall = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { 
      method = 'GET', 
      body = null, 
      headers = {}, 
      withCredentials = true 
    } = options;

    setLoading(true);
    setError(null);

    const requestOptions: RequestInit = {
      method,
      credentials: withCredentials ? 'include' : 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setLastResponse(data);
      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error(`Erreur API (${endpoint}):`, err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effectue une requête GET
   * @param endpoint - Point de terminaison de l'API
   * @param queryParams - Paramètres de requête (optionnels)
   * @returns Promise avec les données de réponse
   */
  const get = async <T>(endpoint: string, queryParams?: Record<string, string | number>): Promise<T> => {
    let url = endpoint;
    
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value.toString());
      });
      url = `${endpoint}?${params.toString()}`;
    }
    
    return apiCall<T>(url);
  };

  /**
   * Effectue une requête POST
   * @param endpoint - Point de terminaison de l'API
   * @param data - Données à envoyer
   * @returns Promise avec les données de réponse
   */
  const post = async <T>(endpoint: string, data: any): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'POST', body: data });
  };

  /**
   * Effectue une requête PUT
   * @param endpoint - Point de terminaison de l'API
   * @param data - Données à envoyer
   * @returns Promise avec les données de réponse
   */
  const put = async <T>(endpoint: string, data: any): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'PUT', body: data });
  };

  /**
   * Effectue une requête DELETE
   * @param endpoint - Point de terminaison de l'API
   * @returns Promise avec les données de réponse
   */
  const del = async <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE' });
  };

  return {
    apiCall,
    get,
    post,
    put,
    del,
    loading,
    error,
    lastResponse
  };
} 