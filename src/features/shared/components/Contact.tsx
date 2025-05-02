import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../shared/ui/components/Button';
import { Send, CheckCircle, AlertCircle, User, Mail, Building, Phone, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    acceptTerms: false
  });

  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ submitted: false, success: false, message: '' });
    
    try {
      // Simulation d'un appel API (à remplacer par votre appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Uncomment and modify this when you have a real API endpoint
      /*
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Problème lors de l\'envoi du formulaire');
      }
      
      const data = await response.json();
      */
      
      // Succès
      setStatus({
        submitted: true,
        success: true,
        message: 'Votre message a été envoyé avec succès! Nous vous contacterons bientôt.'
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        acceptTerms: false
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatus({
        submitted: true,
        success: false,
        message: 'Un problème est survenu lors de l\'envoi du message. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-4 md:px-6 bg-gradient-to-b from-dark to-darker">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-light mb-6">Contactez-nous</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Notre équipe d'experts est prête à vous accompagner dans vos projets agricoles durables
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Formulaire */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-3/5 bg-surface/40 backdrop-blur-sm p-8 rounded-xl border border-primary/10 shadow-glow-sm"
          >
            {status.submitted && (
              <div className={`mb-8 p-5 rounded-lg ${status.success ? 'bg-primary/10 border border-primary/30' : 'bg-red-900/10 border border-red-800/30'}`}>
                <div className="flex items-center">
                  {status.success ? 
                    <CheckCircle className="text-primary mr-3" size={24} /> :
                    <AlertCircle className="text-red-500 mr-3" size={24} />
                  }
                  <p className={status.success ? 'text-primary' : 'text-red-500'}>
                    {status.message}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-text-secondary font-medium">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-text-tertiary" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Votre prénom"
                      className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-text-secondary font-medium">Nom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-text-tertiary" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Votre nom"
                      className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-text-secondary font-medium">Entreprise</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={18} className="text-text-tertiary" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Nom de votre entreprise"
                    className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-text-secondary font-medium">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-text-tertiary" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-text-secondary font-medium">Téléphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-text-tertiary" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 01 23 45 67 89"
                      className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-text-secondary font-medium">Sujet</label>
                <select
                  name="subject"
                  className="w-full p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Sélectionnez un sujet</option>
                  <option value="demo">Demande de démonstration</option>
                  <option value="devis">Demande de devis</option>
                  <option value="partnership">Proposition de partenariat</option>
                  <option value="support">Support technique</option>
                  <option value="other">Autre sujet</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-text-secondary font-medium">Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare size={18} className="text-text-tertiary" />
                  </div>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full pl-10 p-3 bg-surface/80 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  className="mt-1 mr-3 h-4 w-4 rounded border-neutral-800 text-primary focus:ring-primary/50"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acceptTerms" className="text-text-secondary">
                  J'accepte les <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
                </label>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className={`w-full py-4 flex items-center justify-center gap-2 ${loading ? 'opacity-90' : 'hover:shadow-glow-sm'}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
          
          {/* Information de contact */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-2/5 flex flex-col"
          >
            <div className="mb-8 p-8 bg-surface/40 backdrop-blur-sm rounded-xl border border-primary/10 shadow-glow-sm">
              <h3 className="text-2xl font-light mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <Mail size={16} className="text-primary" />
                </div>
                Nos informations
              </h3>
              
              <div className="space-y-6 text-text-secondary">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <a href="mailto:contact@agritech.fr" className="hover:text-primary transition-colors">
                      contact@agritech.fr
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Téléphone</p>
                    <a href="tel:+33123456789" className="hover:text-primary transition-colors">
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10">
                    <Building size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Adresse</p>
                    <address className="not-italic">
                      123 Avenue de l'Innovation<br />
                      75001 Paris, France
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-neutral-200 rounded-xl overflow-hidden shadow-glow-sm">
              <img 
                src="/img/farmers-field.jpg" 
                alt="Agriculteurs dans un champ" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1593264931142-27c9fecb9d82?q=80&w=2071&auto=format&fit=crop';
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
