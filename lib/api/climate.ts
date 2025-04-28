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
      throw new Error(`Échec de récupération des données climatiques: ${response.status} ${response.statusText}`);
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
    throw error; // Propager l'erreur au lieu de renvoyer des données simulées
  }
}

// Fonction de repli pour générer des données simulées - n'est plus utilisée
function getSimulatedClimateData(): ClimateData {
  // Cette fonction n'est plus appelée
  throw new Error("Les données simulées ne sont plus autorisées");
}