import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

// Définir les types pour les partenaires
interface Partner {
  name: string;
  logo: string;
  type: 'Institutionnel' | 'Technologique' | 'Recherche' | 'Distribution';
}

const Partner = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Données des partenaires
  const partners: Partner[] = [
    {
      name: 'Ministère de l\'Agriculture',
      logo: '/images/partners/ministry-agri.svg',
      type: 'Institutionnel'
    },
    {
      name: 'Institut National Agronomique',
      logo: '/images/partners/agro-institute.svg',
      type: 'Recherche'
    },
    {
      name: 'TechFarm Solutions',
      logo: '/images/partners/techfarm.svg',
      type: 'Technologique'
    },
    {
      name: 'AgriData Corp',
      logo: '/images/partners/agridata.svg',
      type: 'Technologique'
    },
    {
      name: 'EcoCultures',
      logo: '/images/partners/ecocultures.svg',
      type: 'Distribution'
    },
    {
      name: 'Université des Sciences Agricoles',
      logo: '/images/partners/university.svg',
      type: 'Recherche'
    },
    {
      name: 'FarmTech Alliance',
      logo: '/images/partners/farmtech.svg',
      type: 'Distribution'
    },
    {
      name: 'AgroInnovate',
      logo: '/images/partners/agroinnovate.svg',
      type: 'Technologique'
    }
  ];

  // Filtrer les partenaires si un type est sélectionné
  const filteredPartners = selectedType
    ? partners.filter(partner => partner.type === selectedType)
    : partners;

  // Animation pour le container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation pour chaque élément
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fonction pour obtenir la couleur en fonction du type
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Institutionnel':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradientFrom: 'from-blue-500/20',
          gradientTo: 'to-blue-600/10',
          buttonBg: 'bg-blue-600',
          buttonHover: 'hover:bg-blue-700'
        };
      case 'Technologique':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          gradientFrom: 'from-green-500/20',
          gradientTo: 'to-green-600/10',
          buttonBg: 'bg-green-600',
          buttonHover: 'hover:bg-green-700'
        };
      case 'Recherche':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          gradientFrom: 'from-amber-500/20',
          gradientTo: 'to-amber-600/10',
          buttonBg: 'bg-amber-600',
          buttonHover: 'hover:bg-amber-700'
        };
      case 'Distribution':
        return {
          bg: 'bg-teal-50',
          text: 'text-teal-700',
          border: 'border-teal-200',
          gradientFrom: 'from-teal-500/20',
          gradientTo: 'to-teal-600/10',
          buttonBg: 'bg-teal-600',
          buttonHover: 'hover:bg-teal-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradientFrom: 'from-gray-500/20',
          gradientTo: 'to-gray-600/10',
          buttonBg: 'bg-gray-600',
          buttonHover: 'hover:bg-gray-700'
        };
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Motifs décoratifs type AMINI */}
      <div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full border border-green-500/10 opacity-40" style={{ transform: 'translate(-300px, -300px)' }} />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full border border-blue-500/10 opacity-40" style={{ transform: 'translate(250px, 250px)' }} />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full border border-green-500/5 opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Titre de la section */}
        <motion.div
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
            <span className="text-sm font-semibold">Notre écosystème</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Nos <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">partenaires</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous collaborons avec des leaders de l'industrie, des institutions de recherche et des organismes gouvernementaux pour transformer l'agriculture.
          </p>
        </motion.div>

        {/* Filtres pour les types de partenaires */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.button
            variants={itemVariants}
            className={`px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${
              selectedType === null 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
            }`}
            onClick={() => setSelectedType(null)}
          >
            Tous les partenaires
          </motion.button>
          
          {['Institutionnel', 'Technologique', 'Recherche', 'Distribution'].map((type, index) => {
            const typeColors = getTypeColor(type);
            return (
              <motion.button
                key={type}
                variants={itemVariants}
                className={`px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${
                  selectedType === type 
                    ? `${typeColors.buttonBg} text-white shadow-md` 
                    : `bg-white border border-gray-200 text-gray-700 hover:${typeColors.bg} hover:border-${type === 'Institutionnel' ? 'blue' : type === 'Technologique' ? 'green' : type === 'Recherche' ? 'amber' : 'teal'}-200 hover:${typeColors.text}`
                }`}
                onClick={() => setSelectedType(type as any)}
              >
                {type}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logos des partenaires */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredPartners.map((partner, index) => {
            const typeColors = getTypeColor(partner.type);
            return (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
              >
                {/* Barre de couleur en haut */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeColors.gradientFrom} ${typeColors.gradientTo}`}></div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typeColors.gradientFrom} ${typeColors.gradientTo} flex items-center justify-center mb-5 shadow-sm text-white font-bold text-xl group-hover:scale-110 transition-all duration-300`}>
                    {partner.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <h4 className="text-base font-bold text-gray-800 text-center mb-2">{partner.name}</h4>
                  <span className={`mt-1 px-3 py-1 rounded-full text-xs ${typeColors.bg} ${typeColors.text} font-medium`}>
                    {partner.type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bannière de collaboration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
        >
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full border border-green-200 -z-10" style={{ transform: 'translate(20%, -20%)' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border border-blue-200 -z-10" style={{ transform: 'translate(-20%, 20%)' }}></div>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex-shrink-0 shadow-sm">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Devenir partenaire</h3>
              <p className="text-gray-600 mb-6">
                Vous souhaitez rejoindre notre écosystème et contribuer à l'avenir de l'agriculture intelligente ? Nous sommes toujours à la recherche de nouvelles collaborations innovantes.
              </p>
              <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-sm">
                Nous contacter
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partner; 