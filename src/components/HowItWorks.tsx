import React, { useRef } from 'react';
import { MapPin, BarChart, CloudLightning, AlertCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Cartographiez vos parcelles",
    description: "Délimitez facilement vos champs sur notre carte interactive. Importez des fichiers GeoJSON ou tracez manuellement vos parcelles avec précision.",
    icon: <MapPin className="h-8 w-8" />,
    gradient: "from-green-500/20 to-green-600/10",
    color: "green-600"
  },
  {
    number: 2,
    title: "Configurez vos alertes",
    description: "Paramétrez vos préférences de notification pour les conditions météo extrêmes, les changements d'indices de végétation ou les anomalies détectées.",
    icon: <AlertCircle className="h-8 w-8" />,
    gradient: "from-blue-500/20 to-blue-600/10",
    color: "blue-600"
  },
  {
    number: 3,
    title: "Suivez vos cultures",
    description: "Accédez aux données satellite actualisées, aux indices NDVI et aux prévisions météo pour chaque parcelle. Visualisez l'évolution de vos cultures.",
    icon: <BarChart className="h-8 w-8" />,
    gradient: "from-green-500/20 to-green-600/10",
    color: "green-600"
  },
  {
    number: 4,
    title: "Recevez des alertes ciblées",
    description: "Soyez informé en temps réel des risques météorologiques, du stress hydrique ou d'autres anomalies affectant spécifiquement vos parcelles.",
    icon: <CloudLightning className="h-8 w-8" />,
    gradient: "from-blue-500/20 to-blue-600/10",
    color: "blue-600"
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax values for different elements
  const titleY = useTransform(scrollYProgress, [0, 0.3], ['-5%', '0%']);
  
  return (
    <section className="py-24 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Motifs décoratifs type AMINI */}
      <div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full border border-green-500/10 opacity-40" style={{ transform: 'translate(-300px, -300px)' }} />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full border border-blue-500/10 opacity-40" style={{ transform: 'translate(250px, 250px)' }} />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full border border-green-500/5 opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mb-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: titleY }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
            <span className="text-sm font-semibold">Comment ça marche</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Une approche <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">simple</span> de l'agriculture de précision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une méthode efficace pour suivre vos cultures et optimiser votre production agricole en quelques étapes simples.
          </p>
        </motion.div>

        {/* Timeline et steps */}
        <div className="max-w-5xl mx-auto mb-20">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col md:flex-row items-start mb-16 md:mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Ligne de connexion verticale */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 -z-10 hidden md:block">
                  <motion.div 
                    className="absolute top-0 bottom-0 w-0.5 bg-green-300"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
              )}
              
              {/* Numéro d'étape */}
              <div className="mr-8 mb-4 md:mb-0">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-white border-2 border-green-500 flex items-center justify-center font-bold text-lg text-green-600 shadow-lg"
                  whileHover={{ scale: 1.1, borderColor: "#22c55e" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.number}
                </motion.div>
              </div>
              
              {/* Contenu de l'étape */}
              <motion.div 
                className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${step.gradient} mr-4 shadow-sm`}>
                    <div className={`text-${step.color}`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Section finale avec image + CTA */}
        <motion.div 
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute w-full h-full bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-3xl -z-10 transform translate-x-3 translate-y-3 rotate-1"></div>
            <img 
              src="/images/dashboard.jpg" 
              alt="Tableau de bord agricole" 
              className="rounded-3xl shadow-xl w-full object-cover h-[400px] bg-gray-100" 
            />
            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-xl flex items-center justify-center">
              <BarChart className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Prêt à transformer votre exploitation ?
            </h3>
            <p className="text-gray-600 mb-8">
              Notre plateforme vous donne accès à des outils de pointe pour une agriculture de précision, sans complexité technique. Commencez dès aujourd'hui et voyez la différence sur vos cultures.
            </p>
            <a href="#" className="inline-flex items-center px-8 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md">
              Démarrer maintenant
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
