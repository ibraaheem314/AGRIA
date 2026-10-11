import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User as UserIcon, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { AIService } from '../lib/services/aiService';
import MessageContent from '../components/ui/MessageContent';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Bonjour ${user?.name || 'Agriculteur'} ! 👋 Je suis votre assistant IA spécialisé en agriculture.\n\nJe peux vous aider avec :\n• 🌱 Conseils de culture et plantation\n• 💧 Gestion de l'irrigation\n• 🐛 Identification et traitement des ravageurs\n• 🌾 Optimisation des rendements\n• 📊 Analyse de vos données agricoles\n\nComment puis-je vous aider aujourd'hui ?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Vérifier si l'API est configurée
    const apiKey = import.meta.env.VITE_OPEN_ROUTER_KEY;
    console.log('🔍 ChatPage API Check:', {
      apiKey: apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT_FOUND',
      length: apiKey?.length || 0,
      isValid: apiKey && apiKey.length > 10 && apiKey !== ''
    });
    setIsApiConnected(apiKey && apiKey.length > 10 && apiKey !== '');
  }, []);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Utiliser l'historique de conversation pour le contexte
      const conversationHistory = AIService.formatConversationHistory(messages);
      
      // Appel au service AI intelligent
      const response = await AIService.getFarmingAdvice(userMessage, conversationHistory);
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Obtenir la réponse IA normale
      const aiResponse = await getAIResponse(inputMessage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-6">
        {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
      >
          <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
        </div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
          Assistant IA Agricole
        </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-3">
            Posez vos questions agricoles et obtenez des conseils personnalisés.
        </p>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isApiConnected ? '🤖 Mistral AI Connecté - Réponses intelligentes' : '🧠 Mode Expert - Conseils spécialisés'}
          </span>
        </div>
      </motion.div>

        {/* Chat Container */}
        <Card className="p-0 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {message.isUser ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>

                  <div className={`max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-xl ${
                      message.isUser
                        ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                      <MessageContent content={message.content} isUser={message.isUser} />
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
            {isLoading && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-600">L'IA réfléchit...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question agricole..."
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                disabled={isLoading}
              />
                <Button
                  onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                  )}
                </Button>
        </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
              L'IA peut faire des erreurs. Vérifiez les informations importantes avec un expert.
                </div>
              </div>
            </Card>
        </div>
    </div>
  );
};

export default ChatPage; 