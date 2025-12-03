import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> => {
  if (!apiKey) {
    return "Nexus AI System Error: API Key missing. Please configure the environment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus, an advanced AI integrated into the NexusOS operating system. You are helpful, concise, and futuristic in your tone. Keep responses relatively short suitable for a chat interface.",
      }
    });
    return response.text || "I processed that, but have no textual response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the Nexus Mainframe. Please try again later.";
  }
};
