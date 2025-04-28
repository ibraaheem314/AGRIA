import React from 'react';
import { StatusIndicator } from './StatusIndicator';
import { ProgressBar } from './ProgressBar';

interface AirQualityData {
  aqi: number;
  category: string;
  mainPollutant: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  index?: number;
  description?: string;
}

interface AirQualityDisplayProps {
  data: AirQualityData;
}

export const AirQualityDisplay: React.FC<AirQualityDisplayProps> = ({ data }) => {
  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { label: 'Bon', color: 'bg-green-500' };
    if (aqi <= 100) return { label: 'Modéré', color: 'bg-yellow-500' };
    if (aqi <= 150) return { label: 'Mauvais pour groupes sensibles', color: 'bg-orange-500' };
    if (aqi <= 200) return { label: 'Mauvais', color: 'bg-red-500' };
    if (aqi <= 300) return { label: 'Très mauvais', color: 'bg-purple-700' };
    return { label: 'Dangereux', color: 'bg-rose-900' };
  };

  const aqi = data.aqi;
  const aqiInfo = getAQILevel(aqi);
  
  // Valeurs max pour chaque polluant selon les standards OMS
  const pollutantMaxValues = {
    co: 10000, // ppb
    no: 100,   // ppb
    no2: 200,  // ppb
    o3: 100,   // ppb
    so2: 350,  // ppb
    pm2_5: 25, // µg/m³ 
    pm10: 50,  // µg/m³
    nh3: 200   // ppb
  };

  return (
    <div className="text-white space-y-6">
      <div className="flex flex-col items-center mb-4">
        <div className={`${aqiInfo.color} w-24 h-24 rounded-full flex items-center justify-center mb-2`}>
          <span className="text-3xl font-bold">{aqi}</span>
        </div>
        <h4 className="text-lg font-medium">{aqiInfo.label}</h4>
        <p className="text-sm text-white/70">Indice de qualité de l'air</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>CO</span>
            <span>{data.pollutants.co.toFixed(1)} ppb</span>
          </div>
          <ProgressBar value={data.pollutants.co} max={pollutantMaxValues.co} color="blue" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>NO₂</span>
            <span>{data.pollutants.no2.toFixed(1)} ppb</span>
          </div>
          <ProgressBar value={data.pollutants.no2} max={pollutantMaxValues.no2} color="amber" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>O₃</span>
            <span>{data.pollutants.o3.toFixed(1)} ppb</span>
          </div>
          <ProgressBar value={data.pollutants.o3} max={pollutantMaxValues.o3} color="emerald" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>SO₂</span>
            <span>{data.pollutants.so2.toFixed(1)} ppb</span>
          </div>
          <ProgressBar value={data.pollutants.so2} max={pollutantMaxValues.so2} color="red" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>PM₂.₅</span>
            <span>{data.pollutants.pm25.toFixed(1)} µg/m³</span>
          </div>
          <ProgressBar value={data.pollutants.pm25} max={pollutantMaxValues.pm2_5} color="violet" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>PM₁₀</span>
            <span>{data.pollutants.pm10.toFixed(1)} µg/m³</span>
          </div>
          <ProgressBar value={data.pollutants.pm10} max={pollutantMaxValues.pm10} color="fuchsia" />
        </div>
      </div>
    </div>
  );
}; 