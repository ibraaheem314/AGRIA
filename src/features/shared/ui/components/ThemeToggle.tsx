import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>('system');

  // Initialisation du thème
  useEffect(() => {
    // Récupérer le thème sauvegardé ou utiliser 'system'
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Appliquer le thème
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      // Détecter le thème système
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
      root.removeAttribute('data-force-theme');
    } else {
      root.setAttribute('data-theme', newTheme);
      root.setAttribute('data-force-theme', 'true');
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('theme', newTheme);
  };

  // Changer de thème
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Effet pour détecter les changements de thème système
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <div className={`flex items-center gap-1 bg-surface p-1 rounded-lg border border-border ${className}`}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => changeTheme('light')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'light' ? 'bg-surface-3 text-primary' : 'text-text-secondary hover:text-text hover:bg-surface-2'
        }`}
        aria-label="Thème clair"
      >
        <Sun size={18} />
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => changeTheme('system')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'system' ? 'bg-surface-3 text-primary' : 'text-text-secondary hover:text-text hover:bg-surface-2'
        }`}
        aria-label="Thème système"
      >
        <Monitor size={18} />
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => changeTheme('dark')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'dark' ? 'bg-surface-3 text-primary' : 'text-text-secondary hover:text-text hover:bg-surface-2'
        }`}
        aria-label="Thème sombre"
      >
        <Moon size={18} />
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 