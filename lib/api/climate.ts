import { config } from '../config';

interface ClimateData {
  soilMoisture: number;
  ndvi: number; // Normalized Difference Vegetation Index
  precipitation: number;
}

// Cache pour les données
let cachedClimateData: ClimateData | null = null;

export async function getClimateData(polygonCoordinates: number[][]): Promise<ClimateData> {
  try {
    // Vérifier si la clé API est disponible
    if (!config.climate.apiKey || config.climate.apiKey === 'your_agromonitoring_api_key_here') {
      console.warn('Agromonitoring API key is missing or invalid. Using simulated climate data.');
      return getSimulatedClimateData();
    }
    
    const response = await fetch(`${config.climate.baseUrl}/soil?polyid=demo&appid=${config.climate.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        polygon: polygonCoordinates
      })
    });

    if (!response.ok) {
      console.warn(`Échec de récupération des données climatiques: ${response.status} ${response.statusText}`);
      return getSimulatedClimateData();
    }

    const data = await response.json();
    
    const result = {
      soilMoisture: data.moisture || 0,
      ndvi: data.ndvi || 0,
      precipitation: data.precipitation || 0
    };
    
    // Mettre à jour le cache avec les données réelles
    cachedClimateData = result;
    return result;
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return getSimulatedClimateData();
  }
}

// Fonction pour générer des données simulées
function getSimulatedClimateData(): ClimateData {
  // Générer des données réalistes pour l'humidité du sol (20-60%)
  const soilMoisture = 20 + Math.random() * 40;
  
  // NDVI entre 0.3 et 0.8 (végétation saine)
  const ndvi = 0.3 + Math.random() * 0.5;
  
  // Précipitations récentes entre 0 et 30mm
  const precipitation = Math.random() * 30;
  
  return {
    soilMoisture: parseFloat(soilMoisture.toFixed(1)),
    ndvi: parseFloat(ndvi.toFixed(2)),
    precipitation: parseFloat(precipitation.toFixed(1))
  };
}