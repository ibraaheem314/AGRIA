import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Gift, Sparkles } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Veuillez entrer votre adresse email');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setStatus('loading');
    
    // Simulation d'inscription
    setTimeout(() => {
      setStatus('success');
      setMessage('🎉 Inscription réussie ! Vérifiez votre boîte mail.');
      setEmail('');
    }, 2000);
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center overflow-hidden"
      >
        {/* Effet de particules */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{ 
                x: Math.random() * 400, 
                y: Math.random() * 300,
                scale: 0 
              }}
              animate={{ 
                scale: [0, 1, 0],
                y: [null, -50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold text-green-900 mb-4">
          Bienvenue dans la communauté AGRIA !
        </h3>
        
        <p className="text-green-700 mb-6 leading-relaxed">
          {message}
          <br />
          <span className="text-sm">
            Vous recevrez votre guide gratuit dans quelques minutes.
          </span>
        </p>

        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
        >
          <Mail className="w-4 h-4" />
          Inscrire un autre email
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Gift className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Mail className="w-12 h-12" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Badge "Gratuit" */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6"
        >
          <Gift className="w-4 h-4" />
          100% Gratuit
        </motion.div>

        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Recevez nos conseils agricoles
          </h3>
          <p className="text-green-100 text-lg leading-relaxed">
            Rejoignez plus de <strong>12 000 agriculteurs</strong> qui reçoivent nos conseils hebdomadaires + 
            <span className="block mt-2 font-semibold text-yellow-200">
              🎁 Guide gratuit "Optimiser ses rendements avec l'IA"
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="w-full px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:outline-none backdrop-blur-sm transition-colors"
                disabled={status === 'loading'}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-green-600 rounded-full font-bold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
            >
              {status === 'loading' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"
                  />
                  Inscription...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  S'inscrire
                </>
              )}
            </motion.button>
          </div>

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-200 text-sm bg-red-500/20 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              {message}
            </motion.p>
          )}
        </form>

        {/* Avantages */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { icon: "📊", text: "Conseils personnalisés" },
            { icon: "🌱", text: "Techniques innovantes" },
            { icon: "💰", text: "Réduction des coûts" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-2 text-green-100"
            >
              <span className="text-lg">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-green-200 mt-6 text-center">
          📧 Un email par semaine maximum. Désabonnement en un clic. Zéro spam garanti.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup; 