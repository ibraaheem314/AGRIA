import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CloudDrizzle, CloudRain, CloudSnow, Sun, Sunrise, Sunset, Thermometer, Wind, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';

// Simuler les bibliothèques de graphiques - dans une application réelle, utiliser des bibliothèques comme recharts, visx, ou d3
// Types pour les données
interface WeatherDataPoint {
  date: string;
  time: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  weatherCode: number;
  uvIndex: number;
  soilMoisture: number;
}

export interface WeatherChartProps {
  data: WeatherDataPoint[];
  type: 'daily' | 'hourly' | 'forecast' | 'weekly' | 'monthly';
  timeframe?: 'day' | 'week' | 'month' | 'weekly' | 'monthly';
  metric?: 'temperature' | 'precipitation' | 'humidity' | 'wind' | 'pressure' | 'uv' | 'soilMoisture';
  location?: string;
  className?: string;
  loading?: boolean;
  onTimeframeChange?: (timeframe: 'day' | 'week' | 'month' | 'weekly' | 'monthly') => void;
  onMetricChange?: (metric: 'temperature' | 'precipitation' | 'humidity' | 'wind' | 'pressure' | 'uv' | 'soilMoisture') => void;
}

// Fonction pour récupérer la couleur d'un gradient basé sur une valeur
const getTemperatureColor = (temp: number): string => {
  if (temp <= 0) return '#9DB7FB';
  if (temp <= 10) return '#64B5F6'; 
  if (temp <= 20) return '#81C784';
  if (temp <= 30) return '#FFD54F';
  if (temp <= 35) return '#FF9800';
  return '#F44336';
};

// Fonction pour obtenir l'icône météo basée sur le code
const getWeatherIcon = (code: number) => {
  // Codes simplifiés pour l'exemple
  if (code >= 200 && code < 300) return <CloudDrizzle className="text-blue-400" />; // Orage
  if (code >= 300 && code < 400) return <CloudDrizzle className="text-blue-300" />; // Bruine
  if (code >= 500 && code < 600) return <CloudRain className="text-blue-500" />; // Pluie
  if (code >= 600 && code < 700) return <CloudSnow className="text-slate-200" />; // Neige
  if (code >= 800 && code < 801) return <Sun className="text-yellow-400" />; // Ciel clair
  return <CloudDrizzle className="text-slate-400" />; // Par défaut
};

// Composant de ligne de graphique animée
const AnimatedLine: React.FC<{
  points: { x: number, y: number, value: number }[];
  color: string;
  isActive: boolean;
}> = ({ points, color, isActive }) => {
  if (points.length === 0) return null;

  let path = `M ${points[0].x} ${points[0].y}`;
  points.forEach((point, i) => {
    if (i > 0) {
      path += ` L ${point.x} ${point.y}`;
    }
  });

  return (
    <motion.path
      d={path}
      stroke={color}
      strokeWidth={isActive ? 3 : 2}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1, 
        opacity: isActive ? 1 : 0.7,
        strokeWidth: isActive ? 3 : 2
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  );
};

// Composant des points sur le graphique
const DataPoints: React.FC<{
  points: { x: number, y: number, value: number, date: string, time: string, weather: number }[];
  color: string;
  isActive: boolean;
  onHoverPoint: (idx: number | null) => void;
  activePoint: number | null;
}> = ({ points, color, isActive, onHoverPoint, activePoint }) => {
  return (
    <>
      {points.map((point, idx) => (
        <motion.g key={idx}>
          <motion.circle
            cx={point.x}
            cy={point.y}
            r={activePoint === idx ? 6 : 4}
            fill={isActive ? color : '#fff'}
            stroke={color}
            strokeWidth={2}
            className="cursor-pointer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: activePoint === idx ? 1.2 : 1, 
              opacity: 1,
              fill: activePoint === idx ? color : (isActive ? color : '#fff')
            }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
            onMouseEnter={() => onHoverPoint(idx)}
            onMouseLeave={() => onHoverPoint(null)}
          />
          
          {activePoint === idx && (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <rect
                x={point.x - 50}
                y={point.y - 70}
                width={100}
                height={50}
                rx={4}
                fill="rgba(0,0,0,0.8)"
                className="dark:fill-surface"
              />
              <text
                x={point.x}
                y={point.y - 55}
                textAnchor="middle"
                className="text-xs fill-white dark:fill-text font-medium"
              >
                {point.value}°C
              </text>
              <text
                x={point.x}
                y={point.y - 40}
                textAnchor="middle"
                className="text-xs fill-gray-300 dark:fill-text-secondary"
              >
                {point.time}, {point.date}
              </text>
              <g transform={`translate(${point.x + 30}, ${point.y - 55})`}>
                {getWeatherIcon(point.weather)}
              </g>
            </motion.g>
          )}
        </motion.g>
      ))}
    </>
  );
};

const WeatherChart: React.FC<WeatherChartProps> = ({
  data = [],
  type = 'daily',
  timeframe = 'day',
  metric = 'temperature',
  location,
  className = '',
  loading = false,
  onTimeframeChange,
  onMetricChange
}) => {
  // Gestion de l'état des points survolés
  const [activePoint, setActivePoint] = useState<number | null>(null);
  
  // Gestion des métriques actives
  const [activeMetric, setActiveMetric] = useState<string>(metric);
  
  // Gestion des métriques disponibles
  const metrics = [
    { id: 'temperature', label: 'Température', icon: <Thermometer size={16} /> },
    { id: 'precipitation', label: 'Précipitations', icon: <CloudRain size={16} /> },
    { id: 'humidity', label: 'Humidité', icon: <CloudDrizzle size={16} /> },
    { id: 'wind', label: 'Vent', icon: <Wind size={16} /> },
  ];
  
  // Gestion des périodes disponibles
  const timeframes = [
    { id: 'day', label: 'Journée' },
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
  ];

  // Changement de métrique
  const handleMetricChange = (metric: string) => {
    setActiveMetric(metric);
    onMetricChange?.(metric as any);
  };

  // Changement de période
  const handleTimeframeChange = (timeframe: 'day' | 'week' | 'month' | 'weekly' | 'monthly') => {
    onTimeframeChange?.(timeframe);
  };

  // Générer des points de données pour le graphique
  const generateChartPoints = () => {
    // Dans une implémentation réelle, calculer ces points à partir des données
    const chartHeight = 200;
    const chartWidth = 700;
    const padding = 40;
    
    // Limiter le nombre de points selon la période
    const limitedData = data.slice(0, timeframe === 'day' ? 24 : (timeframe === 'week' ? 7 : 30));
    
    // Calculer l'espacement horizontal
    const step = (chartWidth - padding * 2) / (limitedData.length - 1);
    
    // Trouver les valeurs min et max pour l'échelle
    const values = limitedData.map(d => d.temperature);
    const minValue = Math.min(...values) - 2;
    const maxValue = Math.max(...values) + 2;
    const valueRange = maxValue - minValue;
    
    // Créer les points
    return limitedData.map((d, i) => {
      const x = padding + i * step;
      const normalizedValue = (d.temperature - minValue) / valueRange;
      const y = chartHeight - padding - normalizedValue * (chartHeight - padding * 2);
      
      return {
        x,
        y,
        value: d.temperature,
        date: d.date,
        time: d.time,
        weather: d.weatherCode
      };
    });
  };

  // Points pour le graphique
  const chartPoints = generateChartPoints();

  // Formater la date pour l'affichage
  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    
    if (timeframe === 'daily') {
      return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date);
    } else if (timeframe === 'weekly') {
      return `Sem. ${getWeekNumber(date)}`;
    } else {
      return new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date);
    }
  };

  // Obtenir le numéro de semaine
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Agréger les données selon la période sélectionnée
  const aggregatedData = useMemo(() => {
    if (timeframe === 'daily') {
      return data;
    }

    const aggregated: Record<string, { 
      values: number[], 
      dates: string[],
      key: string
    }> = {};

    data.forEach(point => {
      const date = new Date(point.date);
      let key: string;
      
      if (timeframe === 'weekly') {
        const weekNum = getWeekNumber(date);
        key = `${date.getFullYear()}-W${weekNum}`;
      } else { // monthly
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!aggregated[key]) {
        aggregated[key] = { 
          values: [], 
          dates: [],
          key
        };
      }

      aggregated[key].values.push(point[metric]);
      aggregated[key].dates.push(point.date);
    });

    // Calculer les moyennes et convertir en tableau
    return Object.values(aggregated).map(group => {
      const sum = group.values.reduce((acc, val) => acc + val, 0);
      const average = sum / group.values.length;
      
      // Utiliser la date médiane du groupe pour l'affichage
      const sortedDates = [...group.dates].sort();
      const medianDate = sortedDates[Math.floor(sortedDates.length / 2)];
      
      return {
        date: medianDate,
        [metric]: average,
        temperature: 0,
        precipitation: 0,
        humidity: 0,
        soilMoisture: 0,
        windSpeed: 0,
        groupKey: group.key
      } as WeatherDataPoint & { groupKey: string };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, metric, timeframe]);

  // Obtenir les valeurs min et max pour l'échelle
  const maxValue = Math.max(...data.map(d => d[metric])) * 1.1;
  const minValue = Math.min(...data.map(d => d[metric])) * 0.9;

  // Obtenir l'unité pour la métrique
  const getUnit = (): string => {
    switch (metric) {
      case 'temperature':
        return '°C';
      case 'precipitation':
        return 'mm';
      case 'humidity':
      case 'soilMoisture':
        return '%';
      default:
        return '';
    }
  };

  // Obtenir la couleur pour la métrique
  const getMetricColor = (): string => {
    switch (metric) {
      case 'temperature':
        return '#ef4444'; // red-500
      case 'precipitation':
        return '#3b82f6'; // blue-500
      case 'humidity':
        return '#8b5cf6'; // violet-500
      case 'soilMoisture':
        return '#10b981'; // emerald-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  // Calculer la hauteur relative de la barre/point
  const calculateHeight = (value: number): number => {
    const range = maxValue - minValue;
    if (range === 0) return 0;
    return ((value - minValue) / range) * 100;
  };

  return (
    <div className={`bg-surface p-4 rounded-lg shadow-sm border border-border ${className}`}>
      {/* En-tête du graphique */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-text mb-1">
            {type === 'daily' ? 'Prévisions de la journée' : 
             type === 'hourly' ? 'Prévisions horaires' : 
             type === 'weekly' ? 'Prévisions hebdomadaires' :
             type === 'monthly' ? 'Prévisions mensuelles' : 'Prévisions à long terme'}
          </h3>
          {location && (
            <div className="flex items-center text-text-secondary text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              {type === 'daily' && (
                <>
                  <Sunrise size={14} className="ml-3 mr-1" />
                  <span>6:32</span>
                  <Sunset size={14} className="ml-3 mr-1" />
                  <span>20:45</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Filtres et sélecteurs */}
        <div className="flex mt-3 sm:mt-0">
          <div className="flex space-x-1 text-xs bg-surface-2 rounded-md p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeframe === tf.id ? 'bg-primary text-white' : 'text-text-secondary hover:text-text hover:bg-surface-3'
                }`}
                onClick={() => handleTimeframeChange(tf.id as any)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Options de métriques */}
      <div className="flex flex-wrap items-center space-x-2 mb-6">
        {metrics.map((m) => (
          <button
            key={m.id}
            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
              activeMetric === m.id 
                ? 'bg-primary/10 text-primary border border-primary/30' 
                : 'text-text-secondary hover:bg-surface-2 border border-transparent'
            }`}
            onClick={() => handleMetricChange(m.id)}
          >
            <span className="mr-1">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Graphique */}
      <div className="relative h-[250px] w-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
            {/* Arrière-plan du graphique et grille */}
            <rect x="0" y="0" width="800" height="250" fill="transparent" />
            
            {/* Lignes horizontales de la grille */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-h-${i}`}
                x1="40"
                y1={50 + i * 40}
                x2="760"
                y2={50 + i * 40}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4,6"
                strokeWidth="1"
              />
            ))}
            
            {/* Ligne principale */}
            <AnimatedLine 
              points={chartPoints} 
              color={getTemperatureColor(
                chartPoints.length > 0 ? chartPoints[activePoint || 0]?.value : 20
              )} 
              isActive={true} 
            />
            
            {/* Points de données */}
            <DataPoints 
              points={chartPoints} 
              color={getTemperatureColor(
                chartPoints.length > 0 ? chartPoints[activePoint || 0]?.value : 20
              )} 
              isActive={true}
              onHoverPoint={setActivePoint}
              activePoint={activePoint}
            />
            
            {/* Axe X */}
            <line
              x1="40"
              y1="210"
              x2="760"
              y2="210"
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            
            {/* Libellés d'axes X (temps) */}
            {chartPoints.filter((_, i) => i % Math.max(1, Math.floor(chartPoints.length / 6)) === 0).map((point, i) => (
              <text
                key={`x-label-${i}`}
                x={point.x}
                y="230"
                textAnchor="middle"
                className="text-xs fill-text-secondary"
              >
                {type === 'hourly' ? point.time : point.date}
              </text>
            ))}
            
            {/* Libellés d'axe Y (température) */}
            {[0, 5, 10, 15, 20, 25, 30].map((temp, i) => (
              <text
                key={`y-label-${i}`}
                x="30"
                y={210 - i * 30}
                textAnchor="end"
                className="text-xs fill-text-secondary"
              >
                {temp}°
              </text>
            ))}
          </svg>
        )}
      </div>
      
      {/* Légende ou résumé en bas */}
      <div className="mt-4 text-sm text-text-secondary">
        {type === 'forecast' && 
          <p>Prévisions basées sur les données des 5 derniers jours avec 80% de précision.</p>
        }
        {type === 'daily' && chartPoints.length > 0 && (
          <div className="flex justify-between">
            <span>Température min: {Math.min(...chartPoints.map(p => p.value))}°C</span>
            <span>Température max: {Math.max(...chartPoints.map(p => p.value))}°C</span>
            <span>Moyenne: {Math.round(chartPoints.reduce((sum, p) => sum + p.value, 0) / chartPoints.length)}°C</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherChart; 