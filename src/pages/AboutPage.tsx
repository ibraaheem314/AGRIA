import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Package, Cloud, Shield, Target, Award, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              À propos d'<span className="text-green-600 font-normal">AGRIA</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Révolutionner l'agriculture grâce à l'intelligence artificielle et 
              créer un écosystème complet pour les agriculteurs modernes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
              Démocratiser l'accès aux technologies agricoles avancées pour permettre 
              à chaque agriculteur d'optimiser ses rendements tout en préservant l'environnement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8 text-green-600" />,
                title: "Précision",
                description: "Des conseils personnalisés basés sur vos données spécifiques et votre environnement local."
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-500" />,
                title: "Durabilité",
                description: "Solutions respectueuses de l'environnement pour une agriculture durable et rentable."
              },
              {
                icon: <Award className="w-8 h-8 text-yellow-500" />,
                title: "Innovation",
                description: "Technologies de pointe accessibles à tous les types d'exploitations agricoles."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Écosystème AGRIA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              L'Écosystème AGRIA
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Une plateforme complète qui vous accompagne à chaque étape de votre activité agricole.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12 text-green-600" />,
                title: "Assistant IA",
                description: "Intelligence artificielle conversationnelle pour répondre à toutes vos questions agricoles.",
                features: ["Conseils personnalisés", "Détection de complexité", "Recommandations intelligentes"],
                color: "green"
              },
              {
                icon: <Users className="w-12 h-12 text-orange-600" />,
                title: "Réseau d'Experts",
                description: "Accès direct à des consultants agricoles certifiés pour des conseils approfondis.",
                features: ["Consultants vérifiés", "Réservation en ligne", "Expertise spécialisée"],
                color: "orange"
              },
              {
                icon: <Package className="w-12 h-12 text-purple-600" />,
                title: "Marketplace",
                description: "Boutique en ligne de produits agricoles sélectionnés par nos experts.",
                features: ["Produits certifiés", "Livraison rapide", "Prix transparents"],
                color: "purple"
              }
            ].map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-center mb-6">
                  {module.icon}
                  <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${module.color}-500`}></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Pourquoi Choisir AGRIA ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "1500+", label: "Agriculteurs utilisateurs" },
              { number: "98%", label: "Taux de satisfaction" },
              { number: "24/7", label: "Support disponible" },
              { number: "15+", label: "Pays couverts" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-light text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Technologies Avancées
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Nous utilisons les dernières innovations en IA et data science pour 
              vous offrir les meilleurs conseils agricoles.
            </p>
          </motion.div>

          <div className="bg-gray-50 rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-light text-gray-900">
                  Intelligence Artificielle Avancée
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre IA analyse en temps réel des milliers de paramètres : 
                  météo, type de sol, historique des cultures, données satellitaires 
                  pour vous fournir des recommandations ultra-précises.
                </p>
                <div className="space-y-3">
                  {[
                    "Machine Learning adaptatif",
                    "Traitement du langage naturel",
                    "Analyse prédictive avancée",
                    "Vision par ordinateur"
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-8 h-8 text-green-600" />
                  <span className="font-medium text-gray-900">IA AGRIA</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Précision des conseils</span>
                    <span className="font-medium text-green-600">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temps de réponse</span>
                    <span className="font-medium text-blue-600">&lt; 2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Langues supportées</span>
                    <span className="font-medium text-purple-600">12+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Rejoignez la révolution agricole
            </h2>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Découvrez comment AGRIA peut transformer votre exploitation agricole
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-gray-900 px-12 py-4 rounded-full hover:bg-gray-100"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 