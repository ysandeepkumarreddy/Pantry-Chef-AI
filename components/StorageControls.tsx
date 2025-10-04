import React from 'react';

interface StorageControlsProps {
    onSave: () => void;
    onLoad: () => void;
    onClear: () => void;
    hasSavedData: boolean;
    statusMessage: string;
}

export const StorageControls: React.FC<StorageControlsProps> = ({ onSave, onLoad, onClear, hasSavedData, statusMessage }) => {
    return (
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                    onClick={onSave}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                >
                    Save Ingredients
                </button>
                <button 
                    onClick={onLoad}
                    disabled={!hasSavedData}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Load Saved
                </button>
                <button 
                    onClick={onClear}
                    disabled={!hasSavedData}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Clear Saved
                </button>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 h-5" aria-live="polite">
                {statusMessage}
            </div>
        </div>
    )
}
