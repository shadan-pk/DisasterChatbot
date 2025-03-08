import { Message } from '../types';

// Your API configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const API_URL = 'YOUR_MODEL_ENDPOINT'; // Replace with your model's endpoint URL

export class AIService {
  static async sendMessage(
    userMessage: string, 
    userName: string, 
    isEmergency: boolean = false
  ): Promise<string | null> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            // You can include context about the user here
            { role: 'system', content: `You are chatting with ${userName}. ${isEmergency ? 'This is an EMERGENCY situation. Be concise and helpful.' : 'Be helpful and friendly.'}` },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return null;
    }
  }
}
