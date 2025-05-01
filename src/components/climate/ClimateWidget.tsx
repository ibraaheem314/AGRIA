import React from 'react';
import useClimate from '../../hooks/useClimate';
import { Leaf, Droplets, Cloud } from 'lucide-react';
import Card from '../ui/Card';

interface ClimateWidgetProps {
  coordinates?: number[][];
  className?: string;
}

const ClimateWidget: React.FC<ClimateWidgetProps> = ({ 
  // Default coordinates polygon (example of a small field)
  coordinates = [
    [2.3522, 48.8566],
    [2.3622, 48.8566],
    [2.3622, 48.8666],
    [2.3522, 48.8666],
    [2.3522, 48.8566]
  ],
  className = ''
}) => {
  const { data, loading, error, refetch } = useClimate(coordinates);
  
  const getColorForValue = (value: number, max: number) => {
    if (value < max * 0.25) return 'text-red-500';
    if (value < max * 0.5) return 'text-yellow-500';
    if (value < max * 0.75) return 'text-green-400';
    return 'text-green-500';
  };
  
  const getSoilMoistureStatus = (value: number) => {
    if (value < 20) return 'Très sec';
    if (value < 35) return 'Sec';
    if (value < 50) return 'Modéré';
    if (value < 65) return 'Bon';
    return 'Humide';
  };
  
  const getNDVIStatus = (value: number) => {
    if (value < 0.2) return 'Pauvre';
    if (value < 0.4) return 'Modéré';
    if (value < 0.6) return 'Bon';
    return 'Excellent';
  };
  
  return (
    <Card 
      className={`p-4 ${className}`}
      variant="gradient"
    >
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Données climatiques</h3>
          <p className="text-sm text-gray-300">
            Mise à jour en temps réel
          </p>
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
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Droplets className="text-blue-400 mr-2" size={18} />
                    <span className="text-gray-200">Humidité du sol</span>
                  </div>
                  <span className={`text-lg font-medium ${getColorForValue(data.soilMoisture, 100)}`}>
                    {data.soilMoisture}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${data.soilMoisture}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {getSoilMoistureStatus(data.soilMoisture)}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Leaf className="text-green-400 mr-2" size={18} />
                    <span className="text-gray-200">Indice de végétation (NDVI)</span>
                  </div>
                  <span className={`text-lg font-medium ${getColorForValue(data.ndvi, 1)}`}>
                    {data.ndvi.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${data.ndvi * 100}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {getNDVIStatus(data.ndvi)}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Cloud className="text-blue-300 mr-2" size={18} />
                    <span className="text-gray-200">Précipitations récentes</span>
                  </div>
                  <span className="text-lg font-medium text-blue-400">
                    {data.precipitation} mm
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => refetch(coordinates)} 
              className="text-xs text-primary hover:text-primary-400 self-end"
            >
              Actualiser
            </button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ClimateWidget; 