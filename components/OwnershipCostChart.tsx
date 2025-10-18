import React from 'react';
import { AnalysisResult } from '../src/types';

interface OwnershipCostChartProps {
  ownershipCost: AnalysisResult['ownershipCost'];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const OwnershipCostChart: React.FC<OwnershipCostChartProps> = ({ ownershipCost }) => {
  const costs = [
    { label: 'Principal & Interest', value: ownershipCost.principalAndInterest, color: 'bg-violet-500' },
    { label: 'Property Tax', value: ownershipCost.propertyTax, color: 'bg-indigo-500' },
    { label: 'Home Insurance', value: ownershipCost.homeInsurance, color: 'bg-purple-500' },
    { label: 'Maintenance', value: ownershipCost.maintenance, color: 'bg-fuchsia-500' },
  ];
  
  const total = ownershipCost.totalMonthlyCost;

  return (
    <div>
      <div className="w-full bg-slate-700 rounded-full h-8 flex overflow-hidden mb-4">
        {costs.map((cost) => (
          <div
            key={cost.label}
            className={`${cost.color}`}
            style={{ width: `${(cost.value / total) * 100}%` }}
            title={`${cost.label}: ${formatCurrency(cost.value)}`}
          ></div>
        ))}
      </div>
      <div className="space-y-2">
        {costs.map(cost => (
            <div key={cost.label} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${cost.color}`}></span>
                    <span className="text-slate-300">{cost.label}</span>
                </div>
                <span className="font-semibold text-white">{formatCurrency(cost.value)}</span>
            </div>
        ))}
        <div className="flex justify-between items-center text-lg pt-2 border-t border-slate-700">
            <span className="font-bold text-violet-300">Total Monthly Cost</span>
            <span className="font-bold text-violet-300">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OwnershipCostChart;