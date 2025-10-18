import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult, GroundingChunk } from "../types";

// This is a simplified mock analysis for the fallback simulation mode.
const mockAnalysis: AnalysisResult = {
    verdict: {
        decision: 'borderline',
        summary: 'This is a mock analysis. The connection to the AI service failed.',
        pros: ['App is running in simulation mode.'],
        cons: ['Live AI data is unavailable.'],
    },
    marketAnalysis: { trend: 'stable', sentiment: 50, narrative: 'Market data is simulated.' },
    affordability: { monthlyPayment: 2500, dtiRatio: 35, affordabilityIndex: 65, narrative: 'Affordability is simulated.' },
    ownershipCost: { principalAndInterest: 2000, propertyTax: 300, homeInsurance: 100, maintenance: 100, totalMonthlyCost: 2500 },
    breakEven: { years: 5.5, narrative: 'Break-even point is simulated.' },
    commute: { time: 25, distance: 10, narrative: 'Commute data is simulated.' },
    locationScore: { schools: 7, crime: 8, amenities: 9, overall: 8, narrative: 'Location scores are simulated.' },
    userInput: { propertyPrice: 500000, downPayment: 100000, interestRate: 6.5, loanTerm: 30, annualIncome: 120000, monthlyDebts: 500, propertyLocation: 'Austin, TX', workLocation: 'Downtown Austin, TX' }
};

let getAnalysis: (input: UserInput) => Promise<{ analysis: AnalysisResult; citations: GroundingChunk[] }>;

const apiKey = process.env.API_KEY;

if (!apiKey || apiKey.startsWith("YOUR") || apiKey.length < 10) {
    console.warn("Gemini API key is a placeholder or invalid. App will run in simulation mode.");
    getAnalysis = async (input: UserInput): Promise<{ analysis: AnalysisResult; citations: GroundingChunk[] }> => {
        console.log("Running in Gemini simulation mode.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return { analysis: { ...mockAnalysis, userInput: input }, citations: [] };
    };
} else {
    const ai = new GoogleGenAI({ apiKey });

    function createPrompt(input: UserInput): string {
        const schemaString = `{
    "verdict": {
      "decision": "string (one of: 'good', 'borderline', 'bad')",
      "summary": "string",
      "pros": ["string"],
      "cons": ["string"]
    },
    "marketAnalysis": {
      "trend": "string (one of: 'up', 'down', 'stable')",
      "sentiment": "number (0-100)",
      "narrative": "string"
    },
    "affordability": {
      "monthlyPayment": "number",
      "dtiRatio": "number",
      "affordabilityIndex": "number (0-100)",
      "narrative": "string"
    },
    "ownershipCost": {
      "principalAndInterest": "number",
      "propertyTax": "number",
      "homeInsurance": "number",
      "maintenance": "number",
      "totalMonthlyCost": "number"
    },
    "breakEven": {
      "years": "number",
      "narrative": "string"
    },
    "commute": {
      "time": "number (in minutes)",
      "distance": "number (in miles)",
      "narrative": "string"
    },
    "locationScore": {
      "schools": "number (0-10)",
      "crime": "number (0-10)",
      "amenities": "number (0-10)",
      "overall": "number (0-10)",
      "narrative": "string"
    }
  }`;

      return `
        Analyze the following real estate investment scenario and provide a detailed breakdown in JSON format.
        The user is considering buying a property and wants to know if it's a good financial decision. Use Google Search to find recent, relevant data for your analysis.

        User's Financial Profile:
        - Annual Income: $${input.annualIncome}
        - Monthly Debts (excluding new mortgage): $${input.monthlyDebts}

        Property Details:
        - Price: $${input.propertyPrice}
        - Location: ${input.propertyLocation}
        - Down Payment: $${input.downPayment}

        Loan Details:
        - Interest Rate: ${input.interestRate}%
        - Loan Term: ${input.loanTerm} years

        Other Considerations:
        - User's Work Location: ${input.workLocation}

        Your analysis MUST be a single, valid JSON object that conforms EXACTLY to the following structure. Do NOT include any markdown formatting like \`\`\`json or any other text outside the JSON object itself.

        JSON Structure to follow:
        ${schemaString}
        `;
    }

    getAnalysis = async (input: UserInput): Promise<{ analysis: AnalysisResult; citations: GroundingChunk[] }> => {
        try {
            const prompt = createPrompt(input);
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const text = response.text;
            let analysisData: Omit<AnalysisResult, 'userInput'>;

            try {
                // Step 1: Try to find a JSON block within markdown ```json ... ```
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    analysisData = JSON.parse(jsonMatch[1]);
                } else {
                    // Step 2: If no block found, assume the whole string is JSON.
                    analysisData = JSON.parse(text);
                }
            } catch (e) {
                console.error("Failed to parse Gemini response as JSON. Raw response:", text);
                throw new Error("The AI model returned an invalid data format. Please try again.");
            }
            
            const analysis: AnalysisResult = { ...analysisData, userInput: input };
            
            const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { analysis, citations };

        } catch (error) {
            console.error("Error during Gemini API call or processing:", error);
            // Preserve specific, user-friendly error messages
            if (error instanceof Error) {
                if (error.message.includes('API key not valid') || error.message.startsWith("The AI model returned")) {
                    throw error;
                }
            }
            // Generic fallback error
            throw new Error("An unexpected error occurred while communicating with the AI service.");
        }
    }
}

export { getAnalysis };