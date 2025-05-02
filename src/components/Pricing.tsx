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
      className={`relative rounded-xl overflow-hidden border ${
        popular 
          ? 'border-primary bg-white shadow-lg' 
          : 'border-gray-100 bg-white shadow-md'
      } hover:shadow-xl transition-all duration-300`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-medium rounded-full z-10 shadow-sm">
          Recommandé
        </div>
      )}
      
      <div className="p-8 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${popular ? 'bg-primary-100' : 'bg-gray-100'} flex items-center justify-center ${popular ? 'text-primary-600' : 'text-gray-600'}`}>
            {icon}
          </div>
          <h3 className="text-xl text-gray-800 font-medium">{name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 h-12">{description}</p>
        
        <div className="mb-8">
          {price !== null ? (
            <div className="flex items-baseline">
              <span className="text-4xl text-gray-800 font-light">{price}€</span>
              <span className="text-gray-500 ml-2">/mois</span>
              {annualPrice && (
                <span className="ml-2 text-xs text-primary">{`Économisez ${Math.round((price * 12 - annualPrice) / (price * 12) * 100)}% annuellement`}</span>
              )}
            </div>
          ) : (
            <div className="text-2xl text-gray-800 font-light">Sur demande</div>
          )}
        </div>
        
        <div className="group">
          <button 
            className={`w-full py-3 rounded-md font-medium mb-8 relative overflow-hidden shadow-md ${
              popular 
                ? 'bg-primary text-white hover:bg-primary-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-all duration-300`}
          >
            {cta}
          </button>
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              {feature.included ? (
                <div className="mr-3 flex-shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className="mr-3 flex-shrink-0 mt-0.5">
                  <X className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
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
    <section className="relative bg-gray-50 py-24" id="pricing">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-50 opacity-40 blur-3xl rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary-50 opacity-60 blur-3xl rounded-tr-full"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            TARIFICATION
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            Nos tarifs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions adaptées à toutes les exploitations agricoles, quelle que soit leur taille
          </p>
        </motion.div>

        {/* Toggle annuel/mensuel */}
        <div className="flex justify-center mb-16">
          <div className="p-1 bg-white inline-flex rounded-lg shadow-sm">
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-6 py-2 text-sm transition-all duration-300 rounded-md ${
                annualBilling 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Annuel <span className="text-xs opacity-80">(-20%)</span>
            </button>
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-6 py-2 text-sm transition-all duration-300 rounded-md ${
                !annualBilling 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mensuel
            </button>
          </div>
        </div>

        {/* Grille de prix */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan key={plan.name} {...plan} index={index} />
          ))}
        </div>

        {/* Section FAQ */}
        <div className="mt-32 max-w-3xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-light text-center mb-12 text-gray-800"
          >
            Questions fréquentes
          </motion.h3>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openFaqIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 pt-0 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100"
        >
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            Besoin d'une solution personnalisée ?
          </h3>
          <p className="text-gray-600 mb-6">
            Contactez notre équipe commerciale pour discuter de vos besoins spécifiques
            et obtenir un devis adapté à votre exploitation.
          </p>
          <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
            Demander un devis personnalisé
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
