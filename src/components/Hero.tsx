import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Map, BarChart, CloudRain, LineChart } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge de plateforme */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8"
        >
          Plateforme d'agriculture de précision
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Contenu principal */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Données satellite et météo pour une{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                agriculture de précision
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl mb-8"
            >
              Basé sur une grande quantité de données satellite et
              climatiques, notre plateforme fournit des analyses avancées,
              indices de végétation et recommandations personnalisées.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#features"
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                Commencer gratuitement
              </a>
              <a
                href="#demo"
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all duration-300"
              >
                Demander une démo
              </a>
            </motion.div>

            {/* Fonctionnalités clés */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: <CloudRain className="h-6 w-6 text-primary" />, label: "Données météo" },
                { icon: <Map className="h-6 w-6 text-primary" />, label: "Imagerie satellite" },
                { icon: <LineChart className="h-6 w-6 text-primary" />, label: "Indices de végétation" },
                { icon: <BarChart className="h-6 w-6 text-primary" />, label: "Analyses avancées" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + (i * 0.1) }}
                  className="flex flex-col items-center text-center p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="p-2 rounded-full bg-primary/10 mb-2">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image / Visualisation avec données météo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative"
          >
            {/* Widget météo */}
            <div className="absolute -top-20 -right-10 z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="glass-card p-4 w-[240px]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Météo</h3>
                  <div className="bg-gradient-to-r from-primary to-secondary text-xs text-white px-2 py-1 rounded-full">
                    En direct
                  </div>
                </div>
                <div className="flex items-center">
                  <CloudRain className="text-primary w-12 h-12 mr-2" />
                  <div>
                    <div className="text-2xl font-bold">24°C</div>
                    <div className="text-xs text-gray-400">Humidité: 65%</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-300">Conditions optimales</span>
                </div>
              </motion.div>
            </div>

            {/* Carte de suivi des parcelles */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="glass-card p-5 mb-6 rounded-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Zone monitorée</h3>
                </div>
                <span className="text-xs bg-white/10 py-1 px-2 rounded-full">129 hectares</span>
              </div>
              
              <div className="relative h-64 bg-neutral-800/50 rounded-lg overflow-hidden">
                <img 
                  src="/map-sample.png" 
                  alt="Carte satellite des parcelles" 
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    // Fallback si l'image n'existe pas
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1570322965016-6020bdb05b40?q=80&w=500&auto=format&fit=crop";
                  }}
                />
                
                {/* Overlay des statistiques */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                  <div className="flex justify-between text-xs text-gray-300">
                    <div>Rendement estimé: <span className="text-white font-medium">4.7 t/ha</span></div>
                    <div>Mise à jour: <span className="text-white font-medium">aujourd'hui</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Panel flottant statistiques */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-20 -left-10 glass-card p-4 rounded-lg w-[220px]"
            >
              <div className="flex items-center mb-3">
                <LineChart className="text-primary w-5 h-5 mr-2" />
                <h4 className="font-medium text-sm">Analyse des cultures</h4>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Santé végétale</span>
                    <span className="text-green-400">Excellente</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Stress hydrique</span>
                    <span className="text-yellow-400">Faible</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm mb-2">Découvrir nos solutions</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
