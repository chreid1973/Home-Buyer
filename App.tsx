import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import Hero from './components/Hero';
import { UserInput, AnalysisResult, GroundingChunk, User } from './src/types';
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
  const [citations, setCitations] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
  const [analysesToCompare, setAnalysesToCompare] = useState<AnalysisResult[]>([]);

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
    setFormLoading(true);
    setView('loading');
    setAnalysisResult(null);
    setError(null);
    setCitations([]);

    try {
      const { analysis, citations: fetchedCitations } = await getAnalysis(input);
      setAnalysisResult(analysis);
      setCitations(fetchedCitations);
      setView('results');
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during analysis.');
      console.error(e);
      setView('form'); // Go back to form on error
    } finally {
        setFormLoading(false);
    }
  };
  
  const handleReset = () => {
    setView('form');
    setAnalysisResult(null);
    setError(null);
    setCitations([]);
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
      setCitations([]); // Citations are not saved, so clear them
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
      const toCompare = savedAnalyses.filter(a => compareIds.includes(a.id!));
      setAnalysesToCompare(toCompare);
      setView('compare');
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingAnalysis />;
      case 'results':
        return analysisResult ? (
          <Results 
            result={analysisResult} 
            citations={citations} 
            onReset={handleReset}
            userInput={analysisResult.userInput}
            currentUser={currentUser}
            savedAnalyses={savedAnalyses}
            onShowDashboard={handleShowDashboard}
          />
        ) : null;
      case 'dashboard':
        return currentUser ? (
            <Dashboard 
                user={currentUser} 
                analyses={savedAnalyses}
                onView={handleViewAnalysis}
                onDelete={handleDeleteAnalysis}
                onNewAnalysis={handleReset}
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
            {error && <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center my-4 max-w-4xl mx-auto">
              <p><strong>Error:</strong> {error}</p>
            </div>}
            {/* FIX: Pass formLoading state to handle button state correctly during submission. */}
            <InputForm onAnalysis={handleAnalysis} loading={formLoading} />
          </>
        );
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans">
      <Header 
        onReset={handleReset}
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={() => authService.logout()}
        onShowDashboard={handleShowDashboard}
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
