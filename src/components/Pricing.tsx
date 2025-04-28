import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp, Shield, Leaf, Cloud, Star, HelpCircle } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '../lib/utils';

const plans = [
  {
    name: 'Découverte',
    price: '29',
    frequency: '/mois',
    description: 'Pour les petites exploitations ou tests de la plateforme',
    icon: <Leaf className="w-5 h-5" />,
    features: [
      'Analyse météo locale',
      'Assistant IA pour 10 hectares',
      'Alertes maladies basiques',
      'Support email standard'
    ],
    disabledFeatures: [
      'Rapports personnalisés',
      'Intégration de capteurs IoT',
      'Accès API avancé'
    ]
  },
  {
    name: 'Professionnel',
    price: '79',
    frequency: '/mois',
    icon: <Cloud className="w-5 h-5" />,
    description: 'Pour les exploitations en croissance',
    features: [
      'Analyse météo & sol avancée',
      'Assistant IA jusqu\'à 100 hectares',
      'Alertes maladies + irrigation',
      'Priorité support technique',
      'Accès aux conseils agronomiques personnalisés'
    ],
    disabledFeatures: [
      'Intégration satellite temps réel',
      'Support dédié 24/7'
    ],
    popular: true
  },
  {
    name: 'Sur-mesure',
    price: null,
    icon: <Shield className="w-5 h-5" />,
    description: 'Pour les grandes exploitations, coopératives ou groupes',
    features: [
      'Nombre d\'hectares illimité',
      'Intégrations satellites temps réel',
      'Rapports IA personnalisés',
      'Support dédié 24/7',
      'Optimisation multisites',
      'Accompagnement stratégique'
    ],
    disabledFeatures: []
  }
];

const faqs = [
  {
    question: 'Puis-je changer de formule en cours d\'abonnement ?',
    answer: 'Oui, vous pouvez upgrader votre formule à tout moment. Le changement prendra effet immédiatement avec un prorata temporis pour la différence de prix.'
  },
  {
    question: 'Comment fonctionne la période d\'essai ?',
    answer: 'Nous proposons 14 jours d\'essai gratuit pour les formules Découverte et Professionnel, sans engagement et sans carte bancaire.'
  },
  {
    question: 'Quelles méthodes de paiement acceptez-vous ?',
    answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), les virements bancaires et les prélèvements SEPA pour les abonnements annuels.'
  },
  {
    question: 'Comment sont protégées mes données agricoles ?',
    answer: 'Vos données sont chiffrées et stockées sur des serveurs sécurisés en Europe, conformément au RGPD. Nous ne partageons jamais vos données avec des tiers sans votre accord explicite.'
  }
];

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-2xl font-bold mb-8 text-center"
      >
        Questions fréquentes
      </motion.h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="border border-neutral-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left bg-[#151818] hover:bg-[#1a1a1a] transition-colors"
            >
              <span className="font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#0c0c0c] text-gray-400 text-sm"
              >
                {faq.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  const pricingPlans = [
    {
      name: "Starter",
      description: "Idéal pour les petites exploitations agricoles",
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        { name: "Jusqu'à 5 parcelles", included: true },
        { name: "Données satellite (mise à jour hebdomadaire)", included: true },
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
      delay: 0.1,
      popular: false,
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Pro",
      description: "Pour les exploitations de taille moyenne et les coopératives",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        { name: "Jusqu'à 20 parcelles", included: true },
        { name: "Données satellite (mise à jour tous les 2-3 jours)", included: true },
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
      delay: 0.2,
      popular: true,
      color: "from-primary to-secondary"
    },
    {
      name: "Enterprise",
      description: "Pour les grandes exploitations et sociétés agricoles",
      monthlyPrice: 249,
      annualPrice: 2490,
      features: [
        { name: "Parcelles illimitées", included: true },
        { name: "Données satellite (mises à jour quotidiennes)", included: true },
        { name: "Données météorologiques premium", included: true },
        { name: "Utilisateurs illimités", included: true },
        { name: "Indices de végétation avancés", included: true },
        { name: "Exportation de rapports personnalisés", included: true },
        { name: "Alertes personnalisées avancées", included: true },
        { name: "Analyses avancées des sols", included: true },
        { name: "API Access", included: true },
        { name: "Support dédié 24/7", included: true },
      ],
      cta: "Contacter l'équipe",
      delay: 0.3,
      popular: false,
      color: "from-purple-600 to-purple-800"
    },
  ];

  return (
    <div className="py-24 relative overflow-hidden" id="pricing">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute right-10 top-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 1.8 }}
          viewport={{ once: true }}
        />
        <motion.div 
          className="absolute -left-20 bottom-40 w-80 h-80 rounded-full bg-secondary/20 blur-[100px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Tarification adaptée à vos besoins
            </span>
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Des solutions flexibles pour chaque exploitation agricole. Choisissez le plan qui correspond à vos besoins.
          </motion.p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-900 p-1 rounded-lg inline-flex items-center">
            <button
              onClick={() => setAnnualBilling(false)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                !annualBilling 
                  ? "bg-gradient-to-r from-primary to-secondary text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 relative",
                annualBilling 
                  ? "bg-gradient-to-r from-primary to-secondary text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              Annuel
              <span className="absolute -top-8 right-0 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 transition-all duration-300",
                plan.popular ? "shadow-lg shadow-primary/20 md:-mt-4 md:mb-4" : ""
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: plan.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    <Star className="h-3 w-3 inline-block mr-1" />
                    RECOMMANDÉ
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className={`bg-gradient-to-r ${plan.color} p-px rounded-t-2xl`}>
                <div className="bg-gray-900 rounded-t-2xl pt-6 pb-4 px-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
              </div>

              {/* Plan price */}
              <div className="px-6 py-8">
                <div className="flex items-end mb-6">
                  <span className="text-5xl font-bold text-white">
                    {annualBilling ? plan.annualPrice : plan.monthlyPrice}€
                  </span>
                  <span className="text-gray-400 ml-2 mb-1">
                    /{annualBilling ? 'an' : 'mois'}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: plan.delay + (featureIndex * 0.05) }}
                      viewport={{ once: true }}
                    >
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-500 shrink-0 mr-3 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-gray-300" : "text-gray-500"}>
                        {feature.name}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA button */}
                <motion.button
                  className={cn(
                    "w-full py-3 px-6 rounded-lg font-medium transition-all",
                    plan.popular 
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise section */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Besoin d'une solution sur mesure ?</h3>
              <p className="text-gray-400">Contactez notre équipe pour une offre personnalisée adaptée à vos besoins spécifiques.</p>
            </div>
            <motion.button
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg whitespace-nowrap hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Demander un devis
            </motion.button>
          </div>
        </motion.div>

        {/* FAQ teaser */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Des questions ?</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Consultez notre FAQ ou contactez-nous</h3>
          <motion.a
            href="#faq"
            className="text-gray-400 hover:text-primary underline transition-colors"
            whileHover={{ scale: 1.03 }}
          >
            Voir les questions fréquentes
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
