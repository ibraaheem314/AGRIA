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
  color: string;
  gradient: string;
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
  index,
  color,
  gradient
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}
      className={`relative rounded-2xl overflow-hidden border ${
        popular 
          ? 'border-green-200 bg-white shadow-md' 
          : 'border-gray-100 bg-white shadow-sm'
      } transition-all duration-300`}
    >
      {popular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
      )}
      
      {popular && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full shadow-sm">
          Recommandé
        </div>
      )}
      
      <div className="p-8 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
            {icon}
          </div>
          <h3 className="text-xl text-green-900 font-bold">{name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-8 h-12">{description}</p>
        
        <div className="mb-8">
          {price !== null ? (
            <div className="flex items-baseline">
              <span className="text-4xl text-green-900 font-bold">{price}€</span>
              <span className="text-gray-600 ml-2">/mois</span>
              {annualPrice && (
                <span className="ml-2 text-xs text-green-600 font-medium">{`Économisez ${Math.round((price * 12 - annualPrice) / (price * 12) * 100)}% annuellement`}</span>
              )}
            </div>
          ) : (
            <div className="text-2xl text-green-900 font-bold">Sur demande</div>
          )}
        </div>
        
        <div className="group mb-8">
          <a 
            href="#" 
            className={`block w-full py-3 rounded-lg font-semibold text-center relative overflow-hidden shadow-sm ${
              popular 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : `bg-white text-${color} border border-${color} hover:bg-${color}/5`
            } transition-all duration-300`}
          >
            {cta}
          </a>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-green-900 mb-4">Fonctionnalités incluses :</h4>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                {feature.included ? (
                  <div className={`mr-3 flex-shrink-0 p-0.5 rounded-full bg-green-100 mt-0.5`}>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                ) : (
                  <div className="mr-3 flex-shrink-0 p-0.5 rounded-full bg-gray-100 mt-0.5">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
                <span className={feature.included ? "text-gray-700 text-sm" : "text-gray-400 text-sm"}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
      icon: <Zap size={20} />,
      color: "blue-600",
      gradient: "from-blue-500/90 to-blue-600/90",
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
      icon: <Cloud size={20} />,
      color: "green-600",
      gradient: "from-green-500/90 to-green-600/90",
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
      icon: <ShieldCheck size={20} />,
      color: "amber-600",
      gradient: "from-amber-500/90 to-amber-600/90",
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
    <section className="py-24 bg-white relative overflow-hidden" id="pricing">
      {/* Motifs décoratifs type AMINI */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full border border-green-500/10 opacity-40" style={{ transform: 'translate(300px, -300px)' }} />
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full border border-blue-500/10 opacity-40" style={{ transform: 'translate(-250px, 250px)' }} />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full border border-green-500/5 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
            <span className="text-sm font-semibold">Tarification</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Des offres adaptées à <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">vos besoins</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions adaptées à toutes les exploitations agricoles, quelle que soit leur taille
          </p>
        </motion.div>

        {/* Toggle annuel/mensuel */}
        <div className="flex justify-center mb-16">
          <div className="p-1 bg-white inline-flex rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 rounded-md ${
                annualBilling 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Annuel <span className="text-xs ml-1 font-normal">(-20%)</span>
            </button>
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 rounded-md ${
                !annualBilling 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mensuel
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, index) => (
            <PricingPlan key={plan.name} {...plan} index={index} />
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <motion.h3 
            className="text-2xl font-bold text-green-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Questions fréquentes
          </motion.h3>
          
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className={`border border-gray-100 rounded-xl shadow-sm overflow-hidden bg-white ${openFaqIndex === index ? 'shadow-md' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-green-900">{faq.question}</span>
                  {openFaqIndex === index ? 
                    <ChevronUp className="w-5 h-5 text-green-600" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    <div className="pt-2 border-t border-gray-100 mt-1">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Bannière CTA */}
      <motion.div 
        className="mt-24 max-w-5xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full border border-green-200 -z-10" style={{ transform: 'translate(20%, -20%)' }}></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border border-blue-200 -z-10" style={{ transform: 'translate(-20%, 20%)' }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
          <div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">Vous avez des questions ?</h3>
            <p className="text-gray-600 mb-8">
              Notre équipe est disponible pour vous accompagner dans le choix de la meilleure solution pour votre exploitation agricole.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300 shadow-sm">
                Nous contacter
              </a>
              <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-green-700 font-semibold border border-green-200 hover:bg-green-50 transition-colors duration-300">
                Voir la démo
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-center text-sm text-gray-600">Garantie satisfait ou remboursé pendant 30 jours</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;
