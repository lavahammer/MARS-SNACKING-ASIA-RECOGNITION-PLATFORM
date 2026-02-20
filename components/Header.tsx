import React from 'react';
import { Trophy, BarChart3, Users, LayoutDashboard } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 shadow-md bg-[#0000A0] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('VOTE')}>
            <Trophy className="h-8 w-8 text-[#b98c52] mr-3" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">MARS SNACKING ASIA</h1>
              <p className="text-xs text-[#b98c52] uppercase tracking-wider font-semibold">Recognition Platform</p>
            </div>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => onNavigate('VOTE')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                currentView === 'VOTE' 
                  ? 'bg-[#b98c52] text-white' 
                  : 'text-gray-200 hover:bg-[#000080] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Vote</span>
            </button>

            <button
              onClick={() => onNavigate('WINNERS')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                currentView === 'WINNERS' 
                  ? 'bg-[#b98c52] text-white' 
                  : 'text-gray-200 hover:bg-[#000080] hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Winners Gallery</span>
            </button>

            <button
              onClick={() => onNavigate('ADMIN')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                currentView === 'ADMIN' 
                  ? 'bg-[#ff6400] text-white' 
                  : 'text-gray-200 hover:bg-[#000080] hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};