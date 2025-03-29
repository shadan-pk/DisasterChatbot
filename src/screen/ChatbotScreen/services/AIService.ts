import { Message } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '../api/config'; // Import the config

export class AIService {
  static async sendMessage(
    userMessage: string, 
    userName: string, 
    isEmergency: boolean = false
  ): Promise<string | null> {
    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: API_CONFIG.MODEL_ID });

      // Create system message for context
      const systemPrompt = `You are chatting with ${userName}. ${isEmergency ? 'This is an EMERGENCY situation. Be concise and helpful.' : 'Be helpful and friendly.'}`;
      
      // Combine system prompt and user message
      const prompt = `${systemPrompt}\n\n${userMessage}`;

      // Generate content using the Gemini API
      const result = await model.generateContent(prompt);
      
      // Extract the response text
      return result.response.text();
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return null;
    }
  }
}