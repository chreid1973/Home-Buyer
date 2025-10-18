import React from 'react';
import { AnalysisResult } from '../src/types';
import MarketGauge from './MarketGauge';
import AffordabilityIndex from './AffordabilityIndex';
import BreakEvenAnalysis from './BreakEvenAnalysis';

interface CompareProps {
    analyses: AnalysisResult[];
    onBack: () => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const Compare: React.FC<CompareProps> = ({ analyses, onBack }) => {
    if (analyses.length === 0) {
        return (
            <div className="text-center">
                <p>No analyses selected for comparison.</p>
                <button onClick={onBack} className="mt-4 bg-violet-600 text-white py-2 px-4 rounded">Back to Dashboard</button>
            </div>
        )
    }
    
    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Compare Properties</h1>
                <button onClick={onBack} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    &larr; Back to Dashboard
                </button>
            </div>

            <div className="grid gap-4 min-w-max" style={{ gridTemplateColumns: `minmax(200px, 1fr) repeat(${analyses.length}, minmax(250px, 1fr))`}}>
                {/* Headers Column */}
                <div className="space-y-4 font-bold text-violet-300">
                    <div className="bg-slate-800/50 p-4 rounded-lg h-24 flex items-center">Property</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-24 flex items-center">Verdict</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-20 flex items-center">Price</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-20 flex items-center">Monthly Cost</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-40 flex items-center">Affordability</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-40 flex items-center">Market Sentiment</div>
                    <div className="bg-slate-800/50 p-4 rounded-lg h-40 flex items-center">Break-Even</div>
                </div>

                {/* Data Columns */}
                {analyses.map(analysis => (
                    <div key={analysis.id} className="space-y-4 text-center">
                        <div className="bg-slate-800/50 p-4 rounded-lg h-24 flex items-center justify-center font-semibold text-white">
                            {analysis.userInput.propertyLocation}
                        </div>
                        <div className={`bg-slate-800/50 p-4 rounded-lg h-24 flex items-center justify-center text-2xl font-bold capitalize text-white`}>
                           {analysis.verdict.decision}
                        </div>
                         <div className="bg-slate-800/50 p-4 rounded-lg h-20 flex items-center justify-center text-xl font-semibold text-white">
                           {formatCurrency(analysis.userInput.propertyPrice)}
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg h-20 flex items-center justify-center text-xl font-semibold text-white">
                           {formatCurrency(analysis.ownershipCost.totalMonthlyCost)}
                        </div>
                         <div className="bg-transparent p-0 rounded-lg h-40">
                           <AffordabilityIndex affordability={analysis.affordability} />
                        </div>
                        <div className="bg-transparent p-0 rounded-lg h-40">
                           <MarketGauge marketAnalysis={analysis.marketAnalysis} />
                        </div>
                         <div className="bg-transparent p-0 rounded-lg h-40">
                           <BreakEvenAnalysis breakEven={analysis.breakEven} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Compare;