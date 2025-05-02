import { useState } from 'react';
import { getFarmingAdvice } from '../api/chatbotApi';

interface UseChatbotReturn {
  askQuestion: (question: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

const useChatbot = (): UseChatbotReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFarmingAdvice(question);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    askQuestion,
    loading,
    error
  };
};

export default useChatbot; 