import React from 'react';
import { Battery, Droplets, Leaf, Sun } from 'lucide-react';
import Card from '../ui/Card';

interface ResourceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const ResourceMonitor = () => {
  const metrics: ResourceMetric[] = [
    {
      name: 'Utilisation d’eau',
      value: 2.5,
      unit: 'L/m²',
      trend: 'down',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      name: 'Consommation énergétique',
      value: 145,
      unit: 'kWh',
      trend: 'down',
      icon: <Battery className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    {
      name: 'Empreinte carbone évitée',
      value: 12.8,
      unit: 'tonnes',
      trend: 'up',
      icon: <Leaf className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      name: 'Production solaire',
      value: 280,
      unit: 'kWh',
      trend: 'up',
      icon: <Sun className="w-5 h-5" />,
      color: 'text-orange-400'
    }
  ];

  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↑</span>;
      case 'down':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  return (
    <Card className="p-6 bg-[#151818] border-neutral-800">
      <h2 className="text-xl font-bold text-white mb-6">Suivi des ressources</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-[#1B1F1E] rounded-lg p-4 border border-neutral-800"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg bg-opacity-20 ${metric.color.replace('text', 'bg')}`}
              >
                <span className={`${metric.color}`}>{metric.icon}</span>
              </div>
              {getTrendIndicator(metric.trend)}
            </div>
            <h3 className="text-gray-400 text-sm">{metric.name}</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-white">{metric.value}</p>
              <p className="ml-1 text-gray-400">{metric.unit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-blue-900 bg-blue-950/40">
        <h3 className="font-semibold text-blue-300 mb-2">Conseils pour économiser</h3>
        <ul className="space-y-2 text-sm text-blue-400">
          <li>• Arrosez tôt le matin ou tard le soir</li>
          <li>• Exploitez l’énergie solaire pendant les heures pleines</li>
          <li>• Utilisez des capteurs intelligents pour une gestion fine</li>
          <li>• Pensez à la récupération d’eau de pluie</li>
        </ul>
      </div>
    </Card>
  );
};

export default ResourceMonitor;
