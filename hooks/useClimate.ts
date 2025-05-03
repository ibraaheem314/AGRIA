import { useState, useEffect } from 'react';
import { getClimateData } from '../lib/api/climate';

interface ClimateData {
  soilMoisture: number;
  ndvi: number; // Normalized Difference Vegetation Index
  precipitation: number;
}

/**
 * Hook pour gérer les données climatiques et d'analyse du sol
 * @param coordinates - Tableau de coordonnées pour délimiter la zone d'analyse
 * @returns Objet contenant les données climatiques, l'état de chargement et les fonctions utilitaires
 */
export default function useClimate(coordinates?: number[][]) {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Coordonnées par défaut (région parisienne)
  const defaultCoordinates = [
    [2.2769, 48.8589],
    [2.2769, 48.8719],
    [2.2969, 48.8719],
    [2.2969, 48.8589],
    [2.2769, 48.8589]
  ];

  /**
   * Récupère les données climatiques pour les coordonnées fournies
   */
  const fetchClimateData = async (polygonCoords?: number[][]) => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = polygonCoords || coordinates || defaultCoordinates;
      const data = await getClimateData(coords);
      setClimateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des données climatiques:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtient la catégorie de l'humidité du sol
   */
  const getSoilMoistureCategory = () => {
    if (!climateData) return 'non disponible';
    
    const { soilMoisture } = climateData;
    
    if (soilMoisture < 20) return 'très sec';
    if (soilMoisture < 35) return 'sec';
    if (soilMoisture < 50) return 'modéré';
    if (soilMoisture < 65) return 'humide';
    return 'très humide';
  };

  /**
   * Obtient la catégorie de l'indice NDVI
   */
  const getNDVICategory = () => {
    if (!climateData) return 'non disponible';
    
    const { ndvi } = climateData;
    
    if (ndvi < 0.2) return 'faible végétation';
    if (ndvi < 0.4) return 'végétation modérée';
    if (ndvi < 0.6) return 'végétation saine';
    return 'végétation abondante';
  };

  /**
   * Obtient la catégorie des précipitations
   */
  const getPrecipitationCategory = () => {
    if (!climateData) return 'non disponible';
    
    const { precipitation } = climateData;
    
    if (precipitation < 5) return 'négligeable';
    if (precipitation < 10) return 'légère';
    if (precipitation < 20) return 'modérée';
    return 'importante';
  };

  // Charge les données climatiques au montage du composant
  useEffect(() => {
    fetchClimateData();
  }, [coordinates]);

  return {
    climateData,
    loading,
    error,
    fetchClimateData,
    getSoilMoistureCategory,
    getNDVICategory,
    getPrecipitationCategory
  };
} 