import { config } from '../../../lib/config';

export async function getFarmingAdvice(question: string): Promise<string> {
  try {
    // Check if API key is available
    if (!config.openRouter.apiKey || config.openRouter.apiKey === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key is missing or invalid. Using simulated chatbot response.');
      return getSimulatedResponse(question);
    }
    
    const response = await fetch(`${config.openRouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "You are an expert agricultural advisor with deep knowledge of sustainable farming practices, crop management, and modern agricultural techniques."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    if (!response.ok) {
      console.warn(`Failed to get farming advice: ${response.status} ${response.statusText}`);
      return getSimulatedResponse(question);
    }

    const data = await response.json();
    return data.choices[0].message.content || "Je m'excuse, mais je n'ai pas pu générer de conseil pour le moment.";
  } catch (error) {
    console.error('Error getting farming advice:', error);
    return getSimulatedResponse(question);
  }
}

// Simulated response function based on keywords in the question
function getSimulatedResponse(question: string): string {
  const lowerCaseQuestion = question.toLowerCase();
  
  if (lowerCaseQuestion.includes('irrigation') || lowerCaseQuestion.includes('arrosage')) {
    return "Pour optimiser l'irrigation de vos cultures, je vous recommande d'installer des capteurs d'humidité du sol et d'adopter un système d'irrigation goutte à goutte. Cette méthode peut réduire la consommation d'eau jusqu'à 60% par rapport aux méthodes traditionnelles. Arrosez tôt le matin pour minimiser l'évaporation et surveillez les prévisions météorologiques pour ajuster votre programme d'irrigation.";
  }
  
  if (lowerCaseQuestion.includes('engrais') || lowerCaseQuestion.includes('fertilisation')) {
    return "La fertilisation doit être basée sur une analyse de sol récente. Pour une approche durable, envisagez d'utiliser des engrais organiques comme le compost ou le fumier composté, qui améliorent la structure du sol tout en fournissant des nutriments. Appliquez les engrais au début de la saison de croissance et utilisez des cultures de couverture comme les légumineuses pour fixer naturellement l'azote dans le sol.";
  }
  
  if (lowerCaseQuestion.includes('ravageur') || lowerCaseQuestion.includes('insecte') || lowerCaseQuestion.includes('parasite')) {
    return "Pour une gestion intégrée des ravageurs, commencez par l'identification précise du problème. Favorisez la biodiversité en plantant des fleurs qui attirent les insectes bénéfiques comme les coccinelles et les chrysopes. Utilisez des pièges à phéromones pour surveiller les populations de ravageurs. N'utilisez des pesticides biologiques qu'en dernier recours, et toujours de manière ciblée pour préserver les insectes utiles.";
  }
  
  if (lowerCaseQuestion.includes('maladie') || lowerCaseQuestion.includes('champignon')) {
    return "La prévention des maladies fongiques commence par une bonne circulation de l'air entre vos plants. Pratiquez la rotation des cultures pour éviter l'accumulation de pathogènes spécifiques dans le sol. Par temps humide, envisagez des applications préventives de purin d'ortie ou de bicarbonate de soude dilué pour les maladies fongiques légères. Retirez et détruisez (ne compostez pas) tout matériel végétal visiblement infecté.";
  }
  
  if (lowerCaseQuestion.includes('semis') || lowerCaseQuestion.includes('plantation')) {
    return "Pour des semis réussis, assurez-vous que votre sol est bien préparé avec un bon drainage. Suivez les recommandations de profondeur de semis pour chaque espèce (généralement 2-3 fois la taille de la graine). Pour les transplantations, attendez les bonnes conditions météorologiques et arrosez abondamment après la plantation. Utilisez un calendrier de plantation adapté à votre région et aux particularités de votre microclimat.";
  }
  
  if (lowerCaseQuestion.includes('sol') || lowerCaseQuestion.includes('terre')) {
    return "L'amélioration de la santé du sol est fondamentale pour une agriculture durable. Incorporez régulièrement de la matière organique, pratiquez le paillage pour protéger la surface du sol, et minimisez le travail du sol pour préserver sa structure. Envisagez des analyses de sol tous les 2-3 ans pour surveiller les niveaux de nutriments et le pH. Un sol sain devrait être meuble, avoir une bonne odeur de terre fraîche et abriter de nombreux vers de terre.";
  }
  
  // Default response
  return "Pour une agriculture durable et productive, je vous recommande d'observer attentivement votre exploitation et d'adapter vos pratiques aux conditions locales. La diversification des cultures, l'amélioration de la santé du sol et la gestion efficace de l'eau sont des principes fondamentaux qui s'appliquent à la plupart des situations agricoles. Si vous avez des questions plus spécifiques sur l'irrigation, la fertilisation, ou la gestion des ravageurs, n'hésitez pas à me les poser.";
} 