import React from 'react';

const LoadingAnalysis: React.FC = () => {
    const messages = [
        "Analyzing market trends...",
        "Calculating affordability index...",
        "Consulting with real estate experts (our AI)...",
        "Evaluating location scores...",
        "Running commute simulations...",
        "Cross-referencing financial data...",
        "Compiling your personalized verdict...",
        "Finalizing the report...",
    ];

    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % messages.length;
            setMessage(messages[i]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center py-20 flex flex-col items-center justify-center">
             <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-3xl font-bold mt-6 text-white">Generating Your Analysis</h2>
            <p className="text-slate-300 mt-2 text-lg transition-opacity duration-500">{message}</p>
        </div>
    );
};

export default LoadingAnalysis;
