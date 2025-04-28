import { config } from '../config';

interface AirQualityData {
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
  healthImplications: string;
  recommendations: string;
}

// Cache pour stocker les données de qualité d'air par coordonnées
interface AirQualityCache {
  [key: string]: {
    data: AirQualityData;
    timestamp: number;
  };
}

const airQualityCache: AirQualityCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes

export async function getAirQualityData(lat: number, lon: number): Promise<AirQualityData> {
  try {
    // Vérifier le cache
    const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = airQualityCache[cacheKey];
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log('Utilisation des données de qualité d\'air en cache');
      return cached.data;
    }
    
    console.log('Récupération de nouvelles données de qualité d\'air');
    
    // Essayer d'abord l'API OpenWeather pour la qualité de l'air
    try {
      const result = await getOpenWeatherAirQuality(lat, lon);
      
      // Mettre en cache avec horodatage
      airQualityCache[cacheKey] = {
        data: result,
        timestamp: now
      };
      
      return result;
    } catch (openWeatherError) {
      console.warn('OpenWeather air quality failed, trying AirVisual:', openWeatherError);
      
      // Fallback sur AirVisual si OpenWeather échoue
      const result = await getAirVisualData(lat, lon);
      
      // Mettre en cache avec horodatage
      airQualityCache[cacheKey] = {
        data: result,
        timestamp: now
      };
      
      return result;
    }
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
}

// Fonction pour obtenir des données de qualité d'air depuis OpenWeather
async function getOpenWeatherAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(
    `${config.weather.openWeather.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${config.weather.openWeather.apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`Échec de récupération des données d'OpenWeather: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.list || data.list.length === 0) {
    throw new Error('Données de qualité d\'air OpenWeather non disponibles');
  }
  
  const pollutionData = data.list[0];
  const components = pollutionData.components;
  const aqi = pollutionData.main.aqi; // Indice entre 1 et 5
  
  // Convertir l'indice OpenWeather (1-5) en indice AQI (0-500)
  const aqiRanges = {1: 25, 2: 75, 3: 125, 4: 200, 5: 300};
  const aqiUS = aqiRanges[aqi] || 150;
  
  // Déterminer le polluant principal
  const pollutants = {
    "pm2.5": components.pm2_5,
    "pm10": components.pm10,
    "o3": components.o3,
    "no2": components.no2,
    "so2": components.so2,
    "co": components.co
  };
  
  // Seuils selon l'OMS
  const thresholds = {
    "pm2.5": 10,   // OMS: 10 μg/m³
    "pm10": 20,    // OMS: 20 μg/m³
    "o3": 100,     // OMS: 100 μg/m³
    "no2": 40,     // OMS: 40 μg/m³
    "so2": 40,     // OMS: 40 μg/m³
    "co": 4000     // 4000 μg/m³ (approximation)
  };
  
  // Trouver le polluant principal
  let maxRatio = 0;
  let mainPollutant = "pm2.5"; // Par défaut
  
  for (const [poll, value] of Object.entries(pollutants)) {
    const threshold = thresholds[poll];
    if (threshold > 0) {
      const ratio = value / threshold;
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mainPollutant = poll;
      }
    }
  }
  
  const category = getAQICategory(aqiUS);
  
  return {
    aqi: aqiUS,
    mainPollutant,
    category,
    pollutants: {
      pm25: components.pm2_5,
      pm10: components.pm10,
      o3: components.o3,
      no2: components.no2,
      so2: components.so2,
      co: components.co / 1000 // Convertir μg/m³ en mg/m³
    },
    healthImplications: getHealthImplications(aqiUS),
    recommendations: getRecommendations(aqiUS)
  };
}

// Fonction pour obtenir des données de qualité d'air depuis AirVisual
async function getAirVisualData(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(
    `${config.weather.airVisual.baseUrl}/nearest_city?lat=${lat}&lon=${lon}&key=${config.weather.airVisual.apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`Échec de récupération des données d'AirVisual: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.status !== 'success') {
    throw new Error(`Erreur API AirVisual: ${data.data?.message || 'Erreur inconnue'}`);
  }
  
  const pollutionData = data.data.current.pollution;
  const aqi = pollutionData.aqius;
  const category = getAQICategory(aqi);
  
  // AirVisual ne fournit pas directement tous les polluants dans son API gratuite
  // Certaines valeurs sont donc estimées
  return {
    aqi: aqi,
    mainPollutant: pollutionData.mainus || 'pm25',
    category,
    pollutants: {
      pm25: aqi, // Utiliser l'AQI comme approximation
      pm10: pollutionData.aqicn || 0,
      o3: 0,     // Non disponible directement
      no2: 0,    // Non disponible directement
      so2: 0,    // Non disponible directement
      co: 0      // Non disponible directement
    },
    healthImplications: getHealthImplications(aqi),
    recommendations: getRecommendations(aqi)
  };
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getHealthImplications(aqi: number): string {
  if (aqi <= 50) {
    return "Qualité de l'air satisfaisante et pollution atmosphérique posant peu ou pas de risque.";
  } else if (aqi <= 100) {
    return "Qualité de l'air acceptable. Certains polluants peuvent cependant poser un problème de santé pour un très petit nombre de personnes sensibles à la pollution atmosphérique.";
  } else if (aqi <= 150) {
    return "Les personnes appartenant à des groupes sensibles peuvent éprouver des effets sur la santé. Le grand public n'est généralement pas affecté.";
  } else if (aqi <= 200) {
    return "Certains membres du grand public peuvent éprouver des effets sur la santé; les membres de groupes sensibles peuvent ressentir des effets plus graves.";
  } else if (aqi <= 300) {
    return "Avertissements sanitaires des conditions d'urgence. La population entière est davantage susceptible d'être affectée.";
  } else {
    return "Alerte sanitaire: tout le monde peut avoir des effets sur la santé plus graves.";
  }
}

function getRecommendations(aqi: number): string {
  if (aqi <= 50) {
    return "Idéal pour les activités extérieures.";
  } else if (aqi <= 100) {
    return "Les personnes très sensibles devraient envisager de limiter les efforts prolongés en extérieur.";
  } else if (aqi <= 150) {
    return "Les enfants, personnes âgées et personnes atteintes de maladies respiratoires ou cardiaques devraient limiter les efforts prolongés en extérieur.";
  } else if (aqi <= 200) {
    return "Les enfants, personnes âgées et personnes atteintes de maladies respiratoires ou cardiaques devraient éviter les activités extérieures; tout le monde devrait éviter les efforts prolongés.";
  } else if (aqi <= 300) {
    return "Les enfants, personnes âgées et personnes atteintes de maladies respiratoires ou cardiaques devraient éviter toute activité extérieure; tout le monde devrait éviter les efforts en extérieur.";
  } else {
    return "Tout le monde devrait éviter toute activité en extérieur.";
  }
}

// La fonction getSimulatedAirQualityData n'est plus utilisée mais conservée pour référence
function getSimulatedAirQualityData(lat: number, lon: number): AirQualityData {
  // Cette fonction n'est plus appelée
  throw new Error("Les données simulées ne sont plus autorisées");
} 