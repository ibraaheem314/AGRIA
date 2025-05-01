import React, { useState } from 'react';
import { Zap, Send, ChevronDown, ChevronUp, X, Save, BarChart, CloudRain, Map } from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import useChatbot from '../../hooks/useChatbot';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Bonjour ! Je suis votre assistant IA agricole. Comment puis-je vous aider aujourd'hui ?", 
      sender: 'assistant',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Utiliser le hook personnalisé pour le chatbot
  const { askQuestion, loading } = useChatbot();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);
  
    try {
      // Obtenir une réponse réelle de l'API
      const response = await askQuestion(newMessage);
  
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // En cas d'erreur, afficher un message approprié
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Désolé, je rencontre des difficultés à traiter votre demande. Veuillez réessayer plus tard.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating action buttons */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 mb-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#328af1]/90 hover:bg-[#328af1] backdrop-blur-sm shadow-lg flex items-center justify-center cursor-pointer"
              title="Données Météo"
            >
              <CloudRain size={18} className="text-white" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-lg flex items-center justify-center cursor-pointer"
              title="Cartes Satellite"
            >
              <Map size={18} className="text-white" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#8855dd]/90 hover:bg-[#8855dd] backdrop-blur-sm shadow-lg flex items-center justify-center cursor-pointer"
              title="Analyses"
            >
              <BarChart size={18} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main chat button */}
      <motion.button
        onClick={toggleChat}
        className={`flex items-center gap-2 px-4 py-3 rounded-full ${isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-600'} text-white font-medium shadow-lg transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <>
            <X size={18} />
            <span className="md:inline hidden">Fermer</span>
          </>
        ) : (
          <>
            <Zap size={18} />
            <span className="md:inline hidden">Assistant IA</span>
          </>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-[350px] md:w-[450px] h-[500px] bg-gradient-to-br from-[#151918]/95 to-[#0D1211]/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Chat header */}
            <div className="border-b border-neutral-800 bg-gradient-to-r from-primary/10 to-neutral-800/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AgriBot</h3>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="text-xs text-gray-300">Assistant agricole</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-300 hover:text-white transition-colors">
                    <Save size={16} />
                  </button>
                  <button className="text-gray-300 hover:text-white transition-colors" onClick={toggleChat}>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
      </div>

            {/* Chat body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 styled-scrollbar backdrop-blur-sm bg-gradient-to-br from-black/30 to-neutral-900/30">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none shadow-md' 
                        : 'bg-[#151918] text-white border border-neutral-800 rounded-tl-none'
                }`}
              >
                    <p>{message.text}</p>
                    <div className="mt-1 text-xs text-gray-400 flex justify-end">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
              </div>
            </motion.div>
          ))}
              
              {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
                  <div className="bg-[#151918] text-white border border-neutral-800 p-3 rounded-xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.1 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.1 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.3, delay: 0.2 }}
                      />
                    </div>
              </div>
            </motion.div>
          )}
            </div>

            {/* Quick actions */}
            <div className="p-2 border-t border-neutral-800 bg-[#151918]">
              <div className="flex gap-2 overflow-x-auto styled-scrollbar pb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap text-xs"
                  onClick={() => {
                    setNewMessage("Comment optimiser l'irrigation de mes cultures?");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  Optimiser l'irrigation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap text-xs"
                  onClick={() => {
                    setNewMessage("Quand devrais-je fertiliser mes cultures?");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  Planifier la fertilisation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap text-xs"
                  onClick={() => {
                    setNewMessage("Y a-t-il des problèmes détectés dans mes champs?");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  Détecter des problèmes
                </Button>
              </div>
      </div>

            {/* Chat input */}
            <div className="p-4 border-t border-neutral-800 bg-gradient-to-r from-primary/5 to-neutral-800/5">
              <div className="flex items-center bg-[#151918] border border-neutral-800 rounded-full pl-4 pr-2 py-2">
          <input
            type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  className="bg-transparent flex-1 text-white focus:outline-none placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    newMessage.trim() ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 text-xs text-center text-gray-500">
                Posez des questions sur vos cultures, la météo ou les recommandations
              </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
