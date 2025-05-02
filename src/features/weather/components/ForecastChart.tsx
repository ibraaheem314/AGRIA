import React from 'react';
import { Cloud, CloudRain, Sun, Snowflake, CloudLightning, CloudFog, CloudSun } from 'lucide-react';
import Card from "../../shared/ui/components/Card";

interface ForecastPoint {
  time: string;
  hour: string;
  temperature: number;
  icon: string;
  description: string;
  precipitation: number;
}

interface ForecastChartProps {
  data: ForecastPoint[];
  className?: string;
  height?: number;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
  data = [],
  className = '',
  height = 200
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-text-secondary text-center">
          Aucune donnée de prévision disponible
        </div>
      </Card>
    );
  }
  
  // Trouver les températures min et max pour l'échelle
  const temperatures = data.map(point => point.temperature);
  const minTemp = Math.floor(Math.min(...temperatures));
  const maxTemp = Math.ceil(Math.max(...temperatures));
  const range = maxTemp - minTemp;
  
  // Fonction pour obtenir l'icône météo basée sur la description
  const getWeatherIcon = (description: string, size = 20) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('pluie')) {
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
  
  // Convertir la température en position y sur le graphique
  const getYPosition = (temp: number): number => {
    if (range === 0) return 0; // Éviter la division par zéro
    return height - ((temp - minTemp) / range) * height;
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-text mb-4">Prévisions horaires</h3>
      
      <div className="relative" style={{ height: `${height + 100}px` }}>
        {/* Ligne de température et points */}
        <svg 
          viewBox={`0 0 ${data.length * 60} ${height}`} 
          className="w-full absolute top-0 overflow-visible"
          style={{ height }}
        >
          {/* Ligne rouge pour la courbe de température */}
          <path
            d={`M ${data.map((point, index) => (
              `${index * 60 + 30} ${getYPosition(point.temperature)}`
            )).join(' L ')}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="drop-shadow-md"
          />
          
          {/* Points pour chaque prévision */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={index * 60 + 30}
              cy={getYPosition(point.temperature)}
              r="4"
              fill="#ef4444"
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
          
          {/* Labels de température */}
          {data.map((point, index) => (
            <text
              key={`temp-${index}`}
              x={index * 60 + 30}
              y={getYPosition(point.temperature) - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#ef4444"
              fontWeight="bold"
            >
              {Math.round(point.temperature)}°
            </text>
          ))}
        </svg>
        
        {/* Heures, icônes et informations de précipitation */}
        <div className="absolute bottom-0 left-0 right-0 flex" style={{ marginTop: `${height + 10}px` }}>
          {data.map((point, index) => (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center"
              style={{ maxWidth: 60 }}
            >
              <div className="text-text-secondary text-xs mb-1">{point.hour}</div>
              <div className="mb-1">{getWeatherIcon(point.description)}</div>
              {point.precipitation > 0 && (
                <div className={`text-blue-400 text-xs ${point.precipitation > 0.5 ? 'font-medium' : ''}`}>
                  {point.precipitation}mm
                </div>
              )}
              {point.precipitation === 0 && <div className="text-xs text-text-tertiary">0%</div>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Données de prévision simulées pour démonstration
const demoForecastData: ForecastPoint[] = [
  { time: '2023-07-22T17:00', hour: '17:00', temperature: 27, icon: 'sun', description: 'clear sky', precipitation: 0 },
  { time: '2023-07-22T20:00', hour: '20:00', temperature: 24, icon: 'cloud', description: 'few clouds', precipitation: 0 },
  { time: '2023-07-22T23:00', hour: '23:00', temperature: 19, icon: 'cloud', description: 'broken clouds', precipitation: 0 },
  { time: '2023-07-23T02:00', hour: '02:00', temperature: 16, icon: 'cloud', description: 'overcast clouds', precipitation: 0 },
  { time: '2023-07-23T05:00', hour: '05:00', temperature: 13, icon: 'moon', description: 'clear sky', precipitation: 0 },
  { time: '2023-07-23T08:00', hour: '08:00', temperature: 16, icon: 'sun', description: 'clear sky', precipitation: 0 },
  { time: '2023-07-23T11:00', hour: '11:00', temperature: 23, icon: 'sun', description: 'clear sky', precipitation: 0 },
  { time: '2023-07-23T14:00', hour: '14:00', temperature: 28, icon: 'sun', description: 'clear sky', precipitation: 0 },
];

// Version du composant avec données de démonstration pour faciliter l'utilisation
export const DemoForecastChart: React.FC<Omit<ForecastChartProps, 'data'>> = (props) => {
  return <ForecastChart {...props} data={demoForecastData} />;
};

export default ForecastChart; 