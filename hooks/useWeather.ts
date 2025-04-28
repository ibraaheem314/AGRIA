import { useState, useEffect } from 'react';
import { getWeatherData, getForecastData } from '../lib/api/weather';
import axios from 'axios';

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

interface Forecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    rain?: {
      '3h'?: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherHookResult {
  data: WeatherData | null;
  forecast: Forecast | null;
  loading: boolean;
  error: string | null;
  refetch: (lat: number, lon: number) => Promise<void>;
}

export default function useWeather(initialLat?: number, initialLon?: number): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialLat && !!initialLon);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather
      try {
        // Essaie d'abord d'utiliser le service existant
        const weatherData = await getWeatherData(lat, lon);
        setData(weatherData);
        
        // Récupérer les prévisions
        try {
          const forecastData = await getForecastData(lat, lon);
          setForecast(forecastData);
        } catch (forecastError) {
          console.warn('Failed to fetch forecast:', forecastError);
          // On continue même si les prévisions échouent
        }
      } catch (serviceError) {
        console.warn('Weather API service failed, trying Flask API:', serviceError);
        
        // Tenter l'API Flask directement
        try {
          const response = await axios.get(`http://localhost:8000/api/weather?lat=${lat}&lon=${lon}`);
          
          if (response.data?.error) {
            throw new Error(response.data.error);
          }
          
          if (response.data) {
            // Adapter le format de l'API Flask au format attendu
            setData({
              temperature: response.data.temperature,
              humidity: response.data.humidity,
              windSpeed: response.data.windSpeed,
              description: response.data.description,
              icon: 'unknown', // L'API Flask ne fournit pas cette information
              feelsLike: response.data.temperature - 1, // Approximation
              pressure: 1013, // Valeur par défaut
              visibility: 10000, // Valeur par défaut (10 km)
              clouds: 0, // Valeur par défaut
              sunrise: Math.floor(Date.now() / 1000) - 3600, // Approximation
              sunset: Math.floor(Date.now() / 1000) + 43200, // Approximation
              windDirection: 0, // Valeur par défaut
              country: 'Unknown',
              cityName: 'Unknown'
            });
          } else {
            throw new Error('Données météo non disponibles');
          }
        } catch (flaskError) {
          // Propager l'erreur
          throw flaskError;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Error fetching weather data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLat && initialLon) {
      fetchWeather(initialLat, initialLon);
    }
  }, [initialLat, initialLon]);

  return {
    data,
    forecast,
    loading,
    error,
    refetch: fetchWeather
  };
}
