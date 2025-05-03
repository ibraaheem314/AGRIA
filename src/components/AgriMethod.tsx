import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Seedling, CloudRain, BarChart3, Users, LineChart, Sun, Droplets } from 'lucide-react';
import Button from './ui/Button';

// Composant personnalisé Seedling pour l'icône de pousse
const Seedling = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 3v9" />
    <path d="M4 13l8-10 8 10" />
    <path d="M8 13v3a4 4 0 0 0 8 0v-3" />
    <path d="M20 21H4" />
  </svg>
);

const AgriMethod = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Valeurs pour l'effet parallaxe
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ['-5%', '0%']);
  
  return (
    <section className="py-20 relative bg-white overflow-hidden" ref={containerRef}>
      {/* Motif d'arrière-plan avec parallaxe */}
      <motion.div 
        className="absolute inset-0 bg-pattern-dots opacity-5 pointer-events-none"
        style={{ y: backgroundY }}
      ></motion.div>
      
      {/* Éléments graphiques flottants pour le parallaxe */}
      <motion.div 
        className="absolute -right-20 top-1/3 opacity-20 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['30%', '-30%']) }}
      >
        <div className="w-64 h-64 rounded-full bg-primary-100 blur-3xl"></div>
      </motion.div>
      
      <motion.div 
        className="absolute -left-20 bottom-1/3 opacity-15 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['15%', '-15%']) }}
      >
        <div className="w-56 h-56 rounded-full bg-primary-200 blur-3xl"></div>
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: titleY }}
        >
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">MÉTHODE ÉPROUVÉE</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            Une approche durable et efficace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Inspirée de l'agroécologie et des techniques du bio-intensif – pratiquées par les maraîchers parisiens du 19ème siècle et développées depuis plus de 20 ans par notre parrain Jean-Martin Fortier – la méthode Cultive propose une triple performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Carte Économiquement Profitable */}
          <motion.div
            className="rounded-xl overflow-hidden bg-[#e9e1d3] p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-medium text-gray-800 mb-5">ÉCONOMIQUEMENT PROFITABLE</h3>
            <p className="text-gray-700 mb-6">En diversifiant les sources de revenus et en optimisant les charges salariales</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Leaf className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">environ 60 tonnes/hectare/an</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <BarChart3 className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">jusqu'à 250.000€ CA / an</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <LineChart className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">temps de travail optimisé</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Carte Écologiquement Bénéfique */}
          <motion.div
            className="rounded-xl overflow-hidden bg-[#e9e1d3] p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-medium text-gray-800 mb-5">ÉCOLOGIQUEMENT BÉNÉFIQUE</h3>
            <p className="text-gray-700 mb-6">En préservant la biodiversité et en luttant contre le réchauffement climatique</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Seedling className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">régénération des sols</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <CloudRain className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">séquestration de carbone</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Droplets className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">gestion économe en eau</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Carte Socialement Juste */}
          <motion.div
            className="rounded-xl overflow-hidden bg-[#e9e1d3] p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-medium text-gray-800 mb-5">SOCIALEMENT JUSTE</h3>
            <p className="text-gray-700 mb-6">En améliorant la qualité de vie des nouveaux agriculteurs.trices</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Sun className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">35h tissées sur l'année</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Leaf className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">alimentation saine + accessible</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white rounded-full p-1 mt-0.5 mr-3">
                  <Users className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700">liens villes & ceintures rurales renforcés</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      {/* Divider courbe en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg className="absolute -bottom-1 w-full h-24 text-primary-50 fill-current" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,96 C1120,64 720,48 360,64 C180,72 90,64 0,96 L0,0 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default AgriMethod; 