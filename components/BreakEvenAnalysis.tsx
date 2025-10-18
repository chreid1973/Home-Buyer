import React from 'react';
import { AnalysisResult } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface BreakEvenAnalysisProps {
  breakEven: AnalysisResult['breakEven'];
}

const BreakEvenAnalysis: React.FC<BreakEvenAnalysisProps> = ({ breakEven }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-violet-300 flex items-center justify-center">
          Break-Even Point
          <InfoTooltip text="Estimated time until owning becomes more profitable than renting a comparable property." />
        </h3>
        <p className="text-6xl font-bold my-4 text-white">
          {breakEven.years.toFixed(1)}
          <span className="text-3xl ml-2">years</span>
        </p>
      </div>
      <p className="text-slate-300 text-sm">{breakEven.narrative}</p>
    </div>
  );
};

export default BreakEvenAnalysis;