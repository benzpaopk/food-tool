"use client";

/**
 * Recent Recipes Component
 * 
 * Displays the most recently created recipes.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { Recipe } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentRecipesProps {
  recipes: Recipe[];
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
  // Sort by createdAt (most recent first) and take top 5
  const recentRecipes = [...recipes]
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  if (recentRecipes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Recipes</CardTitle>
          <CardDescription>Your most recently created recipes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No recipes created yet</p>
            <Button asChild>
              <Link href="/recipes/new">Create Your First Recipe</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Recipes</CardTitle>
          <CardDescription>Your most recently created recipes</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/recipes">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe Name</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Food Cost %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRecipes.map((recipe) => {
                const foodCostStatus =
                  recipe.foodCostPercentage === 0
                    ? "text-muted-foreground"
                    : recipe.foodCostPercentage <= 35
                    ? "text-green-600"
                    : recipe.foodCostPercentage <= 40
                    ? "text-yellow-600"
                    : "text-red-600";

                return (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.name}</TableCell>
                    <TableCell>{formatCurrency(recipe.totalCost)}</TableCell>
                    <TableCell>
                      {recipe.salePrice > 0 ? (
                        formatCurrency(recipe.salePrice)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipe.foodCostPercentage > 0 ? (
                        <span className={foodCostStatus}>
                          {formatPercentage(recipe.foodCostPercentage)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

