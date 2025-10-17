import React, { useState, useEffect } from 'react';
import { AnalysisResult, GroundingChunk, User, UserInput } from '../src/types';
import { analysisService } from '../src/services/analysisService';

import VerdictReveal from './VerdictReveal';
import MarketGauge from './MarketGauge';
import AffordabilityIndex from './AffordabilityIndex';
import OwnershipCostChart from './OwnershipCostChart';
import LocationRadarChart from './LocationRadarChart';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import CommuteAnalysis from './CommuteAnalysis';
import Citation from './Citation';
import StopIcon from './icons/StopIcon';

interface ResultsProps {
  result: AnalysisResult;
  citations: GroundingChunk[];
  onReset: () => void;
  userInput: UserInput;
  currentUser: User | null;
  savedAnalyses: AnalysisResult[];
  onShowDashboard: () => void;
}

const isAnalysisResultValid = (result: any): result is AnalysisResult => {
    return (
        result &&
        result.verdict &&
        result.verdict.decision &&
        result.marketAnalysis &&
        result.affordability &&
        result.ownershipCost &&
        result.breakEven &&
        result.commute &&
        result.locationScore &&
        result.userInput
    );
};

const Results: React.FC<ResultsProps> = ({ result, citations, onReset, currentUser, savedAnalyses, onShowDashboard }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (result.id) {
            setIsSaved(true);
        } else {
            const alreadySaved = savedAnalyses.some(saved => 
                JSON.stringify(saved.userInput) === JSON.stringify(result.userInput) &&
                saved.verdict.summary === result.verdict.summary
            );
            setIsSaved(alreadySaved);
        }
    }, [result, savedAnalyses]);

    if (!isAnalysisResultValid(result)) {
        return (
            <div className="text-center py-20 flex flex-col items-center justify-center">
                <StopIcon className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-3xl font-bold mt-6 text-white">Analysis Data Incomplete</h2>
                <p className="text-slate-300 mt-2 text-lg max-w-2xl">
                    The AI model returned an incomplete or malformed analysis. This can sometimes happen during periods of high demand. Please try generating a new analysis.
                </p>
                <button onClick={onReset} className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Start New Analysis
                </button>
            </div>
        );
    }

    const handleSave = async () => {
        if (!currentUser) {
            alert('Please log in to save your analysis.');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            await analysisService.saveAnalysis(currentUser, result);
            setIsSaved(true);
        } catch (e: any) {
            setError(e.message || 'Failed to save analysis. Please try again.');
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Analysis Complete</h1>
                <div className="flex items-center gap-2">
                    {currentUser && (
                        isSaved ? (
                            <button onClick={onShowDashboard} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                ✓ Saved (View Dashboard)
                            </button>
                        ) : (
                            <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                                {isSaving ? 'Saving...' : 'Save Analysis'}
                            </button>
                        )
                    )}
                    <button onClick={onReset} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        New Analysis
                    </button>
                </div>
            </div>
            {error && <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center my-4 max-w-4xl mx-auto"><p><strong>Error:</strong> {error}</p></div>}

            <VerdictReveal verdict={result.verdict} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <AffordabilityIndex affordability={result.affordability} />
                <MarketGauge marketAnalysis={result.marketAnalysis} />
                <BreakEvenAnalysis breakEven={result.breakEven} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Ownership Cost Breakdown</h3>
                    <OwnershipCostChart ownershipCost={result.ownershipCost} />
                </div>
                <div className="bg-slate-800 p-6 rounded-lg flex flex-col">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Location Score</h3>
                    <div className="flex-grow">
                        <LocationRadarChart locationScore={result.locationScore} />
                    </div>
                </div>
            </div>

             <div className="mt-8">
                <CommuteAnalysis 
                    commute={result.commute} 
                    from={result.userInput.propertyLocation} 
                    to={result.userInput.workLocation} 
                />
            </div>
            
            <Citation citations={citations} />
        </div>
    );
};

export default Results;