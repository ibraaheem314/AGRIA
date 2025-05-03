import React from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction utilitaire pour combiner des classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'outline' | 'filled' | 'glass' | 'glow' | 'accent' | 'amini' | 'data' | 'modern';
  interactive?: boolean;
  hoverable?: boolean;
  withHoverAnimation?: boolean;
  hoverAnimationType?: 'lift' | 'scale' | 'glow' | 'border' | 'shine';
  withInitialAnimation?: boolean;
  withPattern?: boolean;
  patternType?: 'grid' | 'dots' | 'noise';
  onClick?: () => void;
  withDecoration?: boolean;
  decorationColor?: 'primary' | 'accent' | 'innovation';
}

/**
 * Composant Card moderne avec plusieurs variantes de style inspirées d'AMINI
 * 
 * @example
 * <Card>
 *   <h3>Basic Card</h3>
 *   <p>This is the content</p>
 * </Card>
 * 
 * <Card variant="amini" hoverable withPattern>
 *   <h3>Interactive AMINI-Style Card</h3>
 *   <p>This card has a modern AMINI-inspired design with hover effects</p>
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  hoverable = false,
  withHoverAnimation = false,
  hoverAnimationType = 'lift',
  withInitialAnimation = false,
  withPattern = false,
  patternType = 'grid',
  withDecoration = false,
  decorationColor = 'primary',
  onClick,
}) => {
  const baseStyles = 'rounded-xl overflow-hidden relative transition-colors duration-200';

  const variants = {
    default: 'bg-surface border border-border-subtle shadow-sm',
    gradient: 'bg-gradient-to-br from-dark-surface via-dark-elevated to-dark-surface border border-border-subtle shadow-sm',
    outline: 'bg-transparent border border-white/20 shadow-sm',
    filled: 'bg-dark-elevated border border-border-subtle shadow-sm',
    glass: 'backdrop-blur-lg bg-black/40 border border-white/10 shadow-sm',
    glow: 'bg-surface border border-primary/20 shadow-glow-sm',
    accent: 'bg-gradient-to-br from-dark-surface via-dark-elevated to-dark-surface border-l-4 border border-primary/20 border-l-primary shadow-sm',
    amini: 'bg-black border border-white/10 shadow-md backdrop-blur-sm',
    data: 'bg-gradient-data border border-blue-500/20 shadow-glow-blue',
    modern: 'card-modern',
  };

  const interactiveStyles = interactive 
    ? 'cursor-pointer transition-all duration-300'
    : '';

  const hoverStyles = hoverable 
    ? 'hover:border-white/20 hover:shadow-lg hover:bg-opacity-95'
    : '';
    
  const patternStyles = withPattern ? {
    grid: 'bg-grid-pattern',
    dots: 'bg-dot-pattern',
    noise: 'bg-noise',
  }[patternType] : '';

  const getHoverAnimationProps = () => {
    if (!withHoverAnimation) return {};
    
    switch (hoverAnimationType) {
      case 'lift':
        return {
          whileHover: { y: -5, transition: { duration: 0.3 } },
          whileTap: { y: 0, scale: 0.98 },
        };
      case 'scale':
        return {
          whileHover: { scale: 1.02, transition: { duration: 0.3 } },
          whileTap: { scale: 0.98 },
        };
      case 'glow':
        return {
          whileHover: { boxShadow: '0 5px 20px rgba(255, 255, 255, 0.1)', transition: { duration: 0.3 } },
        };
      case 'border':
        return {
          whileHover: { borderColor: 'rgba(255, 255, 255, 0.25)', transition: { duration: 0.3 } },
        };
      case 'shine':
        return {
          whileHover: { 
            backgroundPosition: 'right top',
            transition: { duration: 1.5, ease: 'easeInOut' } 
          },
        };
      default:
        return {};
    }
  };

  const initialAnimationProps = withInitialAnimation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  } : {};

  const getShineStyle = () => {
    if (hoverAnimationType === 'shine') {
      return {
        backgroundSize: '200% 100%',
        backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
        backgroundPosition: 'left top',
      };
    }
    return {};
  };

  const decorationElement = withDecoration ? (
    <div className={`absolute top-0 left-0 h-full w-1 bg-${decorationColor}`}></div>
  ) : null;

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], interactiveStyles, hoverStyles, className)}
      onClick={onClick}
      style={getShineStyle()}
      {...getHoverAnimationProps()}
      {...initialAnimationProps}
    >
      {decorationElement}
      
      {withPattern && (
        <div className={`absolute inset-0 pointer-events-none ${patternStyles} opacity-10`}></div>
      )}
      
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-primary opacity-5 blur-xl -z-10 rounded-xl"></div>
      )}
      
      {children}
    </motion.div>
  );
};

export default Card;
