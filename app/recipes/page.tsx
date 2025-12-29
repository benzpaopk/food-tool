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
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-3">Your Recipes</h1>
          <p className="text-lg text-muted-foreground">
            View and manage all your recipes here
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/recipes/new">
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            <span>Create New Recipe</span>
          </Link>
        </Button>
      </div>

      <RecipeList />
    </div>
  );
}

