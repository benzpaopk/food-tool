"use client";

/**
 * Recipe Print View Component
 * 
 * Print-friendly view of a recipe card suitable for A4 paper.
 * Designed for kitchen use (without costs) or management (with costs).
 */

import type { Recipe } from "@/types";
import { formatCurrency, formatQuantity } from "@/lib/formatters";
import { useIngredientStore } from "@/features/ingredients/store";
import { calculateIngredientCost } from "@/lib/calculations";

/**
 * Props for RecipePrintView component
 */
export interface RecipePrintViewProps {
  /** The recipe to display */
  recipe: Recipe;
  /** Whether to show cost information (default: false for kitchen, true for management) */
  showCosts?: boolean;
}

export function RecipePrintView({ recipe, showCosts = false }: RecipePrintViewProps) {
  const getIngredient = useIngredientStore((state) => state.getIngredient);
  
  // Format date for display
  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-recipe-card hidden print:block bg-white text-black p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
        <div className="text-sm text-gray-700">
          <span>Date: {printDate}</span>
          {recipe.servings > 0 && (
            <span className="ml-4">Servings: {recipe.servings}</span>
          )}
        </div>
        {recipe.description && (
          <p className="mt-2 text-base text-gray-800">{recipe.description}</p>
        )}
      </div>

      {/* Ingredients Table */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">
          Ingredients
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 px-4 font-bold">Ingredient</th>
              <th className="text-right py-2 px-4 font-bold">Quantity</th>
              <th className="text-right py-2 px-4 font-bold">Unit</th>
              {showCosts && (
                <th className="text-right py-2 px-4 font-bold">Cost</th>
              )}
            </tr>
          </thead>
          <tbody>
            {recipe.items.map((item, index) => {
              const ingredient = getIngredient(item.ingredientId);
              let itemCost = 0;
              
              if (ingredient && showCosts) {
                try {
                  itemCost = calculateIngredientCost({
                    pricePerUnit: ingredient.pricePerUnit,
                    purchaseQuantity: ingredient.purchaseQuantity,
                    purchaseUnit: ingredient.purchaseUnit,
                    yieldPercentage: ingredient.yieldPercentage,
                    usedQuantity: item.usedQuantity,
                    usedUnit: item.usedUnit,
                  });
                } catch (error) {
                  console.error("Error calculating item cost:", error);
                  itemCost = 0;
                }
              }

              return (
                <tr
                  key={item.id || index}
                  className="border-b border-gray-300"
                >
                  <td className="py-2 px-4">
                    {ingredient ? ingredient.name : `Ingredient ${index + 1} (Not Found)`}
                  </td>
                  <td className="text-right py-2 px-4">
                    {item.usedQuantity}
                  </td>
                  <td className="text-right py-2 px-4 uppercase">
                    {item.usedUnit}
                  </td>
                  {showCosts && (
                    <td className="text-right py-2 px-4 font-mono">
                      {ingredient ? formatCurrency(itemCost) : "—"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          {showCosts && (
            <tfoot>
              <tr className="border-t-2 border-black font-bold">
                <td colSpan={3} className="py-2 px-4 text-right">
                  Total Cost:
                </td>
                <td className="text-right py-2 px-4 font-mono">
                  {formatCurrency(recipe.totalCost)}
                </td>
              </tr>
              {recipe.servings > 0 && (
                <tr className="border-b-2 border-black">
                  <td colSpan={3} className="py-2 px-4 text-right">
                    Cost per Serving:
                  </td>
                  <td className="text-right py-2 px-4 font-mono">
                    {formatCurrency(recipe.totalCost / recipe.servings)}
                  </td>
                </tr>
              )}
              {recipe.salePrice > 0 && (
                <>
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-right">
                      Sale Price:
                    </td>
                    <td className="text-right py-2 px-4 font-mono">
                      {formatCurrency(recipe.salePrice)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-right">
                      Food Cost %:
                    </td>
                    <td className="text-right py-2 px-4 font-mono">
                      {recipe.foodCostPercentage.toFixed(1)}%
                    </td>
                  </tr>
                </>
              )}
            </tfoot>
          )}
        </table>
      </div>

      {/* Instructions/Notes Section */}
      {(recipe.notes || showCosts) && (
        <div className="mt-6 border-t-2 border-black pt-4">
          {recipe.notes && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Notes / Instructions</h2>
              <p className="text-base whitespace-pre-wrap text-gray-800">
                {recipe.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-600 text-center">
        <p>Food Cost Calculator - Recipe Card</p>
      </div>
    </div>
  );
}

