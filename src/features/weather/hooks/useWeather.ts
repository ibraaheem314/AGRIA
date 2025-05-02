import { useState, useEffect } from 'react';
import { getWeatherData, getForecastData } from '../services/weatherAPI';
import axios from 'axios';
import { config } from '../../lib/config';

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

interface WeatherLocation {
  lat: number;
  lon: number;
}

interface WeatherHookResult {
  data: WeatherData | null;
  forecast: Forecast | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Fonction pour générer des données météo simulées
function getSimulatedWeatherData(lat: number, lon: number): WeatherData {
  console.log('Generating simulated weather data');
  const now = Date.now();
  const sunriseDate = new Date();
  sunriseDate.setHours(6, 0, 0, 0);
  const sunsetDate = new Date();
  sunsetDate.setHours(20, 0, 0, 0);
  
  return {
    temperature: 15 + Math.random() * 10,
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: 1 + Math.random() * 9,
    description: "ciel partiellement nuageux",
    icon: "50d",
    feelsLike: 14 + Math.random() * 10,
    pressure: 1010 + Math.floor(Math.random() * 20),
    visibility: 8000 + Math.floor(Math.random() * 2000),
    clouds: Math.floor(Math.random() * 100),
    sunrise: Math.floor(sunriseDate.getTime() / 1000),
    sunset: Math.floor(sunsetDate.getTime() / 1000),
    windDirection: Math.floor(Math.random() * 360),
    rain1h: Math.random() > 0.7 ? Math.random() * 5 : undefined,
    country: "FR",
    cityName: lat && lon ? `${lat.toFixed(2)}, ${lon.toFixed(2)}` : "Paris"
  };
}

// Fonction pour générer des prévisions simulées
function getSimulatedForecastData(lat: number, lon: number): any {
  console.log('Generating simulated forecast data');
  const now = Date.now();
  const list = [];
  
  // Créer 8 prévisions par tranches de 3 heures
  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now + i * 3 * 60 * 60 * 1000);
    
    list.push({
      dt: Math.floor(forecastTime.getTime() / 1000),
      main: {
        temp: 15 + Math.sin(i/4) * 5 + Math.random() * 3,
        feels_like: 14 + Math.sin(i/4) * 5 + Math.random() * 3,
        humidity: 40 + Math.floor(Math.random() * 40)
      },
      weather: [{
        id: 800 + Math.floor(Math.random() * 30),
        main: "Clouds",
        description: "nuages épars",
        icon: "03d"
      }],
      clouds: {
        all: Math.floor(Math.random() * 100)
      },
      wind: {
        speed: 2 + Math.random() * 8,
        deg: Math.floor(Math.random() * 360)
      },
      pop: Math.random(),
      dt_txt: forecastTime.toISOString().split('.')[0].replace('T', ' ')
    });
  }
  
  return {
    list: list,
    city: {
      name: "Paris",
      country: "FR",
      sunrise: Math.floor(new Date().setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(new Date().setHours(20, 0, 0, 0) / 1000)
    }
  };
}

export default function useWeather(location: WeatherLocation): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await getWeatherData(location.lat, location.lon);
      setData(weatherData);
      
      // Get forecast data
      try {
        console.log('Trying to get forecast data from API');
        const forecastData = await getForecastData(location.lat, location.lon);
        console.log('Forecast data fetched successfully');
        setForecast(forecastData);
      } catch (forecastError) {
        console.warn('Failed to fetch forecast, using simulated data:', forecastError);
        setForecast(getSimulatedForecastData(location.lat, location.lon));
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to load weather data. Please try again later.');
      
      // Toujours fournir des données simulées pour éviter une page vide
      setData(getSimulatedWeatherData(location.lat, location.lon));
      setForecast(getSimulatedForecastData(location.lat, location.lon));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location.lat, location.lon]);

  return {
    data,
    forecast,
    loading,
    error,
    refetch: fetchWeatherData
  };
} 