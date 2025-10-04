import React from 'react';
import type { Recipe } from '../types';

interface RecipeDisplayProps {
  recipe: Recipe;
  imageUrl: string | null;
  instructionImages: (string | null)[];
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const InfoPill: React.FC<{ label: string; value: string; icon: React.ReactElement }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg text-center">
        <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-1">
            {icon}
            <span className="font-bold ml-2">{label}</span>
        </div>
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
    </div>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, imageUrl, instructionImages }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
      {imageUrl && (
        <div className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt={`A delicious photo of ${recipe.recipeName}`}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-2">{recipe.recipeName}</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{recipe.description}</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-6">
        <InfoPill label="Prep Time" value={recipe.prepTime} icon={<ClockIcon />} />
        <InfoPill label="Cook Time" value={recipe.cookTime} icon={<FlameIcon />} />
        <InfoPill label="Servings" value={recipe.servings} icon={<UsersIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b-2 border-indigo-500 dark:border-indigo-400 pb-2">Ingredients</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b-2 border-indigo-500 dark:border-indigo-400 pb-2">Instructions</h3>
          <ol className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex flex-col gap-4">
                <div className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 bg-indigo-500 text-white font-bold rounded-full mr-4">{index + 1}</span>
                  <p className="pt-1 text-gray-700 dark:text-gray-300">{instruction}</p>
                </div>
                {instructionImages && instructionImages.length > 0 && (
                    <div className="pl-12">
                        {instructionImages[index] ? (
                            <img
                                src={instructionImages[index] as string}
                                alt={`Visual for step ${index + 1}: ${instruction}`}
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <p className="text-sm text-gray-500">Image not available</p>
                            </div>
                        )}
                    </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

// SVG Icons defined as components
const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const FlameIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A5 5 0 0012 11c0-4-3-4-3-4s-1 1-1 3-1 3-1 3a5 5 0 002.879 5.121z" /></svg>
);

const UsersIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
