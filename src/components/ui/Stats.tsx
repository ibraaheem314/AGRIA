import React from 'react';
import Card from './Card';
import { motion } from 'framer-motion';

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatItem: React.FC<StatItemProps> = ({ 
  label, 
  value, 
  icon,
  trend,
  trendValue
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{label}</span>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </motion.div>
        {trend && trendValue && (
          <div className={`mt-1 text-sm ${trendColors[trend]}`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatItem;