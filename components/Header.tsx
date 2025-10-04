import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';

interface HeaderProps {
    onToggleDarkMode: () => void;
    isDarkMode: boolean;
    onShowHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleDarkMode, isDarkMode, onShowHowItWorks }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M5 12.55a11 11 0 0 1 14 0" />
                <path d="M5 18.55a11 11 0 0 1 14 0" />
                <path d="M2 12.55V12a10 10 0 0 1 10-10c4.97 0 9.18 3.22 9.9 7.5" />
                <path d="M22 12.55V12a10 10 0 0 0-10-10c-4.97 0-9.18 3.22-9.9 7.5" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pantry Chef AI</h1>
            </div>
            <div className="flex items-center space-x-4">
                 <button 
                    onClick={onShowHowItWorks}
                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 rounded-md"
                    aria-label="How it works"
                >
                    How it Works
                </button>
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
            </div>
        </div>
      </div>
    </header>
  );
};
