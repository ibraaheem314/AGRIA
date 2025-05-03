import React from 'react';
import { Leaf, Shield, Brain, BarChart2, Calculator, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Agriculture durable",
    description: "Réduisez votre empreinte carbone grâce à des pratiques agricoles optimisées et précises.",
    gradient: "from-green-500/20 to-green-600/10",
    color: "green-600"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Sécurité et transparence",
    description: "Vos données sont chiffrées et stockées en toute sécurité, disponibles pour vos certifications.",
    gradient: "from-blue-500/20 to-blue-600/10",
    color: "blue-600"
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Prédictions avancées",
    description: "Anticipez les risques et les opportunités grâce à notre intelligence artificielle prédictive.",
    gradient: "from-green-500/20 to-green-600/10",
    color: "green-600"
  },
  {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Optimisation des ressources",
    description: "Irrigation, engrais, traitements - réduisez vos coûts tout en optimisant vos rendements.",
    gradient: "from-blue-500/20 to-blue-600/10",
    color: "blue-600"
  }
];

const features = [
  "Surveillance par satellite en temps réel",
  "Alertes météo personnalisées",
  "Planification intelligente des cultures",
  "Analyses prédictives des rendements",
  "Suivi de la santé des sols",
  "Recommandations d'irrigation précises"
];

const WhyAgriTech = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Motifs décoratifs type AMINI */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full border border-green-500/10 opacity-40" style={{ transform: 'translate(-250px, 250px)' }} />
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full border border-blue-500/10 opacity-40" style={{ transform: 'translate(300px, -300px)' }} />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full border border-green-500/5 opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="mb-20 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
            <span className="text-sm font-semibold">Notre mission</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Pourquoi choisir <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">AgriTech</span> ?
          </h2>
          <p className="text-xl text-gray-600">
            Notre plateforme utilise les dernières technologies d'intelligence artificielle et d'imagerie satellite pour révolutionner vos méthodes et opérations agricoles.
          </p>
        </motion.div>
      
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} mr-4 shadow-sm`}>
                  <div className={`text-${benefit.color}`}>
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Image + Feature List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-900 mb-8">Ce que nous offrons</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-green-500 rounded-full p-1 mr-3 text-white">
                      <Check size={16} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute w-full h-full bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-3xl -z-10 transform translate-x-3 translate-y-3 rotate-1"></div>
              <img 
                src="/images/features.jpg" 
                alt="Fonctionnalités AgriTech" 
                className="rounded-3xl shadow-xl w-full object-cover h-[350px] bg-gray-100" 
              />
              <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-r from-green-50 to-blue-50 p-16 rounded-3xl text-center mb-24 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full border border-green-500/20 -z-10" style={{ transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full border border-blue-500/20 -z-10" style={{ transform: 'translate(-20%, 20%)' }}></div>
          
          <h2 className="text-4xl font-bold text-green-900 mb-6">
            Prêt à révolutionner votre agriculture ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Rejoignez des milliers d'agriculteurs qui ont déjà transformé leurs opérations avec nos solutions innovantes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md"
            >
              Démarrer gratuitement
              <ArrowRight className="ml-2" size={16} />
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 font-semibold rounded-lg border border-green-200 hover:bg-green-50 transition-colors duration-300"
            >
              Voir une démo
            </a>
          </div>
        </motion.div>

        {/* Impact Calculator */}
        <motion.div 
          className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background element */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-8">
            <span className="text-sm font-semibold">Impact potentiel</span>
          </div>
          <h2 className="text-4xl font-bold text-green-900 mb-6">
            Mesurez votre impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Notre calculateur d'impact vous permet d'estimer les bénéfices économiques et environnementaux que vous pourriez obtenir en adoptant AgriTech.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Calculer mon impact
            <Calculator className="ml-2" size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyAgriTech;
