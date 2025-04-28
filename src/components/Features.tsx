import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, CloudRain, LineChart, Map, Layers, BarChart3, Droplets, Sun } from 'lucide-react';

const featureItems = [
  {
    icon: <Satellite className="h-8 w-8 text-primary" />,
    title: "Imagerie Satellite Haute Résolution",
    description: "Accédez aux images satellite les plus récentes avec mise à jour quotidienne et résolution de 10m par pixel.",
    delay: 0.1
  },
  {
    icon: <CloudRain className="h-8 w-8 text-primary" />,
    title: "Prévisions Météo Précises",
    description: "Prévisions hyperlocales jusqu'à 14 jours pour planifier vos activités agricoles en toute confiance.",
    delay: 0.2
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: "Indices de Végétation NDVI",
    description: "Surveillez la santé des cultures avec des analyses d'indices de végétation normalisés actualisées hebdomadairement.",
    delay: 0.3
  },
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    title: "Gestion de Parcelles",
    description: "Créez et gérez facilement vos parcelles avec notre système de cartographie intuitif et précis.",
    delay: 0.4
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "Analyse des Sols",
    description: "Obtenez des données détaillées sur la composition et l'humidité de vos sols pour optimiser vos cultures.",
    delay: 0.5
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Tableaux de Bord Personnalisés",
    description: "Visualisez toutes vos données critiques sur un tableau de bord adapté à vos besoins spécifiques.",
    delay: 0.6
  },
  {
    icon: <Droplets className="h-8 w-8 text-primary" />,
    title: "Gestion de l'Irrigation",
    description: "Optimisez votre consommation d'eau grâce à des recommandations basées sur les conditions météo et l'humidité du sol.",
    delay: 0.7
  },
  {
    icon: <Sun className="h-8 w-8 text-primary" />,
    title: "Suivi des Conditions Climatiques",
    description: "Surveillez en temps réel les températures, précipitations, et autres facteurs climatiques affectant vos cultures.",
    delay: 0.8
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80,
        duration: 0.6
      }
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Fonctionnalités Avancées pour l'Agriculture de Précision
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Notre plateforme combine données satellite, météorologiques et analyses avancées 
            pour vous aider à prendre les meilleures décisions pour vos cultures.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureItems.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-[#0C1512]/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
              style={{ transitionDelay: `${feature.delay}s` }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-primary/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorer toutes nos fonctionnalités
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
