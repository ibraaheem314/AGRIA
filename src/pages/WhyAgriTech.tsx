import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, Brain, BarChart2, Calculator } from 'lucide-react';
import Button from '../components/ui/Button';

const WhyAgriTech = () => {
  const benefits = [
    {
      icon: <Leaf className="h-6 w-6 text-primary" />,
      title: "Agriculture durable",
      description: "Réduisez votre empreinte carbone grâce à des pratiques agricoles optimisées et précises.",
      delay: 0.1
    },
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: "Sécurité et transparence",
      description: "Vos données sont cryptées et stockées en toute sécurité, consultables pour vos certifications.",
      delay: 0.2
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Prédictions avancées",
      description: "Anticipez les risques et opportunités avec notre intelligence artificielle prédictive.",
      delay: 0.3
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-secondary" />,
      title: "Optimisation des ressources",
      description: "Irrigation, fertilisants, traitements - réduisez vos coûts tout en optimisant vos rendements.",
      delay: 0.4
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50
      }
    }
  };

  return (
    <div className="relative py-20 px-4 md:px-6 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-secondary/5 filter blur-[120px]" />
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block text-sm font-medium text-gray-400 mb-3"
          >
            Notre mission
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Pourquoi choisir <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AgriTech</span> ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto text-gray-400 text-lg"
          >
            Notre plateforme utilise les dernières technologies en intelligence artificielle et imagerie satellite pour
            révolutionner vos méthodes de culture et d'exploitation.
          </motion.p>
        </motion.div>

        {/* Benefits cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card p-6 rounded-xl border border-white/10"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white/5 mr-4">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass-card p-8 md:p-12 rounded-xl text-center mb-20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-30" />
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Prêt à révolutionner votre agriculture ?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Rejoignez des milliers d'agriculteurs qui ont déjà transformé leur exploitation grâce à nos solutions innovantes.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white">
                Commencer gratuitement
              </Button>
              <Button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10">
                Voir une démo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Impact Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 md:p-10 rounded-xl text-center border border-white/10 relative overflow-hidden mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 opacity-30" />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-primary/80 text-black px-3 py-1 rounded-md text-xs font-medium inline-block mb-4"
            >
              Impact potentiel
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4">Mesurez votre impact</h2>
            <p className="text-gray-300 max-w-3xl mx-auto mb-6">
              Notre calculateur d'impact vous permet d'estimer les bénéfices économiques et environnementaux que vous
              pourriez obtenir en adoptant AgriTech.
            </p>
            <Button className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white">
              Calculer mon impact
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyAgriTech;
