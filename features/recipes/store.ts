/**
 * Recipe Store (Zustand)
 * 
 * Global state management for recipes with localStorage persistence.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Recipe, RecipeItem } from "@/types";
import { generateUUID } from "@/lib/uuid";
import { calculateRecipeTotalCost, calculateFoodCostPercentage } from "@/lib/calculations";
import { useIngredientStore } from "@/features/ingredients/store";

/**
 * State interface for the recipe store
 */
interface RecipeState {
  /** Array of all recipes */
  recipes: Recipe[];
  
  /** Add a new recipe */
  addRecipe: (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "totalCost" | "foodCostPercentage">) => void;
  
  /** Remove a recipe by ID */
  removeRecipe: (id: string) => void;
  
  /** Update an existing recipe */
  updateRecipe: (id: string, data: Partial<Omit<Recipe, "id" | "createdAt">>) => void;
  
  /** Get a recipe by ID */
  getRecipe: (id: string) => Recipe | undefined;
  
  /** Clear all recipes */
  clearRecipes: () => void;
}

/**
 * Helper to restore Date objects from stored data
 */
function restoreRecipeDates(recipe: any): Recipe {
  return {
    ...recipe,
    createdAt:
      recipe.createdAt instanceof Date
        ? recipe.createdAt
        : new Date(recipe.createdAt),
    updatedAt:
      recipe.updatedAt instanceof Date
        ? recipe.updatedAt
        : new Date(recipe.updatedAt),
    // Restore dates in items if they exist
    items: recipe.items.map((item: any) => ({
      ...item,
    })),
  };
}

/**
 * Custom storage that handles Date serialization/deserialization
 */
const recipeStorage = {
  getItem: (name: string): string | null => {
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

/**
 * Zustand store for recipe management
 * 
 * Features:
 * - Persistent storage in localStorage
 * - Auto-generates UUIDs for new recipes
 * - Automatically sets createdAt and updatedAt timestamps
 * - Calculates totalCost and foodCostPercentage
 */
export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],

      addRecipe: (recipeData) => {
        const now = new Date();
        
        // Get ingredients map for cost calculation
        const ingredients = useIngredientStore.getState().ingredients;
        const ingredientsMap = new Map(
          ingredients.map((ing) => [ing.id, ing])
        );
        
        // Calculate total cost
        const totalCost = calculateRecipeTotalCost(recipeData.items, ingredientsMap);
        
        // Calculate food cost percentage if sale price is provided
        const foodCostPercentage = recipeData.salePrice
          ? calculateFoodCostPercentage(totalCost, recipeData.salePrice)
          : 0;
        
        const newRecipe: Recipe = {
          ...recipeData,
          id: generateUUID(),
          totalCost,
          foodCostPercentage,
          salePrice: recipeData.salePrice || 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          recipes: [...state.recipes, newRecipe],
        }));
      },

      removeRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe: any) => recipe.id !== id),
        }));
      },

      updateRecipe: (id, data) => {
        set((state) => {
          const recipe = state.recipes.find((r: Recipe) => r.id === id);
          if (!recipe) return state;

          // If items or sale price changed, recalculate costs
          const updatedItems = data.items || recipe.items;
          const updatedSalePrice = data.salePrice !== undefined ? data.salePrice : recipe.salePrice;
          
          // Get ingredients map for cost calculation
          const ingredients = useIngredientStore.getState().ingredients;
          const ingredientsMap = new Map(
            ingredients.map((ing) => [ing.id, ing])
          );
          
          // Calculate total cost
          const totalCost = calculateRecipeTotalCost(updatedItems, ingredientsMap);
          
          // Calculate food cost percentage if sale price is provided
          const foodCostPercentage = updatedSalePrice > 0
            ? calculateFoodCostPercentage(totalCost, updatedSalePrice)
            : 0;

          return {
            recipes: state.recipes.map((r: Recipe) =>
              r.id === id
                ? {
                    ...r,
                    ...data,
                    totalCost,
                    foodCostPercentage,
                    salePrice: updatedSalePrice,
                    updatedAt: new Date(),
                  }
                : r
            ),
          };
        });
      },

      getRecipe: (id) => {
        const recipe = get().recipes.find((r: Recipe) => r.id === id);
        return recipe ? restoreRecipeDates(recipe) : undefined;
      },

      clearRecipes: () => {
        set({ recipes: [] });
      },
    }),
    {
      name: "recipe-storage", // localStorage key
      storage: createJSONStorage(() => recipeStorage),
      // Convert Date objects to ISO strings when storing
      partialize: (state) => ({
        recipes: state.recipes.map((recipe: Recipe) => ({
          ...recipe,
          createdAt: recipe.createdAt.toISOString(),
          updatedAt: recipe.updatedAt.toISOString(),
        })),
      }),
      // Restore Date objects when loading from storage
      merge: (persistedState: any, currentState: RecipeState) => {
        return {
          ...currentState,
          recipes: (persistedState?.recipes || []).map(restoreRecipeDates),
        };
      },
    }
  )
);

