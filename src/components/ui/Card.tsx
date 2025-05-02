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
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-surface-2 to-surface via-surface border border-primary/10';
      case 'outline':
        return 'bg-transparent border border-primary/30';
      case 'filled':
        return 'bg-primary/10 border border-primary/20';
      case 'glass':
        return 'bg-surface/70 backdrop-blur-lg border border-primary/10';
      case 'glow':
        return 'bg-surface border border-primary/20 shadow-glow-sm';
      case 'accent':
        return 'bg-surface border-l-4 border-accent border-y border-r border-primary/10';
      default:
        return 'bg-surface border border-primary/10';
    }
  };

  const getHoverAnimationProps = () => {
    if (!withHoverAnimation) return {};

    switch (hoverAnimationType) {
      case 'lift':
        return {
          whileHover: { y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
          transition: { duration: 0.2 }
        };
      case 'scale':
        return {
          whileHover: { scale: 1.02 },
          transition: { duration: 0.2 }
        };
      case 'glow':
        return {
          whileHover: { boxShadow: '0 0 20px rgba(46, 160, 87, 0.3)' },
          transition: { duration: 0.3 }
        };
      case 'border':
        return {
          whileHover: { borderColor: 'rgba(46, 160, 87, 0.5)' },
          transition: { duration: 0.3 }
        };
      default:
        return {};
    }
  };

  const getInitialAnimationProps = () => {
    if (!withInitialAnimation) return {};

    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: 'easeOut' }
    };
  };

  const hoverClasses = hoverable
    ? 'transition-all duration-300 ease-in-out hover:shadow-card-hover hover:border-primary/30'
    : '';

  const interactiveClasses = interactive ? 'cursor-pointer active:scale-[0.98]' : '';

  const cardClasses = cn(
    'rounded-xl overflow-hidden transition-colors duration-300',
    getVariantClasses(),
    hoverClasses,
    interactiveClasses,
    className
  );

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      {...getHoverAnimationProps()}
      {...getInitialAnimationProps()}
    >
      {children}
    </motion.div>
  );
};

export default Card;
