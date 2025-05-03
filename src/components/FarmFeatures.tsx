import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Users, Tractor, Leaf, Farm, Award } from 'lucide-react';

// Composant personnalisé Farm
const Farm = ({ size = 24, className, ...props }) => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <rect x="9" y="14" width="6" height="5" rx="1" />
    <path d="M4 22V12" />
    <path d="M20 22V12" />
  </svg>
);

const FarmFeatures = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Valeurs pour l'effet parallaxe
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1.05]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.5], ['5%', '0%']);
  
  return (
    <section className="py-24 bg-primary-50 relative overflow-hidden" ref={containerRef}>
      {/* Motif d'arrière-plan */}
      <div className="absolute inset-0 bg-pattern-diagonal opacity-10 pointer-events-none"></div>
      
      {/* Éléments graphiques flottants */}
      <div className="absolute top-0 left-0 w-1/3 h-1/4 bg-primary-100 opacity-40 blur-3xl rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-primary-200 opacity-60 blur-3xl rounded-tl-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image avec animation */}
          <motion.div 
            className="relative"
            style={{ scale: imageScale }}
          >
            <div className="h-0 pb-[80%] rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/images/girl-farming.jpg" 
                alt="Jeune agricultrice récoltant" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Badge flottant */}
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-primary-600"
              initial={{ opacity: 0, y: 20, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Award className="h-5 w-5 text-primary-600" />
                <span>Méthode duplicable</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Caractéristiques */}
          <motion.div
            className="space-y-10"
            style={{ y: contentY }}
          >
            <div>
              <motion.h2
                className="text-4xl font-light text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Caractéristiques d'une ferme Cultive
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Alors que près de 200 fermes disparaissent chaque semaine en France, l'enjeu de rapidité de déploiement de nouvelles infrastructures est clé pour notre résilience alimentaire. Aussi nous avons pensé les fermes Cultive pour qu'elles soient rapidement duplicables avec des investissements optimisés, un système agronomique vertueux encadré par un écosystème de partenaires.
              </motion.p>
            </div>
            
            <div className="space-y-6">
              <Feature 
                icon={<MapPin />}
                title="Superficie entre 1 et 5 hectares"
                delay={0.2}
              />
              
              <Feature 
                icon={<Users />}
                title="Entre 3 et 7 ETP selon le niveau de maturité des fermes"
                delay={0.3}
              />
              
              <Feature 
                icon={<Farm />}
                title="Modèle agroforestier en maraîchage, arboriculture et petit élevage"
                delay={0.4}
              />
              
              <Feature 
                icon={<Leaf />}
                title="Activité principale : maraîchage bio-intensif"
                delay={0.5}
              />
              
              <Feature 
                icon={<Tractor />}
                title="Activités complémentaires réparties selon les temps forts de la saison : arboriculture, petits fruits, plantes aromatiques et médicinales, petit élevage, apiculture, transformation..."
                delay={0.6}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, delay = 0 }) => {
  return (
    <motion.div 
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="bg-white p-3 rounded-xl shadow-sm text-primary-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-700 font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

export default FarmFeatures; 