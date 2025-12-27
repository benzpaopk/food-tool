"use client";

/**
 * Edit Recipe View Component
 * 
 * Page for editing an existing recipe with print functionality.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecipeStore } from "@/features/recipes/store";
import { RecipeForm } from "./RecipeForm";
import { RecipePrintView } from "./RecipePrintView";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Recipe } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditRecipeView({ id }: { id: string }) {
  const router = useRouter();
  const getRecipe = useRecipeStore((state) => state.getRecipe);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showCosts, setShowCosts] = useState(false);

  useEffect(() => {
    const foundRecipe = getRecipe(id);
    
    if (!foundRecipe) {
      router.push("/recipes");
    } else {
      setRecipe(foundRecipe);
    }
  }, [id, getRecipe, router]);

  const handlePrint = (includeCosts: boolean = false) => {
    setShowCosts(includeCosts);
    // Small delay to ensure state update before print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (!recipe) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/recipes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main UI - Hidden when printing */}
      <div className="space-y-8 print:hidden">
        {/* Header with Print Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/recipes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Recipe</h1>
              <p className="text-muted-foreground mt-2">
                Update your recipe and recalculate costs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePrint(false)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print (Kitchen)
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePrint(true)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print (With Costs)
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-4xl">
          <div className="rounded-lg border p-6">
            <RecipeForm
              initialData={recipe}
              onCancel={() => router.push("/recipes")}
            />
          </div>
        </div>
      </div>

      {/* Print View - Only visible when printing */}
      <div className="hidden print:block">
        <RecipePrintView recipe={recipe} showCosts={showCosts} />
      </div>
    </>
  );
}