import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Qu\'est-ce qu\'AGRIA et comment ça fonctionne ?',
      answer: 'AGRIA est une plateforme d\'intelligence artificielle dédiée à l\'agriculture. Notre IA analyse vos questions en langage naturel et vous fournit des conseils personnalisés basés sur votre contexte agricole, les données météorologiques et les meilleures pratiques du secteur.',
      category: 'Général'
    },
    {
      id: '2',
      question: 'L\'utilisation d\'AGRIA est-elle gratuite ?',
      answer: 'Oui ! L\'accès de base à notre assistant IA est entièrement gratuit. Vous pouvez poser des questions illimitées et recevoir des conseils personnalisés. Des fonctionnalités premium comme l\'accès prioritaire aux experts peuvent être ajoutées ultérieurement.',
      category: 'Tarifs'
    },
    {
      id: '3',
      question: 'Quels types de questions puis-je poser à l\'IA ?',
      answer: 'Vous pouvez poser toute question liée à l\'agriculture : gestion des cultures, problèmes de ravageurs, choix d\'engrais, planning de semis, irrigation, météo agricole, certifications bio, etc. Plus votre question est précise, plus la réponse sera adaptée.',
      category: 'IA Assistant'
    },
    {
      id: '4',
      question: 'Comment l\'IA détecte-t-elle si j\'ai besoin d\'un expert ?',
      answer: 'Notre système analyse la complexité de votre question, recherche des mots-clés spécialisés et évalue le niveau de personnalisation requis. Si la question dépasse les capacités de l\'IA ou nécessite une expertise terrain, elle vous proposera automatiquement de consulter un expert certifié.',
      category: 'IA Assistant'
    },
    {
      id: '5',
      question: 'Les experts sont-ils vraiment certifiés ?',
      answer: 'Absolument ! Tous nos consultants agricoles sont rigoureusement vérifiés : diplômes d\'agronomie, certifications professionnelles, années d\'expérience terrain et avis clients. Chaque profil indique clairement les qualifications et spécialités de l\'expert.',
      category: 'Experts'
    },
    {
      id: '6',
      question: 'Comment réserver une consultation avec un expert ?',
      answer: 'Simple ! Accédez à la section "Experts", filtrez par spécialité, consultez les profils et tarifs, puis cliquez sur "Réserver". Vous pouvez choisir la date, l\'heure et décrire votre problématique. L\'expert vous contactera pour confirmer.',
      category: 'Experts'
    },
    {
      id: '7',
      question: 'Les produits de la marketplace sont-ils fiables ?',
      answer: 'Tous les produits sont sélectionnés par nos experts agricoles. Nous ne travaillons qu\'avec des vendeurs certifiés, des produits homologués et des marques reconnues. Chaque produit affiche ses certifications (bio, phyto, etc.) et avis clients.',
      category: 'Marketplace'
    },
    {
      id: '8',
      question: 'Puis-je annuler ma commande ?',
      answer: 'Oui, vous pouvez annuler votre commande jusqu\'à 24h après validation, sauf pour les produits périssables ou sur-mesure. Les remboursements sont traités sous 5-7 jours ouvrés selon votre mode de paiement.',
      category: 'Marketplace'
    },
    {
      id: '9',
      question: 'Mes données agricoles sont-elles sécurisées ?',
      answer: 'La sécurité est notre priorité absolue. Vos données sont chiffrées, stockées en conformité RGPD et jamais partagées avec des tiers sans votre consentement. Vous gardez le contrôle total sur vos informations et pouvez les supprimer à tout moment.',
      category: 'Sécurité'
    },
    {
      id: '10',
      question: 'Comment contacter le support technique ?',
      answer: 'Notre équipe support est disponible 7j/7 : chat en direct sur la plateforme, email à support@agria.fr, ou téléphone au 01 23 45 67 89. Temps de réponse moyen : 2h en journée, 24h le weekend.',
      category: 'Support'
    },
    {
      id: '11',
      question: 'L\'IA fonctionne-t-elle hors ligne ?',
      answer: 'Non, l\'IA nécessite une connexion internet pour accéder aux données météo en temps réel, bases de connaissances actualisées et recommandations personnalisées. Cependant, vous pouvez sauvegarder les conseils importants pour consultation hors ligne.',
      category: 'Technique'
    },
    {
      id: '12',
      question: 'AGRIA est-elle disponible sur mobile ?',
      answer: 'Oui ! Notre plateforme est entièrement optimisée pour mobile et tablette. Vous pouvez accéder à toutes les fonctionnalités depuis votre navigateur. Une application mobile native est prévue pour 2024.',
      category: 'Technique'
    }
  ];

  const categories = ['Toutes', 'Général', 'IA Assistant', 'Experts', 'Marketplace', 'Tarifs', 'Sécurité', 'Support', 'Technique'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Questions <span className="text-green-600 font-normal">Fréquentes</span>
            </h1>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur AGRIA. 
              Besoin d'aide supplémentaire ? Notre support est là pour vous.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp size={20} className="text-gray-500 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 flex-shrink-0 ml-4" />
                  )}
                </button>

                {openItems.includes(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Aucune question trouvée pour votre recherche.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Toutes');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-lg text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              Notre équipe support est là pour vous aider. Contactez-nous et obtenez 
              une réponse personnalisée en moins de 2 heures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/contact')}
                className="px-8 py-3"
              >
                <MessageCircle size={20} className="mr-2" />
                Nous contacter
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/login')}
                className="px-8 py-3"
              >
                Commencer avec AGRIA →
              </Button>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone size={24} className="text-green-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
                <p className="text-sm text-gray-500">7j/7, 8h-20h</p>
              </div>
              
              <div className="text-center">
                <Mail size={24} className="text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">support@agria.fr</p>
                <p className="text-sm text-gray-500">Réponse sous 2h</p>
              </div>
              
              <div className="text-center">
                <MessageCircle size={24} className="text-purple-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Chat Live</h3>
                <p className="text-gray-600">Support instantané</p>
                <p className="text-sm text-gray-500">Lun-Ven, 9h-18h</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage; 