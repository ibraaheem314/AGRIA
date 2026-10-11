import { config } from '../config';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private static apiKey = config.openRouter.apiKey;
  private static baseUrl = config.openRouter.baseUrl;

  // Prompt système spécialisé en agriculture
  private static systemPrompt = `Tu es AGRIA, un assistant IA expert en agriculture. Tu es spécialisé en:
- Conseils de cultures et techniques agricoles
- Gestion des ravageurs et maladies des plantes
- Optimisation des rendements
- Agriculture biologique et durable
- Irrigation et fertilisation
- Analyse de sols
- Météorologie agricole

IMPORTANT:
- Réponds UNIQUEMENT en français
- Sois précis, pratique et actionnable
- Demande des détails spécifiques (région, type de culture, conditions) pour donner de meilleurs conseils
- Utilise des émojis agricoles appropriés (🌱🚜💧🌾🐛☀️🌧️)
- Structure tes réponses avec des bullet points quand approprié
- Si tu n'es pas sûr, dis-le et recommande de consulter un expert local
- Reste dans le domaine agricole`;

  public static async getFarmingAdvice(userMessage: string, conversationHistory: AIMessage[] = []): Promise<string> {
    // Debug : vérifier la clé API
    console.log('🔍 API Key check:', {
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 15)}...` : 'NOT_FOUND',
      length: this.apiKey?.length || 0,
      envVar: import.meta.env.VITE_OPEN_ROUTER_KEY ? 'FOUND' : 'NOT_FOUND'
    });

    // Vérifier si l'API est configurée
    if (!this.apiKey || this.apiKey === '' || this.apiKey.length < 10) {
      console.warn('🔴 OpenRouter API key not configured, using intelligent fallback');
      return this.getIntelligentFallbackResponse(userMessage);
    }

    console.log('🟢 Using Mistral AI via OpenRouter!');

    try {
      // Construire l'historique de conversation
      const messages: AIMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory.slice(-8), // Garder les 8 derniers messages pour le contexte
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: messages,
          temperature: 0.7,
          max_tokens: 600,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid API response format');
      }

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback intelligent en cas d'erreur API
      return this.getIntelligentFallbackResponse(userMessage);
    }
  }

  // Système de fallback intelligent avec réponses thématiques
  private static getIntelligentFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Réponses spécialisées par thème
    if (message.includes('irrigation') || message.includes('arrosage') || message.includes('eau')) {
      return "💧 **Gestion de l'irrigation optimale**\n\n• **Fréquence** : Dépend du type de sol (sableux = plus fréquent, argileux = moins fréquent)\n• **Quantité** : 15-25mm par semaine selon la culture et saison\n• **Timing** : Tôt le matin (6h-9h) pour minimiser l'évaporation\n• **Méthode** : Goutte-à-goutte pour économiser 30-50% d'eau\n• **Surveillance** : Vérifier l'humidité du sol à 10-15cm de profondeur\n\n🌱 Quelle culture irriguez-vous et dans quelle région ? Je peux affiner mes conseils !";
    }
    
    if (message.includes('maladie') || message.includes('champignon') || message.includes('fongique') || message.includes('pathologie')) {
      return "🍄 **Diagnostic et gestion des maladies**\n\n• **Symptômes à observer** : décoloration, taches, flétrissement, déformation\n• **Conditions favorables** : humidité >80%, température 15-25°C, mauvaise aération\n• **Prévention** : rotation des cultures, espacement optimal, variétés résistantes\n• **Traitement bio** : décoctions de prêle, bicarbonate, cuivre en modération\n• **Traitement chimique** : fongicides systémiques si nécessaire\n\n📸 Des photos des symptômes aideraient beaucoup pour un diagnostic précis !";
    }
    
    if (message.includes('rendement') || message.includes('production') || message.includes('productivité')) {
      return "📈 **Optimisation des rendements**\n\n• **Analyse de sol** : pH optimal (6.0-7.5), NPK équilibré, matière organique >3%\n• **Sélection variétale** : adaptée au climat local, résistante aux stress\n• **Densité de plantation** : optimiser selon l'espèce et conditions\n• **Fertilisation raisonnée** : apports fractionnés selon les stades\n• **Protection intégrée** : surveillance + traitements ciblés\n• **Irrigation précise** : stress hydrique contrôlé selon les phases\n\n🌾 Quelle culture visez-vous ? Surface et contexte pédoclimatique ?";
    }
    
    if (message.includes('bio') || message.includes('biologique') || message.includes('organique')) {
      return "🌱 **Agriculture biologique durable**\n\n• **Fertilisation naturelle** : compost mature, fumier composté, engrais verts\n• **Protection** : auxiliaires, extraits végétaux, huiles essentielles, biocontrôle\n• **Rotation intelligente** : légumineuses fixatrices, cultures nettoyantes\n• **Sol vivant** : couverts végétaux, BRF, limitation du travail du sol\n• **Biodiversité** : haies, bandes fleuries, nichoirs\n\n📋 Êtes-vous en conversion bio ou déjà certifié ? Cela change les stratégies possibles.";
    }
    
    if (message.includes('ravageur') || message.includes('insecte') || message.includes('puceron') || message.includes('chenille')) {
      return "🐛 **Gestion intégrée des ravageurs**\n\n• **Identification précise** : observer dégâts, insecte, cycle de vie\n• **Seuils d'intervention** : surveiller densité population vs dégâts économiques\n• **Lutte biologique** : coccinelles, chrysopes, Bt, phéromones\n• **Barrières physiques** : filets, pièges colorés, bandes engluées\n• **Traitements sélectifs** : insecticides ciblés en dernier recours\n\n🔍 Quel ravageur observez-vous exactement ? Sur quelle culture et à quel stade ?";
    }
    
    if (message.includes('sol') || message.includes('terre') || message.includes('ph') || message.includes('fertilité')) {
      return "🌍 **Santé et fertilité du sol**\n\n• **Analyse complète** : pH, NPK, oligo-éléments, matière organique\n• **Structure physique** : porosité, compaction, drainage, rétention\n• **Vie biologique** : vers de terre, champignons mycorhiziens, activité microbienne\n• **Amendements** : chaux si pH<6, compost pour MO, gypse si salinité\n• **Couverts végétaux** : protection + enrichissement naturel\n\n📊 Avez-vous une analyse de sol récente ? Type de sol et historique cultural ?";
    }
    
    if (message.includes('semis') || message.includes('plantation') || message.includes('variété')) {
      return "🌱 **Semis et plantation réussis**\n\n• **Calendrier optimal** : selon région, dernières gelées, température sol\n• **Préparation du lit de semence** : sol affiné, nivelé, ressuyé\n• **Choix variétal** : adaptation locale, résistances, objectifs production\n• **Densité et profondeur** : 2-3x diamètre graine, espacement selon développement\n• **Conditions germination** : humidité constante, température adéquate\n\n📅 Quelle culture et quelle région ? Je peux vous donner le calendrier précis !";
    }
    
    if (message.includes('météo') || message.includes('climat') || message.includes('température') || message.includes('pluie')) {
      return "☀️ **Adaptation aux conditions climatiques**\n\n• **Suivi météorologique** : prévisions 7-15 jours, cumuls pluviométriques\n• **Gestion stress hydrique** : paillage, brise-vent, variétés tolérantes\n• **Protection gel** : voiles, aspersion, fumigation si possible\n• **Canicule** : irrigation d'appoint, ombrage, variétés résistantes\n• **Planification** : adapter calendrier cultural aux tendances climatiques\n\n🌡️ Votre région et les conditions actuelles ? Je peux adapter les conseils !";
    }
    
    // Réponse générale engageante
    return "🌾 **Bonjour ! Je suis AGRIA, votre expert agricole IA.**\n\nJe peux vous accompagner sur :\n• 🌱 Techniques de culture et semis\n• 💧 Gestion de l'irrigation\n• 🐛 Protection contre ravageurs et maladies\n• 📈 Optimisation des rendements\n• 🌍 Santé et fertilité des sols\n• ☀️ Adaptation climatique\n\n**Pour vous donner les meilleurs conseils, précisez-moi :**\n• Votre type de culture\n• Votre région/climat\n• Le problème spécifique rencontré\n\n💬 Plus vous me donnez de détails, plus mes conseils seront précis et utiles !";
  }

  // Convertir l'historique des messages pour l'API
  public static formatConversationHistory(messages: any[]): AIMessage[] {
    return messages
      .filter(msg => msg.content && msg.content.trim())
      .map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  }
} 