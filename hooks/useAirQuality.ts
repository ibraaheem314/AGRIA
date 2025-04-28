import { useState, useEffect } from 'react';
import { getAirQualityData } from '../lib/api/airQuality';
import axios from 'axios';

interface AirQualityHookResult {
  data: {
    aqi: number;
    mainPollutant: string;
    category: string;
    pollutants: {
      pm25: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
      co: number;
    };
  } | null;
  loading: boolean;
  error: string | null;
  refetch: (lat: number, lon: number) => Promise<void>;
}

export default function useAirQuality(initialLat?: number, initialLon?: number): AirQualityHookResult {
  const [data, setData] = useState<AirQualityHookResult['data']>(null);
  const [loading, setLoading] = useState<boolean>(!!initialLat && !!initialLon);
  const [error, setError] = useState<string | null>(null);

  const fetchAirQuality = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Essaie d'abord d'utiliser le service existant
        const airQualityData = await getAirQualityData(lat, lon);
        setData(airQualityData);
      } catch (serviceError) {
        // Tenter l'API Flask directement
        try {
          const response = await axios.get(`http://localhost:8000/api/airquality?lat=${lat}&lon=${lon}`);
          
          if (response.data?.error) {
            throw new Error(response.data.error);
          }
          
          if (response.data) {
            setData({
              aqi: response.data.aqi,
              mainPollutant: response.data.mainPollutant,
              category: response.data.category,
              pollutants: response.data.pollutants
            });
          } else {
            throw new Error('Données de qualité de l\'air non disponibles');
          }
        } catch (flaskError) {
          // Propager l'erreur
          throw flaskError;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Error fetching air quality data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLat && initialLon) {
      fetchAirQuality(initialLat, initialLon);
    }
  }, [initialLat, initialLon]);

  return {
    data,
    loading,
    error,
    refetch: fetchAirQuality
  };
} 