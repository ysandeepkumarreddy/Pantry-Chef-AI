import React, { useState } from 'react';
import type { Recipe, SharedRecipePayload } from '../types';

interface ShareRecipeProps {
  recipe: Recipe;
  imageUrl: string | null;
  instructionImages: (string | null)[];
}

export const ShareRecipe: React.FC<ShareRecipeProps> = ({ recipe, imageUrl, instructionImages }) => {
    const [buttonText, setButtonText] = useState('Share Recipe');

    const handleShare = () => {
        const payload: SharedRecipePayload = {
            recipe,
            imageUrl,
            instructionImages,
        };

        try {
            const jsonString = JSON.stringify(payload);
            const encodedData = btoa(jsonString);
            const url = `${window.location.origin}${window.location.pathname}?recipe=${encodedData}`;
            
            navigator.clipboard.writeText(url).then(() => {
                setButtonText('Copied!');
                setTimeout(() => setButtonText('Share Recipe'), 2000);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                setButtonText('Copy Failed');
                setTimeout(() => setButtonText('Share Recipe'), 2000);
            });
        } catch (error) {
            console.error("Error encoding recipe for sharing:", error);
            setButtonText('Error');
            setTimeout(() => setButtonText('Share Recipe'), 2000);
        }
    };

    return (
        <div className="text-center my-4">
            <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-5 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
            >
                <ShareIcon />
                <span>{buttonText}</span>
            </button>
        </div>
    );
}

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);
