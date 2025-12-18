
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchElgoogSearch = async (query: string, mode: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is searching elgooG (the reverse Google) in "${mode}" mode for: "${query}". 
      Respond as elgooG. Your responses should be quirky, witty, and match the theme of the mode.
      - If Mirror: Use reverse logic.
      - If Underwater: Use sea-puns.
      - If Terminal: Use 80s computer jargon.
      - If Thanos: Talk about balance and destiny.
      Keep it very brief (max 2 sentences).`,
      config: {
        temperature: 1.0,
      }
    });

    return response.text || "The mirror dimension is currently opaque.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: The mirror cracked. Check your connection to the void.";
  }
};
