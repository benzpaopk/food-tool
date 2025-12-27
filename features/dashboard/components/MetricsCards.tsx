"use client";

/**
 * Metrics Cards Component
 * 
 * Displays key metrics in card format.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ChefHat, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MetricsCardsProps {
  totalIngredients: number;
  totalRecipes: number;
  mostExpensiveRecipe: {
    name: string;
    cost: number;
  } | null;
}

export function MetricsCards({
  totalIngredients,
  totalRecipes,
  mostExpensiveRecipe,
}: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Ingredients Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalIngredients}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Ingredients in your inventory
          </p>
          <Button asChild variant="link" className="mt-3 p-0 h-auto text-xs">
            <Link href="/ingredients">View all →</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Total Recipes Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
          <ChefHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalRecipes}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Recipes created
          </p>
          <Button asChild variant="link" className="mt-3 p-0 h-auto text-xs">
            <Link href="/recipes">View all →</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Most Expensive Recipe Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Expensive Recipe</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {mostExpensiveRecipe ? (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(mostExpensiveRecipe.cost)}
              </div>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {mostExpensiveRecipe.name}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-muted-foreground">—</div>
              <p className="text-sm text-muted-foreground mt-1">
                No recipes yet
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

