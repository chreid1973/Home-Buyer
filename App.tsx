import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import Hero from './components/Hero';
// FIX: Added GroundingChunk to imports for citation state.
import { UserInput, AnalysisResult, GroundingChunk, User } from './src/types';
// FIX: Corrected imported function name from getAIAnalysis to getAnalysis, as exported from geminiService.
import { getAnalysis } from './src/services/geminiService';
import LoadingAnalysis from './components/LoadingAnalysis';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Compare from './components/Compare';
import { authService } from './src/services/authService';
import { analysisService } from './src/services/analysisService';


type View = 'form' | 'loading' | 'results' | 'dashboard' | 'compare';

function App() {
  const [view, setView] = useState<View>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  // FIX: Added state to hold citations returned from the Gemini service.
  const [citations, setCitations] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
  const [analysesToCompare, setAnalysesToCompare] = useState<AnalysisResult[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        analysisService.getAnalysesForUser(user).then(setSavedAnalyses);
      } else {
        setSavedAnalyses([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAnalysis = async (input: UserInput) => {
    setView('loading');
    setAnalysisResult(null);
    setCitations([]);
    setError(null);

    try {
      // FIX: The getAnalysis function returns an object with 'analysis' and 'citations'. Destructure them here.
      const { analysis, citations } = await getAnalysis(input);
      setAnalysisResult(analysis);
      setCitations(citations);
      setView('results');
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during analysis.');
      console.error(e);
      setView('form'); // Go back to form on error
    } 
  };
  
  const handleReset = () => {
    setView('form');
    setAnalysisResult(null);
    setCitations([]);
    setError(null);
  };
  
  const handleStartNewAnalysis = () => {
    setView('form');
    setAnalysisResult(null);
    setCitations([]);
    setError(null);
  };

  const handleShowDashboard = () => {
    if (currentUser) {
      analysisService.getAnalysesForUser(currentUser).then(analyses => {
        setSavedAnalyses(analyses);
        setView('dashboard');
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleViewAnalysis = (analysisId: string) => {
    const analysis = savedAnalyses.find(a => a.id === analysisId);
    if (analysis) {
      setAnalysisResult(analysis);
      setView('results');
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (currentUser) {
      await analysisService.deleteAnalysis(currentUser, analysisId);
      // Refresh dashboard state after deletion
      setSavedAnalyses(prev => prev.filter(a => a.id !== analysisId));
    }
  };

  const handleStartCompare = (compareIds: string[]) => {
      const toCompare = savedAnalyses.filter(a => a.id! && compareIds.includes(a.id));
      setAnalysesToCompare(toCompare);
      setView('compare');
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingAnalysis />;
      case 'results':
        return analysisResult ? (
          <div ref={resultsRef}>
            {/* FIX: Passed missing 'citations', 'userInput', and 'onShowDashboard' props to the Results component. */}
            <Results 
              result={analysisResult} 
              onReset={handleStartNewAnalysis}
              currentUser={currentUser}
              savedAnalyses={savedAnalyses}
              citations={citations}
              userInput={analysisResult.userInput}
              onShowDashboard={handleShowDashboard}
            />
          </div>
        ) : null;
      case 'dashboard':
        return currentUser ? (
            <Dashboard 
                user={currentUser} 
                analyses={savedAnalyses}
                onView={handleViewAnalysis}
                onDelete={handleDeleteAnalysis}
                onNewAnalysis={handleStartNewAnalysis}
                onStartCompare={handleStartCompare}
            />
        ) : null;
      case 'compare':
        return <Compare analyses={analysesToCompare} onBack={handleShowDashboard} />;
      case 'form':
      default:
        return (
          <>
            <Hero />
            {error && <div className="bg-red-900/50 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center my-4 max-w-4xl mx-auto">
              <p><strong>Analysis Error:</strong> {error}</p>
            </div>}
            {/* FIX: Changed `loading={view === 'loading'}` to `loading={false}`. In this render path, 'view' is always 'form', so the original comparison was always false and caused a TypeScript error. */}
            <InputForm onAnalysis={handleAnalysis} loading={false} />
          </>
        );
    }
  };

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col font-sans">
      {/* FIX: Changed prop `onNewAnalysis` to `onReset` to match the expected props of the Header component. */}
      <Header 
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={() => authService.logout()}
        onShowDashboard={handleShowDashboard}
        onReset={handleStartNewAnalysis}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;