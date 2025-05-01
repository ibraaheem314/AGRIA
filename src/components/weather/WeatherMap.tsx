import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { 
  MapPin, 
  Layers, 
  Cloud, 
  Thermometer, 
  Wind, 
  CloudRain, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';
import { config } from '../../../lib/config';

interface WeatherMapProps {
  lat?: number;
  lon?: number;
  className?: string;
  apiKey?: string;
}

const WeatherMap: React.FC<WeatherMapProps> = ({
  lat = 48.8566,
  lon = 2.3522,
  className = '',
  apiKey = config.weather.openWeather.apiKey // Use the API key from config as default
}) => {
  // État simplifié
  const [activeLayers, setActiveLayers] = useState<string[]>(['clouds']);
  const [expanded, setExpanded] = useState(true);
  
  // Determine whether to show the actual map or a fallback
  const hasApiKey = apiKey && apiKey !== 'your_openweather_api_key_here';
  
  // Debug info
  console.log('WeatherMap rendering', { lat, lon, apiKey, className, hasApiKey });
  
  // Options de couches
  const layers = [
    { id: 'clouds', label: 'Nuages', icon: <Cloud size={16} />, color: 'secondary' },
    { id: 'precipitation', label: 'Précipitations', icon: <CloudRain size={16} />, color: 'primary' },
    { id: 'temp', label: 'Température', icon: <Thermometer size={16} />, color: 'warning' },
    { id: 'wind', label: 'Vent', icon: <Wind size={16} />, color: 'info' }
  ];
  
  // Gestion des couches
  const toggleLayer = (layerId: string) => {
    if (activeLayers.includes(layerId)) {
      setActiveLayers(activeLayers.filter(id => id !== layerId));
    } else {
      setActiveLayers([...activeLayers, layerId]);
    }
  };
  
  // Construire l'URL de la carte
  const getMapUrl = (layer: string) => {
    return `https://tile.openweathermap.org/map/${layer}/1/1/1.png?appid=${apiKey}`;
  };
  
  return (
    <Card className={`${className} overflow-hidden border border-gray-800`}>
      <div className="relative bg-gray-900 h-[300px] md:h-[400px] flex items-center justify-center">
        {hasApiKey ? (
          <>
            {/* Actual OpenWeatherMap layers */}
            <div className="absolute inset-0 z-0">
              <iframe 
                src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=10&appid=${apiKey}`}
                className="w-full h-full border-0"
                title="OpenWeatherMap"
              ></iframe>
            </div>
            
            {/* Layer controls */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg">
                <div className="flex flex-col gap-2">
                  {layers.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                        activeLayers.includes(layer.id) 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {layer.icon}
                      <span>{layer.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Fallback static map */}
            <div className="absolute inset-0 bg-gray-900 z-0">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-center p-4">
                  <div className="mb-4">
                    <MapPin size={50} className="mx-auto text-primary/40 mb-2" />
                    <p className="text-lg font-medium text-gray-300">Carte météo</p>
                    <p className="text-sm text-gray-500 mt-1">Coordonnées: {lat.toFixed(2)}, {lon.toFixed(2)}</p>
                    {!hasApiKey && (
                      <p className="text-xs text-amber-500 mt-2">API key manquante ou invalide</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-6">
                    {layers.map(layer => (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        className={`px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                          activeLayers.includes(layer.id) 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                      >
                        {layer.icon}
                        <span>{layer.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Cercle indiquant la position */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div className="w-16 h-16 rounded-full border border-primary/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-32 h-32 rounded-full border border-primary/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Information en bas */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white/80">
            {activeLayers.length === 0 ? 'Aucune couche météo sélectionnée' : (
              <>Affichage: {activeLayers.map(id => {
                const layer = layers.find(l => l.id === id);
                return layer?.label;
              }).join(', ')}</>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherMap; 