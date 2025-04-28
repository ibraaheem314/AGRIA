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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Données Agricoles</h1>
          <p className="text-text-secondary mt-1">
            Visualisez et analysez vos données de cultures et conditions météorologiques
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-surface-2 hover:bg-surface-3 text-text">
            <Filter size={16} className="mr-1.5" />
            Filtres
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-surface-2 hover:bg-surface-3 text-text">
            <DownloadCloud size={16} className="mr-1.5" />
            Exporter
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary hover:bg-primary-darker text-white">
            <RefreshCw size={16} className="mr-1.5" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'crops'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text hover:border-border'
          }`}
        >
          <div className="flex items-center">
            <Layers size={16} className="mr-1.5" />
            Cultures
          </div>
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'weather'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text hover:border-border'
          }`}
        >
          <div className="flex items-center">
            <BarChart size={16} className="mr-1.5" />
            Météo & Conditions
          </div>
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'crops' ? (
        <DataTable
          data={cropData}
          columns={cropColumns}
          title="Liste des cultures"
          subtitle="Aperçu de toutes les cultures en cours et leur état"
          loading={loading}
          pagination={true}
          itemsPerPage={10}
          exportable={true}
          searchable={true}
          onRowClick={handleRowClick}
          emptyMessage="Aucune donnée de culture disponible"
          className="mb-6"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface rounded-lg border border-border shadow-sm p-4">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Température moyenne</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-text">21.4°C</div>
                <div className="text-sm text-green-500 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  2.1°C
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-lg border border-border shadow-sm p-4">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Précipitations (7j)</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-text">24.5 mm</div>
                <div className="text-sm text-red-500 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  8.3 mm
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-lg border border-border shadow-sm p-4">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Humidité moyenne</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-text">58.2%</div>
                <div className="text-sm text-green-500 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  3.5%
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-lg border border-border shadow-sm p-4">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Humidité du sol</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-text">42.7%</div>
                <div className="text-sm text-red-500 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  5.2%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-text">Tendances météorologiques</h3>
              <div className="flex gap-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="text-sm border border-border rounded-md bg-surface-2 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text"
                >
                  <option value="temperature">Température</option>
                  <option value="precipitation">Précipitations</option>
                  <option value="humidity">Humidité</option>
                  <option value="soilMoisture">Humidité du sol</option>
                </select>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="text-sm border border-border rounded-md bg-surface-2 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text"
                >
                  <option value="daily">Journalier</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>
            </div>
            
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <WeatherChart
                  data={weatherData}
                  metric={selectedMetric}
                  timeframe={selectedTimeframe}
                  type="line"
                  onMetricChange={setSelectedMetric}
                  onTimeframeChange={setSelectedTimeframe}
                />
              )}
            </div>
          </div>

          {/* Tableau des prévisions détaillées */}
          <DataTable
            data={weatherData}
            columns={[
              {
                id: 'date',
                header: 'Date',
                accessor: (row) => formatDate(row.date),
                sortable: true,
              },
              {
                id: 'temperature',
                header: 'Température (°C)',
                accessor: (row) => (
                  <span className={getTemperatureColor(row.temperature)}>
                    {row.temperature.toFixed(1)}
                  </span>
                ),
                sortable: true,
                align: 'right',
              },
              {
                id: 'precipitation',
                header: 'Précipitations (mm)',
                accessor: (row) => row.precipitation.toFixed(1),
                sortable: true,
                align: 'right',
              },
              {
                id: 'humidity',
                header: 'Humidité (%)',
                accessor: (row) => row.humidity.toFixed(1),
                sortable: true,
                align: 'right',
              },
              {
                id: 'soilMoisture',
                header: 'Humidité du sol (%)',
                accessor: (row) => (
                  <div className="flex items-center justify-end">
                    <div className="w-20 bg-surface-3 rounded-full h-2 mr-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${row.soilMoisture}%` }}
                      ></div>
                    </div>
                    <span>{row.soilMoisture.toFixed(1)}</span>
                  </div>
                ),
                sortable: true,
                align: 'right',
              },
              {
                id: 'windSpeed',
                header: 'Vent (km/h)',
                accessor: (row) => row.windSpeed.toFixed(1),
                sortable: true,
                align: 'right',
              },
            ]}
            title="Données météorologiques détaillées"
            subtitle="Historique des 30 derniers jours"
            loading={loading}
            pagination={true}
            itemsPerPage={10}
            exportable={true}
            searchable={true}
            emptyMessage="Aucune donnée météorologique disponible"
          />
        </div>
      )}
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