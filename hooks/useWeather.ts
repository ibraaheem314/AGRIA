import { useState, useEffect } from 'react';
import { getWeatherData, getForecastData } from '../lib/api/weather';

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

/**
 * Hook pour gérer les données météorologiques
 * @param lat - Latitude de l'emplacement
 * @param lon - Longitude de l'emplacement
 * @returns Objet contenant les données météo, prévisions et fonctions utilitaires
 */
export default function useWeather(lat?: number, lon?: number) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Coordonnées par défaut (Paris)
  const defaultLat = 48.8566;
  const defaultLon = 2.3522;

  /**
   * Récupère les données météo pour les coordonnées fournies
   */
  const fetchWeatherData = async (latitude?: number, longitude?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const targetLat = latitude || lat || defaultLat;
      const targetLon = longitude || lon || defaultLon;
      
      const data = await getWeatherData(targetLat, targetLon);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des données météo:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère les prévisions météo pour les coordonnées fournies
   */
  const fetchForecastData = async (latitude?: number, longitude?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const targetLat = latitude || lat || defaultLat;
      const targetLon = longitude || lon || defaultLon;
      
      const data = await getForecastData(targetLat, targetLon);
      setForecastData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des prévisions:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère à la fois les données météo actuelles et les prévisions
   */
  const fetchAllWeatherData = async (latitude?: number, longitude?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const targetLat = latitude || lat || defaultLat;
      const targetLon = longitude || lon || defaultLon;
      
      const [weatherResult, forecastResult] = await Promise.all([
        getWeatherData(targetLat, targetLon),
        getForecastData(targetLat, targetLon)
      ]);
      
      setWeatherData(weatherResult);
      setForecastData(forecastResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des données météo:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formate l'heure depuis un timestamp UNIX
   */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Détermine si c'est actuellement le jour ou la nuit
   */
  const isDaytime = () => {
    if (!weatherData) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return now > weatherData.sunrise && now < weatherData.sunset;
  };

  /**
   * Obtient la classe d'icône pour la direction du vent
   */
  const getWindDirectionClass = () => {
    if (!weatherData) return '';
    
    const direction = weatherData.windDirection;
    
    // Convertir l'angle en classe (N, NE, E, SE, S, SW, W, NW)
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((direction % 360) / 45) % 8;
    
    return `wind-${directions[index]}`;
  };

  // Charge les données météo au montage du composant ou lorsque lat/lon changent
  useEffect(() => {
    fetchWeatherData();
    // Optionnel: décommenter pour charger également les prévisions
    // fetchForecastData();
  }, [lat, lon]);

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeatherData,
    fetchForecastData,
    fetchAllWeatherData,
    formatTime,
    isDaytime,
    getWindDirectionClass
  };
} 