import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, BarChart, CloudLightning, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  {
    number: 1,
    title: "Cartographiez vos parcelles",
    description: "Délimitez facilement vos champs sur notre carte interactive. Importez des fichiers GeoJSON ou tracez manuellement vos parcelles avec précision.",
    icon: <MapPin className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-400",
    delay: 0.1
  },
  {
    number: 2,
    title: "Configurez vos alertes",
    description: "Définissez vos préférences de notification pour les conditions météo extrêmes, les changements d'indices végétatifs ou les anomalies détectées.",
    icon: <AlertCircle className="h-8 w-8" />,
    color: "from-amber-500 to-orange-400",
    delay: 0.3
  },
  {
    number: 3,
    title: "Surveillez vos cultures",
    description: "Accédez à des données satellite actualisées, indices NDVI et prévisions météo pour chaque parcelle. Visualisez l'évolution de vos cultures au fil du temps.",
    icon: <BarChart className="h-8 w-8" />,
    color: "from-green-500 to-emerald-400",
    delay: 0.5
  },
  {
    number: 4,
    title: "Recevez des alertes ciblées",
    description: "Soyez informé en temps réel des risques météorologiques, stress hydrique ou autres anomalies affectant spécifiquement vos parcelles.",
    icon: <CloudLightning className="h-8 w-8" />,
    color: "from-purple-500 to-violet-400",
    delay: 0.7
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Comment ça fonctionne
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Une approche simple et efficace pour surveiller vos cultures et optimiser votre production agricole.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 transform -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: step.delay,
                ease: "easeOut" 
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Step circle with number */}
              <motion.div 
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto",
                  `bg-gradient-to-r ${step.color}`
                )}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,200,0.3)" }}
              >
                {step.number}
              </motion.div>
              
              <div className="bg-[#0C1512]/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                <h3 className="text-xl font-semibold text-white text-center mb-3">{step.title}</h3>
                <p className="text-gray-400 text-center">{step.description}</p>
                
                <div className="mt-4 flex justify-center">
                  <div className={cn(
                    "p-2 rounded-lg",
                    `bg-gradient-to-r ${step.color}/10`
                  )}>
                  {step.icon}
                  </div>
                </div>
                
                <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-400">Simple</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-400">Précis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-400">Efficace</span>
              </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-primary/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Commencer maintenant
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
