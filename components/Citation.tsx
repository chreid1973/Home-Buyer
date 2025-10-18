import React, { useState } from 'react';
import { GroundingChunk } from '../src/types';

interface CitationProps {
    citations: GroundingChunk[];
}

const Citation: React.FC<CitationProps> = ({ citations }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const validCitations = citations.filter(c => c.web && c.web.uri && c.web.title);

    if (validCitations.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mt-8">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left font-semibold text-violet-300 flex justify-between items-center"
            >
                <span>Sources used in this analysis</span>
                <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                    <ul className="space-y-2">
                        {validCitations.map((citation, index) => (
                           <li key={index} className="text-sm">
                                <a 
                                    href={citation.web!.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-violet-300 transition-colors"
                                >
                                    {citation.web!.title || 'Untitled Source'}
                                </a>
                           </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Citation;