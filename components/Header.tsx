import React from 'react';
import { User } from '../src/types';

interface HeaderProps {
  onReset: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onShowDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, currentUser, onLoginClick, onLogoutClick, onShowDashboard }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <h1 className="text-2xl font-bold text-white">RealtyAnalyst AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <button onClick={onShowDashboard} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</button>
              <button onClick={onLogoutClick} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Logout</button>
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm" title={currentUser.email || 'User'}>
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </>
          ) : (
            <button onClick={onLoginClick} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
