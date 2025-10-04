import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeDisplay } from './components/RecipeDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { StorageControls } from './components/StorageControls';
import { ConfirmationModal } from './components/ConfirmationModal';
import { generateRecipe, generateRecipeImage, generateInstructionImages } from './services/geminiService';
import { formatTimestamp } from './utils/dateFormatter';
import type { Recipe, SavedIngredients, SharedRecipePayload } from './types';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['3 eggs', '1 cup flour', '1/2 cup milk']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [instructionImages, setInstructionImages] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // App mode
  const [isViewMode, setIsViewMode] = useState<boolean>(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('prefersDark');
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Ingredient Storage State
  const [savedIngredientsData, setSavedIngredientsData] = useState<SavedIngredients | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Modal States
  const [isLoadModalOpen, setLoadModalOpen] = useState<boolean>(false);
  const [isClearModalOpen, setClearModalOpen] = useState<boolean>(false);
  
  // UX State
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());

  // Check for shared recipe in URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedRecipeData = urlParams.get('recipe');

    if (sharedRecipeData) {
      try {
        const decodedData = atob(sharedRecipeData);
        const parsedPayload: SharedRecipePayload = JSON.parse(decodedData);
        setRecipe(parsedPayload.recipe);
        setRecipeImage(parsedPayload.imageUrl);
        setInstructionImages(parsedPayload.instructionImages);
        setIsViewMode(true);
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to parse shared recipe data:", e);
        setError("The shared recipe link appears to be invalid.");
      }
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('prefersDark', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const checkSavedIngredients = useCallback(() => {
    const savedData = localStorage.getItem('savedIngredients_v1');
    if (savedData) {
      const parsedData: SavedIngredients = JSON.parse(savedData);
      setSavedIngredientsData(parsedData);
      setStatusMessage(`Found ${parsedData.count} saved ingredients from ${formatTimestamp(parsedData.timestamp)}.`);
    } else {
      setSavedIngredientsData(null);
      setStatusMessage('No saved ingredients found.');
    }
  }, []);

  useEffect(() => {
    // Don't check for saved ingredients in view mode
    if (!isViewMode) {
      checkSavedIngredients();
    }
  }, [checkSavedIngredients, isViewMode]);

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() !== '' && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()]);
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveIngredients = () => {
    const dataToSave: SavedIngredients = {
      ingredients: ingredients,
      timestamp: Date.now(),
      count: ingredients.length
    };
    localStorage.setItem('savedIngredients_v1', JSON.stringify(dataToSave));
    setSavedIngredientsData(dataToSave);
    setStatusMessage(`Saved ${dataToSave.count} ingredients. (${formatTimestamp(dataToSave.timestamp, true)})`);
  };
  
  const handleLoadIngredients = () => {
    if (!savedIngredientsData) {
        setStatusMessage('No saved ingredients to load.');
        return;
    }
    if (ingredients.length > 0) {
        setLoadModalOpen(true);
    } else {
        performLoad();
    }
  };

  const performLoad = () => {
    if (savedIngredientsData) {
        setIngredients(savedIngredientsData.ingredients);
        setStatusMessage(`Loaded ${savedIngredientsData.count} ingredients from ${formatTimestamp(savedIngredientsData.timestamp)}.`);
        // Highlight animation
        const indices = new Set(savedIngredientsData.ingredients.map((_, i) => i));
        setHighlightedIndices(indices);
        setTimeout(() => setHighlightedIndices(new Set()), 1500);
    }
    setLoadModalOpen(false);
  };
  
  const handleClearIngredients = () => {
    setClearModalOpen(true);
  };
  
  const performClear = () => {
    localStorage.removeItem('savedIngredients_v1');
    setSavedIngredientsData(null);
    setStatusMessage('Saved ingredients cleared.');
    setClearModalOpen(false);
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add some ingredients first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotification(null);
    setRecipe(null);
    setRecipeImage(null);
    setInstructionImages([]);

    try {
      setLoadingMessage('Crafting your recipe...');
      const generatedRecipe = await generateRecipe(ingredients);

      setLoadingMessage('Visualizing your masterpiece...');
      const mainImagePromise = generateRecipeImage(generatedRecipe.recipeName, generatedRecipe.description);
      const instructionImagesPromise = generateInstructionImages(generatedRecipe.recipeName, generatedRecipe.instructions);
      
      const results = await Promise.allSettled([mainImagePromise, instructionImagesPromise]);
      
      const mainImageResult = results[0];
      const instructionImagesResult = results[1];
      
      let imagesFailed = false;

      let finalRecipeImage: string | null = null;
      if (mainImageResult.status === 'fulfilled') {
        finalRecipeImage = mainImageResult.value;
      } else {
        console.error("Main image generation failed:", mainImageResult.reason);
        imagesFailed = true;
      }

      let finalInstructionImages: (string | null)[] = [];
      if (instructionImagesResult.status === 'fulfilled') {
        finalInstructionImages = instructionImagesResult.value;
        if (finalInstructionImages.some(img => img === null)) {
            imagesFailed = true;
        }
      } else {
        console.error("Instruction images generation failed:", instructionImagesResult.reason);
        imagesFailed = true;
        finalInstructionImages = new Array(generatedRecipe.instructions.length).fill(null);
      }

      setRecipe(generatedRecipe);
      setRecipeImage(finalRecipeImage);
      setInstructionImages(finalInstructionImages);

      if (imagesFailed) {
        setNotification("Heads up! Some images couldn't be generated, but your recipe is ready.");
      }

    } catch (err) {
      console.error(err);
      setError('Sorry, I couldn\'t come up with a recipe. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [ingredients]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {isViewMode ? (
            <div className="mt-10">
                 {recipe && <RecipeDisplay recipe={recipe} imageUrl={recipeImage} instructionImages={instructionImages} isShareable={false} />}
            </div>
        ) : (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
            
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">What's in your pantry?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your ingredients and let AI create a recipe for you.</p>
            </div>

            <IngredientInput
                ingredients={ingredients}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                highlightedIndices={highlightedIndices}
            />

            <StorageControls 
                onSave={handleSaveIngredients}
                onLoad={handleLoadIngredients}
                onClear={handleClearIngredients}
                hasSavedData={!!savedIngredientsData}
                statusMessage={statusMessage}
            />

            <div className="text-center">
                <button
                onClick={handleGenerateRecipe}
                disabled={isLoading || ingredients.length === 0}
                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none dark:disabled:bg-gray-600"
                >
                {isLoading ? loadingMessage : 'Generate Recipe'}
                </button>
            </div>
            </div>

            <div className="mt-10">
            {isLoading && <LoadingSpinner />}
            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative text-center mb-6" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {notification && !isLoading && (
                <div className="bg-yellow-100 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg relative text-center mb-6" role="status">
                   <span className="block sm:inline">{notification}</span>
                </div>
            )}
            {recipe && !isLoading && <RecipeDisplay recipe={recipe} imageUrl={recipeImage} instructionImages={instructionImages} isShareable={!isViewMode} />}
            {!recipe && !isLoading && !error && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                <p>Your generated recipe will appear here.</p>
                </div>
            )}
            </div>
        </>
        )}
      </main>
      
      {!isViewMode && <>
        <ConfirmationModal
            isOpen={isLoadModalOpen}
            onConfirm={performLoad}
            onCancel={() => setLoadModalOpen(false)}
            title="Load Saved Ingredients?"
            message="This will replace your current ingredient list. Are you sure you want to proceed?"
        />
        
        <ConfirmationModal
            isOpen={isClearModalOpen}
            onConfirm={performClear}
            onCancel={() => setClearModalOpen(false)}
            title="Clear Saved Ingredients?"
            message="This will permanently delete your saved ingredient list. This action cannot be undone."
        />
      </>}

    </div>
  );
};

export default App;