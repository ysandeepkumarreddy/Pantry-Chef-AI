import React, { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  highlightedIndices: Set<number>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onAddIngredient, onRemoveIngredient, highlightedIndices }) => {
  const [currentIngredient, setCurrentIngredient] = useState('');

  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIngredient(currentIngredient);
    setCurrentIngredient('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddClick} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          placeholder="e.g., 2 chicken breasts"
          className="flex-grow w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-white"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:focus:ring-offset-gray-800"
          disabled={!currentIngredient.trim()}
        >
          Add
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2 pt-2 min-h-[3rem]">
        {ingredients.map((ingredient, index) => {
          const isHighlighted = highlightedIndices.has(index);
          return (
            <div 
              key={index} 
              className={`flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium pl-3 pr-1 py-1 rounded-full transition-all duration-500 ${isHighlighted ? 'animate-highlight' : ''}`}
            >
              <span>{ingredient}</span>
              <button
                onClick={() => onRemoveIngredient(index)}
                className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-200 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 rounded-full hover:bg-indigo-300 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Remove ${ingredient}`}
              >
                &times;
              </button>
            </div>
          )
        })}
      </div>
       <style>{`
        @keyframes highlight {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .animate-highlight {
          animation: highlight 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
