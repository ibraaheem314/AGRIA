import React, { useState } from 'react';
import { Zap, Send, X, Bot, Leaf } from 'lucide-react';
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
      text: "Bonjour! Je suis votre assistant agricole IA. Comment puis-je vous aider aujourd'hui?", 
      sender: 'assistant',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
      // Get a response from the API
      const response = await askQuestion(newMessage);
  
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // In case of error, show an appropriate message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Désolé, j'ai du mal à traiter votre demande. Veuillez réessayer plus tard.",
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
      {/* Chat button */}
      <motion.button
        onClick={toggleChat}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-white font-medium shadow-glow-primary"
        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(42, 148, 80, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={18} /> : <Leaf size={18} />}
        <span className="md:inline hidden">
          {isOpen ? "Fermer" : "AgriBot"}
        </span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[500px] bg-surface border border-primary/20 rounded-lg shadow-glow-sm overflow-hidden flex flex-col backdrop-blur-sm"
          >
            {/* Chat header */}
            <div className="border-b border-primary/20 p-4 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <Bot size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-light text-white">AgriBot</h3>
                  <p className="text-xs text-text-tertiary">Votre assistant agricole intelligent</p>
                </div>
              </div>
            </div>

            {/* Chat body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 styled-scrollbar bg-grid-pattern">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                      <Bot size={16} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3 shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-primary/90 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-surface/90 border border-primary/20 text-white rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    <div className="mt-1 text-xs text-gray-400 flex justify-end">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center ml-2 mt-1">
                      <div className="text-xs text-secondary font-medium">Vous</div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mr-2">
                    <Bot size={16} className="text-primary" />
                  </div>
                  <div className="bg-surface/90 text-white p-3 rounded-2xl rounded-tl-sm border border-primary/20 shadow-sm">
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
            <div className="p-2 border-t border-primary/20 bg-gradient-to-r from-transparent to-primary/5">
              <div className="flex gap-2 overflow-x-auto styled-scrollbar pb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap text-xs border-primary/40 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300"
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
                  className="whitespace-nowrap text-xs border-primary/40 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300"
                  onClick={() => {
                    setNewMessage("Quand dois-je fertiliser mes cultures?");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  Calendrier de fertilisation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap text-xs border-primary/40 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300"
                  onClick={() => {
                    setNewMessage("Quelles sont les cultures adaptées à mon sol?");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  Cultures adaptées
                </Button>
              </div>
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-primary/20">
              <div className="flex items-center bg-dark/50 border border-primary/20 focus-within:border-primary focus-within:shadow-glow-sm rounded-full pl-4 pr-2 py-2 transition-all duration-300">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question agricole..."
                  className="bg-transparent flex-1 text-white focus:outline-none placeholder-text-tertiary text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    newMessage.trim() ? 'bg-primary text-white hover:bg-primary-600 shadow-glow-sm' : 'bg-neutral-800 text-gray-400'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 text-xs text-text-tertiary text-center">
                Powered by l'intelligence agricole d'AgriTech
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
