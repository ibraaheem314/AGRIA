import { useState, useEffect } from 'react';
import { getClimateData } from '../services/climateAPI';

type Coordinates = [number, number][];

interface ClimateHookResult {
  data: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useClimate(polygonCoordinates: Coordinates): ClimateHookResult {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClimateData = async () => {
    try {
      setLoading(true);
      setError(null);
      const climateData = await getClimateData(polygonCoordinates);
      setData(climateData);
    } catch (err) {
      console.error('Error fetching climate data:', err);
      setError('Failed to load climate data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimateData();
  }, [JSON.stringify(polygonCoordinates)]);

  return {
    data,
    loading,
    error,
    refetch: fetchClimateData
  };
} 