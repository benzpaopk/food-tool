"use client";

/**
 * Ingredients Page
 * 
 * Page for managing ingredients - add, view, edit, and delete ingredients.
 */

import { IngredientForm, IngredientList } from "@/features/ingredients";

export default function IngredientsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold mb-3">Your Ingredients</h1>
        <p className="text-lg text-muted-foreground">
          Add and manage your ingredients and their costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <div className="space-y-4">
          <div className="rounded-lg border-2 p-8 bg-background">
            <h2 className="text-2xl font-bold mb-6">Add New Ingredient</h2>
            <IngredientForm />
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-6">All Your Ingredients</h2>
            <IngredientList />
          </div>
        </div>
      </div>
    </div>
  );
}

