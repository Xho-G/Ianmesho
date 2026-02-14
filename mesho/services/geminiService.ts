
import { GoogleGenAI, Type } from "@google/genai";
import { LOCATIONS, AMENITIES } from "../constants";
import { AISearchResult } from "../types";

export const interpretSearchQuery = async (query: string): Promise<AISearchResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      You are an AI assistant for Mesho, a student accommodation app in Blantyre, Malawi.
      Interpret the user's natural language search query and extract structured search filters.
      
      User Query: "${query}"
      
      Available Locations in Database: ${LOCATIONS.join(", ")}.
      Available Amenities: ${AMENITIES.join(", ")}.
      
      Return a JSON object that maps the user's intent to these fields.
      - If they mention a location (or nearby landmark like "Poly" or "MUBAS"), map it to the closest Available Locations.
      - "Poly" or "MUBAS" is usually near Chitawira, Ginnery Corner, or Nkolokosa.
      - "College of Medicine" or "KUHeS" is near Sunnyside, Namiwawa, or Mandala.
      - Convert prices to MWK if they just say numbers (assume MWK).
      - 'reasoning' should be a short friendly sentence explaining why you picked these filters.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of matched locations from the available list."
            },
            maxPrice: { type: Type.NUMBER, description: "Maximum budget in MWK" },
            minPrice: { type: Type.NUMBER, description: "Minimum budget in MWK" },
            type: { type: Type.STRING, description: "Type of accommodation (e.g. Hostel, Apartment)" },
            requiredAmenities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of amenities explicitly requested"
            },
            reasoning: { type: Type.STRING, description: "Brief explanation of the interpretation" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISearchResult;
    }
    return null;

  } catch (error) {
    console.error("Error interpreting search query with Gemini:", error);
    return null;
  }
};

export const generateListingDescription = async (details: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a catchy, professional, and short description (max 60 words) for a student accommodation listing in Blantyre based on these rough notes: "${details}". Highlight safety, proximity to universities (MUBAS/KUHeS), and essential amenities. Use a friendly tone.`,
        });
        return response.text || "Could not generate description.";
    } catch (e) {
        console.error("Error generating description", e);
        return "Error generating description.";
    }
}
