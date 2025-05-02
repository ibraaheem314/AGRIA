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
        return 'border-secondary text-secondary';
      case 'Technologique':
        return 'border-primary text-primary';
      case 'Recherche':
        return 'border-accent text-accent';
      case 'Distribution':
        return 'border-green-500 text-green-500';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <section className="relative bg-dark py-24 overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative">
        {/* Titre de la section */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 text-white"
          >
            Nos <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">partenaires</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-3xl mx-auto"
          >
            Nous collaborons avec des leaders de l'industrie, des institutions de recherche et des organismes gouvernementaux pour transformer l'agriculture.
          </motion.p>
        </div>

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
            className={`px-6 py-2 border transition-all duration-300 text-sm tracking-wide ${
              selectedType === null 
                ? 'border-primary bg-primary/10 text-white' 
                : 'border-white/20 text-white hover:border-primary/50 hover:bg-primary/5'
            }`}
            onClick={() => setSelectedType(null)}
          >
            Tous
          </motion.button>
          
          {Object.keys(partnersByType).map((type, index) => (
            <motion.button
              key={type}
              variants={itemVariants}
              className={`px-6 py-2 border transition-all duration-300 text-sm tracking-wide ${
                selectedType === type 
                  ? `${getTypeColor(type)} bg-${type === 'Institutionnel' ? 'secondary' : type === 'Recherche' ? 'accent' : 'primary'}/10` 
                  : 'border-white/20 text-white hover:border-primary/50 hover:bg-primary/5'
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </motion.button>
          ))}
        </motion.div>

        {/* Logos des partenaires */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className={`bg-dark/80 backdrop-blur-sm p-8 flex flex-col items-center justify-center group hover:bg-glass transition-all duration-300 border-t border-b-0 ${getTypeColor(partner.type)}`}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(130, 90, 195, 0.2)' }}
            >
              <div className="h-16 w-full flex items-center justify-center mb-5 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center text-white font-light group-hover:scale-110 transition-transform duration-300">
                  {partner.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div className="absolute h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent bottom-0"></div>
              </div>
              <h4 className="text-sm text-white text-center font-light mb-1">{partner.name}</h4>
              <span className={`mt-1 text-xs ${getTypeColor(partner.type)} flex items-center`}>
                <span className="mr-1">{partner.type}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bannière de collaboration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 p-8 border border-primary/20 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
              <CheckCircle className="text-primary w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white mb-3">Devenir partenaire</h3>
              <p className="text-gray-400 mb-6">
                Vous souhaitez rejoindre notre écosystème et contribuer à l'avenir de l'agriculture intelligente ? Nous sommes toujours à la recherche de nouvelles collaborations innovantes.
              </p>
              <button className="bg-white text-dark font-light px-8 py-3 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-glow-primary">
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