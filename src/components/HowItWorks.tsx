import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart, CloudLightning, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

const steps = [
  {
    number: 1,
    title: "Map Your Fields",
    description: "Easily map your fields on our interactive map. Import GeoJSON files or manually trace your plots with precision.",
    icon: <MapPin className="h-8 w-8" />,
    image: "/images/how-it-works/mapping.jpg"
  },
  {
    number: 2,
    title: "Configure Your Alerts",
    description: "Set up notification preferences for extreme weather conditions, changes in vegetation indices, or detected anomalies.",
    icon: <AlertCircle className="h-8 w-8" />,
    image: "/images/how-it-works/alerts.jpg"
  },
  {
    number: 3,
    title: "Monitor Your Crops",
    description: "Access updated satellite data, NDVI indices and weather forecasts for each plot. Visualize the evolution of your crops over time.",
    icon: <BarChart className="h-8 w-8" />,
    image: "/images/how-it-works/monitoring.jpg"
  },
  {
    number: 4,
    title: "Receive Targeted Alerts",
    description: "Be informed in real time of weather risks, water stress or other anomalies specifically affecting your plots.",
    icon: <CloudLightning className="h-8 w-8" />,
    image: "/images/how-it-works/notification.jpg"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 border-b border-neutral-800 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] z-0"></div>
    
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="text-amber-500 mb-4">HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            A Simple Approach to Precision Agriculture
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A simple and effective approach to monitor your crops and optimize your agricultural production.
          </p>
        </motion.div>

        {/* Process flow line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" style={{ transform: 'translateY(-50%)' }}></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-black font-medium text-lg mr-3 shadow-glow-sm z-10"
                >
                  {step.number}
                </motion.div>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-amber-500/80 to-neutral-800"></div>
              </div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="border border-neutral-800 bg-neutral-900/50 rounded-lg overflow-hidden h-full hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-sm p-2 rounded-lg text-white">
                    {step.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Button 
            className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
          >
            Get started now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
