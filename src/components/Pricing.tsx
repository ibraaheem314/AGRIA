import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp, Shield, Zap, Cloud, ShieldCheck } from 'lucide-react';

interface Feature {
  name: string;
  included: boolean;
}

interface PlanProps {
  name: string;
  description: string;
  price: number | null;
  annualPrice?: number;
  features: Feature[];
  popular?: boolean;
  cta: string;
  icon: React.ReactNode;
  index: number;
}

const PricingPlan: React.FC<PlanProps> = ({
  name,
  description,
  price,
  annualPrice,
  features,
  popular,
  cta,
  icon,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-dark backdrop-blur-sm border-t-2 ${
        popular 
          ? 'border-primary shadow-glow-primary' 
          : 'border-white/10'
      } hover:border-primary/50 hover:shadow-glow-sm transition-all duration-300`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs rounded-full z-10">
          Recommandé
        </div>
      )}
      
      <div className="p-8 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${popular ? 'bg-primary' : 'bg-white/10'} flex items-center justify-center text-white`}>
            {icon}
          </div>
          <h3 className="text-xl text-white font-light">{name}</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 h-12">{description}</p>
        
        <div className="mb-8">
          {price !== null ? (
            <div className="flex items-baseline">
              <span className="text-4xl text-white font-light">{price}€</span>
              <span className="text-gray-400 ml-2">/mois</span>
              {annualPrice && (
                <span className="ml-2 text-xs text-primary-400">Économisez {Math.round((price * 12 - annualPrice) / (price * 12) * 100)}% annuellement</span>
              )}
            </div>
          ) : (
            <div className="text-2xl text-white font-light">Sur demande</div>
          )}
        </div>
        
        <div className="group">
          <button 
            className={`w-full py-3 font-light mb-8 relative overflow-hidden ${
              popular 
                ? 'bg-gradient-to-r from-primary to-primary-700 text-white' 
                : 'bg-white text-dark hover:bg-gradient-to-r hover:from-primary hover:to-primary-700 hover:text-white'
            } transition-all duration-500`}
          >
            <span className="relative z-10">{cta}</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-700 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              {feature.included ? (
                <div className="mr-3 flex-shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-secondary" />
                </div>
              ) : (
                <div className="mr-3 flex-shrink-0 mt-0.5">
                  <X className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <span className={feature.included ? "text-gray-300" : "text-gray-500"}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const plans: Omit<PlanProps, 'index'>[] = [
    {
      name: "Essentiel",
      description: "Pour les petites exploitations agricoles",
      price: annualBilling ? 39 : 49,
      annualPrice: 468,
      icon: <Zap size={18} />,
    features: [
        { name: "Jusqu'à 5 parcelles", included: true },
        { name: "Données satellite hebdomadaires", included: true },
        { name: "Données météorologiques de base", included: true },
        { name: "1 utilisateur", included: true },
        { name: "Indices de végétation standards", included: true },
        { name: "Exportation de rapports (limité)", included: true },
        { name: "Alertes personnalisées", included: false },
        { name: "Analyses avancées des sols", included: false },
        { name: "API Access", included: false },
        { name: "Support dédié", included: false },
      ],
      cta: "Commencer",
      popular: false
    },
    {
      name: "Professionnel",
      description: "Pour les exploitations de taille moyenne",
      price: annualBilling ? 79 : 99,
      annualPrice: 948,
      icon: <Cloud size={18} />,
    features: [
        { name: "Jusqu'à 20 parcelles", included: true },
        { name: "Données satellite (tous les 2-3 jours)", included: true },
        { name: "Données météorologiques complètes", included: true },
        { name: "3 utilisateurs", included: true },
        { name: "Tous les indices de végétation", included: true },
        { name: "Exportation de rapports illimitée", included: true },
        { name: "Alertes personnalisées", included: true },
        { name: "Analyses avancées des sols", included: true },
        { name: "API Access", included: false },
        { name: "Support dédié", included: false },
      ],
      cta: "Essai gratuit",
    popular: true
  },
  {
      name: "Enterprise",
      description: "Pour les grandes exploitations et coopératives",
    price: null,
      icon: <ShieldCheck size={18} />,
    features: [
        { name: "Parcelles illimitées", included: true },
        { name: "Données satellite quotidiennes", included: true },
        { name: "Données météorologiques premium", included: true },
        { name: "Utilisateurs illimités", included: true },
        { name: "Indices de végétation avancés", included: true },
        { name: "Rapports personnalisés", included: true },
        { name: "Alertes personnalisées avancées", included: true },
        { name: "Analyses avancées des sols", included: true },
        { name: "API Access complet", included: true },
        { name: "Support dédié 24/7", included: true },
      ],
      cta: "Contacter l'équipe",
      popular: false
    },
];

const faqs = [
  {
      question: "Puis-je changer de formule en cours d'abonnement ?",
      answer: "Oui, vous pouvez upgrader votre formule à tout moment. Le changement prendra effet immédiatement avec un prorata temporis pour la différence de prix."
  },
  {
      question: "Comment fonctionne la période d'essai ?",
      answer: "Nous proposons 14 jours d'essai gratuit pour les formules Essentiel et Professionnel, sans engagement et sans carte bancaire."
  },
  {
      question: "Quelles méthodes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), les virements bancaires et les prélèvements SEPA pour les abonnements annuels."
  },
  {
      question: "Comment sont protégées mes données agricoles ?",
      answer: "Vos données sont chiffrées et stockées sur des serveurs sécurisés en Europe, conformément au RGPD. Nous ne partageons jamais vos données avec des tiers sans votre accord explicite."
  }
];

  return (
    <section className="relative bg-dark py-24" id="pricing">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-grid-pattern opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 text-white"
          >
            <span className="text-white">Nos </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">tarifs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-lg max-w-3xl mx-auto"
          >
            Des solutions adaptées à toutes les exploitations agricoles, quelle que soit leur taille
          </motion.p>
        </div>

        {/* Toggle annuel/mensuel */}
        <div className="flex justify-center mb-16">
          <div className="p-1 bg-surface border border-white/10 inline-flex rounded-lg shadow-glow-sm">
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-6 py-2 text-sm transition-all duration-300 rounded-md ${
                annualBilling 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-white hover:bg-white/5'
              }`}
            >
              Annuel <span className="text-xs opacity-80">(-20%)</span>
            </button>
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-6 py-2 text-sm transition-all duration-300 rounded-md ${
                !annualBilling 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-white hover:bg-white/5'
              }`}
            >
              Mensuel
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {plans.map((plan, i) => (
            <PricingPlan
              key={i}
              index={i}
              {...plan}
            />
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-primary/30"></div>
            <h3 className="text-2xl font-light text-white text-center">Questions fréquentes</h3>
            <div className="h-px w-12 bg-primary/30"></div>
          </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
                className="border border-white/10 bg-dark backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
          >
            <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full p-5 text-left"
            >
                  <span className="font-light text-white">{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    openFaqIndex === index ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-4 h-4" />
              ) : (
                      <ChevronDown className="w-4 h-4" />
              )}
                  </div>
            </button>
            
                {openFaqIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                    className="p-5 border-t border-white/10 text-gray-400 text-sm bg-white/5"
              >
                {faq.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
      </div>
    </section>
  );
};

export default Pricing;
