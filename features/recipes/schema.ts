/**
 * Zod validation schemas for Recipe Management
 * 
 * Self-contained schema definitions to avoid circular dependencies.
 */

import { z } from "zod";

// ============================================================================
// UNIT SCHEMA (Self-contained, no imports)
// ============================================================================

/**
 * Unit enum for Zod validation
 * Defined inline to avoid circular dependencies
 */
const unitSchema = z.enum(["kg", "g", "l", "ml", "pcs"]);

// ============================================================================
// RECIPE ITEM SCHEMA
// ============================================================================

/**
 * Schema for a recipe item (ingredient in a recipe)
 * 
 * This represents a single ingredient used in a recipe with its quantity and unit.
 */
export const recipeItemSchema = z.object({
  ingredientId: z
    .string({
      required_error: "Ingredient is required",
      invalid_type_error: "Ingredient ID must be a string",
    })
    .min(1, "Ingredient is required")
    .trim(),
  
  usedQuantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("Quantity must be greater than 0")
    .finite("Quantity must be a valid number"),
  
  usedUnit: unitSchema,
  
  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters")
    .optional()
    .or(z.literal("")),
});

// ============================================================================
// RECIPE FORM SCHEMA
// ============================================================================

/**
 * Schema for creating a new recipe
 * 
 * This schema validates the form input for creating a recipe.
 * Note: totalCost is calculated server-side/client-side, not from form input.
 */
export const createRecipeSchema = z.object({
  name: z
    .string({
      required_error: "Recipe name is required",
      invalid_type_error: "Recipe name must be a string",
    })
    .min(1, "Recipe name is required")
    .max(100, "Recipe name must be less than 100 characters")
    .trim(),
  
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  
  items: z
    .array(recipeItemSchema)
    .min(1, "Recipe must have at least one ingredient")
    .refine(
      (items) => items.every((item) => item.ingredientId && item.ingredientId.trim() !== ""),
      {
        message: "All ingredients must have a valid ingredient selected",
      }
    )
    .refine(
      (items) => items.every((item) => item.usedQuantity && item.usedQuantity > 0),
      {
        message: "All ingredients must have a quantity greater than 0",
      }
    ),
  
  servings: z
    .number({
      required_error: "Number of servings is required",
      invalid_type_error: "Servings must be a number",
    })
    .int("Servings must be a whole number")
    .positive("Servings must be greater than 0")
    .finite("Servings must be a valid number"),
  
  salePrice: z
    .number({
      invalid_type_error: "Sale price must be a number",
    })
    .nonnegative("Sale price cannot be negative")
    .finite("Sale price must be a valid number")
    .optional()
    .or(z.null()),
  
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

// ============================================================================
// UPDATE RECIPE SCHEMA
// ============================================================================

/**
 * Schema for updating an existing recipe
 * All fields are optional except id
 */
export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Type inference for create recipe form
 */
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

/**
 * Type inference for recipe item form
 */
export type RecipeItemInput = z.infer<typeof recipeItemSchema>;

/**
 * Type inference for update recipe form
 */
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

// ============================================================================
// UNIT TYPE EXPORT (for convenience)
// ============================================================================

/**
 * Unit type for use in components
 */
export type Unit = "kg" | "g" | "l" | "ml" | "pcs";
