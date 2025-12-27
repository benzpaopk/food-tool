"use client";

/**
 * Ingredient List Component
 * 
 * Displays a table of all ingredients with actions to edit/delete.
 */

import { useIngredientStore } from "../store";
import { formatCurrency, formatQuantity } from "@/lib/formatters";
import type { Ingredient } from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IngredientForm } from "./IngredientForm";
import { useState } from "react";

/**
 * Props for IngredientList component
 */
export interface IngredientListProps {
  /** Callback when an ingredient is selected for editing */
  onEdit?: (ingredient: Ingredient) => void;
  /** Show edit/delete actions */
  showActions?: boolean;
}

export function IngredientList({
  onEdit,
  showActions = true,
}: IngredientListProps) {
  const ingredients = useIngredientStore((state) => state.ingredients);
  const removeIngredient = useIngredientStore((state) => state.removeIngredient);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    removeIngredient(id);
    setDeletingId(null);
  };

  const handleEditClick = (ingredient: Ingredient) => {
    if (onEdit) {
      // Use custom callback if provided
      onEdit(ingredient);
    } else {
      // Open dialog with form
      setEditingIngredient(ingredient);
      setIsDialogOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setIsDialogOpen(false);
    setEditingIngredient(null);
  };

  const handleEditCancel = () => {
    setIsDialogOpen(false);
    setEditingIngredient(null);
  };

  if (ingredients.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          No ingredients yet. Add your first ingredient to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Purchase Unit</TableHead>
                <TableHead>Yield %</TableHead>
                {showActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell className="capitalize">{ingredient.category}</TableCell>
                  <TableCell>
                    {formatCurrency(ingredient.pricePerUnit)} / {ingredient.purchaseUnit}
                  </TableCell>
                  <TableCell>
                    {formatQuantity(ingredient.purchaseQuantity, ingredient.purchaseUnit)}
                  </TableCell>
                  <TableCell>{ingredient.yieldPercentage}%</TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(ingredient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingId === ingredient.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{ingredient.name}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(ingredient.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogDescription>
              Update the ingredient information below.
            </DialogDescription>
          </DialogHeader>
          {editingIngredient && (
            <IngredientForm
              initialData={editingIngredient}
              onCancel={handleEditCancel}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

