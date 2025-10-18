import React from 'react';
import { AnalysisResult } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface AffordabilityIndexProps {
  affordability: AnalysisResult['affordability'];
}

const AffordabilityIndex: React.FC<AffordabilityIndexProps> = ({ affordability }) => {
  const getAffordabilityColor = (index: number) => {
    if (index > 75) return 'text-green-400';
    if (index > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-violet-300 flex items-center justify-center">
          Affordability
          <InfoTooltip text="Measures how manageable the monthly costs are relative to your income. Higher is better." />
        </h3>
        <p className={`text-6xl font-bold my-4 ${getAffordabilityColor(affordability.affordabilityIndex)}`}>
          {affordability.affordabilityIndex}<span className="text-3xl">%</span>
        </p>
      </div>
      <p className="text-slate-300 text-sm">{affordability.narrative}</p>
    </div>
  );
};

export default AffordabilityIndex;