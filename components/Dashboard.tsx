import React, { useState } from 'react';
import { AnalysisResult, User } from '../src/types';

interface DashboardProps {
    user: User;
    analyses: AnalysisResult[];
    onView: (analysisId: string) => void;
    onDelete: (analysisId: string) => Promise<void>;
    onNewAnalysis: () => void;
    onStartCompare: (compareIds: string[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, analyses, onView, onDelete, onNewAnalysis, onStartCompare }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this analysis?")) {
            setDeletingId(id);
            try {
                await onDelete(id);
            } catch (error) {
                alert("Failed to delete analysis.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const getVerdictColor = (decision: 'good' | 'borderline' | 'bad') => {
        if (decision === 'good') return 'bg-green-500';
        if (decision === 'borderline') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <p className="text-slate-400 mt-1">Viewing saved analyses for {user.email}</p>
                </div>
                <div>
                    <button onClick={onNewAnalysis} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        + New Analysis
                    </button>
                </div>
            </div>

            {analyses.length === 0 ? (
                <div className="text-center bg-slate-800 p-12 rounded-lg">
                    <p className="text-slate-300">You haven't saved any analyses yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-end mb-4">
                        <button 
                            onClick={() => onStartCompare(selectedIds)}
                            disabled={selectedIds.length < 2}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            Compare ({selectedIds.length})
                        </button>
                    </div>
                    {analyses.map(analysis => (
                        <div key={analysis.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                           <div className="flex items-center gap-4 flex-grow">
                                <input 
                                    type="checkbox" 
                                    className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500"
                                    checked={selectedIds.includes(analysis.id!)}
                                    onChange={() => toggleSelection(analysis.id!)}
                                    aria-label={`Select ${analysis.userInput.propertyLocation} for comparison`}
                                />
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getVerdictColor(analysis.verdict.decision)}`} title={`Verdict: ${analysis.verdict.decision}`}></div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{analysis.userInput.propertyLocation}</h3>
                                    <p className="text-sm text-slate-400">
                                        Saved on {new Date(analysis.savedAt!).toLocaleDateString()}
                                    </p>
                                </div>
                           </div>
                           <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => onView(analysis.id!)} className="text-sm py-1 px-3 rounded bg-slate-700 hover:bg-slate-600">View</button>
                                <button onClick={() => handleDelete(analysis.id!)} disabled={deletingId === analysis.id} className="text-sm py-1 px-3 rounded bg-red-900 hover:bg-red-800 disabled:bg-slate-600">
                                    {deletingId === analysis.id ? 'Deleting...' : 'Delete'}
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
