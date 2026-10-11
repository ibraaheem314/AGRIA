import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  Wind, 
  Search, 
  X, 
  Loader,
  MapPin,
  Sun,
  Thermometer,
  Umbrella,
  CloudLightning,
  Sunrise,
  Sunset,
  BarChart2,
  Eye,
  Gauge,
  Navigation,
  Activity,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { config } from '../lib/config';

// Composants météo - remplacés par des placeholders simples

// Interface pour les données météo
interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  clouds: number;
  sunrise: number;
  sunset: number;
  cityName: string;
  country: string;
  rain1h?: number;
  visibility?: number;
}

interface ForecastItem {
  dt: number;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  pop: number;
}

const WeatherPage = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [city, setCity] = useState<{name: string; lat: number; lon: number}>({
    name: 'Paris',
    lat: 48.8566,
    lon: 2.3522
  });
  
  const weatherApiKey = config.weather.openWeather.apiKey;
  const isApiConfigured = weatherApiKey && weatherApiKey !== 'VOTRE_CLE_ICI' && weatherApiKey.length > 10;
  
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si pas de clé API, utiliser des données simulées
      if (!weatherApiKey || weatherApiKey === 'VOTRE_CLE_ICI') {
        // Données simulées pour demo
        const simulatedWeatherData: WeatherData = {
          temperature: 18,
          feelsLike: 20,
          humidity: 65,
          pressure: 1013,
          windSpeed: 2.5,
          windDirection: 180,
          description: 'partiellement nuageux',
          icon: '02d',
          clouds: 40,
          sunrise: Math.floor(Date.now() / 1000) - 3600 * 2,
          sunset: Math.floor(Date.now() / 1000) + 3600 * 8,
          cityName: 'Paris',
          country: 'FR',
          rain1h: 0,
          visibility: 10000
        };
        
        setWeatherData(simulatedWeatherData);
        
        // Prévisions simulées
        const simulatedForecast: ForecastItem[] = Array.from({length: 8}, (_, i) => ({
          dt: Math.floor(Date.now() / 1000) + i * 3600 * 3,
          temp: 15 + Math.random() * 10,
          description: 'ensoleillé',
          icon: '01d',
          humidity: 60 + Math.random() * 20,
          pop: Math.random() * 0.3
        }));
        
        setForecast(simulatedForecast);
        setLoading(false);
        return;
      }
      
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${weatherApiKey}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Impossible de récupérer les données météo');
      }
      
      const weatherJson = await weatherResponse.json();
      
      const processedWeatherData: WeatherData = {
        temperature: Math.round(weatherJson.main.temp),
        feelsLike: Math.round(weatherJson.main.feels_like),
        humidity: weatherJson.main.humidity,
        pressure: weatherJson.main.pressure,
        windSpeed: weatherJson.wind?.speed || 0,
        windDirection: weatherJson.wind?.deg || 0,
        description: weatherJson.weather[0].description,
        icon: weatherJson.weather[0].icon,
        clouds: weatherJson.clouds.all,
        sunrise: weatherJson.sys.sunrise,
        sunset: weatherJson.sys.sunset,
        cityName: weatherJson.name,
        country: weatherJson.sys.country,
        rain1h: weatherJson.rain?.['1h'],
        visibility: weatherJson.visibility
      };
      
      setWeatherData(processedWeatherData);
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${weatherApiKey}`
      );
      
      if (forecastResponse.ok) {
      const forecastJson = await forecastResponse.json();
        const processedForecast: ForecastItem[] = forecastJson.list.slice(0, 8).map((item: any) => ({
        dt: item.dt,
          temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        pop: item.pop
      }));
        setForecast(processedForecast);
      }
    } catch (err) {
      console.error('Weather API Error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Géolocalisation automatique au démarrage
    const initializeLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setCity({
              name: 'Ma position',
              lat,
              lon
            });
          },
          (error) => {
            console.log('Géolocalisation échouée, utilisation de Paris par défaut');
            // Fallback sur Paris si géolocalisation échoue
            fetchWeatherData();
          }
        );
      } else {
        // Pas de géolocalisation disponible, utiliser Paris
        fetchWeatherData();
      }
    };

    initializeLocation();
  }, []); // Exécuter une seule fois au montage
  
  useEffect(() => {
    fetchWeatherData();
  }, [city]);
  
  // Fonction de recherche de ville
  const searchCity = async (query: string) => {
    if (!query.trim() || !isApiConfigured) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${weatherApiKey}`
      );
      
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Gérer la sélection d'une ville
  const selectCity = (selectedCity: any) => {
    setCity({
      name: selectedCity.name,
      lat: selectedCity.lat,
      lon: selectedCity.lon
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Gérer la saisie dans le champ de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Déclencher la recherche après 300ms de pause dans la saisie
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      if (value.trim().length >= 2) {
        searchCity(value);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCity({
            name: 'Ma position',
            lat,
            lon
          });
          setError(null);
        },
        (error) => {
          setError('Impossible d\'obtenir votre position actuelle');
          setLoading(false);
        }
      );
    } else {
      setError('La géolocalisation n\'est pas prise en charge');
    }
  };

  const getDayProgress = () => {
    if (!weatherData) return 50;
    const now = Math.floor(Date.now() / 1000);
    const dayLength = weatherData.sunset - weatherData.sunrise;
    const elapsed = now - weatherData.sunrise;
    
    if (now < weatherData.sunrise || now > weatherData.sunset) {
      return now < weatherData.sunrise ? 0 : 100;
    }
    return Math.min(100, Math.max(0, (elapsed / dayLength) * 100));
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherIcon = (iconCode: string, size: number = 24) => {
    const iconMap: { [key: string]: JSX.Element } = {
      '01d': <Sun className="text-yellow-400" size={size} />,
      '01n': <Sun className="text-yellow-300 opacity-80" size={size} />,
      '02d': <Cloud className="text-gray-400" size={size} />,
      '02n': <Cloud className="text-gray-400" size={size} />,
      '03d': <Cloud className="text-gray-400" size={size} />,
      '03n': <Cloud className="text-gray-400" size={size} />,
      '04d': <Cloud className="text-gray-400" size={size} />,
      '04n': <Cloud className="text-gray-400" size={size} />,
      '09d': <CloudRain className="text-blue-400" size={size} />,
      '09n': <CloudRain className="text-blue-400" size={size} />,
      '10d': <CloudRain className="text-blue-400" size={size} />,
      '10n': <CloudRain className="text-blue-400" size={size} />,
      '11d': <CloudLightning className="text-purple-400" size={size} />,
      '11n': <CloudLightning className="text-purple-400" size={size} />,
      '13d': <Cloud className="text-blue-200" size={size} />,
      '13n': <Cloud className="text-blue-200" size={size} />,
      '50d': <Cloud className="text-gray-400" size={size} />,
      '50n': <Cloud className="text-gray-400" size={size} />
    };
    return iconMap[iconCode] || <Cloud className="text-gray-400" size={size} />;
  };
  
  const quickActions = [
    {
      icon: <Navigation className="w-5 h-5" />,
      title: "Ma position",
      description: "Localiser automatiquement",
      color: "blue",
      action: getCurrentLocation
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Rechercher ville",
      description: isApiConfigured ? "Trouver une nouvelle ville" : "Mode simulation uniquement",
      color: "green",
      action: () => {
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!isApiConfigured) {
          alert('🌍 Recherche de ville nécessite une clé API OpenWeather.\n\nEn mode simulation, vous pouvez utiliser "Ma position" pour tester la géolocalisation.');
        }
      }
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Prévisions 7j",
      description: "Tendances détaillées",
      color: "purple",
      action: () => document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Qualité air",
      description: "Indice de pollution",
      color: "amber",
      action: () => alert('Fonctionnalité prochainement disponible')
    }
  ];

  const getMetrics = () => {
    if (!weatherData) return [];
    
    return [
      {
        id: 'temperature',
        icon: <Thermometer className="w-6 h-6" />,
        value: `${weatherData.temperature}°C`,
        label: "Température",
        trend: `Ressenti ${weatherData.feelsLike}°C`,
        status: weatherData.temperature > 25 ? 'hot' : weatherData.temperature < 5 ? 'cold' : 'moderate',
        description: `Température actuelle avec un ressenti de ${weatherData.feelsLike}°C`
      },
      {
        id: 'humidity',
        icon: <Droplets className="w-6 h-6" />,
        value: `${weatherData.humidity}%`,
        label: "Humidité",
        trend: weatherData.humidity > 70 ? "Élevée" : weatherData.humidity < 30 ? "Faible" : "Normale",
        status: weatherData.humidity > 70 ? 'high' : weatherData.humidity < 30 ? 'low' : 'optimal',
        description: `Taux d'humidité ${weatherData.humidity > 70 ? 'élevé' : 'normal'} dans l'air`
      },
      {
        id: 'wind',
        icon: <Wind className="w-6 h-6" />,
        value: `${Math.round(weatherData.windSpeed * 3.6)} km/h`,
        label: "Vent",
        trend: getWindDirection(weatherData.windDirection),
        status: weatherData.windSpeed > 10 ? 'strong' : weatherData.windSpeed < 2 ? 'calm' : 'moderate',
        description: `Vent de direction ${getWindDirection(weatherData.windDirection)} à ${Math.round(weatherData.windSpeed * 3.6)} km/h`
      },
      {
        id: 'pressure',
        icon: <Gauge className="w-6 h-6" />,
        value: `${weatherData.pressure} hPa`,
        label: "Pression",
        trend: weatherData.pressure > 1013 ? "Haute" : "Basse",
        status: weatherData.pressure > 1020 ? 'high' : weatherData.pressure < 1000 ? 'low' : 'normal',
        description: `Pression atmosphérique ${weatherData.pressure > 1013 ? 'élevée' : 'normale'}`
      }
    ];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      hot: 'border-red-300 bg-red-50 hover:bg-red-100',
      cold: 'border-blue-300 bg-blue-50 hover:bg-blue-100',
      moderate: 'border-green-300 bg-green-50 hover:bg-green-100',
      high: 'border-amber-300 bg-amber-50 hover:bg-amber-100',
      low: 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100',
      optimal: 'border-green-300 bg-green-50 hover:bg-green-100',
      strong: 'border-orange-300 bg-orange-50 hover:bg-orange-100',
      calm: 'border-gray-300 bg-gray-50 hover:bg-gray-100',
      normal: 'border-blue-300 bg-blue-50 hover:bg-blue-100'
    };
    return colors[status as keyof typeof colors] || colors.moderate;
  };

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
      green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
      amber: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };


  
  // Fermer les résultats de recherche en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('#search-input')?.parentElement;
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearchResults]);
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header révolutionnaire */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 shadow-lg">
          <Cloud size={36} className="text-white" />
          </div>
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
          Météo Intelligente
        </h1>
        <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
          Conditions météorologiques en temps réel et prévisions précises pour optimiser 
          vos décisions agricoles.
        </p>
        

      </motion.div>

      {/* Recherche moderne */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
              <input
              id="search-input"
                type="text"
              placeholder={isApiConfigured ? "Rechercher une ville..." : "Recherche nécessite clé API (géolocalisation disponible)"}
                value={searchQuery}
              onChange={handleSearchChange}
              disabled={!isApiConfigured}
              className={`w-full px-6 py-4 border border-gray-200 rounded-full focus:border-gray-900 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400 pr-12 ${
                !isApiConfigured ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchResults(true);
              }}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Search size={20} />
            </button>
            
            {/* Résultats de recherche */}
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {searchResults.map((result, index) => (
                <button 
                    key={index}
                    onClick={() => selectCity(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-gray-900">
                      {result.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.state && `${result.state}, `}{result.country}
                    </div>
                </button>
                ))}
              </motion.div>
            )}
            
            {/* Message si pas de résultats */}
            {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4"
              >
                <div className="text-center text-gray-500">
                  <Search size={24} className="mx-auto mb-2 opacity-50" />
                  <p>Aucune ville trouvée pour "{searchQuery}"</p>
                  <p className="text-sm">Essayez un autre nom de ville</p>
                </div>
              </motion.div>
            )}
            </div>
            <Button 
              onClick={getCurrentLocation}
            className="px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
            <MapPin size={18} className="mr-2" />
              Ma position
            </Button>
          </div>
      </motion.div>

      {/* Métriques météo interactives */}
      {weatherData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {getMetrics().map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              onHoverStart={() => setActiveMetric(metric.id)}
              onHoverEnd={() => setActiveMetric(null)}
              className={`relative p-4 lg:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                activeMetric === metric.id 
                  ? `${getStatusColor(metric.status)} scale-105 shadow-lg` 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Métrique ${metric.label}: ${metric.value}. ${metric.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveMetric(activeMetric === metric.id ? null : metric.id);
                }
              }}
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2 rounded-lg transition-colors duration-200 ${
                  activeMetric === metric.id ? 'bg-white/80' : 'bg-gray-50'
                }`}>
                  {metric.icon}
                </div>
                <Badge variant="default" className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl lg:text-3xl font-light text-gray-900">{metric.value}</div>
                <div className="text-sm font-medium text-gray-600">{metric.label}</div>
              </div>

              <AnimatePresence>
                {activeMetric === metric.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center z-10"
                  >
                    <p className="text-sm text-gray-700 text-center font-medium leading-relaxed">
                      {metric.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Actions rapides météo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-xl lg:text-2xl font-light text-gray-900">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`group p-4 lg:p-5 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getActionColor(action.color)}`}
              aria-label={`${action.title}: ${action.description}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                  {action.icon}
                </div>
                <span className="font-medium text-sm lg:text-base">{action.title}</span>
              </div>
              <p className="text-xs lg:text-sm opacity-75 group-hover:opacity-90 transition-opacity duration-200">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Contenu principal */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center"
            >
              <Cloud size={24} className="text-blue-600" />
            </motion.div>
          </div>
          <div className="text-center space-y-2">
            <motion.h3
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg font-medium text-gray-900"
            >
              Chargement des données météo...
            </motion.h3>
            <p className="text-sm text-gray-500">
              {isApiConfigured ? "Connexion à OpenWeather API" : "Préparation des données simulées"}
            </p>
        </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200"
        >
          <p className="font-medium">Erreur: {error}</p>
          <p className="mt-2">Veuillez réessayer plus tard ou vérifier votre connexion.</p>
        </motion.div>
      ) : weatherData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Météo actuelle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card météo principale */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-2">
                    {weatherData.cityName}, {weatherData.country}
                    </h2>
                  <p className="text-gray-600 capitalize">{weatherData.description}</p>
                        </div>
                <div className="text-right">
                  {getWeatherIcon(weatherData.icon, 64)}
                        </div>
                      </div>
                      
              <div className="text-5xl font-light text-gray-900 mb-8">
                {weatherData.temperature}°C
                      </div>
                      
              {/* Lever/Coucher du soleil */}
              <div className="space-y-4">
                      <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sunrise size={18} className="text-yellow-500" />
                    <span className="text-sm text-gray-700">{formatTime(weatherData.sunrise)}</span>
                        </div>
                  <div className="flex items-center gap-2">
                    <Sunset size={18} className="text-orange-500" />
                    <span className="text-sm text-gray-700">{formatTime(weatherData.sunset)}</span>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${getDayProgress()}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                    </div>
              </div>
            </Card>

            {/* Prévisions */}
            <Card className="p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Prévisions sur 24h</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {forecast.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm text-gray-500 mb-2">{formatTime(item.dt)}</div>
                    <div className="mb-2">{getWeatherIcon(item.icon, 24)}</div>
                    <div className="font-medium text-gray-900">{item.temp}°C</div>
                    <div className="text-xs text-gray-500 mt-1">{Math.round(item.pop * 100)}%</div>
                  </motion.div>
                ))}
                    </div>
            </Card>
                  </div>
                  
          {/* Sidebar avec détails */}
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Détails météorologiques</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visibilité</span>
                  <span className="font-medium text-gray-900">
                    {weatherData.visibility ? `${Math.round(weatherData.visibility / 1000)} km` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Couverture nuageuse</span>
                  <span className="font-medium text-gray-900">{weatherData.clouds}%</span>
                  </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Précipitations</span>
                  <span className="font-medium text-gray-900">
                    {weatherData.rain1h ? `${weatherData.rain1h} mm` : "0 mm"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <h4 className="font-medium text-blue-900 mb-4">
                Conseils agricoles
              </h4>
              <div className="space-y-3 text-sm text-blue-800">
                <p>• Conditions {weatherData.temperature > 20 ? 'favorables' : 'modérées'} pour la croissance</p>
                <p>• Humidité {weatherData.humidity > 70 ? 'élevée' : 'normale'} - {weatherData.humidity > 70 ? 'surveiller les maladies' : 'bon pour l\'arrosage'}</p>
                <p>• Vent {weatherData.windSpeed > 15 ? 'fort' : 'modéré'} - {weatherData.windSpeed > 15 ? 'protéger les cultures sensibles' : 'conditions stables'}</p>
              </div>
            </Card>
          </div>
        </motion.div>
      ) : null}

      {/* Carte météo interactive */}
      {weatherData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          id="forecast-section"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-900">Carte météorologique</h3>
            </div>
            <div className="h-96 rounded-lg overflow-hidden bg-gray-100">
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🗺️</div>
                  <p className="font-medium">Carte météorologique</p>
                  <p className="text-sm">Prochainement disponible</p>
                  </div>
                </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Graphiques d'évolution */}
      {weatherData && forecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} />
                <span className="text-sm lg:text-base">Évolution de la température</span>
              </h4>
                      </div>
            <div className="h-48 lg:h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">📊</div>
                  <p className="font-medium text-gray-600">Graphique de température</p>
                  <p className="text-sm text-gray-500">Prochainement disponible</p>
                  </div>
                  </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Droplets size={18} />
                <span className="text-sm lg:text-base">Évolution de l'humidité</span>
              </h4>
            </div>
            <div className="h-48 lg:h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">💧</div>
                  <p className="font-medium text-gray-600">Graphique d'humidité</p>
                  <p className="text-sm text-gray-500">Prochainement disponible</p>
                    </div>
                </div>
          </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherPage; 