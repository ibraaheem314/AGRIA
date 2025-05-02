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
}

/**
 * A reusable section title component with optional badge and description
 * 
 * @example
 * <SectionTitle 
 *   title="Notre impact en chiffres" 
 *   description="Des résultats concrets mesurés auprès de nos utilisateurs"
 *   badge="Impact Réel"
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
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };
  
  const Container = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  } : {};

  return (
    <Container
      className={`max-w-2xl mb-16 ${alignmentClasses[align]} ${className}`}
      {...animationProps}
    >
      {badge && (
        <Badge 
          variant={badgeVariant} 
          className="mb-4" 
          pill
        >
          {badge}
        </Badge>
      )}
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${titleClassName}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-gray-400 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </Container>
  );
};

export default SectionTitle; 