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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started quickly with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/ingredients">
              <Utensils className="mr-2 h-5 w-5" />
              Add New Ingredient
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/recipes/new">
              <ChefHat className="mr-2 h-5 w-5" />
              Create Recipe
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

