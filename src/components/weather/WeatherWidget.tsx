import React, { useState, useEffect } from 'react';
import useWeather from '../../hooks/useWeather';
import { Cloud, CloudRain, Sun, Wind, Droplets, ThermometerSun, CloudSun, Snowflake, 
         CloudLightning, CloudFog, Sunrise, Sunset, Clock, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

interface WeatherWidgetProps {
  lat?: number;
  lon?: number;
  className?: string;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  lat = 48.8566, // Paris by default
  lon = 2.3522,
  className = '',
  compact = false
}) => {
  const { data, forecast, loading, error, refetch } = useWeather(lat, lon);
  const [isDayTime, setIsDayTime] = useState(true);
  
  // Déterminer s'il fait jour ou nuit
  useEffect(() => {
    if (data) {
      const now = Math.floor(Date.now() / 1000);
      setIsDayTime(now > data.sunrise && now < data.sunset);
    }
  }, [data]);
  
  // Obtenir l'icône météo basée sur la description
  const getWeatherIcon = (description?: string, size = 24) => {
    if (!description) return <Cloud className="text-gray-400" size={size} />;
    
    const desc = description.toLowerCase();
    
    if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRain className="text-blue-400" size={size} />;
    } else if (desc.includes('thunderstorm') || desc.includes('orage')) {
      return <CloudLightning className="text-purple-400" size={size} />;
    } else if (desc.includes('snow') || desc.includes('neige')) {
      return <Snowflake className="text-blue-100" size={size} />;
    } else if (desc.includes('mist') || desc.includes('fog') || desc.includes('brouillard')) {
      return <CloudFog className="text-gray-400" size={size} />;
    } else if (desc.includes('cloud') || desc.includes('nuage')) {
      if (desc.includes('broken') || desc.includes('scattered') || desc.includes('few')) {
        return <CloudSun className="text-gray-400" size={size} />;
      }
      return <Cloud className="text-gray-400" size={size} />;
    } else if (desc.includes('clear') || desc.includes('sunny') || desc.includes('ciel dégagé')) {
      return <Sun className="text-yellow-400" size={size} />;
    } else {
      return <Cloud className="text-gray-400" size={size} />;
    }
  };
  
  // Formatage de l'heure
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculer la progression de la journée
  const getDayProgress = () => {
    if (!data) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    const dayLength = data.sunset - data.sunrise;
    const elapsed = now - data.sunrise;
    
    // Si c'est avant le lever du soleil ou après le coucher
    if (now < data.sunrise || now > data.sunset) {
      return now < data.sunrise ? 0 : 100;
    }
    
    return Math.min(100, Math.max(0, (elapsed / dayLength) * 100));
  };
  
  return (
    <Card 
      className={`p-4 ${className}`}
      variant={compact ? "gradient" : "default"}
      hoverable={true}
    >
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">Météo actuelle</h3>
            <p className="text-sm text-gray-300">
              {data?.cityName ? `${data.cityName}, ${data.country}` : 'Chargement...'}
            </p>
          </div>
          {!compact && data && (
            <div className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-300 flex items-center gap-1">
              <Clock size={12} />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 text-red-300 p-3 rounded-lg text-sm">
            Une erreur est survenue: {error}
          </div>
        )}
        
        {data && !loading && (
          <>
            <div className={`flex items-center ${compact ? 'justify-between' : ''} mb-4`}>
              <div className="flex items-center">
                <div className={`mr-3 ${compact ? 'text-3xl' : 'text-4xl'}`}>{getWeatherIcon(data.description, compact ? 36 : 48)}</div>
                <div>
                  <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-semibold`}>{Math.round(data.temperature)}°C</div>
                  <div className="text-gray-300 capitalize">{data.description}</div>
                </div>
              </div>
              {!compact && (
                <div className="text-right">
                  <div className="text-sm text-gray-300">Ressenti</div>
                  <div className="text-xl font-medium">{Math.round(data.feelsLike)}°C</div>
                </div>
              )}
            </div>
            
            {!compact && (
              <div className="mb-6 relative">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <div className="flex items-center">
                    <Sunrise size={14} className="mr-1 text-yellow-500" />
                    <span>Lever {formatTime(data.sunrise)}</span>
                  </div>
                  <div className="flex items-center">
                    <span>Coucher {formatTime(data.sunset)}</span>
                    <Sunset size={14} className="ml-1 text-orange-500" />
                  </div>
                </div>
                
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" 
                    style={{ width: `${getDayProgress()}%` }}
                  ></div>
                </div>
                
                <div className="absolute" style={{ 
                  left: `${getDayProgress()}%`, 
                  top: '0.25rem',
                  transform: 'translateX(-50%) translateY(-50%)'
                }}>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-md"></div>
                </div>
              </div>
            )}
            
            <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-3'} gap-3 text-sm`}>
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-2 flex items-center">
                <Wind size={18} className="text-blue-300 mr-2" />
                <div>
                  <div className="text-gray-400">Vent</div>
                  <div>{Math.round(data.windSpeed * 3.6)} km/h</div>
                </div>
              </div>
              
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-2 flex items-center">
                <Droplets size={18} className="text-blue-300 mr-2" />
                <div>
                  <div className="text-gray-400">Humidité</div>
                  <div>{data.humidity}%</div>
                </div>
              </div>
              
              {!compact && (
                <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-2 flex items-center">
                  <ThermometerSun size={18} className="text-yellow-300 mr-2" />
                  <div>
                    <div className="text-gray-400">Pression</div>
                    <div>{data.pressure} hPa</div>
                  </div>
                </div>
              )}
            </div>
            
            {forecast && forecast.list && forecast.list.length > 0 && !compact && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Prévisions prochaines heures</h4>
                <div className="flex space-x-3 overflow-x-auto py-2 styled-scrollbar">
                  {forecast.list.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[4rem] bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-400">
                        {new Date(item.dt * 1000).getHours()}h
                      </div>
                      <div className="my-1">
                        {getWeatherIcon(item.weather[0].description, 20)}
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round(item.main.temp)}°C
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={() => refetch(lat, lon)} 
                className="text-xs text-primary hover:text-primary-400"
              >
                Actualiser
              </button>
              
              {compact && (
                <button className="text-xs text-gray-400 hover:text-white flex items-center">
                  <span>Détails</span>
                  <ArrowRight size={12} className="ml-1" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default WeatherWidget; 