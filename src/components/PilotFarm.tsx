import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building, School, Users, Tool } from 'lucide-react';
import Button from './ui/Button';

const PilotFarm = () => {
  return (
    <section className="py-24 bg-primary-800 text-white relative overflow-hidden">
      {/* Motif d'arrière-plan */}
      <div className="absolute inset-0 bg-pattern-dots opacity-15 pointer-events-none"></div>
      
      {/* Éléments graphiques */}
      <div className="absolute top-0 right-0 w-1/4 h-1/3 bg-primary-700 opacity-60 blur-3xl rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary-600 opacity-30 blur-3xl rounded-tr-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu textuel */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-block bg-primary-700 text-primary-50 px-4 py-1 rounded-full text-sm font-medium mb-6">
                  UNE MÉTHODE APPLIQUÉE
                </div>
                
                <h2 className="text-4xl font-light mb-6">
                  La ferme pilote Cultive
                </h2>
                
                <p className="text-xl text-primary-50 leading-relaxed">
                  Conçue pour être productive, pédagogique et expérimentale, la ferme du campus Cultive abritera à terme 4 modules de fermes de 5ha chacun, où les apprenants pourront mettre en application la méthode enseignée mais aussi expérimenter et challenger les pratiques.
                </p>
              </motion.div>
              
              <div className="space-y-4">
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-primary-700 p-3 rounded-xl text-primary-100 flex-shrink-0">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Productive</h3>
                    <p className="text-primary-100">Exploitation agricole rentable démontrant la viabilité économique du modèle</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-primary-700 p-3 rounded-xl text-primary-100 flex-shrink-0">
                    <School className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Pédagogique</h3>
                    <p className="text-primary-100">Espace d'apprentissage pour former la nouvelle génération d'agriculteurs</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-primary-700 p-3 rounded-xl text-primary-100 flex-shrink-0">
                    <Tool className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Expérimentale</h3>
                    <p className="text-primary-100">Laboratoire à ciel ouvert pour tester et améliorer les techniques agricoles</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-primary-50 hover:bg-white text-primary-900 mt-6 group"
                >
                  <span>Visiter la ferme</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
            
            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="h-0 pb-[75%] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/farm-building.jpg"
                  alt="Ferme pilote Cultive" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Badge flottant */}
              <motion.div
                className="absolute -bottom-8 right-16 bg-white shadow-xl rounded-xl p-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-7 w-7 text-primary-600" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Partenaires & Clients</div>
                    <div className="text-lg font-medium text-gray-800">12 Fermes</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Une méthode qui s'adapte aussi en fonction des besoins spécifiques et des conditions de chaque projet de ferme.
          </p>
        </motion.div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="h-0 pb-[70%] rounded-xl overflow-hidden relative border-2 border-primary-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <img 
                src={`/images/partner-farm-${index}.jpg`}
                alt={`Ferme partenaire ${index}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PilotFarm; 