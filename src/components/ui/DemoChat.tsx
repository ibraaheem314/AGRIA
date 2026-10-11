import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Play, RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const DemoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  // Messages de démonstration
  const demoConversation = [
    {
      type: 'bot' as const,
      content: "👋 Bonjour ! Je suis l'assistant IA d'AGRIA. Comment puis-je vous aider aujourd'hui ?"
    },
    {
      type: 'user' as const,
      content: "Mes plants de tomates ont des feuilles qui jaunissent. Que faire ?"
    },
    {
      type: 'bot' as const,
      content: "🍅 Le jaunissement des feuilles peut avoir plusieurs causes :\n\n• **Arrosage excessif** - Vérifiez l'humidité du sol\n• **Carence en azote** - Fertilisez avec un engrais riche en N\n• **Maladie fongique** - Retirez les feuilles atteintes\n\nPuis-je avoir plus de détails sur vos conditions de culture ?"
    },
    {
      type: 'user' as const,
      content: "C'est en serre, j'arrose 2 fois par semaine"
    },
    {
      type: 'bot' as const,
      content: "🌡️ Parfait ! En serre avec cet arrosage, c'est probablement une carence nutritive.\n\n**Mes recommandations :**\n• Appliquez un engrais 20-10-10 (NPK)\n• Vérifiez le pH du sol (optimal: 6.0-6.8)\n• Augmentez la ventilation pour éviter l'humidité stagnante\n\nVoulez-vous que je vous recommande des produits spécifiques ?"
    }
  ];

  const startDemo = () => {
    setMessages([]);
    setCurrentMessageIndex(0);
    setIsPlaying(true);
    setShowTyping(false);
  };

  const resetDemo = () => {
    setMessages([]);
    setCurrentMessageIndex(0);
    setIsPlaying(false);
    setShowTyping(false);
  };

  useEffect(() => {
    if (!isPlaying || currentMessageIndex >= demoConversation.length) {
      if (currentMessageIndex >= demoConversation.length) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      const currentMsg = demoConversation[currentMessageIndex];
      
      // Montrer l'indicateur de frappe pour les messages du bot
      if (currentMsg.type === 'bot') {
        setShowTyping(true);
        
        setTimeout(() => {
          setShowTyping(false);
          const newMessage: Message = {
            id: currentMessageIndex,
            type: currentMsg.type,
            content: currentMsg.content,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, newMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, 1500); // Simulation du temps de réflexion de l'IA
      } else {
        // Messages utilisateur apparaissent immédiatement
        const newMessage: Message = {
          id: currentMessageIndex,
          type: currentMsg.type,
          content: currentMsg.content,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, currentMessageIndex === 0 ? 500 : 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMessageIndex]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header du chat */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Assistant IA AGRIA</h3>
            <p className="text-green-100 text-sm">Démonstration interactive</p>
          </div>
        </div>
      </div>

      {/* Zone de messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-900 shadow-sm border'
              }`}>
                <div className="text-sm whitespace-pre-line leading-relaxed">
                  {message.content}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicateur de frappe */}
        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {messages.length === 0 && !isPlaying && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Cliquez sur "Démarrer la démo" pour voir l'IA en action
            </p>
          </div>
        )}
      </div>

      {/* Zone de saisie (désactivée en mode démo) */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Tapez votre message... (Mode démo)"
            disabled
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-gray-400 text-sm"
          />
          <button
            disabled
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Contrôles de la démo */}
      <div className="bg-gray-100 px-4 py-3 flex gap-3 justify-center">
        <button
          onClick={startDemo}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          {isPlaying ? 'Démo en cours...' : 'Démarrer la démo'}
        </button>
        
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default DemoChat; 