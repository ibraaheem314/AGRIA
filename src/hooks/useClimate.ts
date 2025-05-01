import { useState, useEffect } from 'react';
import { getClimateData } from '../../lib/api/climate';
import axios from 'axios';

interface ClimateHookResult {
  data: {
    soilMoisture: number;
    ndvi: number;
    precipitation: number;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: (coordinates: number[][]) => Promise<void>;
}

export default function useClimate(initialCoordinates?: number[][]): ClimateHookResult {
  const [data, setData] = useState<ClimateHookResult['data']>(null);
  const [loading, setLoading] = useState<boolean>(!!initialCoordinates);
  const [error, setError] = useState<string | null>(null);

  const fetchClimateData = async (coordinates: number[][]) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Essaie d'abord d'utiliser le service existant
        const climateData = await getClimateData(coordinates);
        setData(climateData);
      } catch (serviceError) {
        // Tenter l'API Flask directement
        try {
          const response = await axios.post('http://localhost:8000/api/climate', {
            polygon: coordinates
          });
          
          if (response.data?.error) {
            throw new Error(response.data.error);
          }
          
          if (response.data) {
            setData({
              soilMoisture: response.data.soilMoisture,
              ndvi: response.data.ndvi,
              precipitation: response.data.precipitation
            });
          } else {
            throw new Error('Données climatiques non disponibles');
          }
        } catch (flaskError) {
          // Propager l'erreur 
          throw flaskError;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Error fetching climate data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCoordinates) {
      fetchClimateData(initialCoordinates);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchClimateData
  };
} 