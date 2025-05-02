import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Card from "../../shared/ui/components/Card";

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TemperatureChartProps {
  forecast: Array<{
    dt: number; // timestamp
    temp: number; // température
    icon?: string; // icône météo (optionnel)
  }>;
  title?: string;
  className?: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ 
  forecast, 
  title = 'Évolution de la température', 
  className = '' 
}) => {
  // Formater les heures pour l'axe X
  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Préparer les données pour le graphique
  const labels = forecast.map(item => formatHour(item.dt));
  const temperatures = forecast.map(item => item.temp);
  
  // Déterminer les températures min et max pour le style
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  
  // Configuration du graphique
  const data = {
    labels,
    datasets: [
      {
        label: 'Température (°C)',
        data: temperatures,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        min: Math.floor(minTemp) - 1,
        max: Math.ceil(maxTemp) + 1,
        ticks: {
          callback: function(value: any) {
            return `${value}°C`;
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-gray-500">Prévisions sur les prochaines heures</p>
      </div>
      
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      
      {/* Légende minimaliste */}
      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
          <span className="text-gray-500">Température</span>
        </div>
        <div className="text-gray-500">
          <span className="font-medium">Min: {Math.round(minTemp)}°C</span>
          <span className="mx-2">|</span>
          <span className="font-medium">Max: {Math.round(maxTemp)}°C</span>
        </div>
      </div>
    </Card>
  );
};

export default TemperatureChart; 