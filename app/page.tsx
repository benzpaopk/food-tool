"use client";

/**
 * Dashboard Page
 * 
 * Main dashboard showing overview statistics, metrics, and analytics.
 * Professional SaaS-style analytics dashboard.
 */

import { useEffect, useState } from "react";
import { useIngredientStore } from "@/features/ingredients/store";
import { useRecipeStore } from "@/features/recipes/store";
import {
  MetricsCards,
  RecentRecipes,
  CostDistributionChart,
  QuickActions,
} from "@/features/dashboard";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const ingredients = useIngredientStore((state) => state.ingredients);
  const recipes = useRecipeStore((state) => state.recipes);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate metrics
  const totalIngredients = ingredients.length;
  const totalRecipes = recipes.length;

  // Find most expensive recipe
  const mostExpensiveRecipe =
    recipes.length > 0
      ? recipes.reduce((prev, current) =>
          current.totalCost > prev.totalCost ? current : prev
        )
      : null;

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Here's an overview of your food cost management
        </p>
      </div>

      {/* Key Metrics Cards */}
      <MetricsCards
        totalIngredients={totalIngredients}
        totalRecipes={totalRecipes}
        mostExpensiveRecipe={
          mostExpensiveRecipe
            ? {
                name: mostExpensiveRecipe.name,
                cost: mostExpensiveRecipe.totalCost,
              }
            : null
        }
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Recipes */}
        <RecentRecipes recipes={recipes} />

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Cost Distribution Chart */}
      {recipes.length > 0 && (
        <CostDistributionChart recipes={recipes} />
      )}

      {/* Empty State */}
      {totalIngredients === 0 && totalRecipes === 0 && (
        <div className="rounded-lg border-2 border-primary/20 p-12 text-center bg-muted/30">
          <h2 className="text-3xl font-bold mb-4">Welcome to Food Cost Calculator</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started by adding your first ingredient or creating a recipe
          </p>
          <div className="flex gap-4 justify-center">
            <QuickActions />
          </div>
        </div>
      )}
    </div>
  );
}

