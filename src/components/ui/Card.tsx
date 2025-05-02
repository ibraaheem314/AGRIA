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
  variant?: 'default' | 'gradient' | 'outline' | 'filled' | 'glass' | 'glow' | 'accent';
  interactive?: boolean;
  hoverable?: boolean;
  withHoverAnimation?: boolean;
  hoverAnimationType?: 'lift' | 'scale' | 'glow' | 'border';
  withInitialAnimation?: boolean;
  onClick?: () => void;
}

/**
 * Card component with various style variants
 * 
 * @example
 * <Card>
 *   <h3>Basic Card</h3>
 *   <p>This is the content</p>
 * </Card>
 * 
 * <Card variant="gradient" hoverable>
 *   <h3>Interactive Gradient Card</h3>
 *   <p>This card has a gradient background and hover effects</p>
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
  onClick,
}) => {
  const baseStyles = 'rounded-xl overflow-hidden relative transition-colors duration-200';

  const variants = {
    default: 'bg-surface border border-border',
    gradient: 'bg-gradient-to-br from-surface via-surface to-surface-2 border border-border',
    outline: 'bg-transparent border border-border',
    filled: 'bg-surface-2 border border-border',
    glass: 'backdrop-blur-md bg-white/5 border border-white/10',
    glow: 'bg-surface border border-primary/20 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]',
    accent: 'bg-gradient-to-br from-surface via-surface to-surface-2 border-l-4 border border-primary border-l-primary'
  };

  const interactiveStyles = interactive 
    ? 'cursor-pointer transition-all duration-300'
    : '';

  const hoverStyles = hoverable 
    ? 'hover:border-primary/50 hover:bg-opacity-95'
    : '';

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
          whileHover: { boxShadow: '0 0 20px var(--shadow-glow-primary)', transition: { duration: 0.3 } },
        };
      case 'border':
        return {
          whileHover: { borderColor: 'var(--color-primary-500)', transition: { duration: 0.3 } },
        };
      default:
        return {};
    }
  };

  const initialAnimationProps = withInitialAnimation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], interactiveStyles, hoverStyles, className)}
      onClick={onClick}
      {...getHoverAnimationProps()}
      {...initialAnimationProps}
    >
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-primary opacity-5 blur-xl -z-10 rounded-xl"></div>
      )}
      
      {children}
    </motion.div>
  );
};

export default Card;
