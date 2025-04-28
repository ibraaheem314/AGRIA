import { config } from '../config';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  windDirection: number;
  rain1h?: number;
  snow1h?: number;
  country: string;
  cityName: string;
}

// Cache pour stocker les données météo
interface WeatherCache {
  [key: string]: {
    data: WeatherData;
    timestamp: number;
  };
}

const weatherCache: WeatherCache = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes en millisecondes

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Vérifier le cache - utiliser les données mises en cache si elles existent et sont récentes
    const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = weatherCache[cacheKey];
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log('Utilisation des données météo en cache');
      return cached.data;
    }
    
    console.log('Récupération de nouvelles données météo');
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Échec de récupération des données météo: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const result = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      feelsLike: data.main.feels_like,
      pressure: data.main.pressure,
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      windDirection: data.wind.deg,
      rain1h: data.rain?.['1h'],
      snow1h: data.snow?.['1h'],
      country: data.sys.country,
      cityName: data.name
    };
    
    // Mettre dans le cache avec horodatage
    weatherCache[cacheKey] = {
      data: result,
      timestamp: now
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Nouvelle fonction pour obtenir les prévisions sur 5 jours
export async function getForecastData(lat: number, lon: number): Promise<any> {
  try {
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Échec de récupération des prévisions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}

// Nouvelle fonction pour obtenir les données historiques
export async function getHistoricalWeatherData(lat: number, lon: number, dt: number): Promise<any> {
  try {
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=metric&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Échec de récupération des données historiques: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    throw error;
  }
}

// Nouvelle fonction pour obtenir l'indice UV
export async function getUVIndex(lat: number, lon: number): Promise<number> {
  try {
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/uvi?lat=${lat}&lon=${lon}&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Échec de récupération de l'indice UV: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching UV index:', error);
    throw error;
  }
}

// Fonction de repli pour générer des données météo simulées - n'est plus utilisée
function getSimulatedWeatherData(lat: number, lon: number): WeatherData {
  // Cette fonction n'est plus appelée
  throw new Error("Les données simulées ne sont plus autorisées");
}