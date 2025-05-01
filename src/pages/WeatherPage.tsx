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
  Sunset
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import ModernWeatherMap from '../components/weather/WeatherMap';
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
      <PageHeader 
        title="Météo" 
        description={`Conditions et prévisions pour ${city.name}`}
      />
      
      {/* Barre de recherche et position */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher une ville"
              className="pl-10 pr-3 py-2 w-full bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={getCurrentLocation}
        >
          <MapPin size={16} />
          <span>Ma position</span>
        </Button>
      </div>
      
      {/* Contenu principal */}
      <div className={loading ? "opacity-75 pointer-events-none transition-opacity" : ""}>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}
        
        {/* Widget météo principal et prévisions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Widget météo principal */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-full">
              <div className="flex flex-col">
                <div className="mb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Météo actuelle</h3>
                    <p className="text-sm text-gray-500">
                      {weatherData ? `${weatherData.cityName}, ${weatherData.country}` : 'Chargement...'}
                    </p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-600 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {weatherData && (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="mr-3 text-4xl">
                        {weatherData.icon ? getWeatherIcon(weatherData.icon) : <Sun className="text-yellow-400" size={48} />}
                      </div>
                      <div>
                        <div className="text-3xl font-semibold">{Math.round(weatherData.temperature)}°C</div>
                        <div className="text-gray-500 capitalize">{weatherData.description}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-sm text-gray-500">Ressenti</div>
                        <div className="text-lg font-medium">{Math.round(weatherData.feelsLike)}°C</div>
                      </div>
                    </div>
                    
                    <div className="mb-6 relative">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <div className="flex items-center">
                          <Sunrise size={14} className="mr-1 text-yellow-500" />
                          <span>Lever {formatTime(weatherData.sunrise)}</span>
                        </div>
                        <div className="flex items-center">
                          <span>Coucher {formatTime(weatherData.sunset)}</span>
                          <Sunset size={14} className="ml-1 text-orange-500" />
                        </div>
                      </div>
                      
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" 
                          style={{ width: `${getDayProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 flex items-center">
                        <Wind size={18} className="text-blue-500 mr-2" />
                        <div>
                          <div className="text-gray-500">Vent</div>
                          <div>{Math.round(weatherData.windSpeed * 3.6)} km/h {getWindDirection(weatherData.windDirection)}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 flex items-center">
                        <Droplets size={18} className="text-blue-500 mr-2" />
                        <div>
                          <div className="text-gray-500">Humidité</div>
                          <div>{weatherData.humidity}%</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 flex items-center">
                        <Thermometer size={18} className="text-yellow-500 mr-2" />
                        <div>
                          <div className="text-gray-500">Pression</div>
                          <div>{weatherData.pressure} hPa</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {!weatherData && !loading && (
                  <div className="py-8 text-center text-gray-500">
                    Impossible de récupérer les données météo
                  </div>
                )}
                
                {loading && (
                  <div className="py-8 flex justify-center items-center">
                    <Loader className="animate-spin mr-2" size={20} />
                    <span>Chargement...</span>
                  </div>
                )}
              </div>
            </Card>
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
        
        {/* Détails des conditions météo */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <h2 className="text-xl font-semibold mr-2">Conditions météo détaillées</h2>
            <div className="text-xs bg-primary/20 text-primary-300 px-2 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              <span>Mis à jour à {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          
          {weatherData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <WeatherDetailCard 
                title="Température" 
                value={`${Math.round(weatherData.temperature)}°C`} 
                icon={<Thermometer className="text-red-400" />} 
                description={`Ressenti ${Math.round(weatherData.feelsLike)}°C`}
              />
              <WeatherDetailCard 
                title="Humidité" 
                value={`${weatherData.humidity}%`} 
                icon={<Droplets className="text-blue-400" />} 
                description={weatherData.humidity > 70 ? "Humidité élevée" : weatherData.humidity < 30 ? "Air sec" : "Niveau normal"}
              />
              <WeatherDetailCard 
                title="Vent" 
                value={`${Math.round(weatherData.windSpeed * 3.6)} km/h`} 
                icon={<Wind className="text-blue-400" />} 
                description={`Direction: ${getWindDirection(weatherData.windDirection)}`}
              />
              <WeatherDetailCard 
                title="Précipitations" 
                value={`${weatherData.rain1h ? weatherData.rain1h.toFixed(1) : '0'} mm`} 
                icon={<Umbrella className="text-purple-400" />} 
                description="Dernière heure"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Indicateur de chargement global */}
      {loading && (
        <div className="fixed bottom-6 right-6 bg-card border border-border shadow-lg rounded-lg p-3 flex items-center gap-2">
          <Loader className="animate-spin" size={16} />
          <span>Mise à jour des données...</span>
        </div>
      )}
    </div>
  );
};

// Composant pour les détails météo
const WeatherDetailCard = ({ 
  title, 
  value, 
  icon, 
  description 
}: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  description: string 
}) => (
  <Card className="p-4">
    <div className="flex flex-col h-full">
      <h3 className="text-base font-medium mb-1">{title}</h3>
      
      <div className="flex justify-between items-start mb-auto">
        <div className="flex items-center">
          <div className="text-4xl font-semibold mt-2">
            {value}
          </div>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
          {icon}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        {description}
      </div>
    </div>
  </Card>
);

export default WeatherPage; 