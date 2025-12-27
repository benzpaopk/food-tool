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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/recipes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Recipe</h1>
          <p className="text-muted-foreground mt-2">
            Build your recipe and calculate food costs in real-time
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="rounded-lg border p-6">
          <RecipeForm submitLabel="Create Recipe" />
        </div>
      </div>
    </div>
  );
}

