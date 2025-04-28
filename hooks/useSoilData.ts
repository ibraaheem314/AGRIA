import { useState, useEffect } from 'react';
import axios from 'axios';

interface SoilDataResult {
  data: {
    ph_level: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organic_matter?: number;
    clay?: number;
    sand?: number;
    recommendations: string[];
  } | null;
  loading: boolean;
  error: string | null;
  refetch: (lat: number, lon: number) => Promise<void>;
}

export default function useSoilData(initialLat?: number, initialLon?: number): SoilDataResult {
  const [data, setData] = useState<SoilDataResult['data']>(null);
  const [loading, setLoading] = useState<boolean>(!!initialLat && !!initialLon);
  const [error, setError] = useState<string | null>(null);

  const fetchSoilData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel direct à l'API Flask
      const response = await axios.get(`http://localhost:8000/api/soil-analysis?lat=${lat}&lon=${lon}`);
      
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      
      if (response.data) {
        setData({
          ph_level: response.data.ph_level,
          nitrogen: response.data.nitrogen,
          phosphorus: response.data.phosphorus,
          potassium: response.data.potassium,
          organic_matter: response.data.organic_matter,
          clay: response.data.clay,
          sand: response.data.sand,
          recommendations: response.data.recommendations
        });
      } else {
        throw new Error('Données d\'analyse de sol non disponibles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Error fetching soil data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLat && initialLon) {
      fetchSoilData(initialLat, initialLon);
    }
  }, [initialLat, initialLon]);

  return {
    data,
    loading,
    error,
    refetch: fetchSoilData
  };
} 