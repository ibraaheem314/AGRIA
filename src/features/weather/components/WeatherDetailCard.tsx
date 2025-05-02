import React from 'react';
import Card from "../../shared/ui/components/Card";

interface WeatherDetailCardProps { 
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const WeatherDetailCard: React.FC<WeatherDetailCardProps> = ({
  title,
  value,
  icon,
  description
}) => (
  <Card className="p-4">
    <div className="flex flex-col h-full">
      <h3 className="text-base font-medium mb-1">{title}</h3>
      
      <div className="flex justify-between items-start mb-auto">
        <div className="flex items-center">
          <div className="text-4xl font-semibold mt-2">
            {value}
          </div>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
          {icon}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        {description}
      </div>
    </div>
  </Card>
);

export default WeatherDetailCard; 