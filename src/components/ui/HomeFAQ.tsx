import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const HomeFAQ: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(1); // Premier item ouvert par défaut

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "AGRIA est-il vraiment gratuit ?",
      answer: "Oui ! L'accès aux fonctionnalités essentielles d'AGRIA (IA agricole, conseils de base, météo) est 100% gratuit. Aucun frais caché. Nous proposons également des services premium pour les exploitations plus importantes."
    },
    {
      id: 2,
      question: "L'IA comprend-elle vraiment l'agriculture française ?",
      answer: "Absolument ! Notre IA est spécialement entraînée sur les spécificités de l'agriculture française : climat, sols, réglementations, cultures locales. Elle maîtrise les techniques bio, HVE, et les défis régionaux."
    },
    {
      id: 3,
      question: "Mes données agricoles sont-elles sécurisées ?",
      answer: "La sécurité est notre priorité #1. Vos données sont chiffrées, hébergées en France, et jamais partagées avec des tiers. Vous gardez le contrôle total de vos informations agricoles."
    },
    {
      id: 4,
      question: "Puis-je essayer sans m'inscrire ?",
      answer: "Vous pouvez découvrir nos fonctionnalités sur cette page, mais pour une expérience personnalisée et des conseils adaptés à votre exploitation, l'inscription (gratuite) est nécessaire."
    },
    {
      id: 5,
      question: "Comment AGRIA peut-il améliorer mes rendements ?",
      answer: "AGRIA analyse vos données (météo, sols, cultures) et vous propose des actions concrètes : timing optimal pour les traitements, irrigation précise, détection précoce des maladies, optimisation des intrants."
    }
  ];

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HelpCircle className="w-8 h-8 text-green-600" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-lg text-gray-600 font-light">
          Tout ce que vous devez savoir sur AGRIA
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 pr-4">
                {item.question}
              </h3>
              <motion.div
                animate={{ rotate: activeId === item.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {activeId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* CTA vers FAQ complète */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-12"
      >
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            D'autres questions ?
          </h3>
          <p className="text-gray-600 mb-6">
            Consultez notre centre d'aide complet ou contactez notre équipe
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
            >
              Voir toutes les FAQ
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeFAQ; 