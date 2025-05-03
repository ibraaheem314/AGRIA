import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '../components/tables/DataTable';
import { BarChart, DownloadCloud, Filter, Layers, RefreshCw } from 'lucide-react';
import WeatherChart from '../components/charts/WeatherChart';

// Interface pour les données agricoles
interface CropData {
  id: string;
  cropName: string;
  soilType: string;
  growthStage: string;
  plantDate: string;
  estimatedYield: number;
  waterUsage: number;
  nutrientLevels: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  healthScore: number;
  lastInspection: string;
  fieldLocation: string;
  area: number;
}

// Interface pour les données météo agrégées
interface WeatherDataPoint {
  date: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  soilMoisture: number;
  windSpeed: number;
}

const AgricultureDataPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crops' | 'weather'>('crops');
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'precipitation' | 'humidity' | 'soilMoisture'>('soilMoisture');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      // Générer des données de test
      setCropData(generateCropData());
      setWeatherData(generateWeatherData());
      setLoading(false);
    }, 1000);
  }, []);

  // Colonnes pour le tableau des cultures
  const cropColumns: Column<CropData>[] = [
    {
      id: 'cropName',
      header: 'Culture',
      accessor: (row) => row.cropName,
      sortable: true,
      filterable: true,
    },
    {
      id: 'growthStage',
      header: 'Stade',
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthStageColor(row.growthStage)}`}>
          {row.growthStage}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'plantDate',
      header: 'Date de plantation',
      accessor: (row) => formatDate(row.plantDate),
      sortable: true,
    },
    {
      id: 'healthScore',
      header: 'Santé',
      accessor: (row) => (
        <div className="flex items-center">
          <div className="w-full bg-surface-3 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getHealthScoreColor(row.healthScore)}`}
              style={{ width: `${row.healthScore}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs">{row.healthScore}%</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'waterUsage',
      header: 'Eau (L/m²)',
      accessor: (row) => row.waterUsage.toFixed(1),
      sortable: true,
      align: 'right',
    },
    {
      id: 'estimatedYield',
      header: 'Rendement est.',
      accessor: (row) => `${row.estimatedYield.toFixed(1)} t/ha`,
      sortable: true,
      align: 'right',
    },
    {
      id: 'area',
      header: 'Superficie',
      accessor: (row) => `${row.area.toFixed(1)} ha`,
      sortable: true,
      align: 'right',
    },
    {
      id: 'fieldLocation',
      header: 'Emplacement',
      accessor: (row) => row.fieldLocation,
      sortable: true,
    },
  ];

  // Fonction pour obtenir la couleur du stade de croissance
  const getGrowthStageColor = (stage: string): string => {
    switch (stage) {
      case 'Germination':
        return 'bg-blue-100 text-blue-800';
      case 'Croissance':
        return 'bg-green-100 text-green-800';
      case 'Floraison':
        return 'bg-purple-100 text-purple-800';
      case 'Maturation':
        return 'bg-yellow-100 text-yellow-800';
      case 'Récolte':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir la couleur du score de santé
  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Formater la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Générer des données fictives pour les cultures
  const generateCropData = (): CropData[] => {
    const cropTypes = ['Blé', 'Maïs', 'Soja', 'Tournesol', 'Orge', 'Colza', 'Luzerne', 'Pomme de terre'];
    const soilTypes = ['Argileux', 'Limoneux', 'Sableux', 'Calcaire', 'Humifère'];
    const growthStages = ['Germination', 'Croissance', 'Floraison', 'Maturation', 'Récolte'];
    const locations = ['Parcelle Nord', 'Parcelle Sud', 'Parcelle Est', 'Parcelle Ouest', 'Zone Centrale'];

    return Array.from({ length: 20 }, (_, i) => {
      const healthScore = Math.floor(Math.random() * 100);
      const plantDate = new Date();
      plantDate.setDate(plantDate.getDate() - Math.floor(Math.random() * 90));

      return {
        id: `crop-${i}`,
        cropName: cropTypes[Math.floor(Math.random() * cropTypes.length)],
        soilType: soilTypes[Math.floor(Math.random() * soilTypes.length)],
        growthStage: growthStages[Math.floor(Math.random() * growthStages.length)],
        plantDate: plantDate.toISOString().split('T')[0],
        estimatedYield: 3 + Math.random() * 5,
        waterUsage: 10 + Math.random() * 30,
        nutrientLevels: {
          nitrogen: Math.floor(Math.random() * 100),
          phosphorus: Math.floor(Math.random() * 100),
          potassium: Math.floor(Math.random() * 100),
        },
        healthScore,
        lastInspection: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        fieldLocation: locations[Math.floor(Math.random() * locations.length)],
        area: 0.5 + Math.random() * 5,
      };
    });
  };

  // Générer des données météorologiques fictives
  const generateWeatherData = (): WeatherDataPoint[] => {
    const data: WeatherDataPoint[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 31; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        temperature: 15 + Math.random() * 15,
        precipitation: Math.random() * 10,
        humidity: 40 + Math.random() * 40,
        soilMoisture: 20 + Math.random() * 60,
        windSpeed: Math.random() * 20,
      });
    }

    return data;
  };

  // Gestionnaire pour le clic sur une ligne
  const handleRowClick = (row: CropData) => {
    console.log('Détails de la culture:', row);
    // Vous pourriez ouvrir un modal ou naviguer vers une page de détails
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Données Agricoles</h1>
            <p className="text-gray-500 mt-1">
              Visualisez et analysez vos données de cultures et conditions météorologiques
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
              <Filter size={16} className="mr-1.5 text-gray-500" />
              Filtres
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm">
              <DownloadCloud size={16} className="mr-1.5 text-gray-500" />
              Exporter
            </button>
            <button className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors">
              <RefreshCw size={16} className="mr-1.5" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`
                py-4 px-6 font-medium text-sm border-b-2 focus:outline-none
                ${activeTab === 'crops'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              onClick={() => setActiveTab('crops')}
            >
              <Layers size={16} className="inline-block mr-2" />
              Cultures
            </button>
            <button
              className={`
                py-4 px-6 font-medium text-sm border-b-2 focus:outline-none
                ${activeTab === 'weather'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              onClick={() => setActiveTab('weather')}
            >
              <BarChart size={16} className="inline-block mr-2" />
              Météo & Environnement
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'crops' ? (
            <>
              {/* Panneau des cultures */}
              <div className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Données des cultures</h2>
                <div className="flex gap-2">
                  <select className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg py-2 px-3 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none text-sm">
                    <option value="all">Toutes les cultures</option>
                    <option value="ble">Blé</option>
                    <option value="mais">Maïs</option>
                    <option value="orge">Orge</option>
                  </select>
                  <select className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg py-2 px-3 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none text-sm">
                    <option value="all">Tous les champs</option>
                    <option value="nord">Parcelles Nord</option>
                    <option value="sud">Parcelles Sud</option>
                  </select>
                </div>
              </div>

              {/* Statistiques résumées */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700">
                      <Layers size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Total des cultures</p>
                      <p className="text-xl font-medium text-gray-800">{cropData.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Santé moyenne</p>
                      <p className="text-xl font-medium text-gray-800">
                        {cropData.length > 0
                          ? `${Math.round(cropData.reduce((sum, crop) => sum + crop.healthScore, 0) / cropData.length)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Superficie cultivée</p>
                      <p className="text-xl font-medium text-gray-800">
                        {cropData.length > 0
                          ? `${cropData.reduce((sum, crop) => sum + crop.area, 0).toFixed(1)} ha`
                          : '0 ha'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Rendement projeté</p>
                      <p className="text-xl font-medium text-gray-800">
                        {cropData.length > 0
                          ? `${cropData.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)} t`
                          : '0 t'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tableau des cultures */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {loading ? (
                  <div className="py-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Chargement des données...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {cropColumns.map((column) => (
                            <th
                              key={column.id}
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                column.align === 'right' ? 'text-right' : ''
                              }`}
                            >
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cropData.map((row) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(row)}
                          >
                            {cropColumns.map((column) => (
                              <td
                                key={`${row.id}-${column.id}`}
                                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${
                                  column.align === 'right' ? 'text-right' : ''
                                }`}
                              >
                                {column.accessor(row)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Panneau météo */}
              <div className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Données météorologiques</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden p-0.5 flex text-sm">
                    <button
                      className={`px-3 py-1.5 ${
                        selectedMetric === 'soilMoisture'
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedMetric('soilMoisture')}
                    >
                      Humidité du sol
                    </button>
                    <button
                      className={`px-3 py-1.5 ${
                        selectedMetric === 'temperature'
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedMetric('temperature')}
                    >
                      Température
                    </button>
                    <button
                      className={`px-3 py-1.5 ${
                        selectedMetric === 'precipitation'
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedMetric('precipitation')}
                    >
                      Précipitations
                    </button>
                    <button
                      className={`px-3 py-1.5 ${
                        selectedMetric === 'humidity'
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedMetric('humidity')}
                    >
                      Humidité de l'air
                    </button>
                  </div>

                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg py-2 px-3 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none text-sm"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  >
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>
              </div>

              {/* Statistiques météo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Temp. moyenne</p>
                      <p className="text-xl font-medium text-gray-800">
                        {weatherData.length > 0
                          ? `${(weatherData.reduce((sum, data) => sum + data.temperature, 0) / weatherData.length).toFixed(1)}°C`
                          : '0°C'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Précip. totales</p>
                      <p className="text-xl font-medium text-gray-800">
                        {weatherData.length > 0
                          ? `${weatherData.reduce((sum, data) => sum + data.precipitation, 0).toFixed(1)} mm`
                          : '0 mm'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Humidité moyenne</p>
                      <p className="text-xl font-medium text-gray-800">
                        {weatherData.length > 0
                          ? `${(weatherData.reduce((sum, data) => sum + data.humidity, 0) / weatherData.length).toFixed(0)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Vitesse du vent</p>
                      <p className="text-xl font-medium text-gray-800">
                        {weatherData.length > 0
                          ? `${(weatherData.reduce((sum, data) => sum + data.windSpeed, 0) / weatherData.length).toFixed(1)} km/h`
                          : '0 km/h'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques météo */}
              {loading ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Chargement des données...</span>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-96">
                  {/* Placeholder pour le composant WeatherChart */}
                  <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Graphique météorologique</p>
                    {/* <WeatherChart 
                      data={weatherData} 
                      metric={selectedMetric}
                      timeframe={selectedTimeframe}
                    /> */}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir la couleur de la température
const getTemperatureColor = (temperature: number): string => {
  if (temperature >= 30) return 'text-red-500';
  if (temperature >= 25) return 'text-orange-500';
  if (temperature >= 20) return 'text-yellow-500';
  if (temperature >= 15) return 'text-green-500';
  if (temperature >= 10) return 'text-blue-400';
  return 'text-blue-600';
};

export default AgricultureDataPage; 