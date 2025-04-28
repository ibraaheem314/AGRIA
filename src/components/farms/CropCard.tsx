import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface CropCardProps {
  name: string;
  area: string;
  plantedDate: string;
  expectedHarvest: string;
  status: string;
  health: string;
  image: string;
}

const CropCard: React.FC<CropCardProps> = ({
  name,
  area,
  plantedDate,
  expectedHarvest,
  status,
  health,
  image
}) => {
  const getHealthBadge = () => {
    if (health === 'excellent') return <Badge variant="success">Excellent</Badge>;
    if (health === 'good') return <Badge variant="info">Good</Badge>;
    if (health === 'attention needed') return <Badge variant="warning">Needs Attention</Badge>;
    return <Badge variant="default">{health}</Badge>;
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          {getHealthBadge()}
        </div>
        <p className="text-sm text-gray-600 mt-1">{area}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Planted: {formatDate(plantedDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Droplets size={16} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Harvest: {formatDate(expectedHarvest)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CropCard;