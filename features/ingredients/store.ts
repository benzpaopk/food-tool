/**
 * Ingredient Store (Zustand)
 * 
 * Global state management for ingredients with localStorage persistence.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Ingredient } from "@/types";
import { generateUUID } from "@/lib/uuid";

/**
 * State interface for the ingredient store
 */
interface IngredientState {
  /** Array of all ingredients */
  ingredients: Ingredient[];
  
  /** Add a new ingredient */
  addIngredient: (ingredient: Omit<Ingredient, "id" | "createdAt" | "updatedAt">) => void;
  
  /** Remove an ingredient by ID */
  removeIngredient: (id: string) => void;
  
  /** Update an existing ingredient */
  updateIngredient: (id: string, data: Partial<Omit<Ingredient, "id" | "createdAt">>) => void;
  
  /** Get an ingredient by ID */
  getIngredient: (id: string) => Ingredient | undefined;
  
  /** Clear all ingredients */
  clearIngredients: () => void;
}

/**
 * Helper to restore Date objects from stored data
 */
function restoreIngredientDates(ingredient: any): Ingredient {
  return {
    ...ingredient,
    createdAt:
      ingredient.createdAt instanceof Date
        ? ingredient.createdAt
        : new Date(ingredient.createdAt),
    updatedAt:
      ingredient.updatedAt instanceof Date
        ? ingredient.updatedAt
        : new Date(ingredient.updatedAt),
  };
}

/**
 * Custom storage that handles Date serialization/deserialization
 */
const ingredientStorage = {
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
 * Zustand store for ingredient management
 * 
 * Features:
 * - Persistent storage in localStorage
 * - Auto-generates UUIDs for new ingredients
 * - Automatically sets createdAt and updatedAt timestamps
 */
export const useIngredientStore = create<IngredientState>()(
  persist(
    (set, get) => ({
      ingredients: [],

      addIngredient: (ingredientData) => {
        const now = new Date();
        const newIngredient: Ingredient = {
          ...ingredientData,
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          ingredients: [...state.ingredients, newIngredient],
        }));
      },

      removeIngredient: (id) => {
        set((state) => ({
          ingredients: state.ingredients.filter((ing: Ingredient) => ing.id !== id),
        }));
      },

      updateIngredient: (id, data) => {
        set((state) => ({
          ingredients: state.ingredients.map((ing: Ingredient) =>
            ing.id === id
              ? {
                  ...ing,
                  ...data,
                  updatedAt: new Date(),
                }
              : ing
          ),
        }));
      },

      getIngredient: (id) => {
        const ingredient = get().ingredients.find((ing: Ingredient) => ing.id === id);
        return ingredient ? restoreIngredientDates(ingredient) : undefined;
      },

      clearIngredients: () => {
        set({ ingredients: [] });
      },
    }),
    {
      name: "ingredient-storage", // localStorage key
      storage: createJSONStorage(() => ingredientStorage),
      // Convert Date objects to ISO strings when storing
      partialize: (state) => ({
        ingredients: state.ingredients.map((ing: Ingredient) => ({
          ...ing,
          createdAt: ing.createdAt.toISOString(),
          updatedAt: ing.updatedAt.toISOString(),
        })),
      }),
      // Restore Date objects when loading from storage
      merge: (persistedState: any, currentState: IngredientState) => {
        return {
          ...currentState,
          ingredients: (persistedState?.ingredients || []).map(
            restoreIngredientDates
          ),
        };
      },
    }
  )
);

