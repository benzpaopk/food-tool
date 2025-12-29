/**
 * New Recipe Page
 * 
 * Page for creating a new recipe.
 */

import { RecipeForm } from "@/features/recipes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewRecipePage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="lg" asChild aria-label="Go back to recipes list">
          <Link href="/recipes">
            <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
            <span>Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold mb-3">Create New Recipe</h1>
          <p className="text-lg text-muted-foreground">
            Build your recipe and see the cost calculated automatically as you add ingredients
          </p>
        </div>
      </div>

      <div className="max-w-5xl">
        <div className="rounded-lg border-2 p-8 bg-background">
          <RecipeForm submitLabel="Save Recipe" />
        </div>
      </div>
    </div>
  );
}

