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
import { useToast } from "@/hooks/use-toast";
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
          title: "Missing Information",
          description: "Please add at least one ingredient to your recipe before saving.",
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
          title: "Recipe Saved Successfully!",
          description: `Your recipe "${data.name}" has been saved and updated.`,
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
          title: "Recipe Created Successfully!",
          description: `Your recipe "${data.name}" has been saved. You can find it in your recipes list.`,
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
        title: "Something Went Wrong",
        description: isEditMode
          ? "We couldn't save your changes. Please check your information and try again."
          : "We couldn't save your recipe. Please check your information and try again.",
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
        title: "Please Check Your Information",
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
              <FormLabel className="text-base font-semibold">What is the name of this recipe?</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type the recipe name here, for example: Pad Thai"
                  {...field}
                  disabled={isLoading}
                  aria-label="Recipe name"
                />
              </FormControl>
              <FormDescription className="text-base">
                Give your recipe a name that you will remember
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
              <FormLabel className="text-base font-semibold">Description (Optional - You can skip this)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a short description about this recipe, for example: A popular Thai noodle dish..."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                  aria-label="Recipe description"
                />
              </FormControl>
              <FormDescription className="text-base">
                You can add a short note about this recipe if you want (this is optional)
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
            <FormItem className="w-full md:w-64">
              <FormLabel className="text-base font-semibold">How many people can eat from this recipe?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter a number, for example: 4"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number.parseInt(value, 10));
                  }}
                  value={field.value ?? ""}
                  disabled={isLoading}
                  aria-label="Number of servings"
                />
              </FormControl>
              <FormDescription className="text-base">
                How many people can eat from this recipe? Enter a number like 2, 4, or 6
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ingredients Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">What ingredients do you need?</h3>
              <p className="text-base text-muted-foreground">
                Add each ingredient you need for this recipe
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={addIngredientRow}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Add Another Ingredient</span>
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
                    <h4 className="text-base font-semibold">
                      Ingredient {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Remove ingredient ${index + 1}`}
                      >
                        <Trash2 className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span>Remove</span>
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
                          <FormLabel className="text-base font-semibold">Which ingredient?</FormLabel>
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
                              <SelectTrigger aria-label={`Select ingredient for ingredient ${index + 1}`}>
                                <SelectValue placeholder="Choose an ingredient from the list" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ingredients.length === 0 ? (
                                <div className="px-4 py-3 text-base text-muted-foreground">
                                  You need to add ingredients first. Go to the Ingredients page to add them.
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
                          <FormDescription className="text-base">
                            Choose which ingredient you need from your list
                          </FormDescription>
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
                          <FormLabel className="text-base font-semibold">How much do you need?</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              min="0"
                              placeholder="Enter the amount, for example: 500"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number.parseFloat(value)
                                );
                              }}
                              value={field.value ?? ""}
                              disabled={isLoading}
                              aria-label={`Quantity for ingredient ${index + 1}`}
                            />
                          </FormControl>
                          <FormDescription className="text-base">
                            Enter how much of this ingredient you need (just the number)
                          </FormDescription>
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
                          <FormLabel className="text-base font-semibold">What unit? (grams, kilograms, etc.)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading || !ingredientId}
                          >
                            <FormControl>
                              <SelectTrigger aria-label={`Select unit for ingredient ${index + 1}`}>
                                <SelectValue placeholder="Choose the unit (grams, kilograms, etc.)" />
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
                          <FormDescription className="text-base">
                            Choose the unit of measurement (grams, kilograms, liters, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Item Cost Display */}
                  {selectedIngredient &&
                    form.watch(`items.${index}.usedQuantity`) &&
                    form.watch(`items.${index}.usedQuantity`)! > 0 && (
                      <div className="text-base font-semibold text-primary bg-primary/10 p-3 rounded-md">
                        Cost for this ingredient:{" "}
                        <span className="text-lg">
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
                        </span>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Summary Section */}
        <div className="rounded-lg border-2 border-primary/20 bg-muted/50 p-8 space-y-6">
          <h3 className="text-2xl font-bold">Cost Summary - How Much Does This Recipe Cost?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-4 rounded-lg border-2">
              <p className="text-base font-semibold text-muted-foreground mb-2">Total Cost for All Ingredients</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
              <p className="text-sm text-muted-foreground mt-2">This is how much all ingredients cost together</p>
            </div>
            
            <div className="bg-background p-4 rounded-lg border-2">
              <p className="text-base font-semibold text-muted-foreground mb-2">Cost Per Person</p>
              <p className="text-3xl font-bold">
                {formatCurrency(costPerServing)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">This is how much each serving costs</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/30">
              <p className="text-base font-semibold text-muted-foreground mb-2">
                Suggested Price to Sell
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(suggestedSellingPrice)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Suggested price based on {DEFAULT_FOOD_COST_PERCENTAGE}% food cost (you can change this below)
              </p>
            </div>
          </div>

          {/* Sale Price Input */}
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">How much will you sell this recipe for? (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter the price in Thai Baht, for example: 150.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : Number.parseFloat(value)
                      );
                    }}
                    value={field.value ?? ""}
                    disabled={isLoading}
                    aria-label="Selling price in Thai Baht"
                  />
                </FormControl>
                <FormDescription className="text-base">
                  If you plan to sell this recipe, enter the price here. This is optional - you can skip it if you don't need it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Food Cost Percentage Display */}
          {form.watch("salePrice") &&
            form.watch("salePrice")! > 0 && (
              <div className="pt-4 border-t-2 border-primary/20 bg-primary/5 p-4 rounded-lg">
                <p className="text-base font-semibold text-muted-foreground mb-2">
                  Food Cost Percentage
                </p>
                <p className="text-3xl font-bold text-primary">
                  {((totalCost / form.watch("salePrice")!) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This shows what percentage of your selling price goes to ingredients. Lower is usually better for profit.
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
              <FormLabel className="text-base font-semibold">Additional Notes (Optional - You can skip this)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write any additional notes about this recipe here, for example: cooking tips, special instructions, etc."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                  aria-label="Additional notes about the recipe"
                />
              </FormControl>
              <FormDescription className="text-base">
                You can add any extra notes or reminders about this recipe (this is optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <span>Cancel</span>
            </Button>
          )}
          <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Saving Your Recipe..." : finalSubmitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

