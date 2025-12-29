"use client";

/**
 * Ingredient Form Component
 * 
 * Form for creating and editing ingredients using React Hook Form and Zod validation.
 * Uses Shadcn UI components for consistent styling.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIngredientSchema, type CreateIngredientInput } from "../schema";
import type { IngredientCategory, Unit, Ingredient } from "@/types";
import { useIngredientStore } from "../store";
import { Button } from "@/components/ui/button";
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

/**
 * Props for IngredientForm component
 */
export interface IngredientFormProps {
  /** Initial ingredient data (for editing) - if provided, form is in edit mode */
  initialData?: Ingredient;
  /** Initial form values (alternative to initialData, for backward compatibility) */
  defaultValues?: Partial<CreateIngredientInput>;
  /** Optional callback when form is submitted (if not provided, uses store) */
  onSubmit?: (data: CreateIngredientInput) => void | Promise<void>;
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
 * Category options for the select dropdown
 */
const categoryOptions: { value: IngredientCategory; label: string }[] = [
  { value: "protein", label: "Protein" },
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "dairy", label: "Dairy" },
  { value: "grain", label: "Grain" },
  { value: "spice", label: "Spice" },
  { value: "oil", label: "Oil" },
  { value: "beverage", label: "Beverage" },
  { value: "other", label: "Other" },
];

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

export function IngredientForm({
  initialData,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
  onSuccess,
}: IngredientFormProps) {
  const addIngredient = useIngredientStore((state) => state.addIngredient);
  const updateIngredient = useIngredientStore((state) => state.updateIngredient);
  
  // Determine if we're in edit mode
  const isEditMode = !!initialData;
  
  // Get default values from initialData or defaultValues
  const formDefaults = initialData
    ? {
        name: initialData.name,
        category: initialData.category,
        pricePerUnit: initialData.pricePerUnit,
        purchaseUnit: initialData.purchaseUnit,
        purchaseQuantity: initialData.purchaseQuantity,
        yieldPercentage: initialData.yieldPercentage,
        notes: initialData.notes || "",
      }
    : {
        name: defaultValues?.name ?? "",
        category: defaultValues?.category ?? "other",
        pricePerUnit: defaultValues?.pricePerUnit ?? undefined,
        purchaseUnit: defaultValues?.purchaseUnit ?? "kg",
        purchaseQuantity: defaultValues?.purchaseQuantity ?? undefined,
        yieldPercentage: defaultValues?.yieldPercentage ?? 100,
        notes: defaultValues?.notes ?? "",
      };
  
  // Auto-set submit label based on mode
  const finalSubmitLabel = submitLabel || (isEditMode ? "Save Changes" : "Add Ingredient");
  
  const form = useForm<CreateIngredientInput>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: formDefaults,
  });

  const handleSubmit = async (data: CreateIngredientInput) => {
    try {
      // Use custom onSubmit if provided
      if (onSubmit) {
        await onSubmit(data);
      } else if (isEditMode && initialData) {
        // Update existing ingredient
        updateIngredient(initialData.id, {
          name: data.name,
          category: data.category,
          pricePerUnit: data.pricePerUnit,
          purchaseUnit: data.purchaseUnit,
          purchaseQuantity: data.purchaseQuantity,
          yieldPercentage: data.yieldPercentage,
          notes: data.notes || undefined,
        });
      } else {
        // Add new ingredient
        addIngredient({
          name: data.name,
          category: data.category,
          pricePerUnit: data.pricePerUnit,
          purchaseUnit: data.purchaseUnit,
          purchaseQuantity: data.purchaseQuantity,
          yieldPercentage: data.yieldPercentage,
          notes: data.notes || undefined,
        });
      }
      
      // Reset form on successful submission (only if not editing)
      if (!isEditMode) {
        form.reset({
          name: "",
          category: "other",
          pricePerUnit: undefined,
          purchaseUnit: "kg",
          purchaseQuantity: undefined,
          yieldPercentage: 100,
          notes: "",
        });
      }
      
      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">What is the name of this ingredient?</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type the ingredient name here, for example: Chicken Breast"
                  {...field}
                  disabled={isLoading}
                  aria-label="Ingredient name"
                />
              </FormControl>
              <FormDescription className="text-base">
                Give your ingredient a name that you will remember
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">What type of ingredient is this?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger aria-label="Select ingredient category">
                    <SelectValue placeholder="Choose a category, for example: Protein, Vegetable, etc." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-base">
                Choose what type of ingredient this is (like Protein, Vegetable, Spice, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Unit and Quantity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Unit Field */}
          <FormField
            control={form.control}
            name="purchaseUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">How is this ingredient sold? (grams, kilograms, etc.)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger aria-label="Select purchase unit">
                      <SelectValue placeholder="Choose the unit, for example: Kilogram, Gram, Liter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-base">
                  Choose how this ingredient is sold when you buy it (like kilograms, grams, liters, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Purchase Quantity Field */}
          <FormField
            control={form.control}
            name="purchaseQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">How much did you buy? (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Enter the amount you bought, for example: 1"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number.parseFloat(value));
                    }}
                    value={field.value ?? ""}
                    disabled={isLoading}
                    aria-label="Purchase quantity"
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Enter how much you bought (this is just for your reference - you can skip this)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Per Unit Field */}
        <FormField
          control={form.control}
          name="pricePerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">How much does this ingredient cost? (Thai Baht)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter the price, for example: 200.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number.parseFloat(value));
                  }}
                  value={field.value ?? ""}
                  disabled={isLoading}
                  aria-label="Price per unit in Thai Baht"
                />
              </FormControl>
              <FormDescription className="text-base">
                Enter how much you paid for this ingredient in Thai Baht (for example: 200.00)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Yield Percentage Field */}
        <FormField
          control={form.control}
          name="yieldPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">How much can you actually use? (Percentage)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Enter a number between 0 and 100, for example: 80"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number.parseFloat(value));
                  }}
                  value={field.value ?? ""}
                  disabled={isLoading}
                  aria-label="Yield percentage"
                />
              </FormControl>
              <FormDescription className="text-base">
                After cleaning or preparing this ingredient, how much can you actually use? Enter a number from 0 to 100. 
                For example: 80 means you can use 80% of what you bought (20% is lost during cleaning or preparation).
                If you're not sure, leave it at 100.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Additional Notes (Optional - You can skip this)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write any additional notes about this ingredient here, for example: where you buy it, storage tips, etc."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                  aria-label="Additional notes about the ingredient"
                />
              </FormControl>
              <FormDescription className="text-base">
                You can add any extra notes or reminders about this ingredient (this is optional)
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
            {isLoading ? "Saving Your Ingredient..." : finalSubmitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

