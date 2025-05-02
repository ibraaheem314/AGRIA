import React from 'react';
import { 
  Thermometer, Cloud, Droplets, Wind, 
  Umbrella, Sun, ArrowDown, Gauge, 
  CloudSun, CloudOff
} from 'lucide-react';
import Card from "../../shared/ui/components/Card";
import useWeather from '../../hooks/useWeather';

interface WeatherDetailsPanelProps {
  lat?: number;
  lon?: number;
  className?: string;
}

interface DetailCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  secondaryInfo?: React.ReactNode;
}

const DetailCard: React.FC<DetailCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  color = 'primary',
  secondaryInfo
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col h-full">
        <h3 className="text-base font-medium text-text mb-1">{title}</h3>
        
        <div className="flex justify-between items-start mb-auto">
          <div className="flex items-center">
            <div className={`text-4xl font-semibold text-text mt-2`}>
              {value}
            </div>
          </div>
          <div className={`text-${color} p-3 bg-${color}/10 rounded-full`}>
            {icon}
          </div>
        </div>
        
        {description && (
          <div className="text-sm text-text-secondary mt-2">
            {description}
          </div>
        )}
        
        {secondaryInfo && (
          <div className="mt-2">
            {secondaryInfo}
          </div>
        )}
      </div>
    </Card>
  );
};

const CircularGauge: React.FC<{
  value: number;
  max: number;
  label: string;
  size?: number;
  thickness?: number;
  color?: string;
}> = ({ value, max, label, size = 120, thickness = 6, color = 'primary' }) => {
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = (normalizedValue / max) * 100;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-${color}`}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="flex flex-col items-center justify-center absolute"
        style={{ width: size, height: size }}
      >
        <span className={`text-2xl font-bold text-${color}`}>{value}</span>
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
    </div>
  );
};

const WeatherDetailsPanel: React.FC<WeatherDetailsPanelProps> = ({
  lat = 48.8566,
  lon = 2.3522,
  className = ''
}) => {
  const { data, loading, error } = useWeather(lat, lon);
  
  // Convertir la direction du vent en point cardinal
  const getWindDirection = (degrees?: number) => {
    if (degrees === undefined) return 'N/A';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };
  
  // Déterminer le niveau de pression
  const getPressureLevel = (pressure?: number) => {
    if (!pressure) return 'N/A';
    if (pressure > 1020) return 'Haute pression';
    if (pressure < 1000) return 'Basse pression';
    return 'Pression normale';
  };
  
  // Décrire la couverture nuageuse
  const getCloudCover = (clouds?: number) => {
    if (clouds === undefined) return 'N/A';
    if (clouds < 10) return 'Ensoleillé';
    if (clouds < 30) return 'Peu nuageux';
    if (clouds < 70) return 'Partiellement nuageux';
    return 'Nuageux';
  };
  
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-danger">
          Erreur lors du chargement des données météo: {error}
        </div>
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-text-secondary">
          Aucune donnée météo disponible
        </div>
      </Card>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <DetailCard
        title="Température"
        value={`${Math.round(data.temperature)}°`}
        icon={<Thermometer size={24} />}
        color="accent"
        description={`Stable à ${Math.round(data.temperature)}°`}
        secondaryInfo={
          <div className="text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Ressenti</span>
              <span className="font-medium text-text">{Math.round(data.feelsLike)}°</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Facteur dominant</span>
              <span className="font-medium text-text">température</span>
            </div>
          </div>
        }
      />
      
      <DetailCard
        title="Couverture nuageuse"
        value={`${data.clouds}%`}
        icon={data.clouds < 50 ? <CloudSun size={24} /> : <Cloud size={24} />}
        color={data.clouds < 30 ? "warning" : "secondary"}
        description={getCloudCover(data.clouds)}
        secondaryInfo={
          <div className="flex justify-center mt-4">
            <div className="bg-gray-800 p-6 rounded-full">
              <Sun size={32} className="text-yellow-400" />
            </div>
          </div>
        }
      />
      
      <DetailCard
        title="Précipitations"
        value={`${data.rain1h || 0} mm`}
        icon={<Umbrella size={24} />}
        color="primary"
        description="Dans les prochaines 24 heures"
      />
      
      <DetailCard
        title="Pression atmosphérique"
        value={`${data.pressure} hPa`}
        icon={<Gauge size={24} />}
        color="secondary"
        description={getPressureLevel(data.pressure)}
        secondaryInfo={
          <div className="flex justify-center">
            <CircularGauge 
              value={data.pressure} 
              max={1050} 
              label="hPa" 
              color={data.pressure > 1020 ? "info" : data.pressure < 1000 ? "warning" : "accent"}
            />
          </div>
        }
      />
      
      <DetailCard
        title="Humidité"
        value={`${data.humidity}%`}
        icon={<Droplets size={24} />}
        color="primary"
        description={data.humidity > 70 ? "Élevée" : data.humidity < 30 ? "Faible" : "Normale"}
        secondaryInfo={
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${data.humidity}%` }}
            ></div>
          </div>
        }
      />
      
      <DetailCard
        title="Vent"
        value={`${Math.round(data.windSpeed * 3.6)} km/h`}
        icon={<Wind size={24} />}
        color="info"
        description={`Direction: ${getWindDirection(data.windDirection)}`}
        secondaryInfo={
          <div className="flex justify-center mt-2">
            <div className="relative inline-flex">
              <div className="p-4 rounded-full bg-gray-800">
                <ArrowDown 
                  size={24} 
                  className="text-info"
                  style={{ transform: `rotate(${data.windDirection}deg)` }} 
                />
              </div>
            </div>
          </div>
        }
      />
      
      <DetailCard
        title="Visibilité"
        value={`${data.visibility / 1000} km`}
        icon={<CloudOff size={24} />}
        color="secondary"
        description={data.visibility >= 10000 ? "Excellente" : data.visibility >= 5000 ? "Bonne" : "Réduite"}
      />
      
      <DetailCard
        title="Indice UV"
        value="5"
        icon={<Sun size={24} />}
        color="warning"
        description="Modéré"
        secondaryInfo={
          <div className="flex justify-center mt-2">
            <CircularGauge 
              value={5} 
              max={11} 
              label="UV" 
              size={100}
              color="warning"
            />
          </div>
        }
      />
    </div>
  );
};

export default WeatherDetailsPanel; 