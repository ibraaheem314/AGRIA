import React from 'react';
import { motion } from 'framer-motion';

// Définir les types pour les partenaires
interface Partner {
  name: string;
  logo: string;
  type: 'Institutionnel' | 'Technologique' | 'Recherche' | 'Distribution';
}

const Partner = () => {
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

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Titre de la section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-primary/20 text-primary font-medium px-4 py-2 rounded-full mb-4"
          >
            Nos partenaires
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Un écosystème d'innovation
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
          className="flex flex-wrap justify-center gap-3 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {Object.keys(partnersByType).map((type, index) => (
            <motion.button
              key={type}
              variants={itemVariants}
              className="px-5 py-2 rounded-full bg-[#151918] text-gray-300 hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-neutral-800"
            >
              {type}
            </motion.button>
          ))}
        </motion.div>

        {/* Logos des partenaires */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="bg-[#151918] border border-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-all duration-300"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-full flex items-center justify-center mb-4">
                {/* Fallback si les images ne sont pas disponibles */}
                <div className="w-32 h-12 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded flex items-center justify-center text-white font-medium">
                  {partner.name.split(' ').map(word => word[0]).join('')}
                </div>
              </div>
              <h4 className="text-sm text-white text-center font-medium mb-1">{partner.name}</h4>
              <span className="text-xs text-primary">{partner.type}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bannière de collaboration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-8 text-center border border-primary/30"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Devenir partenaire</h3>
          <p className="text-gray-300 mb-6">
            Vous souhaitez rejoindre notre écosystème et contribuer à l'avenir de l'agriculture intelligente ?
          </p>
          <button className="bg-primary text-white font-medium px-8 py-3 rounded-lg hover:bg-primary/90 transition">
            Contactez-nous
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Partner; 