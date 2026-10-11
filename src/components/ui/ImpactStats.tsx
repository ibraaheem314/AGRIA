import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Droplets, Leaf, BarChart, DollarSign } from 'lucide-react';

interface Stat {
  id: string;
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const ImpactStats: React.FC = () => {
  const [counters, setCounters] = useState<{ [key: string]: number }>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const stats: Stat[] = [
    {
      id: 'users',
      icon: <Users className="w-8 h-8" />,
      value: 12547,
      suffix: '+',
      label: 'Agriculteurs actifs',
      description: 'Utilisent AGRIA quotidiennement',
      color: 'text-blue-600'
    },
    {
      id: 'hectares',
      icon: <Leaf className="w-8 h-8" />,
      value: 2400000,
      suffix: '',
      label: 'Hectares optimisés',
      description: 'Surface agricole améliorée',
      color: 'text-green-600'
    },
    {
      id: 'yield',
      icon: <TrendingUp className="w-8 h-8" />,
      value: 28,
      suffix: '%',
      label: 'Augmentation moyenne',
      description: 'Des rendements agricoles',
      color: 'text-orange-600'
    },
    {
      id: 'water',
      icon: <Droplets className="w-8 h-8" />,
      value: 35,
      suffix: '%',
      label: 'Économie d\'eau',
      description: 'Réduction de la consommation',
      color: 'text-cyan-600'
    },
    {
      id: 'revenue',
      icon: <DollarSign className="w-8 h-8" />,
      value: 450,
      suffix: 'M€',
      label: 'Revenus supplémentaires',
      description: 'Générés pour nos agriculteurs',
      color: 'text-purple-600'
    },
    {
      id: 'queries',
      icon: <BarChart className="w-8 h-8" />,
      value: 890000,
      suffix: '+',
      label: 'Questions traitées',
      description: 'Par notre IA agricole',
      color: 'text-indigo-600'
    }
  ];

  // Animation du compteur
  const animateCounter = (targetValue: number, statId: string, duration: number = 2000) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out effect
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutProgress);

      setCounters(prev => ({
        ...prev,
        [statId]: currentValue
      }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Observer pour détecter quand l'élément entre dans la vue
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Démarrer l'animation des compteurs avec des délais décalés
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat.value, stat.id, 2000 + index * 200);
            }, index * 100);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div ref={ref} className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            L'impact d'AGRIA en chiffres
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Découvrez comment nous transformons l'agriculture française 
            avec des résultats mesurables et durables
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 ${stat.color}`}>
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <motion.span
                    className="text-4xl md:text-5xl font-bold text-gray-900"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.id === 'hectares' || stat.id === 'queries' 
                      ? formatNumber(counters[stat.id] || 0)
                      : (counters[stat.id] || 0).toLocaleString()
                    }
                  </motion.span>
                  <span className={`text-2xl font-semibold ${stat.color}`}>
                    {stat.suffix}
                  </span>
                </div>
              </div>

              {/* Label & Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Progress bar animation */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-600`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez cette révolution agricole !
            </h3>
            <p className="text-green-100 text-lg mb-6 max-w-2xl mx-auto">
              Faites partie des milliers d'agriculteurs qui transforment déjà 
              leur exploitation avec l'intelligence artificielle d'AGRIA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-green-600 rounded-full font-bold hover:bg-green-50 transition-colors"
              >
                Commencer gratuitement
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Voir la démo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImpactStats; 