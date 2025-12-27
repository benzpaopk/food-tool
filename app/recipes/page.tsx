"use client";
/**
 * Recipes Page
 * 
 * Page for viewing all recipes.
 */

import { RecipeList } from "@/features/recipes/components/RecipeList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your recipes
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Recipe
          </Link>
        </Button>
      </div>

      <RecipeList />
    </div>
  );
}

