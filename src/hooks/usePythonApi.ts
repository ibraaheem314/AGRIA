import { useState } from 'react';
import axios from 'axios';

// URL de base pour l'API Python, à modifier en production
const BASE_URL = 'http://localhost:8000/api';
const API_TIMEOUT = 10000; // 10 secondes

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (endpoint: string, payload?: any) => Promise<T | null>;
}

export default function usePythonApi<T>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string, payload?: any): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${BASE_URL}/${endpoint}`;
      let response;
      
      if (payload) {
        response = await axios.post(url, payload, {
          timeout: API_TIMEOUT,
          withCredentials: true
        });
      } else {
        response = await axios.get(url, {
          timeout: API_TIMEOUT,
          withCredentials: true
        });
      }
      
      const result = response.data;
      setData(result);
      return result;
    } catch (err) {
      let errorMessage = 'Une erreur s\'est produite';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Délai d\'attente dépassé - Veuillez réessayer';
        } else if (err.response) {
          errorMessage = `Erreur ${err.response.status}: ${err.response.data?.error || err.message}`;
        } else if (err.request) {
          errorMessage = 'Aucune réponse du serveur - Vérifiez votre connexion';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error(`Error fetching from ${endpoint}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchData
  };
} 