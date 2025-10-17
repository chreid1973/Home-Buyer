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
    // FIX: Use GoogleGenAI from @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });

    // FIX: Use Type enum for the schema definition
    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            verdict: {
                type: Type.OBJECT,
                properties: {
                    decision: { type: Type.STRING, enum: ['good', 'borderline', 'bad'] },
                    summary: { type: Type.STRING },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['decision', 'summary', 'pros', 'cons'],
            },
            marketAnalysis: {
                type: Type.OBJECT,
                properties: {
                    trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] },
                    sentiment: { type: Type.NUMBER },
                    narrative: { type: Type.STRING },
                },
                required: ['trend', 'sentiment', 'narrative'],
            },
            affordability: {
                type: Type.OBJECT,
                properties: {
                    monthlyPayment: { type: Type.NUMBER },
                    dtiRatio: { type: Type.NUMBER },
                    affordabilityIndex: { type: Type.NUMBER },
                    narrative: { type: Type.STRING },
                },
                required: ['monthlyPayment', 'dtiRatio', 'affordabilityIndex', 'narrative'],
            },
            ownershipCost: {
                type: Type.OBJECT,
                properties: {
                    principalAndInterest: { type: Type.NUMBER },
                    propertyTax: { type: Type.NUMBER },
                    homeInsurance: { type: Type.NUMBER },
                    maintenance: { type: Type.NUMBER },
                    totalMonthlyCost: { type: Type.NUMBER },
                },
                required: ['principalAndInterest', 'propertyTax', 'homeInsurance', 'maintenance', 'totalMonthlyCost'],
            },
            breakEven: {
                type: Type.OBJECT,
                properties: {
                    years: { type: Type.NUMBER },
                    narrative: { type: Type.STRING },
                },
                required: ['years', 'narrative'],
            },
            commute: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.NUMBER },
                    distance: { type: Type.NUMBER },
                    narrative: { type: Type.STRING },
                },
                required: ['time', 'distance', 'narrative'],
            },
            locationScore: {
                type: Type.OBJECT,
                properties: {
                    schools: { type: Type.NUMBER },
                    crime: { type: Type.NUMBER },
                    amenities: { type: Type.NUMBER },
                    overall: { type: Type.NUMBER },
                    narrative: { type: Type.STRING },
                },
                required: ['schools', 'crime', 'amenities', 'overall', 'narrative'],
            },
        },
    };

    function createPrompt(input: UserInput): string {
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

        Your analysis must cover all the properties defined in the provided JSON schema. Provide the output strictly as a JSON object that validates against the schema. Do not include any markdown formatting like \`\`\`json or any other text outside the JSON object.
        `;
    }

    getAnalysis = async (input: UserInput): Promise<{ analysis: AnalysisResult; citations: GroundingChunk[] }> => {
        try {
            const prompt = createPrompt(input);
            // FIX: Per @google/genai guidelines, `responseMimeType` and `responseSchema` must not be used with the `googleSearch` tool.
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
                // Sanitize response, although Gemini with JSON schema is usually clean.
                const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
                analysisData = JSON.parse(cleanedText);
            } catch (e) {
                console.error("Failed to parse Gemini response as JSON:", text);
                throw new Error("The AI model returned an invalid data format.");
            }
            
            const analysis: AnalysisResult = { ...analysisData, userInput: input };
            
            const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { analysis, citations };

        } catch (error) {
            console.error("Error fetching analysis from Gemini API:", error);
            if (error instanceof Error && error.message.includes('API key not valid')) {
                throw new Error("The provided Gemini API key is not valid.");
            }
            throw new Error("Failed to get analysis from Gemini API.");
        }
    }
}

export { getAnalysis };