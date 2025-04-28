// src/lib/api/chatbot.ts

import { config } from '../config';

export async function getFarmingAdvice(question: string): Promise<string> {
  try {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Unknown error');
    }

    return data.choices[0].message.content || "Je m'excuse, mais je n'ai pas pu générer de conseil pour le moment.";
  } catch (error) {
    console.error('Error getting farming advice:', error);
    throw new Error('Failed to get farming advice');
  }
}
