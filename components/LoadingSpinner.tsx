import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v1.5M12 16.253v1.5M15.364 8.636l-1.06 1.06M8.636 15.364l-1.06 1.06M17.753 12h-1.5M7.753 12h-1.5m6.546-5.364l1.06-1.06M6.636 17.364l1.06-1.06" />
            </svg>
        </div>
      </div>
    </div>
  );
};