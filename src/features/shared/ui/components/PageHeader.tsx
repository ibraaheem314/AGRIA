import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ThemeToggle from './ThemeToggle';

// Fonction utilitaire pour combiner des classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Breadcrumb {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  tabs?: {
    label: string;
    href?: string;
    isActive?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
  }[];
  icon?: ReactNode;
  showThemeToggle?: boolean;
  className?: string;
  isLoading?: boolean;
  withAnimation?: boolean;
  background?: 'none' | 'gradient' | 'pattern';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
  tabs,
  icon,
  showThemeToggle = false,
  className = '',
  isLoading = false,
  withAnimation = true,
  background = 'none'
}) => {
  // Animation pour les éléments de l'en-tête
  const containerAnimation = withAnimation ? {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  const staggerAnimations = {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    item: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    }
  };

  // Classe pour le fond
  const backgroundClasses = {
    none: '',
    gradient: 'bg-gradient-to-r from-surface via-surface-2 to-surface',
    pattern: 'bg-surface-2 bg-[url("data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z" fill="rgba(200,200,200,0.05)"%3E%3C/path%3E%3C/svg%3E")]'
  };

  return (
    <motion.header 
      {...containerAnimation}
      className={cn(
        'py-6 px-4 md:px-8 border-b border-border',
        backgroundClasses[background],
        className
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.div 
          {...staggerAnimations.container}
          className="flex items-center space-x-2 mb-4"
        >
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <span className="text-text-tertiary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
              <motion.div {...staggerAnimations.item}>
                {crumb.href ? (
                  <a href={crumb.href} className="text-sm text-text-secondary hover:text-text transition-colors flex items-center">
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-sm text-text-tertiary flex items-center">
                    {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                    {crumb.label}
                  </span>
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </motion.div>
      )}

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          {icon && <span className="mr-3 text-primary">{icon}</span>}
          
          <div>
            {isLoading ? (
              <div className="w-64 h-8 skeleton-loading mb-1 rounded"></div>
            ) : (
              <h1 className="text-2xl font-bold text-text">{title}</h1>
            )}
            
            {description && (
              isLoading ? (
                <div className="w-96 h-5 skeleton-loading rounded"></div>
              ) : (
                <p className="mt-1 text-text-secondary">{description}</p>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showThemeToggle && <ThemeToggle />}
          {actions}
        </div>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <motion.div 
          className="flex overflow-x-auto mt-6 pb-1 -mb-px"
          {...staggerAnimations.container}
        >
          {tabs.map((tab, index) => (
            <motion.div key={index} {...staggerAnimations.item}>
              {tab.href ? (
                <a
                  href={tab.href}
                  className={cn(
                    'flex items-center px-4 py-2 mr-2 border-b-2 font-medium whitespace-nowrap',
                    tab.isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                  )}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </a>
              ) : (
                <button
                  onClick={tab.onClick}
                  className={cn(
                    'flex items-center px-4 py-2 mr-2 border-b-2 font-medium whitespace-nowrap',
                    tab.isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                  )}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
};

export default PageHeader; 