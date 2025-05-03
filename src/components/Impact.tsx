import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Droplets, Cloud, 
  Users, Globe, Sprout, 
  TrendingUp, Award, 
  ArrowRight
} from 'lucide-react';

interface ImpactStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
}

const ImpactStat: React.FC<ImpactStatProps> = ({ 
  icon, value, label, description, color, bgGradient 
}) => {
  return (
    <motion.div 
      className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${bgGradient} shadow-sm`}>
          {icon}
        </div>
        <div className="ml-4">
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl font-bold text-gray-800">{value}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mt-1">{label}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Impact = () => {
  const impactStats = [
    {
      icon: <Droplets size={24} className="text-blue-600" />,
      value: "45%",
      label: "Économie d'eau",
      description: "Réduction de la consommation d'eau grâce à des techniques d'irrigation intelligentes",
      color: "text-blue-600",
      bgGradient: "from-blue-500/20 to-blue-700/10"
    },
    {
      icon: <Leaf size={24} className="text-green-600" />,
      value: "38%",
      label: "Réduction carbone",
      description: "Diminution des émissions de gaz à effet de serre par rapport aux méthodes traditionnelles",
      color: "text-green-600",
      bgGradient: "from-green-500/20 to-green-700/10"
    },
    {
      icon: <Globe size={24} className="text-teal-600" />,
      value: "27%",
      label: "Biodiversité",
      description: "Augmentation de la biodiversité sur les exploitations utilisant nos solutions",
      color: "text-teal-600",
      bgGradient: "from-teal-500/20 to-teal-700/10"
    },
    {
      icon: <Users size={24} className="text-amber-600" />,
      value: "12K+",
      label: "Agriculteurs",
      description: "Communauté d'agriculteurs qui utilisent nos outils pour une agriculture plus durable",
      color: "text-amber-600",
      bgGradient: "from-amber-500/20 to-amber-700/10"
    }
  ];

  return (
    <section className="py-24 relative bg-white overflow-hidden">
      {/* Background elements - Style AMINI */}
      <div className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full border border-green-500/10 opacity-50" style={{ transform: 'translate(-250px, -250px)' }} />
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full border border-blue-500/10 opacity-50" style={{ transform: 'translate(300px, 300px)' }} />
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full border border-green-500/5 opacity-30" style={{ transform: 'translate(-50%, -50%)' }} />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm mb-4">
              <Award size={16} className="mr-2" />
              Impact mesurable
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 leading-tight mb-6">
              Ensemble pour une agriculture <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">durable</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous mesurons et améliorons continuellement l'impact environnemental et social de nos solutions agritech.
            </p>
          </motion.div>
        </div>

        {/* Image principale - Style Adventiel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative mb-24 rounded-3xl overflow-hidden"
        >
          <div className="absolute w-full h-full bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-3xl -z-10 transform translate-x-3 translate-y-3 rotate-1"></div>
          <img 
            src="/images/impact.jpg" 
            alt="Agriculture durable" 
            className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl flex items-end">
            <div className="p-10 text-white">
              <h3 className="text-3xl font-bold mb-4">Notre mission : Nourrir le monde de façon durable</h3>
              <p className="text-lg max-w-3xl">En collaborant avec les agriculteurs, nous créons un futur où l'agriculture est synonyme de durabilité et d'abondance.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                staggerChildren: 0.2
              }
            }
          }}
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                }
              }}
            >
              <ImpactStat {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-10 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-6">
                <TrendingUp size={18} className="mr-2" />
                <span className="text-sm font-semibold">Notre vision d'impact</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-green-900 mb-4">Changer l'agriculture, un hectare à la fois</h3>
                <p className="text-gray-700">
                  Chez AgriTech, nous croyons qu'une agriculture durable est la clé d'un futur plus résilient. Notre plateforme ne se contente pas de mesurer - elle aide concrètement les agriculteurs à réduire leur empreinte environnementale tout en optimisant leurs rendements.
                </p>
                <p className="text-gray-700">
                  Chaque décision prise avec nos outils contribue à un écosystème agricole plus sain, à la préservation des ressources naturelles et à la lutte contre le changement climatique.
                </p>
                <div className="pt-6">
                  <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300">
                    <span>Rejoignez notre programme</span>
                    <ArrowRight size={18} className="ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-5">
                <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
                  <div className="text-green-600 mb-3">
                    <Leaf size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-2">Agriculture régénérative</h4>
                  <p className="text-gray-600">
                    Restauration des écosystèmes naturels et séquestration carbone.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
                  <div className="text-blue-600 mb-3">
                    <Droplets size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-2">Conservation de l'eau</h4>
                  <p className="text-gray-600">
                    Optimisation des ressources hydriques et prévention des pertes.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
                  <div className="text-amber-600 mb-3">
                    <Users size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-2">Impact social</h4>
                  <p className="text-gray-600">
                    Amélioration des conditions des communautés agricoles.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
                  <div className="text-purple-600 mb-3">
                    <Cloud size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-2">Résilience climatique</h4>
                  <p className="text-gray-600">
                    Adaptation aux changements climatiques et aux conditions extrêmes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact; 