"use client";

/**
 * Ingredients Page
 * 
 * Page for managing ingredients - add, view, edit, and delete ingredients.
 */

import { IngredientForm, IngredientList } from "@/features/ingredients";

export default function IngredientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <p className="text-muted-foreground mt-2">
          Manage your ingredients and their costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Ingredient</h2>
            <IngredientForm />
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">All Ingredients</h2>
            <IngredientList />
          </div>
        </div>
      </div>
    </div>
  );
}

