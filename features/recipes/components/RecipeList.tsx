"use client";

/**
 * Recipe List Component
 * 
 * Displays a table of all recipes with actions to view/delete.
 */

import { useRecipeStore } from "../store";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { Recipe } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Link from "next/link";

/**
 * Props for RecipeList component
 */
export interface RecipeListProps {
  /** Callback when a recipe is selected for viewing/editing */
  onView?: (recipe: Recipe) => void;
  /** Show view/delete actions */
  showActions?: boolean;
}

export function RecipeList({ onView, showActions = true }: RecipeListProps) {
  const recipes = useRecipeStore((state) => state.recipes);
  const removeRecipe = useRecipeStore((state) => state.removeRecipe);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    removeRecipe(id);
    setDeletingId(null);
  };

  if (recipes.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground mb-4">
          No recipes created yet. Create your first recipe to get started!
        </p>
        <Button asChild>
          <Link href="/recipes/new">Create Recipe</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Servings</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Food Cost %</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => {
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
                  <TableCell>{recipe.servings}</TableCell>
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
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/recipes/${recipe.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingId === recipe.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{recipe.name}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(recipe.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

