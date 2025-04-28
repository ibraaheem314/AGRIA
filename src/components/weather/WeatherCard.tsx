import React from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import Card from '../ui/Card';

interface WeatherCardProps {
  day: string;
  temperature: number;
  rainfall: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ day, temperature, rainfall }) => {
  const getWeatherIcon = () => {
    if (rainfall > 20) return <CloudRain size={30} className="text-blue-400" />;
    if (rainfall > 0) return <Cloud size={30} className="text-gray-400" />;
    return <Sun size={30} className="text-yellow-400" />;
  };

  return (
    <Card className="p-4 flex flex-col items-center bg-[#151818] border border-neutral-800">
      <div className="text-white font-medium">{day}</div>
      <div className="my-2">{getWeatherIcon()}</div>
      <div className="text-2xl font-bold text-white">{temperature}°C</div>
      <div className="text-sm text-gray-400">{rainfall} mm</div>
    </Card>
  );
};

export default WeatherCard;
