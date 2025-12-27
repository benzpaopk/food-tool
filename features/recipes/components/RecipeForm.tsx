"use client";

/**
 * Recipe Form Component
 * 
 * Form for creating and editing recipes with dynamic ingredient rows.
 * Features real-time cost calculation as ingredients are added/modified.
 */

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRecipeSchema, type CreateRecipeInput, type RecipeItemInput } from "../schema";
import { useIngredientStore } from "@/features/ingredients/store";
import { useRecipeStore } from "../store";
import { calculateIngredientCost } from "@/lib/calculations";
import { formatCurrency } from "@/lib/formatters";
import type { Ingredient, Unit, RecipeItem, Recipe } from "@/types";
import { getUnitMetadata } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { generateUUID } from "@/lib/uuid";

/**
 * Props for RecipeForm component
 */
export interface RecipeFormProps {
  /** Initial recipe data (for editing) - if provided, form is in edit mode */
  initialData?: Recipe;
  /** Initial form values (alternative to initialData, for backward compatibility) */
  defaultValues?: Partial<CreateRecipeInput>;
  /** Callback when form is submitted */
  onSubmit?: (data: CreateRecipeInput) => void | Promise<void>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Submit button text (auto-set in edit mode if not provided) */
  submitLabel?: string;
  /** Whether form is in loading state */
  isLoading?: boolean;
  /** Callback after successful submission */
  onSuccess?: () => void;
}

/**
 * Unit options grouped by type
 */
const unitOptions: { value: Unit; label: string; group: string }[] = [
  { value: "kg", label: "Kilogram (kg)", group: "Weight" },
  { value: "g", label: "Gram (g)", group: "Weight" },
  { value: "l", label: "Liter (l)", group: "Volume" },
  { value: "ml", label: "Milliliter (ml)", group: "Volume" },
  { value: "pcs", label: "Pieces (pcs)", group: "Quantity" },
];

/**
 * Default food cost percentage for suggested selling price calculation
 * Industry standard: 30% food cost means selling price = cost / 0.30
 */
const DEFAULT_FOOD_COST_PERCENTAGE = 30;

export function RecipeForm({
  initialData,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
  onSuccess,
}: RecipeFormProps) {
  const ingredients = useIngredientStore((state) => state.ingredients);
  const getIngredient = useIngredientStore((state) => state.getIngredient);
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const updateRecipe = useRecipeStore((state) => state.updateRecipe);
  const router = useRouter();
  const { toast } = useToast();

  // Determine if we're in edit mode
  const isEditMode = !!initialData;
  
  // Get default values from initialData or defaultValues
  const formDefaults = initialData
    ? {
        name: initialData.name,
        description: initialData.description || "",
        items: initialData.items.map((item) => ({
          ingredientId: item.ingredientId,
          usedQuantity: item.usedQuantity,
          usedUnit: item.usedUnit,
          notes: item.notes || "",
        })),
        servings: initialData.servings,
        salePrice: initialData.salePrice || undefined,
        notes: initialData.notes || "",
      }
    : {
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        items: defaultValues?.items?.length
          ? defaultValues.items
          : [
              {
                ingredientId: "",
                usedQuantity: undefined as any,
                usedUnit: "g" as Unit,
              },
            ],
        servings: defaultValues?.servings ?? 1,
        salePrice: defaultValues?.salePrice ?? undefined,
        notes: defaultValues?.notes ?? "",
      };
  
  // Auto-set submit label based on mode
  const finalSubmitLabel = submitLabel || (isEditMode ? "Save Changes" : "Create Recipe");

  const form = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: formDefaults,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch all form values for real-time cost calculation
  const watchedItems = form.watch("items");
  const watchedServings = form.watch("servings");

  // Calculate total cost in real-time
  const totalCost = useMemo(() => {
    if (!watchedItems || watchedItems.length === 0) {
      return 0;
    }

    return watchedItems.reduce((total, item) => {
      if (!item.ingredientId || !item.usedQuantity || item.usedQuantity <= 0) {
        return total;
      }

      const ingredient = getIngredient(item.ingredientId);
      if (!ingredient) {
        return total;
      }

      try {
        const itemCost = calculateIngredientCost({
          pricePerUnit: ingredient.pricePerUnit,
          purchaseQuantity: ingredient.purchaseQuantity,
          purchaseUnit: ingredient.purchaseUnit,
          yieldPercentage: ingredient.yieldPercentage,
          usedQuantity: item.usedQuantity,
          usedUnit: item.usedUnit,
        });

        return total + itemCost;
      } catch (error) {
        console.error("Error calculating ingredient cost:", error);
        return total;
      }
    }, 0);
  }, [watchedItems, getIngredient]);

  // Calculate suggested selling price based on target food cost percentage
  const suggestedSellingPrice = useMemo(() => {
    if (totalCost === 0) return 0;
    return totalCost / (DEFAULT_FOOD_COST_PERCENTAGE / 100);
  }, [totalCost]);

  // Calculate cost per serving
  const costPerServing = useMemo(() => {
    if (watchedServings <= 0 || totalCost === 0) return 0;
    return totalCost / watchedServings;
  }, [totalCost, watchedServings]);

  // Get compatible units for an ingredient
  const getCompatibleUnits = (ingredientId: string): Unit[] => {
    const ingredient = getIngredient(ingredientId);
    if (!ingredient) return unitOptions.map((opt) => opt.value);

    const ingredientUnitType = getUnitMetadata(ingredient.purchaseUnit).type;
    return unitOptions
      .filter((opt) => getUnitMetadata(opt.value).type === ingredientUnitType)
      .map((opt) => opt.value);
  };

  const handleSubmit = async (data: CreateRecipeInput) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Submitting data...", data);
    console.log("Is edit mode:", isEditMode);
    console.log("Initial data:", initialData);
    console.log("Form state:", form.formState);
    
    try {
      // Filter out empty ingredient rows before processing
      const validItems = data.items.filter(
        (item) => item.ingredientId && item.ingredientId.trim() !== "" && item.usedQuantity && item.usedQuantity > 0
      );
      
      if (validItems.length === 0) {
        console.error("No valid ingredients found");
        toast({
          title: "Validation Error",
          description: "Please add at least one ingredient to the recipe.",
          variant: "destructive",
        });
        return;
      }

      console.log("Valid items:", validItems);

      if (onSubmit) {
        console.log("Using custom onSubmit handler");
        await onSubmit({ ...data, items: validItems });
      } else if (isEditMode && initialData) {
        console.log("Updating recipe:", initialData.id);
        
        // Convert form data to recipe items format
        const recipeItems: RecipeItem[] = validItems.map((item) => ({
          id: generateUUID(),
          ingredientId: item.ingredientId,
          usedQuantity: item.usedQuantity,
          usedUnit: item.usedUnit,
          notes: item.notes || undefined,
        }));

        // Update recipe in store
        updateRecipe(initialData.id, {
          name: data.name,
          description: data.description || undefined,
          items: recipeItems,
          servings: data.servings,
          salePrice: data.salePrice || 0,
          notes: data.notes || undefined,
        });

        console.log("Recipe updated successfully");

        // Show success toast
        toast({
          title: "Recipe updated",
          description: `${data.name} has been updated successfully.`,
        });

        // Redirect to recipes list
        console.log("Redirecting to /recipes");
        router.push("/recipes");
      } else {
        console.log("Creating new recipe");
        
        // Convert form data to recipe format
        const recipeItems: RecipeItem[] = validItems.map((item) => ({
          id: generateUUID(),
          ingredientId: item.ingredientId,
          usedQuantity: item.usedQuantity,
          usedUnit: item.usedUnit,
          notes: item.notes || undefined,
        }));

        // Add recipe to store
        addRecipe({
          name: data.name,
          description: data.description || undefined,
          items: recipeItems,
          servings: data.servings,
          salePrice: data.salePrice || 0,
          notes: data.notes || undefined,
        });

        console.log("Recipe created successfully");

        // Show success toast
        toast({
          title: "Recipe created",
          description: `${data.name} has been saved successfully.`,
        });

        // Redirect to recipes list
        console.log("Redirecting to /recipes");
        router.push("/recipes");
      }
      
      // Reset form on successful submission (only if not editing)
      if (!isEditMode) {
        form.reset({
          name: "",
          description: "",
          items: [
            {
              ingredientId: "",
              usedQuantity: undefined as any,
              usedUnit: "g" as Unit,
            },
          ],
          servings: 1,
          salePrice: undefined,
          notes: "",
        });
      }
      
      console.log("=== FORM SUBMISSION SUCCESS ===");
      onSuccess?.();
    } catch (error) {
      console.error("=== FORM SUBMISSION ERROR ===");
      console.error("Form submission error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      console.error("Form errors:", form.formState.errors);
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update recipe. Please try again."
          : "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addIngredientRow = () => {
    append({
      ingredientId: "",
      usedQuantity: undefined as any,
      usedUnit: "g" as Unit,
      notes: "",
    });
  };

  // Error handler for form validation
  const onError = (errors: any) => {
    console.error("=== FORM VALIDATION ERRORS ===");
    console.error("Validation errors:", errors);
    console.error("Form values:", form.getValues());
    console.error("Form errors object:", form.formState.errors);
    console.error("Form state:", {
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
      isSubmitting: form.formState.isSubmitting,
      submitCount: form.formState.submitCount,
    });
    
    // Show user-friendly error message
    const errorMessages: string[] = [];
    
    // Collect all error messages
    if (errors.items) {
      if (Array.isArray(errors.items)) {
        errors.items.forEach((itemError: any, index: number) => {
          if (itemError) {
            Object.values(itemError).forEach((err: any) => {
              if (err?.message) {
                errorMessages.push(`Ingredient ${index + 1}: ${err.message}`);
              }
            });
          }
        });
      }
    }
    
    if (errors.name) {
      errorMessages.push(`Name: ${errors.name.message || "Required"}`);
    }
    if (errors.servings) {
      errorMessages.push(`Servings: ${errors.servings.message || "Required"}`);
    }
    
    const errorMessage = errorMessages.length > 0 
      ? errorMessages.join(". ")
      : "Please check the form for errors.";
    
    toast({
      title: "Validation Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit, onError)} 
        className="space-y-6"
        noValidate
      >
        {/* Recipe Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pad Thai"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Enter the name of the recipe
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the recipe..."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional description of the recipe
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Servings */}
        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem className="w-full md:w-48">
              <FormLabel>Number of Servings</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g., 4"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number.parseInt(value, 10));
                  }}
                  value={field.value ?? ""}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                How many servings does this recipe make?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ingredients Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                Add ingredients to build your recipe
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredientRow}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </div>

          {/* Dynamic Ingredient Rows */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const ingredientId = form.watch(`items.${index}.ingredientId`);
              const compatibleUnits = getCompatibleUnits(ingredientId);
              const selectedIngredient = ingredientId
                ? getIngredient(ingredientId)
                : null;

              return (
                <div
                  key={field.id}
                  className="rounded-lg border p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">
                      Ingredient {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ingredient Selector */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.ingredientId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ingredient</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset unit to first compatible unit when ingredient changes
                              const ingredient = getIngredient(value);
                              if (ingredient) {
                                const compatible = getCompatibleUnits(value);
                                form.setValue(
                                  `items.${index}.usedUnit`,
                                  compatible[0] || "g"
                                );
                              }
                            }}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ingredients.length === 0 ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  No ingredients available. Add ingredients first.
                                </div>
                              ) : (
                                ingredients.map((ing) => (
                                  <SelectItem key={ing.id} value={ing.id}>
                                    {ing.name} ({formatCurrency(ing.pricePerUnit)}/{ing.purchaseUnit})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity Input */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.usedQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              min="0"
                              placeholder="e.g., 500"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number.parseFloat(value)
                                );
                              }}
                              value={field.value ?? ""}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Unit Selector */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.usedUnit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading || !ingredientId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {compatibleUnits.map((unit) => {
                                const option = unitOptions.find(
                                  (opt) => opt.value === unit
                                );
                                return (
                                  <SelectItem key={unit} value={unit}>
                                    {option?.label || unit}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Cost Display */}
                  {selectedIngredient &&
                    form.watch(`items.${index}.usedQuantity`) &&
                    form.watch(`items.${index}.usedQuantity`)! > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Item Cost:{" "}
                        {formatCurrency(
                          calculateIngredientCost({
                            pricePerUnit: selectedIngredient.pricePerUnit,
                            purchaseQuantity: selectedIngredient.purchaseQuantity,
                            purchaseUnit: selectedIngredient.purchaseUnit,
                            yieldPercentage: selectedIngredient.yieldPercentage,
                            usedQuantity:
                              form.watch(`items.${index}.usedQuantity`) || 0,
                            usedUnit: form.watch(`items.${index}.usedUnit`),
                          })
                        )}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Summary Section */}
        <div className="rounded-lg border bg-muted/50 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Cost Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Cost per Serving</p>
              <p className="text-2xl font-bold">
                {formatCurrency(costPerServing)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Suggested Selling Price
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(suggestedSellingPrice)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Based on {DEFAULT_FOOD_COST_PERCENTAGE}% food cost)
              </p>
            </div>
          </div>

          {/* Sale Price Input */}
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (THB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter selling price"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : Number.parseFloat(value)
                      );
                    }}
                    value={field.value ?? ""}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Set the selling price to calculate food cost percentage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Food Cost Percentage Display */}
          {form.watch("salePrice") &&
            form.watch("salePrice")! > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Food Cost Percentage
                </p>
                <p className="text-xl font-semibold">
                  {((totalCost / form.watch("salePrice")!) * 100).toFixed(1)}%
                </p>
              </div>
            )}
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this recipe..."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional notes or additional information
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : finalSubmitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

