import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    urgency: 'normal'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const categories = [
    { value: 'general', label: 'Question générale' },
    { value: 'technical', label: 'Problème technique' },
    { value: 'billing', label: 'Facturation' },
    { value: 'feature', label: 'Demande de fonctionnalité' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'press', label: 'Presse & Médias' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center px-6"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Message envoyé avec succès !
          </h2>
          <p className="text-gray-600 mb-8">
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais, 
            généralement sous 2 heures en journée.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/faq')}
              className="w-full"
            >
              Consulter la FAQ
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Nous <span className="text-green-600 font-normal">Contacter</span>
            </h1>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Une question, un problème, une suggestion ? Notre équipe est là pour vous aider. 
              Nous nous engageons à vous répondre rapidement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgence
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="low">Faible</option>
                      <option value="normal">Normale</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Résumé de votre demande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  En envoyant ce formulaire, vous acceptez que nous traitions vos données 
                  conformément à notre politique de confidentialité.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-6">
                  Autres moyens de nous joindre
                </h2>
                <p className="text-gray-600 mb-8">
                  Choisissez le canal qui vous convient le mieux. Notre équipe est 
                  disponible pour vous accompagner dans votre expérience AGRIA.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Support Téléphonique</h3>
                      <p className="text-gray-600 mb-2">
                        <strong>01 23 45 67 89</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Disponible 7j/7 de 8h à 20h<br/>
                        Support d'urgence 24h/24 pour les abonnés Premium
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 mb-2">
                        <strong>support@agria.fr</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Réponse garantie sous 2h en journée<br/>
                        24h maximum le weekend
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Chat Live</h3>
                      <p className="text-gray-600 mb-2">
                        Support instantané depuis votre compte
                      </p>
                      <p className="text-sm text-gray-500">
                        Lun-Ven : 9h-18h<br/>
                        Temps de réponse moyen : 2 minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Informations Entreprise</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>AGRIA SAS, 123 Avenue de l'Agriculture, 75001 Paris</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>SIRET : 123 456 789 00012</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>contact@agria.fr</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/faq')}
                  className="w-full justify-start"
                >
                  <HelpCircle size={20} className="mr-3" />
                  Consulter la FAQ
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="w-full justify-start"
                >
                  <MessageCircle size={20} className="mr-3" />
                  En savoir plus sur AGRIA
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 