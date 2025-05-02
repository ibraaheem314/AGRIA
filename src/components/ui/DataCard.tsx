import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './Card';

interface TrendProps {
  value: number;
  isPositive: boolean;
  label?: string;
}

interface DataCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger' | 'accent';
  trend?: TrendProps;
  description?: string;
  loading?: boolean;
  onClick?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  description,
  loading = false,
  onClick
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'secondary':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'info':
        return 'text-info bg-info/10 border-info/20';
      case 'danger':
        return 'text-danger bg-danger/10 border-danger/20';
      case 'accent':
        return 'text-accent bg-accent/10 border-accent/20';
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const iconClasses = `${getColorClasses()} p-3 rounded-lg`;

  const getTrendColor = (trend: TrendProps) => {
    return trend.isPositive ? 
      'text-success bg-success/10' : 
      'text-danger bg-danger/10';
  };

  return (
    <Card 
      className="p-5 border border-primary/20 bg-surface hover:shadow-glow-sm transition-all duration-300"
      hoverable
      onClick={onClick}
      withHoverAnimation={!!onClick}
      hoverAnimationType="lift"
    >
      {loading ? (
        <div className="space-y-3">
          <div className="w-2/3 h-5 bg-primary/5 rounded animate-pulse"></div>
          <div className="w-1/2 h-8 bg-primary/5 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-primary/5 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            <div className={iconClasses}>
              {icon}
            </div>
          </div>
          
          <motion.div 
            className="mb-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl font-semibold">{value}</div>
            
            {trend && (
              <div className="flex items-center mt-1.5">
                <div className={`flex items-center rounded-full px-2 py-0.5 ${getTrendColor(trend)}`}>
                  {trend.isPositive ? (
                    <ArrowUp size={14} className="mr-1" />
                  ) : (
                    <ArrowDown size={14} className="mr-1" />
                  )}
                  <span className="text-xs font-medium">{trend.value}%</span>
                </div>
                {trend.label && (
                  <span className="text-xs text-text-tertiary ml-2">{trend.label}</span>
                )}
              </div>
            )}
          </motion.div>
          
          {description && (
            <div className="text-xs text-text-tertiary">{description}</div>
          )}
        </>
      )}
    </Card>
  );
};

export default DataCard; 