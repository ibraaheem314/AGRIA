import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Droplets, Sun, Wind, 
  BarChart2, Smartphone, Cloud, 
  Shield, Database, Zap
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Analyse Intelligente",
      description: "Utilisez l'IA pour analyser vos cultures et optimiser vos rendements",
      color: "growth",
      gradient: "from-green-500/20 to-green-700/10"
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Gestion de l'Eau",
      description: "Optimisez votre consommation d'eau avec des capteurs intelligents",
      color: "water",
      gradient: "from-blue-500/20 to-blue-700/10"
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: "Suivi Météo",
      description: "Anticipez les conditions météorologiques pour protéger vos cultures",
      color: "sun",
      gradient: "from-amber-500/20 to-amber-700/10"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Analytics Avancés",
      description: "Visualisez vos données agricoles avec des tableaux de bord intuitifs",
      color: "growth",
      gradient: "from-green-500/20 to-green-700/10"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Application Mobile",
      description: "Gérez votre exploitation depuis votre smartphone",
      color: "water",
      gradient: "from-blue-500/20 to-blue-700/10"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Sécurisé",
      description: "Stockez vos données en toute sécurité dans le cloud",
      color: "sun",
      gradient: "from-amber-500/20 to-amber-700/10"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Motifs décoratifs type AMINI */}
      <div className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full border border-growth/10 opacity-50" style={{ transform: 'translate(-250px, -250px)' }} />
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full border border-water/10 opacity-50" style={{ transform: 'translate(300px, 300px)' }} />
      <div className="absolute left-1/2 top-1/2 w-[800px] h-[800px] rounded-full border border-growth/5 opacity-30" style={{ transform: 'translate(-400px, -400px)' }} />
      
      <div className="container mx-auto px-4 relative">
        {/* En-tête de section - Style Adventiel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
            <Zap className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Fonctionnalités Clés</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Une <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">plateforme</span> complète pour votre exploitation
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment notre solution peut transformer votre façon de cultiver
          </p>
        </motion.div>
        
        {/* Image + Texte alternés - Style mélangé */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image à gauche */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute w-full h-full bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-3xl -z-10 transform translate-x-3 translate-y-3 rotate-1"></div>
            <img 
              src="/images/analysis.jpg" 
              alt="Analyse de données agricoles" 
              className="rounded-3xl shadow-xl w-full h-full object-cover min-h-[350px] bg-gray-100" 
            />
            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-xl flex items-center justify-center">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          {/* Texte à droite */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Pilotez votre exploitation avec précision
            </h3>
            <p className="text-gray-600 mb-8">
              Notre plateforme réunit l'ensemble des données de votre exploitation et vous offre des outils d'analyse avancés pour prendre les meilleures décisions, au bon moment.
            </p>
            <ul className="space-y-5">
              {features.slice(0, 3).map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${feature.gradient} mr-4 shadow`}>
                    <span className={`text-${feature.color}`}>{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-900">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Grille de fonctionnalités - Style AMINI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              className="bg-white p-8 rounded-2xl border border-gray-100 relative overflow-hidden transition-all duration-300 hover:border-gray-200 shadow-sm"
            >
              {/* Effet de glow de type AMINI */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-30`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-sm`}>
                  <span className={`text-${feature.color}`}>{feature.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
              
              {/* Élément décoratif au survol - Style AMINI */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
        
        {/* Section sécurité - Style Adventiel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/10 flex items-center justify-center shadow-sm">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                Sécurité et Confidentialité
              </h3>
              <p className="text-gray-600">
                Vos données sont protégées par des protocoles de sécurité avancés et stockées de manière sécurisée dans notre cloud. Nous respectons strictement la confidentialité de vos informations agricoles.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/10 flex items-center justify-center shadow-sm">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
