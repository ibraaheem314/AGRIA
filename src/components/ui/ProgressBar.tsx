import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: string | number;
  max?: number;
  color?: 'default' | 'primary' | 'secondary' | 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'gradient' | string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'default', 
  gradientFrom, 
  gradientTo, 
  className 
}: ProgressBarProps) {
  // Convert value to number if it's a string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Ensure value is between 0 and max
  const safeValue = Math.max(0, Math.min(numericValue, max));
  const percentage = (safeValue / max) * 100;
  
  // Color mapping
  const colorClasses: Record<string, string> = {
    default: 'bg-primary',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    violet: 'bg-violet-500',
    fuchsia: 'bg-fuchsia-500',
    emerald: 'bg-emerald-500',
    gradient: gradientFrom && gradientTo 
      ? `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`
      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
  };
  
  // Get the color class or default to bg-primary if not found
  const colorClass = colorClasses[color] || colorClasses.default;
  
  return (
    <div className={cn("w-full bg-white/10 backdrop-blur-sm rounded-full h-2 overflow-hidden", className)}>
      <div 
        className={cn("h-2 rounded-full transition-all duration-500", colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
} 