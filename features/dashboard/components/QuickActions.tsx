"use client";

/**
 * Quick Actions Component
 * 
 * Provides quick access buttons for common actions.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChefHat, Utensils } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
        <CardDescription className="text-base">Get started quickly with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/ingredients">
              <Utensils className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Add New Ingredient</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/recipes/new">
              <ChefHat className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Create Recipe</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

