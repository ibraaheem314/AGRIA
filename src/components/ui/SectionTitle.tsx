import React from 'react';
import { motion } from 'framer-motion';
import Badge from './Badge';

interface SectionTitleProps {
  title: string;
  description?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' | 'subtle';
  animate?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  gradient?: 'green' | 'gold' | 'amini' | 'data' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  decorative?: boolean;
}

/**
 * Un composant de titre de section moderne inspiré du design AMINI
 * 
 * @example
 * <SectionTitle 
 *   title="Notre impact en chiffres" 
 *   description="Des résultats concrets mesurés auprès de nos utilisateurs"
 *   badge="Impact Réel"
 *   gradient="amini"
 *   decorative
 * />
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  badge,
  align = 'center',
  className = '',
  badgeVariant = 'primary',
  animate = true,
  titleClassName = '',
  descriptionClassName = '',
  gradient = 'none',
  size = 'lg',
  decorative = false,
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };
  
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
  };
  
  const gradientClasses = {
    green: 'text-gradient-green',
    gold: 'text-gradient-gold',
    amini: 'text-gradient-amini',
    data: 'text-gradient-data',
    none: '',
  };
  
  const Container = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  } : {};

  return (
    <Container
      className={`max-w-3xl mb-16 ${alignmentClasses[align]} relative ${className}`}
      {...animationProps}
    >
      {decorative && (
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-grid-pattern rounded-full opacity-30 hidden md:block"></div>
      )}
      
      {badge && (
        <Badge 
          variant={badgeVariant} 
          className="mb-5 font-medium tracking-wide uppercase text-xs px-4 py-1.5" 
          pill
        >
          {badge}
        </Badge>
      )}
      
      <h2 className={`${sizeClasses[size]} title-amini font-medium mb-5 ${gradientClasses[gradient]} ${titleClassName}`}>
        {title}
      </h2>
      
      {description && (
        <p className={`subtitle-amini text-lg text-white/75 max-w-2xl mx-auto ${descriptionClassName}`}>
          {description}
        </p>
      )}
      
      {decorative && (
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-dot-pattern rounded-full opacity-30 hidden md:block"></div>
      )}
    </Container>
  );
};

export default SectionTitle; 