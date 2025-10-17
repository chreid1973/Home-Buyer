export interface User {
  uid: string;
  email: string | null;
}

export interface UserInput {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number; // in years
  annualIncome: number;
  monthlyDebts: number;
  propertyLocation: string;
  workLocation: string;
}

export interface AnalysisResult {
  id?: string; // Only present when saved
  savedAt?: string; // Only present when saved
  verdict: {
    decision: 'good' | 'borderline' | 'bad';
    summary: string;
    pros: string[];
    cons: string[];
  };
  marketAnalysis: {
    trend: 'up' | 'down' | 'stable';
    sentiment: number; // 0 to 100
    narrative: string;
  };
  affordability: {
    monthlyPayment: number;
    dtiRatio: number; // Debt-to-Income
    affordabilityIndex: number; // 0 to 100
    narrative: string;
  };
  ownershipCost: {
    principalAndInterest: number;
    propertyTax: number;
    homeInsurance: number;
    maintenance: number;
    totalMonthlyCost: number;
  };
  breakEven: {
    years: number;
    narrative: string;
  };
  commute: {
    time: number; // in minutes
    distance: number; // in miles
    narrative: string;
  };
  locationScore: {
    schools: number; // 0-10
    crime: number; // 0-10
    amenities: number; // 0-10
    overall: number; // 0-10
    narrative: string;
  };
  userInput: UserInput;
}

export interface GroundingChunk {
  web?: {
    // FIX: Made uri and title optional to match the type from @google/genai SDK.
    uri?: string;
    title?: string;
  };
}