import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

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

  // Regrouper les partenaires par type
  const partnersByType = partners.reduce((acc, partner) => {
    if (!acc[partner.type]) {
      acc[partner.type] = [];
    }
    acc[partner.type].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

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
          bg: 'bg-secondary-50',
          text: 'text-secondary-700',
          border: 'border-secondary-200',
          dot: 'bg-secondary-100'
        };
      case 'Technologique':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-700',
          border: 'border-primary-200',
          dot: 'bg-primary-100'
        };
      case 'Recherche':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          dot: 'bg-yellow-100'
        };
      case 'Distribution':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          dot: 'bg-green-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          dot: 'bg-gray-100'
        };
    }
  };

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-pattern-zigzag opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary-50 opacity-60 blur-3xl rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-50 opacity-40 blur-3xl rounded-tr-full"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Titre de la section */}
        <motion.div
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            ÉCOSYSTÈME
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            Nos partenaires
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
            className={`px-6 py-2 rounded-full transition-all duration-300 text-sm tracking-wide ${
              selectedType === null 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700'
            }`}
            onClick={() => setSelectedType(null)}
          >
            Tous
          </motion.button>
          
          {Object.keys(partnersByType).map((type, index) => {
            const typeStyles = getTypeColor(type);
            return (
              <motion.button
                key={type}
                variants={itemVariants}
                className={`px-6 py-2 rounded-full transition-all duration-300 text-sm tracking-wide ${
                  selectedType === type 
                    ? `bg-${type === 'Institutionnel' ? 'secondary' : type === 'Recherche' ? 'yellow' : type === 'Distribution' ? 'green' : 'primary'} text-white shadow-md` 
                    : `bg-gray-100 text-gray-700 hover:${typeStyles.bg} hover:${typeStyles.text}`
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logos des partenaires */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredPartners.map((partner, index) => {
            const typeStyles = getTypeColor(partner.type);
            return (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className={`card-white p-8 flex flex-col items-center justify-center group border-t-2 ${typeStyles.border}`}
                whileHover={{ y: -5 }}
              >
                <div className="h-16 w-full flex items-center justify-center mb-5 relative">
                  <div className={`w-12 h-12 rounded-full ${typeStyles.bg} flex items-center justify-center ${typeStyles.text} font-medium group-hover:scale-110 transition-transform duration-300`}>
                    {partner.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div className={`absolute h-px w-1/2 ${typeStyles.border} bottom-0`}></div>
                </div>
                <h4 className="text-sm text-gray-800 text-center font-medium mb-1">{partner.name}</h4>
                <span className={`mt-1 px-3 py-1 rounded-full text-xs ${typeStyles.bg} ${typeStyles.text} flex items-center`}>
                  <span className="mr-1.5 w-1.5 h-1.5 rounded-full inline-block ${typeStyles.dot}"></span>
                  {partner.type}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bannière de collaboration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-primary-50 to-secondary-50 p-8 rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
              <CheckCircle className="text-primary-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-gray-800 mb-3">Devenir partenaire</h3>
              <p className="text-gray-600 mb-6">
                Vous souhaitez rejoindre notre écosystème et contribuer à l'avenir de l'agriculture intelligente ? Nous sommes toujours à la recherche de nouvelles collaborations innovantes.
              </p>
              <button className="bg-primary hover:bg-primary-600 text-white font-medium px-8 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                Contactez-nous
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partner; 