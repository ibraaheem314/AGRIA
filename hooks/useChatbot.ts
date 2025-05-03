import { useState } from 'react';
import { getFarmingAdvice } from '../lib/api/chatbot';

/**
 * Hook pour gérer les interactions avec l'assistant virtuel agricole
 * @returns Objet contenant les fonctions de dialogue et l'état de chargement
 */
export default function useChatbot() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  /**
   * Envoie une question à l'API du chatbot et récupère la réponse
   * @param question - La question posée par l'utilisateur
   * @returns Promise avec la réponse du chatbot
   */
  const askQuestion = async (question: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFarmingAdvice(question);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la communication avec l\'assistant:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Propose des suggestions de questions à poser au chatbot
   * @returns Tableau de questions suggérées
   */
  const getSuggestions = (): string[] => {
    return [
      "Comment optimiser l'irrigation de mes cultures?",
      "Quels sont les meilleurs engrais naturels pour le maraîchage?",
      "Comment lutter contre les ravageurs sans produits chimiques?",
      "Quelles cultures associer pour maximiser les rendements?",
      "Comment améliorer la fertilité de mon sol?",
      "Quand planter mes cultures d'automne?"
    ];
  };

  /**
   * Obtient une suggestion de question aléatoire
   * @returns Une question suggérée aléatoire
   */
  const getRandomSuggestion = (): string => {
    const suggestions = getSuggestions();
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  };

  return {
    askQuestion,
    getSuggestions,
    getRandomSuggestion,
    loading,
    error,
    lastResponse
  };
} 