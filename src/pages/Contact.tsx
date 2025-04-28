import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Contact = () => {
  return (
    <section className="min-h-screen bg-[#0B0F0E] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8"
        >
          Contactez-nous
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-400 text-center max-w-2xl mx-auto mb-12"
        >
          Une question, un partenariat ou besoin d’une démo personnalisée ? Envoyez-nous un message, nous vous répondrons rapidement.
        </motion.p>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block mb-2 text-sm font-medium">Nom</label>
              <input
                type="text"
                className="w-full p-3 bg-[#151818] border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Votre nom complet"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full p-3 bg-[#151818] border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="votremail@exemple.com"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-sm font-medium">Message</label>
            <textarea
              rows={5}
              className="w-full p-3 bg-[#151818] border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Décrivez votre besoin..."
              required
            ></textarea>
          </div>

          {/* Bouton envoyer */}
          <div className="text-center">
            <Button variant="primary" size="lg">
              Envoyer le message
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
