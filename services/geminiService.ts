import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

// Fix: Removed `as string` type assertion to align with coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: {
      type: Type.STRING,
      description: "The name of the recipe.",
    },
    description: {
      type: Type.STRING,
      description: "A short, enticing description of the dish."
    },
    prepTime: {
        type: Type.STRING,
        description: "Estimated preparation time, e.g., '15 minutes'."
    },
    cookTime: {
        type: Type.STRING,
        description: "Estimated cooking time, e.g., '25 minutes'."
    },
    servings: {
        type: Type.STRING,
        description: "Number of servings the recipe makes, e.g., '4 servings'."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A required ingredient for the recipe, including quantity."
      },
      description: "An array of all ingredients needed for the recipe.",
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A single step in the cooking instructions."
      },
      description: "An array of step-by-step instructions for preparing the dish.",
    },
  },
  required: ["recipeName", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions"],
};

export async function generateRecipe(ingredients: string[]): Promise<Recipe> {
  const prompt = `You are a creative chef. Generate a delicious recipe using only the following ingredients: ${ingredients.join(', ')}. You can assume basic pantry staples like salt, pepper, oil, and water are available. If the ingredients are insufficient for a good recipe, be creative but realistic. Present the recipe in a clear, structured format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const recipeData = JSON.parse(jsonText);

    return recipeData as Recipe;

  } catch (error) {
    console.error("Error generating recipe from Gemini API:", error);
    throw new Error("Failed to generate recipe.");
  }
}

export async function generateRecipeImage(recipeName: string, description: string): Promise<string> {
    const prompt = `A delicious, high-quality, professional photograph of a finished dish: ${recipeName}. ${description}. The food should look appealing and be presented on a clean, simple background.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating recipe image from Gemini API:", error);
        throw new Error("Failed to generate recipe image.");
    }
}

export async function generateInstructionImages(recipeName: string, instructions: string[]): Promise<(string | null)[]> {
    const imagePromises = instructions.map(async (instruction, index) => {
        const prompt = `A clear, high-quality, photorealistic instructional image for a recipe step. The recipe is for "${recipeName}". The step is: "${instruction}". The image should be from a first-person perspective, showing hands performing the action if appropriate. The background should be a clean, modern kitchen setting. Focus on the action described in the step. Step ${index + 1} of ${instructions.length}.`;
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '4:3',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
            return null;
        } catch (error) {
            console.error(`Error generating image for instruction "${instruction}":`, error);
            return null; // Return null if a single image generation fails
        }
    });

    return Promise.all(imagePromises);
}
