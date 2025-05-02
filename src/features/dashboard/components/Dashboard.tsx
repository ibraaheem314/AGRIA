import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, Cloud, BarChart2, 
  Droplets, Leaf, MapPin, RefreshCw, ThermometerSun, Wind
} from 'lucide-react';
import Card from '../../shared/ui/components/Card';
import Button from '../../shared/ui/components/Button';
import DataCard from '../../shared/ui/components/DataCard';
import { getWeatherData } from '../services/weatherAPI';
import { getClimateData } from '../services/climateAPI';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [climateData, setClimateData] = useState(null);
  
  const PARIS_COORDINATES = {
    lat: 48.8566,
    lon: 2.3522
  };
  
  const FARM_POLYGON = [
    [2.3522, 48.8566],
    [2.3622, 48.8566],
    [2.3622, 48.8666],
    [2.3522, 48.8666],
    [2.3522, 48.8566]
  ];
  
  // Charger les données au chargement de la page
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les données météo
      const weather = await getWeatherData(PARIS_COORDINATES.lat, PARIS_COORDINATES.lon);
      setWeatherData(weather);
      
      // Récupérer les données de climat/sol
      const climate = await getClimateData(FARM_POLYGON);
      setClimateData(climate);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshData = () => {
    fetchDashboardData();
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-1">Overview of your agricultural activities</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          loading={isLoading}
          icon={<RefreshCw size={16} />}
        >
          Refresh
        </Button>
      </div>
      
      {/* Key Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Key Metrics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DataCard
            title="Crop Health Score"
            value="92%"
            icon={<Leaf size={18} />}
            color="success"
            loading={isLoading}
            trend={{ value: 4, isPositive: true, label: "vs. last week" }}
            description="Based on 28 field analyses"
          />
          
          <DataCard
            title="Precipitation"
            value={weatherData ? `${weatherData.rain1h || 0}mm` : "0mm"}
            icon={<Cloud size={18} />}
            color="info"
            loading={isLoading}
            trend={{ value: -12, isPositive: false, label: "vs. average" }}
            description="Recent rainfall amount"
          />
          
          <DataCard
            title="Temperature"
            value={weatherData ? `${Math.round(weatherData.temperature)}°C` : "18°C"}
            icon={<ThermometerSun size={18} />}
            color="warning"
            loading={isLoading}
            description={weatherData ? `Feels like: ${Math.round(weatherData.feelsLike)}°C` : "Loading..."}
          />
          
          <DataCard
            title="Soil Moisture"
            value={climateData ? `${climateData.soilMoisture}%` : "42%"}
            icon={<Droplets size={18} />}
            color="primary"
            loading={isLoading}
            trend={climateData ? { value: 8, isPositive: true } : undefined}
            description="Optimal range: 45-60%"
          />
        </div>
      </section>

      {/* Weather and Climate Details */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Weather & Climate Conditions</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Weather Card */}
          <Card className="p-5 border border-primary/20 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <Cloud size={18} className="mr-2 text-primary" />
                Current Weather
              </h3>
              {weatherData && (
                <div className="text-sm text-text-secondary">
                  {weatherData.cityName}, {weatherData.country}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : weatherData ? (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex flex-col items-center">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
                    alt={weatherData.description}
                    className="w-20 h-20"
                  />
                  <div className="text-center capitalize">{weatherData.description}</div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="text-sm">
                    <div className="text-text-secondary mb-1 flex items-center">
                      <ThermometerSun size={14} className="mr-1" /> Temperature
                    </div>
                    <div className="font-medium">{Math.round(weatherData.temperature)}°C</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-text-secondary mb-1 flex items-center">
                      <Wind size={14} className="mr-1" /> Wind
                    </div>
                    <div className="font-medium">{weatherData.windSpeed} m/s</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-text-secondary mb-1 flex items-center">
                      <Droplets size={14} className="mr-1" /> Humidity
                    </div>
                    <div className="font-medium">{weatherData.humidity}%</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-text-secondary mb-1 flex items-center">
                      <Cloud size={14} className="mr-1" /> Cloud Cover
                    </div>
                    <div className="font-medium">{weatherData.clouds}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-text-secondary text-center py-6">
                Weather data unavailable
              </div>
            )}
          </Card>
          
          {/* Climate Card */}
          <Card className="p-5 border border-primary/20 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <Leaf size={18} className="mr-2 text-primary" />
                Soil & Vegetation Health
              </h3>
            </div>
            
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : climateData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark/30 p-4 rounded-lg">
                    <div className="text-text-secondary text-sm mb-1">Soil Moisture</div>
                    <div className="text-2xl font-bold text-primary">{climateData.soilMoisture}%</div>
                    <div className="mt-2 text-xs text-text-tertiary">
                      {climateData.soilMoisture < 30 
                        ? "Low moisture - consider irrigation" 
                        : climateData.soilMoisture > 70 
                          ? "High moisture - monitor drainage"
                          : "Optimal moisture levels"}
                    </div>
                  </div>
                  
                  <div className="bg-dark/30 p-4 rounded-lg">
                    <div className="text-text-secondary text-sm mb-1">Vegetation Index (NDVI)</div>
                    <div className="text-2xl font-bold text-primary">{climateData.ndvi.toFixed(2)}</div>
                    <div className="mt-2 text-xs text-text-tertiary">
                      {climateData.ndvi < 0.3
                        ? "Poor vegetation health"
                        : climateData.ndvi > 0.6
                          ? "Excellent vegetation health"
                          : "Moderate vegetation health"}
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark/30 p-4 rounded-lg">
                  <div className="text-text-secondary text-sm mb-1">Recent Precipitation</div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold text-primary">{climateData.precipitation}mm</div>
                    <div className="text-text-tertiary text-sm">last 24 hours</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-text-secondary text-center py-6">
                Climate data unavailable
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Performance Data */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Performance Overview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Performance Graph */}
          <Card className="lg:col-span-2 p-5 border border-primary/20 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Crop Performance</h3>
              <div className="text-sm text-text-secondary">Last 12 months</div>
            </div>

            <div className="h-64 relative">
              <div className="absolute inset-x-0 bottom-0 h-64 flex items-end">
                {[35, 45, 30, 65, 50, 60, 70, 55, 80, 75, 65, 90].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 mx-1 rounded-t-sm bg-primary"
                    style={{height: `${height}%`}}
                  >
                    <div className="h-full group relative">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {height}% yield
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">+23%</div>
                  <div className="text-sm text-text-secondary">Annual Growth</div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Tasks List */}
          <Card className="p-5 border border-primary/20 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Upcoming Tasks</h3>
              <Button variant="ghost" size="xs" className="text-text-secondary hover:text-primary">View all</Button>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Field A Irrigation', icon: <Droplets size={14} />, date: "Today", priority: 'high' },
                { title: 'Plant Inspection', icon: <Leaf size={14} />, date: "Tomorrow", priority: 'medium' },
                { title: 'Soil Analysis', icon: <Leaf size={14} />, date: "Thursday", priority: 'medium' },
                { title: 'Supplier Meeting', icon: <Users size={14} />, date: "Friday", priority: 'low' },
              ].map((task, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 border border-primary/20 rounded-lg hover:border-primary/30 transition-colors"
                >
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                  `}></div>
                  <div className="ml-3 mr-auto">
                    <div className="text-sm font-medium">{task.title}</div>
                    <div className="text-xs text-text-secondary">{task.date}</div>
                  </div>
                  <div className="flex-shrink-0 text-text-secondary">
                    {task.icon}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Location Info */}
      <section className="mb-8">
        <Card className="p-4 border border-primary/20 bg-surface">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-primary mr-3" />
            <div>
              <div className="text-sm text-text-secondary">Active Location</div>
              <div className="font-medium">Main Farm - Île-de-France Region</div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
