import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Brain, Users, BarChart, Sparkles, Star, Quote } from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import DemoChat from '../components/ui/DemoChat';
import ImpactStats from '../components/ui/ImpactStats';
import HomeFAQ from '../components/ui/HomeFAQ';
import NewsletterSignup from '../components/ui/NewsletterSignup';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/register');
    }
  };

  const handleDemoClick = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Background Animé */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background animé */}
        <AnimatedBackground />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badge "Nouveau" */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-8"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Nouveau : IA Mistral intégrée
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-light text-gray-900 leading-tight mb-8">
              Intelligence agricole.
              <br />
              <span className="font-normal">Révolutionnez vos cultures</span>
              <br />
              <span className="text-green-600 font-normal">avec l'IA.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-12 max-w-3xl">
              Rejoignez <strong>12 000+ agriculteurs</strong> qui utilisent AGRIA pour optimiser 
              leurs rendements avec l'intelligence artificielle. 
              <span className="block mt-2 text-green-600 font-medium">
                +28% de rendement moyen • -35% de coûts • 100% gratuit
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartNow}
                  className="text-base px-8 py-4 rounded-full font-medium shadow-lg"
                >
                  {isAuthenticated ? 'Accéder à l\'IA' : 'Commencer gratuitement'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleDemoClick}
                  className="text-base px-8 py-4 text-gray-700 hover:text-gray-900 border border-gray-300"
                >
                  Voir la démo →
                </Button>
              </motion.div>
            </div>

            {/* Compteur en temps réel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">En ligne maintenant :</span>
              </div>
              <span className="text-lg font-bold text-green-600">2,847 agriculteurs</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Démo Interactive */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Démo du chatbot */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <DemoChat />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-sm font-medium text-green-600 mb-4 tracking-wide uppercase">
                ✨ Démo Interactive
              </div>
              
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight">
                Découvrez l'IA agricole en action
              </h2>
              
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Notre assistant IA comprend vos questions en langage naturel et vous fournit 
                des conseils personnalisés basés sur 15 ans d'expertise agricole française.
              </p>

              <div className="space-y-4">
                {[
                  { icon: "🧠", title: "IA Spécialisée", desc: "Entraînée sur l'agriculture française" },
                  { icon: "⚡", title: "Réponses Instantanées", desc: "Conseils personnalisés en temps réel" },
                  { icon: "📊", title: "Données Précises", desc: "Basé sur des milliers d'exploitations" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={handleStartNow}
                variant="primary"
                className="mt-8"
              >
                {isAuthenticated ? 'Utiliser l\'IA maintenant' : 'Commencer gratuitement'}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Statistiques d'Impact */}
      <ImpactStats />

      {/* Section Témoignages */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Ce que disent nos agriculteurs
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Découvrez l'expérience de ceux qui ont transformé leur exploitation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Agricultrice bio, Normandie",
                avatar: "👩‍🌾",
                content: "AGRIA m'a permis de réduire mes coûts de 30% tout en améliorant mes rendements. L'IA comprend vraiment les spécificités du bio !",
                rating: 5
              },
              {
                name: "Pierre Martin", 
                role: "Céréalier, Beauce",
                avatar: "👨‍🌾",
                content: "Incroyable ! L'IA a détecté une maladie sur mes blés 2 semaines avant moi. J'ai sauvé toute ma récolte grâce aux conseils personnalisés.",
                rating: 5
              },
              {
                name: "Sophie Laurent",
                role: "Maraîchère, Provence",
                avatar: "🌱",
                content: "L'assistant IA d'AGRIA est devenu indispensable. Je l'utilise quotidiennement pour optimiser l'irrigation et la fertilisation.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 relative"
              >
                <Quote className="w-8 h-8 text-green-300 mb-4" />
                
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi AGRIA */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              L'écosystème complet pour votre réussite
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Plus qu'un simple outil, AGRIA est votre partenaire pour une agriculture moderne et rentable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Brain className="w-8 h-8 text-green-600" />,
                title: "IA Conversationnelle",
                description: "Posez vos questions en français. Notre IA comprend le contexte agricole et vous répond avec précision.",
                badge: "Mistral AI"
              },
              {
                icon: <Users className="w-8 h-8 text-orange-500" />,
                title: "Réseau d'Experts",
                description: "Accédez à notre réseau de 200+ consultants agricoles certifiés pour des conseils approfondis.",
                badge: "200+ experts"
              },
              {
                icon: <BarChart className="w-8 h-8 text-purple-500" />,
                title: "Marketplace Intégrée",
                description: "Commandez directement les produits recommandés par l'IA. Prix négociés, livraison rapide.",
                badge: "5000+ produits"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-6 relative"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  {feature.icon}
                </div>
                
                <div className="absolute top-0 right-8">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-24 px-6 bg-white">
        <HomeFAQ />
      </section>

      {/* Section Newsletter */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Prêt à rejoindre l'agriculture du futur ?
            </h2>
            <p className="text-xl text-green-100 font-light max-w-2xl mx-auto">
              Plus de 12 000 agriculteurs nous font déjà confiance. 
              Rejoignez la révolution agricole dès aujourd'hui.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleStartNow}
                  className="bg-white text-green-600 px-12 py-4 rounded-full hover:bg-green-50 font-bold shadow-lg"
                >
                  {isAuthenticated ? 'Accéder à l\'IA' : 'Commencer gratuitement'}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="border-2 border-white text-white px-12 py-4 rounded-full hover:bg-white/10 font-bold"
                >
                  En savoir plus
                </Button>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 pt-8 border-t border-green-500/30">
              <div className="flex items-center gap-2 text-green-100">
                <span className="text-lg">🇫🇷</span>
                <span className="text-sm">Made in France</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <span className="text-lg">🔒</span>
                <span className="text-sm">Données sécurisées</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <span className="text-lg">✨</span>
                <span className="text-sm">100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <span className="text-lg">⚡</span>
                <span className="text-sm">Support 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
