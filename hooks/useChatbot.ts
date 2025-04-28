import { useState } from 'react';
import { getFarmingAdvice } from '../lib/api/chatbot';
import axios from 'axios';

interface ChatbotHookResult {
  response: string | null;
  loading: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<string>;
}

export default function useChatbot(): ChatbotHookResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Essaie d'abord d'utiliser le service existant (si disponible)
      try {
        const advice = await getFarmingAdvice(question);
        setResponse(advice);
        return advice;
      } catch (serviceError) {
        // Fallback sur l'API Flask directement
        const response = await axios.post('http://localhost:8000/api/agribot', {
          question: question
        });
        
        if (response.data && response.data.response) {
          const aiResponse = response.data.response;
          setResponse(aiResponse);
          return aiResponse;
        } else {
          throw new Error('Réponse invalide');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur s\'est produite';
      setError(errorMessage);
      console.error('Error getting farming advice:', err);
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    error,
    askQuestion
  };
}
