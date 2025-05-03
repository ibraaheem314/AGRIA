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
  Heart,
  Sun,
  Thermometer,
  Umbrella,
  Clock,
  CloudLightning,
  Sunrise,
  Sunset,
  BarChart2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import ModernWeatherMap from '../components/weather/WeatherMap';
import TemperatureChart from '../components/weather/TemperatureChart';
import HumidityChart from '../components/weather/HumidityChart';
import WeatherDetailCard from '../components/weather/WeatherDetailCard';
import { config } from '../../lib/config';

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
}

interface ForecastItem {
  dt: number;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  pop: number; // Probabilité de précipitation
}

// Version fonctionnelle de la page WeatherPage
const WeatherPage = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<{name: string; lat: number; lon: number}>({
    name: 'Paris',
    lat: 48.8566,
    lon: 2.3522
  });
  
  console.log('WeatherPage rendering');
  
  // Utiliser la clé depuis le fichier de configuration
  const weatherApiKey = config.weather.openWeather.apiKey;
  
  // Constantes pour les coordonnées de Paris
  const PARIS_LAT = 48.8566;
  const PARIS_LON = 2.3522;
  const PARIS_RADIUS = 0.05; // Rayon approximatif pour considérer que les coordonnées sont à Paris
  
  // Fonction pour vérifier si les coordonnées sont proches de Paris
  const isNearParis = (lat: number, lon: number): boolean => {
    // Calculer la distance euclidienne entre les coordonnées et le centre de Paris
    const latDiff = Math.abs(lat - PARIS_LAT);
    const lonDiff = Math.abs(lon - PARIS_LON);
    
    // Si la distance est inférieure au rayon défini, considérer que c'est Paris
    return latDiff < PARIS_RADIUS && lonDiff < PARIS_RADIUS;
  };
  
  // Fonction pour récupérer les données météo
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel API pour la météo actuelle
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${weatherApiKey}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Erreur API: ${weatherResponse.status}`);
      }
      
      const weatherJson = await weatherResponse.json();
      
      // Vérifier si nous sommes près de Paris
      const isParis = isNearParis(city.lat, city.lon);
      const cityName = isParis ? "Paris" : weatherJson.name;
      
      // Transformer les données
      const weatherData: WeatherData = {
        temperature: weatherJson.main.temp,
        feelsLike: weatherJson.main.feels_like,
        humidity: weatherJson.main.humidity,
        pressure: weatherJson.main.pressure,
        windSpeed: weatherJson.wind.speed,
        windDirection: weatherJson.wind.deg,
        description: weatherJson.weather[0].description,
        icon: weatherJson.weather[0].icon,
        clouds: weatherJson.clouds.all,
        sunrise: weatherJson.sys.sunrise,
        sunset: weatherJson.sys.sunset,
        cityName: cityName,
        country: weatherJson.sys.country,
        rain1h: weatherJson.rain?.['1h']
      };
      
      setWeatherData(weatherData);
      
      // Appel API pour les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${weatherApiKey}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Erreur API prévisions: ${forecastResponse.status}`);
      }
      
      const forecastJson = await forecastResponse.json();
      
      // Transformer les prévisions (5 premières entrées)
      const forecastItems = forecastJson.list.slice(0, 8).map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        pop: item.pop
      }));
      
      setForecast(forecastItems);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des données météo:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  
  // Récupérer les données au chargement
  useEffect(() => {
    fetchWeatherData();
  }, [city]);
  
  // Fonction pour obtenir l'icône météo
  const getWeatherIcon = (iconCode: string, size = 48) => {
    const iconMap: {[key: string]: React.ReactNode} = {
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
  
  // Formatter l'heure
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Géolocalisation
  const getCurrentLocation = () => {
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
          console.error('Erreur de géolocalisation:', error);
          setError('Impossible d\'obtenir votre position actuelle');
        }
      );
    } else {
      setError('La géolocalisation n\'est pas prise en charge par votre navigateur');
    }
  };
  
  // Calculer la progression du jour
  const getDayProgress = () => {
    if (!weatherData) return 50; // Valeur par défaut
    
    const now = Math.floor(Date.now() / 1000);
    const dayLength = weatherData.sunset - weatherData.sunrise;
    const elapsed = now - weatherData.sunrise;
    
    if (now < weatherData.sunrise || now > weatherData.sunset) {
      return now < weatherData.sunrise ? 0 : 100;
    }
    
    return Math.min(100, Math.max(0, (elapsed / dayLength) * 100));
  };
  
  // Obtenir la direction du vent
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête avec recherche et titre */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Météo</h1>
            <p className="text-gray-500 mt-1">Conditions et prévisions pour {city.name}</p>
          </div>
          <div className="w-full md:w-auto flex items-center">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Rechercher une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 pr-8 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </button>
              )}
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </div>
            <Button 
              onClick={getCurrentLocation}
              variant="outline" 
              className="ml-2 border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
            >
              <MapPin size={16} className="mr-1" />
              Ma position
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-green-600" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6">
          <p className="font-medium">Erreur: {error}</p>
          <p className="mt-2">Veuillez réessayer plus tard ou vérifier votre connexion.</p>
        </div>
      ) : weatherData ? (
        <>
          {/* Météo actuelle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-4">
                      {getWeatherIcon(weatherData.icon, 80)}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">
                      {Math.round(weatherData.temperature)}°C
                    </h2>
                    <p className="text-gray-600 capitalize mb-4">{weatherData.description}</p>
                    
                    <div className="w-full space-y-4 mt-4">
                      <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                        <div className="flex items-center">
                          <Thermometer size={18} className="mr-2 text-green-600" />
                          <span className="text-gray-600 text-sm">Ressenti</span>
                        </div>
                        <span className="font-medium text-gray-800">{Math.round(weatherData.feelsLike)}°C</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                        <div className="flex items-center">
                          <Wind size={18} className="mr-2 text-green-600" />
                          <span className="text-gray-600 text-sm">Vent</span>
                        </div>
                        <span className="font-medium text-gray-800">{Math.round(weatherData.windSpeed * 3.6)} km/h {getWindDirection(weatherData.windDirection)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                        <div className="flex items-center">
                          <Droplets size={18} className="mr-2 text-green-600" />
                          <span className="text-gray-600 text-sm">Humidité</span>
                        </div>
                        <span className="font-medium text-gray-800">{weatherData.humidity}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Umbrella size={18} className="mr-2 text-green-600" />
                          <span className="text-gray-600 text-sm">Précipitations</span>
                        </div>
                        <span className="font-medium text-gray-800">{weatherData.rain1h ? `${weatherData.rain1h} mm` : "0 mm"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lever et coucher du soleil */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center mr-6">
                      <Sunrise size={18} className="mr-2 text-yellow-500" />
                      <span className="text-sm text-gray-700">{formatTime(weatherData.sunrise)}</span>
                    </div>
                    <div className="flex items-center">
                      <Sunset size={18} className="mr-2 text-orange-500" />
                      <span className="text-sm text-gray-700">{formatTime(weatherData.sunset)}</span>
                    </div>
                  </div>
                  
                  {/* Barre de progression du jour */}
                  <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" 
                      style={{ width: `${getDayProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prévisions horaires */}
            <div className="lg:col-span-2">
              <Card className="p-4 h-full">
                <h3 className="text-lg font-medium mb-4">Prévisions</h3>
                {forecast.length > 0 ? (
                  <div className="flex space-x-3 overflow-x-auto py-2">
                    {forecast.map((item, i) => (
                      <div key={i} className="flex flex-col items-center min-w-[5rem] bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">{formatTime(item.dt)}</div>
                        <div className="my-2">
                          {getWeatherIcon(item.icon, 24)}
                        </div>
                        <div className="text-lg font-medium">{Math.round(item.temp)}°C</div>
                        <div className="text-xs text-gray-500 mt-1">{Math.round(item.pop * 100)}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    {loading ? (
                      <div className="flex items-center">
                        <Loader className="animate-spin mr-2" size={20} />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <span>Aucune prévision disponible</span>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
          
          {/* Carte météo - toujours affichée */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Carte Météo</h2>
            <ModernWeatherMap
              lat={city.lat}
              lon={city.lon}
              apiKey={weatherApiKey}
              className="h-[400px] w-full rounded-xl overflow-hidden"
            />
          </div>
          
          {/* NOUVELLE SECTION: Graphiques d'évolution à la place des détails météo */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-semibold mr-2">Évolution des conditions météo</h2>
              <BarChart2 className="text-primary w-5 h-5" />
            </div>
            
            {forecast.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graphique de température */}
                <TemperatureChart 
                  forecast={forecast} 
                  title="Évolution de la température"
                />
                
                {/* Graphique d'humidité */}
                <HumidityChart 
                  forecast={forecast} 
                  title="Évolution de l'humidité"
                />
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="py-8 text-gray-500">
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader className="animate-spin mb-3" size={24} />
                      <span>Chargement des données pour les graphiques...</span>
                    </div>
                  ) : (
                    <span>Données d'évolution non disponibles</span>
                  )}
                </div>
              </Card>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherPage; 