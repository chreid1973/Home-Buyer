import React from 'react';
import { AnalysisResult } from '../src/types';

interface CommuteAnalysisProps {
  commute: AnalysisResult['commute'];
  from: string;
  to: string;
}

const CommuteAnalysis: React.FC<CommuteAnalysisProps> = ({ commute, from, to }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl h-full">
        <h3 className="text-2xl font-bold text-violet-300 mb-4">
            Commute Analysis
        </h3>
        <div className="flex items-baseline space-x-4 mb-4">
            <div>
                <p className="text-slate-400 text-sm">Time</p>
                <p className="text-4xl font-bold text-white">{commute.time} <span className="text-xl">min</span></p>
            </div>
            <div>
                <p className="text-slate-400 text-sm">Distance</p>
                <p className="text-4xl font-bold text-white">{commute.distance} <span className="text-xl">mi</span></p>
            </div>
        </div>
        <p className="text-slate-300 text-sm mb-4">From: {from} <br/> To: {to}</p>
        <p className="text-slate-300">{commute.narrative}</p>
    </div>
  );
};

export default CommuteAnalysis;