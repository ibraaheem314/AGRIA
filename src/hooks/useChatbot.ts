import { useState } from 'react';
import { getFarmingAdvice } from '../../lib/api/chatbot';

interface ChatbotHookResult {
  askQuestion: (question: string) => Promise<string>;
  response: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour interagir avec l'assistant IA agricole
 */
export default function useChatbot(): ChatbotHookResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const askQuestion = async (question: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const responseText = await getFarmingAdvice(question);
      setResponse(responseText);
      return responseText;
    } catch (err) {
      console.error('Error getting farming advice:', err);
      const errorMessage = 'Impossible de contacter l\'assistant. Veuillez réessayer plus tard.';
      setError(errorMessage);
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    askQuestion,
    response,
    loading,
    error
  };
} 