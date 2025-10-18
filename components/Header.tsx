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
    <header className="bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
           <svg className="w-8 h-8 text-violet-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.72,20.28,18,16.55V13a1,1,0,0,0-2,0v1.45L13.17,11.6a3,3,0,0,0-4.34,0L2.28,18.14a1,1,0,0,0,1.41,1.41L10.24,13a1,1,0,0,1,1.41,0l6.66,6.66a1,1,0,0,0,1.41,0A1,1,0,0,0,21.72,20.28ZM12,12.25a1,1,0,0,0-1,.75,1,1,0,0,0,2,0A1,1,0,0,0,12,12.25Z"/><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/></svg>
          <h1 className="text-2xl font-bold text-white">Property Scout AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <button onClick={onShowDashboard} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</button>
              <button onClick={onLogoutClick} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Logout</button>
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-violet-500/50" title={currentUser.email || 'User'}>
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </>
          ) : (
            <button onClick={onLoginClick} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;