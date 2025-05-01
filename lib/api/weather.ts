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

// Constantes pour les coordonnées de Paris
const PARIS_LAT = 48.8566;
const PARIS_LON = 2.3522;
const PARIS_RADIUS = 0.05; // Rayon approximatif pour considérer que les coordonnées sont à Paris

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
    // Vérifier si la clé API est disponible et valide
    const apiKey = config.weather.openWeather.apiKey;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      console.warn('OpenWeatherMap API key is missing or invalid. Using simulated data.');
      return getSimulatedWeatherData(lat, lon);
    }
    
    console.log(`Using API key: ${apiKey.substring(0, 5)}...`);
    
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
  
    if (!response.ok) {
      console.warn(`Échec de récupération des données météo: ${response.status} ${response.statusText}`);
      return getSimulatedWeatherData(lat, lon);
    }

    const data = await response.json();
    console.log('Weather API response received:', data);
  
    // Vérifier si les coordonnées sont proches de Paris
    const isParis = isNearParis(lat, lon);
    
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
      // Utiliser "Paris" si on est dans le rayon de Paris, sinon utiliser le nom retourné par l'API
      cityName: isParis ? "Paris" : data.name
    };
    
    // Mettre dans le cache avec horodatage
    weatherCache[cacheKey] = {
      data: result,
      timestamp: now
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getSimulatedWeatherData(lat, lon);
  }
}

// Fonction pour vérifier si les coordonnées sont proches de Paris
function isNearParis(lat: number, lon: number): boolean {
  // Calculer la distance euclidienne entre les coordonnées et le centre de Paris
  const latDiff = Math.abs(lat - PARIS_LAT);
  const lonDiff = Math.abs(lon - PARIS_LON);
  
  // Si la distance est inférieure au rayon défini, considérer que c'est Paris
  return latDiff < PARIS_RADIUS && lonDiff < PARIS_RADIUS;
}

// Nouvelle fonction pour obtenir les prévisions sur 5 jours
export async function getForecastData(lat: number, lon: number): Promise<any> {
  try {
    // Vérifier si la clé API est disponible et valide
    const apiKey = config.weather.openWeather.apiKey;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      console.warn('OpenWeatherMap API key is missing or invalid. Using simulated forecast data.');
      return getSimulatedForecastData(lat, lon);
    }
    
    console.log(`Using API key for forecast: ${apiKey.substring(0, 5)}...`);
    
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      console.warn(`Échec de récupération des prévisions: ${response.status} ${response.statusText}`);
      return getSimulatedForecastData(lat, lon);
    }

    const data = await response.json();
    console.log('Forecast API response received');
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return getSimulatedForecastData(lat, lon);
  }
}

// Nouvelle fonction pour obtenir les données historiques
export async function getHistoricalWeatherData(lat: number, lon: number, dt: number): Promise<any> {
  try {
    // Vérifier si la clé API est disponible
    if (!config.weather.openWeather.apiKey || config.weather.openWeather.apiKey === 'your_openweather_api_key_here') {
      console.warn('OpenWeatherMap API key is missing or invalid. Using simulated historical data.');
      return { current: getSimulatedWeatherData(lat, lon) };
    }
    
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=metric&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      console.warn(`Échec de récupération des données historiques: ${response.status} ${response.statusText}`);
      return { current: getSimulatedWeatherData(lat, lon) };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    return { current: getSimulatedWeatherData(lat, lon) };
  }
}

// Nouvelle fonction pour obtenir l'indice UV
export async function getUVIndex(lat: number, lon: number): Promise<number> {
  try {
    // Vérifier si la clé API est disponible
    if (!config.weather.openWeather.apiKey || config.weather.openWeather.apiKey === 'your_openweather_api_key_here') {
      console.warn('OpenWeatherMap API key is missing or invalid. Using simulated UV index.');
      return Math.floor(Math.random() * 11);
    }
    
    const response = await fetch(
      `${config.weather.openWeather.baseUrl}/uvi?lat=${lat}&lon=${lon}&appid=${config.weather.openWeather.apiKey}`
    );
    
    if (!response.ok) {
      console.warn(`Échec de récupération de l'indice UV: ${response.status} ${response.statusText}`);
      return Math.floor(Math.random() * 11);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching UV index:', error);
    return Math.floor(Math.random() * 11);
  }
}

// Fonction pour générer des données météo simulées
function getSimulatedWeatherData(lat: number, lon: number): WeatherData {
  const weatherOptions = [
    'clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 
    'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'
  ];
  const iconOptions = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
  const now = new Date();
  const sunriseDate = new Date(now);
  const sunsetDate = new Date(now);
  
  // Set sunrise to approximately 6 AM
  sunriseDate.setHours(6, 0, 0, 0);
  
  // Set sunset to approximately 8 PM
  sunsetDate.setHours(20, 0, 0, 0);
  
  const weatherIndex = Math.floor(Math.random() * weatherOptions.length);
  
  return {
    temperature: 15 + Math.random() * 20, // Between 15 and 35
    humidity: 30 + Math.floor(Math.random() * 60), // Between 30% and 90%
    windSpeed: 1 + Math.random() * 9, // Between 1 and 10 m/s
    description: weatherOptions[weatherIndex],
    icon: iconOptions[weatherIndex],
    feelsLike: 15 + Math.random() * 18, // Similar to temperature
    pressure: 1000 + Math.floor(Math.random() * 30), // Around 1000-1030 hPa
    visibility: 7000 + Math.floor(Math.random() * 3000), // Around 7-10 km
    clouds: Math.floor(Math.random() * 100), // 0-100%
    sunrise: Math.floor(sunriseDate.getTime() / 1000),
    sunset: Math.floor(sunsetDate.getTime() / 1000),
    windDirection: Math.floor(Math.random() * 360), // 0-359 degrees
    rain1h: Math.random() > 0.7 ? Math.random() * 5 : undefined,
    snow1h: Math.random() > 0.9 ? Math.random() * 3 : undefined,
    country: 'Demo',
    cityName: lat.toFixed(2) + ',' + lon.toFixed(2)
  };
}

// Fonction pour générer des données de prévisions simulées
function getSimulatedForecastData(lat: number, lon: number): any {
  const weatherOptions = [
    'clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 
    'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'
  ];
  const iconOptions = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
  const now = new Date();
  const list = [];
  
  // Create 5 days forecast with data every 3 hours (40 entries)
  for (let i = 0; i < 40; i++) {
    const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const weatherIndex = Math.floor(Math.random() * weatherOptions.length);
    const isDay = forecastTime.getHours() >= 6 && forecastTime.getHours() <= 18;
    const iconSuffix = isDay ? 'd' : 'n';
    
    list.push({
      dt: Math.floor(forecastTime.getTime() / 1000),
      main: {
        temp: 15 + Math.sin(i/5) * 10 + Math.random() * 5,
        feels_like: 15 + Math.sin(i/5) * 9 + Math.random() * 4,
        temp_min: 15 + Math.sin(i/5) * 8,
        temp_max: 15 + Math.sin(i/5) * 12,
        pressure: 1010 + Math.floor(Math.random() * 10),
        humidity: 40 + Math.floor(Math.random() * 40)
      },
      weather: [{
        id: 800 + weatherIndex,
        main: weatherOptions[weatherIndex].split(' ')[0].charAt(0).toUpperCase() + 
          weatherOptions[weatherIndex].split(' ')[0].slice(1),
        description: weatherOptions[weatherIndex],
        icon: iconOptions[weatherIndex].substring(0, 2) + iconSuffix
      }],
      clouds: {
        all: Math.floor(Math.random() * 100)
      },
      wind: {
        speed: 2 + Math.random() * 8,
        deg: Math.floor(Math.random() * 360)
      },
      visibility: 8000 + Math.floor(Math.random() * 2000),
      pop: Math.random(),
      dt_txt: forecastTime.toISOString().split('.')[0].replace('T', ' ')
    });
  }
  
  return {
    list: list,
    city: {
      id: 12345,
      name: 'Demo City',
      country: 'Demo',
      sunrise: Math.floor(new Date(now.setHours(6, 0, 0, 0)).getTime() / 1000),
      sunset: Math.floor(new Date(now.setHours(20, 0, 0, 0)).getTime() / 1000)
    }
  };
}