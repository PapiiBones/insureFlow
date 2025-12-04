
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, PolicyType } from "../types";

// Initialize Gemini
// CRITICAL: process.env.API_KEY must be used directly in the constructor configuration.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSalesScript = async (
  leadName: string,
  policyType: PolicyType,
  context: string,
  objection?: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let prompt = `
      Act as a world-class, top 1% insurance sales trainer and closer. 
      Your tonality is confident, authoritative yet empathetic, and unbreakable.
      
      Task: Generate a sales script for a lead named "${leadName}" interested in "${policyType}".
      
      Context/Scenario: ${context}
    `;

    if (objection) {
      prompt += `
      The lead just gave this objection: "${objection}".
      Provide a "Pattern Interrupt" followed by a confident rebuttal that loops back to closing.
      `;
    } else {
      prompt += `
      Provide a script for the initial call or presentation. 
      Structure:
      1. Opener (Authority & Warmth)
      2. Discovery (Pain finding)
      3. The Solution (Tie specifically to ${policyType})
      4. The Close (Assumptive)
      `;
    }

    if (policyType === PolicyType.WHOLE_LIFE) {
      prompt += `
      Make sure to briefly explain the "Living Benefits" and how they can borrow against the cash value (Infinite Banking concept) in simple, powerful terms.
      `;
    }

    prompt += `
      Format the output in clean Markdown. Use bolding for emphasis on tonal shifts.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Failed to generate script. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "## Error\nUnable to generate script at this time. Please check your API configuration.";
  }
};

export const generateSOPContent = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Create a detailed Standard Operating Procedure (SOP) for Life Insurance Agents regarding: ${topic}.
        
        Structure it as:
        1. **Objective**
        2. **Prerequisites**
        3. **Step-by-Step Process** (Numbered list)
        4. **Key Success Metrics**
        5. **Common Pitfalls**
        
        Tone: Professional, Instructional, Action-Oriented.
      `
    });
    return response.text || "Failed to generate SOP.";
  } catch (error) {
    console.error(error);
    return "Error generating SOP.";
  }
};

export const findPotentialLeads = async (
  city: string, 
  policyType: PolicyType
): Promise<Partial<Lead>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 realistic, fictional leads for an insurance agent in ${city} who would be good candidates for ${policyType}.
      
      Provide a mix of scenarios (e.g., new homeowner, new parent, small business owner for infinite banking).
      Generate realistic names, fake phone numbers (555-xxxx), and fake emails.
      Estimate a realistic commission value between $1000 and $8000 based on the policy type.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              notes: { type: Type.STRING, description: "Brief background info on why they are a good lead" },
              estimatedCommission: { type: Type.NUMBER },
            },
            required: ["name", "phone", "email", "notes", "estimatedCommission"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error finding leads:", error);
    return [];
  }
};
