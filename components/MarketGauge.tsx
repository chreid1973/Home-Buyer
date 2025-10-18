import React from 'react';
import { AnalysisResult } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface MarketGaugeProps {
  marketAnalysis: AnalysisResult['marketAnalysis'];
}

const MarketGauge: React.FC<MarketGaugeProps> = ({ marketAnalysis }) => {
    const getSentimentColor = (sentiment: number) => {
        if (sentiment > 70) return 'text-green-400';
        if (sentiment > 40) return 'text-yellow-400';
        return 'text-red-400';
    }

    return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl text-center h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-violet-300 flex items-center justify-center">
            Market Sentiment
            <InfoTooltip text="Indicates the current mood of the real estate market in this location. 0 is very cold, 100 is very hot." />
        </h3>
        <p className={`text-6xl font-bold my-4 ${getSentimentColor(marketAnalysis.sentiment)}`}>
          {marketAnalysis.sentiment}
        </p>
      </div>
      <p className="text-slate-300 text-sm">{marketAnalysis.narrative}</p>
    </div>
  );
};

export default MarketGauge;