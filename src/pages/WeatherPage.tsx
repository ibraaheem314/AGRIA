import React, { useState, useEffect, useRef } from 'react';
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
  BarChart,
  Thermometer,
  Umbrella,
  Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatNumber, formatInteger, limitPercentage, formatTime, formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import DataCard from '../components/ui/DataCard';
import PageHeader from '../components/ui/PageHeader';
import { MultiSelect } from '../components/ui/MultiSelect';
import { useTheme } from '../contexts/ThemeContext';

// Fonction utilitaire temporaire pour remplacer cn
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// Composant de contrôle de couche météo
function WeatherLayerControl({ layers, onLayerToggle, apiKey }: { 
  layers: string[]; 
  onLayerToggle: (layer: string) => void;
  apiKey: string;
}) {
  const layerOptions = [
    { id: 'clouds', label: 'Nuages' },
    { id: 'precipitation', label: 'Précip.' },
    { id: 'temp', label: 'Temp.' },
    { id: 'wind', label: 'Vent' }
  ];

  return (
    <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-sm p-2 rounded-lg">
      {layerOptions.map((layer) => (
        <button
          key={layer.id}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            layers.includes(layer.id) 
              ? 'bg-primary text-white' 
              : 'bg-black/40 text-white/60 hover:bg-black/60'
          }`}
          onClick={() => onLayerToggle(layer.id)}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}

// Le composant WeatherMap qui utilise react-leaflet
interface WeatherMapProps {
  location: {lat: number; lon: number};
  layers: string[];
  onLayerToggle: (layer: string) => void;
  apiKey: string;
}

const WeatherMap = ({ location, layers, onLayerToggle, apiKey }: WeatherMapProps) => {
  return (
    <div className="relative h-[300px] md:h-[350px] w-full rounded-xl overflow-hidden">
      <img 
        src={`https://tile.openweathermap.org/map/${layers.includes('clouds') ? 'clouds' : 'precipitation'}_new/5/${Math.floor(location.lat)}/
${Math.floor(location.lon)}.png?appid=${apiKey}`}
        alt="Weather map"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-2 right-2">
        <WeatherLayerControl 
          layers={layers}
          onLayerToggle={onLayerToggle}
          apiKey={apiKey}
        />
      </div>
    </div>
  );
};

// Définition des interfaces principales
interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
}

interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Créations temporaires des composants manquants
const HeartFilled = (props: React.ComponentProps<typeof Heart>) => <Heart {...props} fill="currentColor" />;

// Composants UI temporaires
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}
const Tabs = ({ defaultValue, children }: TabsProps) => <div>{children}</div>;

interface TabsListProps {
  className: string;
  children: React.ReactNode;
}
const TabsList = ({ className, children }: TabsListProps) => <div className={className}>{children}</div>;

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}
const TabsTrigger = ({ value, children }: TabsTriggerProps) => <button>{children}</button>;

interface TabsContentProps {
  value: string;
  className: string;
  children: React.ReactNode;
}
const TabsContent = ({ value, className, children }: TabsContentProps) => <div className={className}>{children}</div>;

// Composants météo temporaires
interface WeatherCondition {
  condition: string;
  time: 'day' | 'night';
}

const RainEffect = ({ intensity = 1 }: { intensity?: number }) => (
  <div className="absolute inset-0 pointer-events-none opacity-75">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-blue-200 w-0.5 opacity-70"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          height: `${Math.random() * 20 + 10}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${0.7 + Math.random() * 0.6}s`
        }}
      />
    ))}
  </div>
);

const WeatherBackground = ({ condition, time }: WeatherCondition) => {
  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${
      time === 'day' 
        ? (condition === 'rain' 
            ? 'from-blue-600/95 to-blue-900/95' 
            : 'from-blue-500/95 to-blue-700/95')
        : (condition === 'rain' 
            ? 'from-slate-800/95 to-slate-900/95' 
            : 'from-slate-700/95 to-slate-900/95')
    }`}>
      {condition === 'rain' && <RainEffect intensity={0.5} />}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    </div>
  );
};

const AnimatedWeatherIcon = ({ condition, time }: WeatherCondition) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {condition === 'clear' ? 
        <Sun size={40} className="text-yellow-400" /> : 
        <Cloud size={40} className="text-gray-400" />
      }
    </div>
  );
};

interface DetailCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  direction?: string | null;
}

const DetailCard = ({ title, value, icon, gradient, direction = null }: DetailCardProps) => {
  return (
    <div className={`p-4 rounded-xl ${gradient} backdrop-blur-md border border-white/20 shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-white/80 text-sm font-medium mb-1">{title}</div>
          <div className="text-white text-xl font-semibold flex items-center gap-2">
            {value}
            {direction && <span className="text-sm text-white/70">{direction}</span>}
          </div>
        </div>
        <div className="p-2 rounded-full bg-white/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface HourlyForecastCardProps {
  time: string;
  temperature: number | string;
  icon: string;
  precipitation: number | string;
}

const HourlyForecastCard = ({ time, temperature, icon, precipitation }: HourlyForecastCardProps) => (
  <div className="p-3 bg-white/20 border border-white/20 shadow-lg rounded-lg backdrop-blur-md">
    <div className="text-sm font-medium text-white/90">{time}</div>
    <img src={icon} alt="weather" className="w-10 h-10 my-1 mx-auto" />
    <div className="text-white font-semibold">{temperature}°</div>
    <div className="text-xs font-medium text-white/80">{precipitation}%</div>
  </div>
);

interface ForecastData {
  day: string;
  tempMin: number;
  tempMax: number;
  conditions: string;
  precipChance: number;
  min?: number;
  max?: number;
  data?: any[];
}

const DailyForecastChart = ({ data }: { data: ForecastData[] }) => (
  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
    <div className="text-white font-medium mb-4">Prévisions 7 jours</div>
    <div className="h-[180px] bg-white/5 rounded-lg"></div>
  </div>
);

interface DailyForecastRowProps {
  day: string;
  conditions: string;
  high: number | string;
  low: number | string;
  precipitation: number | string;
}

const DailyForecastRow = ({ day, conditions, high, low, precipitation }: DailyForecastRowProps) => (
  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
    <div className="font-medium text-white">{day}</div>
    <div className="text-white/70">{conditions}</div>
    <div className="flex items-center gap-2">
      <div className="text-blue-300">{low}°</div>
      <div className="text-red-300">{high}°</div>
    </div>
    <div className="text-blue-400">{precipitation}%</div>
  </div>
);

interface AirQualityData {
  aqi: number;
  category: string;
  mainPollutant: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  index?: number;
  description?: string;
}

const AirQualityDisplay = ({ data }: { data: AirQualityData }) => {
  // Définir l'échelle de couleurs pour l'AQI
  const getColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-600';
    return 'bg-purple-900';
  };
  
  // Définir les différents niveaux pour la visualisation
  const getGradientColors = () => {
    return [
      'from-emerald-500',
      'via-yellow-500',
      'via-orange-500',
      'via-red-500',
      'to-purple-700'
    ].join(' ');
  };
  
  // Créer des barres pour chaque polluant avec leurs niveaux par couleur
  const pollutantLevels = [
    { name: 'PM2.5', value: data.pollutants.pm25, unit: 'μg/m³', max: 75, good: 12 },
    { name: 'PM10', value: data.pollutants.pm10, unit: 'μg/m³', max: 150, good: 54 },
    { name: 'O₃', value: data.pollutants.o3, unit: 'μg/m³', max: 180, good: 70 },
    { name: 'NO₂', value: data.pollutants.no2, unit: 'μg/m³', max: 100, good: 53 }
  ];
  
  return (
    <div className="space-y-6 text-white bg-black/30 rounded-xl backdrop-blur-md p-5 border border-white/20 shadow-lg">
      {/* Indice principal avec visualisation */}
      <div className="relative">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-xl font-medium">Qualité de l'air</h3>
          <span className="text-lg font-semibold text-white">{Math.round(data.aqi)}</span>
        </div>
        
        <div className="mb-3 text-2xl font-bold text-white">
          {data.category}
        </div>
        
        {/* Visualisation style Apple avec dégradé */}
        <div className="relative h-4 bg-gradient-to-r rounded-full overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 via-red-500 to-purple-700 h-full w-full"></div>
          <div 
            className="absolute top-0 h-8 w-2 bg-white rounded-full transform -translate-y-1/2"
            style={{ left: `${Math.min(100, data.aqi / 3)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs font-medium text-white/80">
          <span>Bon</span>
          <span>Modéré</span>
          <span>Mauvais</span>
          <span>Très Mauvais</span>
        </div>
      </div>
      
      {/* Détail des polluants */}
      <div className="space-y-4 mt-6">
        <h4 className="text-sm font-semibold mb-3">Polluants</h4>
        
        {pollutantLevels.map((pollutant) => {
          const percentage = Math.min(100, (pollutant.value / pollutant.max) * 100);
          const isGood = pollutant.value <= pollutant.good;
          
          return (
            <div key={pollutant.name} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{pollutant.name}</span>
                <span className={`${isGood ? 'text-emerald-400' : 'text-white'}`}>
                  {pollutant.value} {pollutant.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Effets météo
interface SnowEffectProps {
  intensity?: number;
}

const SnowEffect = ({ intensity = 1 }: SnowEffectProps) => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: Math.round(20 * intensity) }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full w-1 h-1 opacity-70"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${1 + Math.random() * 3}s`
        }}
      />
    ))}
  </div>
);

const SunlightEffect = () => <div className="absolute inset-0 bg-yellow-500/10"></div>;
const StarsEffect = () => <div className="absolute inset-0"></div>;

// Tooltip personnalisé
interface CustomTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-2 rounded border border-white/10">
        <p className="text-white text-xs">{label}</p>
        <p className="text-blue-300 text-xs">{`Min: ${payload[0].value}°`}</p>
        <p className="text-red-300 text-xs">{`Max: ${payload[1].value}°`}</p>
      </div>
    );
  }
  return null;
};

// Fonctions temporaires
const getUVIndexDescription = (index: number | null): string => {
  if (!index) return "N/A";
  if (index < 3) return "Faible";
  if (index < 6) return "Modéré";
  if (index < 8) return "Élevé";
  if (index < 11) return "Très élevé";
  return "Extrême";
};

const StatusIndicator = ({ 
  value, 
  levels, 
  className 
}: { 
  value: number;
  levels: Array<{ value: number; color: string; label: string }>;
  className?: string;
}) => {
  // Sort levels by value in ascending order
  const sortedLevels = [...levels].sort((a, b) => a.value - b.value);
  
  // Find the highest level where value >= level.value
  const currentLevel = sortedLevels
    .filter(level => value >= level.value)
    .slice(-1)[0] || sortedLevels[0];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-3 h-3 rounded-full", currentLevel.color)} />
      <span className="text-sm text-gray-700 dark:text-gray-300">{currentLevel.label}</span>
    </div>
  );
};

const ProgressBar = ({ 
  value, 
  max, 
  color, 
  className 
}: { 
  value: number; 
  max: number; 
  color: string; 
  className?: string;
}) => {
  // Ensure value is between 0 and max
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = Math.round((safeValue / max) * 100);
  
  return (
    <div className={cn("w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full", color)} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const WeatherCard = ({ weatherData, isDayTime }: { weatherData: WeatherData | null, isDayTime: boolean }) => {
  if (!weatherData) return null;
  
  // Déterminer la couleur de fond en fonction de la météo et du moment de la journée
  const getBgGradient = () => {
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    
    if (weatherMain.includes('clear')) {
      return isDayTime 
        ? 'bg-gradient-to-b from-blue-400 to-blue-600' 
        : 'bg-gradient-to-b from-blue-900 to-indigo-900';
    } else if (weatherMain.includes('cloud')) {
      return isDayTime 
        ? 'bg-gradient-to-b from-blue-400 to-blue-500' 
        : 'bg-gradient-to-b from-slate-700 to-slate-900';
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return 'bg-gradient-to-b from-blue-700 to-blue-900';
    } else if (weatherMain.includes('thunder')) {
      return 'bg-gradient-to-b from-slate-800 to-slate-900';
    } else if (weatherMain.includes('snow')) {
      return 'bg-gradient-to-b from-blue-100 to-blue-300';
    } else if (weatherMain.includes('fog') || weatherMain.includes('mist')) {
      return 'bg-gradient-to-b from-gray-400 to-gray-600';
    }
    
    return isDayTime 
      ? 'bg-gradient-to-b from-blue-400 to-blue-600' 
      : 'bg-gradient-to-b from-blue-900 to-indigo-900';
  };
  
  const getWeatherIcon = () => {
    const weatherId = weatherData.weather[0].id;
    
    if (weatherId >= 200 && weatherId < 300) {
      return '⛈️';
    } else if (weatherId >= 300 && weatherId < 400) {
      return '🌧️';
    } else if (weatherId >= 500 && weatherId < 600) {
      return '🌧️';
    } else if (weatherId >= 600 && weatherId < 700) {
      return '❄️';
    } else if (weatherId >= 700 && weatherId < 800) {
      return '🌫️';
    } else if (weatherId === 800) {
      return isDayTime ? '☀️' : '🌙';
    } else if (weatherId > 800) {
      return isDayTime ? '⛅' : '☁️';
    }
    
    return '🌤️';
  };
  
  const cityName = weatherData.name;
  const temperature = Math.round(weatherData.main.temp);
  const weatherDescription = weatherData.weather[0].description;
  
  return (
    <div className={`rounded-3xl overflow-hidden w-full ${getBgGradient()}`}>
      <div className="p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-light">{cityName}</h2>
            <p className="text-lg opacity-90 capitalize">{weatherDescription}</p>
          </div>
          <span className="text-6xl mt-2">{getWeatherIcon()}</span>
        </div>
        
        <div className="mt-6">
          <span className="text-8xl font-extralight">{temperature}°</span>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Droplets size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-light opacity-80">Humidité</div>
              <div className="text-xl font-medium">{weatherData.main.humidity}%</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Wind size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-light opacity-80">Vent</div>
              <div className="text-xl font-medium">{weatherData.wind.speed} km/h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HourlyForecastRow = ({ data }: { data: any[] }) => {
  return (
    <div className="mt-4 overflow-x-auto styled-scrollbar">
      <div className="grid grid-flow-col auto-cols-max gap-3 pb-2">
        {data.map((item, index) => (
          <HourlyForecastCard
            key={index}
            time={formatTime(item.dt)}
            temperature={Math.round(item.main.temp)}
            icon={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            precipitation={item.pop ? Math.round(item.pop * 100) : 0}
          />
        ))}
      </div>
    </div>
  );
};

// Fonction pour convertir le code d'icône OpenWeatherMap en emoji
const getIconForCode = (code: string) => {
  const firstChar = code.charAt(0);
  const isDay = code.charAt(code.length - 1) === 'd';
  
  switch (firstChar) {
    case '0': return '🌪️'; // Tornado
    case '1': return isDay ? '☀️' : '🌙'; // Clear
    case '2': return '⛈️'; // Thunderstorm
    case '3': return '🌧️'; // Drizzle  
    case '4': return '🌧️'; // Rain
    case '5': return '❄️'; // Snow
    case '6': return '🌨️'; // Snow
    case '7': return '🌫️'; // Atmosphere (fog, mist)
    case '8': 
      if (code === '800') return isDay ? '☀️' : '🌙';
      if (code === '801') return isDay ? '🌤️' : '☁️';
      if (code === '802') return isDay ? '⛅' : '☁️';
      return '☁️'; // Clouds
    case '9': return '🌧️'; // Rain
    default: return '🌤️';
  }
};

// Ajout d'un composant CircularGauge pour les indices (UV, qualité d'air, etc.)
interface CircularGaugeProps {
  value: number;
  maxValue: number;
  title: string;
  unit?: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  description?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ 
  value, 
  maxValue, 
  title, 
  unit = '', 
  color, 
  size = 'md',
  description 
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const radius = size === 'sm' ? 30 : size === 'md' ? 40 : 50;
  const strokeWidth = size === 'sm' ? 5 : size === 'md' ? 8 : 10;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const sizeClass = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-white/80 text-sm font-medium mb-2">{title}</div>
      <div className="relative" style={{ width: (radius + strokeWidth) * 2, height: (radius + strokeWidth) * 2 }}>
        {/* Fond de la jauge */}
        <svg width="100%" height="100%" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Arc de la jauge */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${centerX} ${centerY})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${sizeClass} text-white`}>{value}{unit}</div>
          {description && <div className="text-xs text-white/70 mt-1">{description}</div>}
        </div>
      </div>
    </div>
  );
};

// Ajout d'un composant TemperatureGraph pour afficher les variations de température
interface TemperatureGraphProps {
  data: Array<{
    time: string;
    temp: number;
    icon?: string;
  }>;
  height?: number;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data, height = 100 }) => {
  const maxTemp = Math.max(...data.map(d => d.temp)) + 3;
  const minTemp = Math.min(...data.map(d => d.temp)) - 3;
  const range = maxTemp - minTemp || 1;
  
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="relative w-full h-full">
        {/* Axe X - heures */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/60">
          {data.map((point, i) => (
            <div key={i} className="text-center">
              {point.time}
            </div>
          ))}
        </div>
        
        {/* Courbe de température */}
        <svg className="absolute inset-0" width="100%" height="100%" viewBox={`0 0 ${data.length * 50} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 99, 71, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 99, 71, 0)" />
            </linearGradient>
          </defs>
          
          {/* Ligne de température */}
          <path
            d={`
              M ${data.map((point, i) => `${i * 50} ${height - ((point.temp - minTemp) / range) * height * 0.8}`).join(' L ')}
            `}
            fill="none"
            stroke="rgb(255, 99, 71)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Aire sous la courbe */}
          <path
            d={`
              M 0 ${height}
              ${data.map((point, i) => `L ${i * 50} ${height - ((point.temp - minTemp) / range) * height * 0.8}`).join(' ')}
              L ${(data.length - 1) * 50} ${height}
              Z
            `}
            fill="url(#tempGradient)"
            opacity="0.5"
          />
          
          {/* Points de température */}
          {data.map((point, i) => (
            <g key={i}>
              <circle
                cx={i * 50}
                cy={height - ((point.temp - minTemp) / range) * height * 0.8}
                r="4"
                fill="white"
                stroke="rgb(255, 99, 71)"
                strokeWidth="2"
              />
              <text
                x={i * 50}
                y={height - ((point.temp - minTemp) / range) * height * 0.8 - 10}
                fontSize="12"
                fill="white"
                textAnchor="middle"
              >
                {point.temp}°
              </text>
            </g>
          ))}
        </svg>
            </div>
    </div>
  );
};

// Ajout d'un composant pour les conditions météo détaillées
interface DetailedWeatherConditionsProps {
  weatherData: WeatherData;
  airQualityData: AirQualityData | null;
  uvIndex: number;
}

const DetailedWeatherConditions: React.FC<DetailedWeatherConditionsProps> = ({ weatherData, airQualityData, uvIndex }) => {
  if (!weatherData) return null;
  
  const calculateFeelsLike = (temp: number, humidity: number, windSpeed: number): number => {
    // Simplification de l'algorithme de température ressentie
    let feelsLike = temp;
    
    // Effet de la chaleur humide
    if (temp > 20) {
      feelsLike += (humidity - 50) / 5;
    }
    
    // Effet du refroidissement éolien
    if (temp < 15) {
      feelsLike -= windSpeed / 5;
    }
    
    return Math.round(feelsLike);
  };
  
  const feelsLikeTemp = calculateFeelsLike(
    weatherData.main.temp,
    weatherData.main.humidity,
    weatherData.wind.speed
  );
  
  // Statut de stabilité de la température
  const tempStability = weatherData.main.temp_max - weatherData.main.temp_min > 5 
    ? "Variable" 
    : "Stable";
  
  // Statut de la couverture nuageuse
  const getCloudCoverStatus = (cloudiness: number): string => {
    if (cloudiness < 10) return "Ensoleillé";
    if (cloudiness < 30) return "Peu nuageux";
    if (cloudiness < 70) return "Partiellement nuageux";
    return "Nuageux";
  };
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-black/30 backdrop-blur-md border border-white/20">
        <h3 className="text-white text-sm mb-2">Température</h3>
        <div className="flex items-end">
          <div className="text-3xl text-white font-bold">
            {Math.round(weatherData.main.temp)}°
              </div>
          <Thermometer className="ml-2 text-red-400" size={24} />
              </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 h-2 rounded-full">
            <div className="h-full w-3 bg-white rounded-full relative" 
                style={{ 
                  left: `${Math.min(100, Math.max(0, ((weatherData.main.temp + 10) / 50) * 100))}%`,
                  transform: 'translateX(-50%)' 
                }}
            />
                  </div>
                </div>
        <div className="mt-2 text-sm text-white/70">
          {tempStability} à {Math.round(weatherData.main.temp)}°
        </div>
      </Card>
      
      <Card className="p-4 bg-black/30 backdrop-blur-md border border-white/20">
        <h3 className="text-white text-sm mb-2">Ressenti</h3>
        <div className="flex items-end">
          <div className="text-3xl text-white font-bold">
            {feelsLikeTemp}°
                  </div>
                  </div>
        <div className="mt-6">
          <div className="text-sm text-white/70">
            Facteur dominant: {weatherData.main.humidity > 70 ? 'humidité' : weatherData.wind.speed > 20 ? 'vent' : 'température'}
                  </div>
          <div className="text-sm text-white/70 mt-1">
            {feelsLikeTemp > weatherData.main.temp 
              ? 'Plus chaud que la température réelle' 
              : feelsLikeTemp < weatherData.main.temp 
                ? 'Plus froid que la température réelle'
                : 'Similaire à la température réelle'
            }
                </div>
              </div>
      </Card>
      
      <Card className="p-4 bg-black/30 backdrop-blur-md border border-white/20">
        <h3 className="text-white text-sm mb-2">Couverture nuageuse</h3>
        <div className="flex items-center gap-2">
          <div className="text-3xl text-white font-bold">
            {weatherData.clouds.all}%
              </div>
          <Cloud className="text-gray-400" size={24} />
        </div>
        
        <div className="relative w-full h-32 mt-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-300/20 flex items-center justify-center relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 bottom-0 left-0 bg-blue-200/40" 
                style={{ 
                  clipPath: `circle(${50 * (weatherData.clouds.all / 100)}% at 50% 50%)` 
                }}
              />
              <Sun className="text-yellow-400 z-10" size={30} />
            </div>
          </div>
          <div className="absolute bottom-0 text-sm text-white/70">
            {getCloudCoverStatus(weatherData.clouds.all)}
          </div>
        </div>
          </Card>
      
      <Card className="p-4 bg-black/30 backdrop-blur-md border border-white/20">
        <h3 className="text-white text-sm mb-2">Précipitations</h3>
        <div className="flex items-center gap-2">
          <div className="text-3xl text-white font-bold">
            {weatherData.rain ? Math.round((weatherData.rain['1h'] || weatherData.rain['3h'] || 0) * 10) / 10 : 0} mm
          </div>
          <Umbrella className="text-blue-400" size={24} />
        </div>
        
        <div className="mt-3 flex flex-col items-center">
          <div className="w-full h-20 flex items-end justify-center relative">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-full w-6 mx-0.5 bg-blue-900/20 rounded-t-lg relative overflow-hidden"
              >
                <div 
                  className="absolute bottom-0 w-full bg-blue-500/60 rounded-t-lg" 
                  style={{ 
                    height: `${Math.min(100, Math.max(0, ((i === 0 ? (weatherData.rain ? (weatherData.rain['1h'] || 0) * 10 : 0) : 0) / 5) * 100))}%` 
                  }}
                />
            </div>
            ))}
            <div className="absolute bottom-0 w-full text-center text-xs text-white/70">
              Dans les prochaines 24 heures
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Ajout d'un composant pour le résumé météo du jour
interface DaySummaryProps {
  weatherData: WeatherData;
  sunrise: number;
  sunset: number;
}

const DaySummary: React.FC<DaySummaryProps> = ({ weatherData, sunrise, sunset }) => {
  if (!weatherData) return null;
  
  const now = new Date();
  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);
  
  const formatTimeHM = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const dayProgress = (): number => {
    const totalDayLength = (sunsetTime.getTime() - sunriseTime.getTime()) / 1000 / 60 / 60;
    const elapsedDay = (now.getTime() - sunriseTime.getTime()) / 1000 / 60 / 60;
    return Math.min(100, Math.max(0, (elapsedDay / totalDayLength) * 100));
  };
  
  return (
    <Card className="p-5 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 backdrop-blur-md border border-white/20">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{Math.round(weatherData.main.temp)}°C</h2>
          <p className="text-lg text-white/80 capitalize">{weatherData.weather[0].description}</p>
              </div>
        <div className="text-5xl">
          {getIconForCode(weatherData.weather[0].icon)}
              </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm text-white/80 mb-1">
          <span>Lever {formatTimeHM(sunriseTime)}</span>
          <span>Coucher {formatTimeHM(sunsetTime)}</span>
        </div>
        <div className="relative h-3 bg-blue-900/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" 
            style={{ width: `${dayProgress()}%` }}
          />
          <div 
            className="absolute top-0 h-6 w-6 bg-yellow-300 rounded-full -mt-1.5 shadow-md"
            style={{ 
              left: `${dayProgress()}%`, 
              transform: 'translateX(-50%)'
            }}
          />
                      </div>
                    </div>
      
      <div className="mt-5 flex items-center justify-between text-white/90">
        <div className="flex items-center">
          <Wind size={18} className="mr-2 text-white/70" />
          <span>{weatherData.wind.speed} km/h</span>
          <span className="text-xs text-white/60 ml-1">
            {(() => {
              const deg = weatherData.wind.deg;
              if (deg >= 337.5 || deg < 22.5) return 'N';
              if (deg >= 22.5 && deg < 67.5) return 'NE';
              if (deg >= 67.5 && deg < 112.5) return 'E';
              if (deg >= 112.5 && deg < 157.5) return 'SE';
              if (deg >= 157.5 && deg < 202.5) return 'S';
              if (deg >= 202.5 && deg < 247.5) return 'SO';
              if (deg >= 247.5 && deg < 292.5) return 'O';
              return 'NO';
            })()}
          </span>
                  </div>

        <div className="flex items-center">
          <Droplets size={18} className="mr-2 text-white/70" />
          <span>{weatherData.main.humidity}%</span>
                      </div>
        
        <div className="flex items-center">
          <Clock size={18} className="mr-2 text-white/70" />
          <span>{formatTime(weatherData.dt)}</span>
                    </div>
                  </div>
    </Card>
  );
};

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('Paris, FR');
  const [coords, setCoords] = useState({ lat: 48.8566, lon: 2.3522 }); // Default: Paris
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [weatherParams, setWeatherParams] = useState<string[]>(['temperature', 'humidity', 'wind', 'pressure']);
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedMapLayers, setSelectedMapLayers] = useState<string[]>(['clouds', 'precipitation']);
  const [uvIndex, setUvIndex] = useState<number>(5); // Valeur par défaut pour l'indice UV
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  // API configuration
  const API_KEY = '1707374d07315cd524c6e04d0b0b734b'; // OpenWeatherMap API key
  const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
  const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
  const AIR_QUALITY_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

  // Options for weather parameters to display
  const weatherParamOptions = [
    { id: 'temperature', label: 'Température', value: 'temperature' },
    { id: 'feels_like', label: 'Ressenti', value: 'feels_like' },
    { id: 'humidity', label: 'Humidité', value: 'humidity' },
    { id: 'wind', label: 'Vent', value: 'wind' },
    { id: 'pressure', label: 'Pression', value: 'pressure' },
    { id: 'visibility', label: 'Visibilité', value: 'visibility' },
    { id: 'precipitation', label: 'Précipitations', value: 'precipitation' },
    { id: 'sun', label: 'Lever/Coucher du soleil', value: 'sun' },
  ];

  const unitsOptions = [
    { id: "metric", label: "Métrique (°C)", value: "metric" },
    { id: "imperial", label: "Impérial (°F)", value: "imperial" },
    { id: "standard", label: "Standard (K)", value: "standard" }
  ];

  const refreshOptions = [
    { id: "manual", label: "Manuel", value: "manual" },
    { id: "1min", label: "1 minute", value: "1min" },
    { id: "5min", label: "5 minutes", value: "5min" },
    { id: "10min", label: "10 minutes", value: "10min" },
    { id: "30min", label: "30 minutes", value: "30min" }
  ];

  // Handle clicks outside search results to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch weather data when coords change
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!API_KEY) {
        setError("Clé API non configurée. Veuillez ajouter votre clé API OpenWeatherMap.");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${WEATHER_API_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=fr&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        setWeatherData(data);
        setIsDayTime(data.sys.sunrise < data.dt && data.dt < data.sys.sunset);
      } catch (err) {
        setError(`Impossible de charger les données météo: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coords, API_KEY]);

  // Search for cities based on query
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      if (!API_KEY) return;
      
      setIsSearching(true);
      
      try {
        const response = await fetch(
          `${GEO_API_URL}?q=${searchQuery}&limit=5&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, API_KEY]);

  // Select a city from search results
  const selectCity = (city: City) => {
    setLocationName(`${city.name}, ${city.country}${city.state ? ` (${city.state})` : ''}`);
    setCoords({ lat: city.lat, lon: city.lon });
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Use browser geolocation to get current position
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          
          // Get city name from reverse geocoding
          if (API_KEY) {
            try {
              const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
              );
              
              if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                  setLocationName(`${data[0].name}, ${data[0].country}`);
                }
              }
            } catch (err) {
              console.error("Erreur lors de la géolocalisation inverse:", err);
            }
          }
          
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          console.error("Erreur de géolocalisation:", error);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas prise en charge par votre navigateur");
    }
  };

  // Header actions including search and MultiSelect
  const headerActions = (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
        onClick={getCurrentLocation}
        className="text-xs gap-1"
        disabled={loading}
              >
        <MapPin className="h-3.5 w-3.5" />
        Ma position
              </Button>
      
      <div className="relative w-full sm:w-auto" ref={searchRef}>
        <div className="flex items-center border border-border rounded-lg bg-surface overflow-hidden">
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            className="w-full sm:w-[180px] bg-transparent py-1.5 pl-3 pr-8 text-sm outline-none"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="absolute right-2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
          )}
            </div>

        {/* Résultats de recherche */}
        {showSearchResults && searchQuery.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-3 text-center text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin mx-auto mb-1" />
                Recherche en cours...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((city, index) => (
                <div 
                  key={index}
                  onClick={() => selectCity(city)}
                  className="p-2 hover:bg-muted cursor-pointer flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">
                    {city.name}, {city.country}
                    {city.state && ` (${city.state})`}
                  </span>
                      </div>
              ))
            ) : searchQuery.length > 1 ? (
              <div className="p-3 text-center text-muted-foreground text-sm">
                Aucun résultat trouvé
                    </div>
            ) : null}
                  </div>
            )}
                </div>

      <MultiSelect
        options={weatherParamOptions}
        selectedValues={weatherParams}
        onChange={setWeatherParams}
        placeholder="Paramètres à afficher"
        className="w-full sm:w-auto text-xs"
      />
              </div>
  );

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle map layer toggle
  const handleMapLayerToggle = (layer: string) => {
    if (selectedMapLayers.includes(layer)) {
      setSelectedMapLayers(selectedMapLayers.filter(l => l !== layer));
    } else {
      setSelectedMapLayers([...selectedMapLayers, layer]);
    }
  };

  // Fetch air quality data when coords change
  useEffect(() => {
    const fetchAirQualityData = async () => {
      if (!API_KEY) return;
      
      try {
        const response = await fetch(
          `${AIR_QUALITY_API_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API qualité de l'air: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.list || data.list.length === 0) {
          throw new Error('Aucune donnée de qualité d\'air disponible');
        }
        
        const pollutionData = data.list[0].components;
        const aqi = data.list[0].main.aqi; // 1 à 5 (1=bon, 5=très mauvais)
        
        // Convertir en AQI US
        const aqiRanges: Record<number, number> = {1: 25, 2: 75, 3: 125, 4: 200, 5: 300};
        const aqiUS = aqiRanges[aqi as keyof typeof aqiRanges] || 150;
        
        // Déterminer le polluant principal
        const pollutants: Record<string, number> = {
          "pm2.5": pollutionData.pm2_5 || 0,
          "pm10": pollutionData.pm10 || 0,
          "no2": pollutionData.no2 || 0,
          "o3": pollutionData.o3 || 0,
          "so2": pollutionData.so2 || 0,
          "co": pollutionData.co || 0
        };
        
        // Seuils approximatifs
        const thresholds: Record<string, number> = {
          "pm2.5": 10,  // OMS: 10 μg/m³
          "pm10": 20,   // OMS: 20 μg/m³
          "no2": 40,    // OMS: 40 μg/m³
          "o3": 100,    // OMS: 100 μg/m³
          "so2": 40,    // Approx
          "co": 4000    // Approx (4000 μg/m³)
        };
        
        // Trouver le polluant principal
        let maxRatio = 0;
        let mainPollutant = "pm2.5"; // Par défaut
        
        Object.entries(pollutants).forEach(([poll, value]) => {
          const threshold = thresholds[poll];
          if (threshold > 0) {
            const ratio = value / threshold;
            if (ratio > maxRatio) {
              maxRatio = ratio;
              mainPollutant = poll;
            }
          }
        });
        
        // Créer l'objet de qualité d'air
        const airQuality = {
          aqi: aqiUS,
          category: getAQICategory(aqiUS),
          mainPollutant,
          pollutants: {
            pm25: pollutionData.pm2_5 || 0,
            pm10: pollutionData.pm10 || 0,
            o3: pollutionData.o3 || 0,
            no2: pollutionData.no2 || 0,
            so2: pollutionData.so2 || 0,
            co: (pollutionData.co || 0) / 1000 // Convertir μg/m³ en mg/m³
          },
          index: aqiUS,
          description: getAQIDescription(aqiUS)
        };
        
        setAirQualityData(airQuality);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de qualité de l\'air:', err);
      }
    };

    fetchAirQualityData();
  }, [coords, API_KEY]);

  // Fetch forecast data when coords change
  useEffect(() => {
    const fetchForecastData = async () => {
      if (!API_KEY) return;
      
      try {
        const response = await fetch(
          `${FORECAST_API_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API prévisions: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Traitement des données de l'API pour obtenir une prévision par jour
        const processedData: ForecastData[] = [];
        const daysMap = new Map();
        
        // Regrouper les prévisions par jour
        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
          const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
          
          if (!daysMap.has(day)) {
            daysMap.set(day, {
              day: capitalizedDay,
              tempMin: item.main.temp_min,
              tempMax: item.main.temp_max,
              conditions: item.weather[0].description,
              precipChance: item.pop ? Math.round(item.pop * 100) : 0,
              data: [item]
            });
          } else {
            const existingDay = daysMap.get(day);
            existingDay.tempMin = Math.min(existingDay.tempMin, item.main.temp_min);
            existingDay.tempMax = Math.max(existingDay.tempMax, item.main.temp_max);
            existingDay.data.push(item);
            
            // Utiliser les conditions du milieu de journée si possible
            if (date.getHours() >= 12 && date.getHours() <= 15) {
              existingDay.conditions = item.weather[0].description;
            }
          }
        });
        
        // Convertir la Map en tableau et limiter à 7 jours
        daysMap.forEach((value) => {
          processedData.push(value);
        });
        
        setForecastData(processedData.slice(0, 7));
      } catch (err) {
        console.error('Erreur lors de la récupération des prévisions:', err);
      }
    };

    fetchForecastData();
  }, [coords, API_KEY]);

  // Ajouter un nouvel effet pour récupérer les données horaires
  useEffect(() => {
    const fetchHourlyForecast = async () => {
      if (!API_KEY) return;
      
      try {
        const response = await fetch(
          `${FORECAST_API_URL}?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API prévisions horaires: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.list) {
          setHourlyData(data.list);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des prévisions horaires:', err);
      }
    };

    fetchHourlyForecast();
  }, [coords, API_KEY]);

  // Fonction pour obtenir la catégorie de l'AQI
  const getAQICategory = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Fonction pour obtenir la description en français de l'AQI
  const getAQIDescription = (aqi: number): string => {
    if (aqi <= 50) return 'Bonne';
    if (aqi <= 100) return 'Modérée';
    if (aqi <= 150) return 'Mauvaise pour les groupes sensibles';
    if (aqi <= 200) return 'Mauvaise';
    if (aqi <= 300) return 'Très mauvaise';
    return 'Dangereuse';
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <PageHeader 
        title="Météo" 
        description={`Conditions et prévisions pour ${locationName}`}
        actions={headerActions}
      />
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Résumé principal du jour */}
        {weatherData && (
          <DaySummary 
            weatherData={weatherData} 
            sunrise={weatherData.sys.sunrise} 
            sunset={weatherData.sys.sunset} 
          />
        )}
        
        {/* Prévisions horaires */}
        <div className="bg-black/30 rounded-xl p-5 backdrop-blur-md border border-white/20 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Prévisions horaires</h2>
          
          {hourlyData.length > 0 ? (
            <>
              <div className="mb-6">
                <TemperatureGraph 
                  data={hourlyData.slice(0, 8).map(item => ({
                    time: formatTime(item.dt).slice(0, 5),
                    temp: Math.round(item.main.temp),
                    icon: item.weather[0].icon
                  }))}
                  height={120}
                />
              </div>
              <HourlyForecastRow data={hourlyData} />
            </>
          ) : (
            <div className="text-gray-400 text-center py-4">Chargement des prévisions...</div>
          )}
              </div>
        
        {/* Conditions météorologiques détaillées */}
        {weatherData && (
          <>
            <h2 className="text-xl font-semibold text-white mt-2">Conditions météo</h2>
            <DetailedWeatherConditions 
              weatherData={weatherData} 
              airQualityData={airQualityData}
              uvIndex={uvIndex}
            />
          </>
        )}
        
        {/* Indices et jauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Colonne 1: UV */}
          <Card className="p-5 bg-black/30 backdrop-blur-md border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">UV</h3>
            <div className="flex justify-center">
              <CircularGauge 
                value={uvIndex} 
                maxValue={11} 
                title="Indice UV" 
                color={
                  uvIndex <= 2 ? "#10b981" : 
                  uvIndex <= 5 ? "#f59e0b" :
                  uvIndex <= 7 ? "#f97316" :
                  uvIndex <= 10 ? "#ef4444" : "#7c3aed"
                }
                size="lg"
                description={getUVIndexDescription(uvIndex)}
              />
            </div>
          </Card>
          
          {/* Colonne 2: Qualité de l'air */}
          <Card className="p-5 bg-black/30 backdrop-blur-md border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">Qualité de l'air</h3>
            <div className="flex justify-center">
              {airQualityData && (
                <CircularGauge 
                  value={airQualityData.aqi} 
                  maxValue={300} 
                  title="IQA" 
                  color={
                    airQualityData.aqi <= 50 ? "#10b981" : 
                    airQualityData.aqi <= 100 ? "#f59e0b" :
                    airQualityData.aqi <= 150 ? "#f97316" :
                    airQualityData.aqi <= 200 ? "#ef4444" : "#7c3aed"
                  }
                  size="lg"
                  description={airQualityData.category}
                />
              )}
            </div>
          </Card>
          
          {/* Colonne 3: Pression */}
          <Card className="p-5 bg-black/30 backdrop-blur-md border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4">Pression atmosphérique</h3>
            <div className="flex justify-center">
              {weatherData && (
                <CircularGauge 
                  value={weatherData.main.pressure} 
                  maxValue={1050} 
                  title="Pression" 
                  unit=" hPa"
                  color="#60a5fa"
                  size="lg"
                  description={weatherData.main.pressure > 1013 ? "Haute pression" : "Basse pression"}
                />
              )}
            </div>
          </Card>
        </div>
        
        {/* Carte météo */}
        <div className="mt-2">
          <h2 className="text-xl font-semibold text-white mb-4">Carte météo</h2>
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/20">
            <WeatherMap 
              location={coords}
              layers={selectedMapLayers}
              onLayerToggle={handleMapLayerToggle}
              apiKey={API_KEY}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage; 