import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from "../constants";
import { Vote } from "../types";

const getClient = () => {
  // Directly access the environment variable as per instructions
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Mars Recognition: API_KEY not found.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateNominationReason = async (
  associateName: string,
  categoryName: string,
  keywords: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Please provide a reason manually (AI service configuration missing).";

  try {
    const prompt = `Write a short, professional, and inspiring award nomination (max 50 words) for ${associateName} in the category of "${categoryName}". Key highlights: ${keywords}. Focus on impact and values.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Nomination generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate nomination automatically. Please try again.";
  }
};

export const generateAdminSummary = async (votes: Vote[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "Analytics AI unavailable.";

    try {
        const voteSummary = votes.map(v => {
            const category = CATEGORIES.find(c => c.id === v.categoryId)?.title || 'Unknown';
            return `Nominee: ${v.nomineeName}, Category: ${category}`;
        }).join('\n');

        const prompt = `Analyze the following voting data for the Mars Snacking Asia Recognition Platform. 
        Data:
        ${voteSummary}
        
        Provide a 2-sentence summary of who is leading and which category is most competitive.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "Analysis complete.";
    } catch (error) {
        console.error("Gemini Analysis Error", error);
        return "Unable to generate AI summary at this time.";
    }
}