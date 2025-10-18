import React from 'react';
import { AnalysisResult } from '../src/types';

interface LocationRadarChartProps {
  locationScore: AnalysisResult['locationScore'];
}

const LocationRadarChart: React.FC<LocationRadarChartProps> = ({ locationScore }) => {
  const scores = [
    { label: 'Schools', value: locationScore.schools },
    { label: 'Crime Safety', value: locationScore.crime },
    { label: 'Amenities', value: locationScore.amenities },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="space-y-4">
          {scores.map(score => (
            <div key={score.label}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-slate-300">{score.label}</span>
                <span className="text-white font-semibold">{score.value} / 10</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${score.value * 10}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <p className="text-slate-300">Overall Location Score</p>
            <p className="text-4xl font-bold text-white mt-1">{locationScore.overall.toFixed(1)}<span className="text-2xl">/10</span></p>
        </div>
      </div>
       <p className="text-slate-300 text-sm mt-4 text-center">{locationScore.narrative}</p>
    </div>
  );
};

export default LocationRadarChart;