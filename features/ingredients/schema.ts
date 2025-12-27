/**
 * Zod validation schemas for Ingredient Management
 */

import { z } from "zod";
import type { IngredientCategory, Unit } from "@/types";

/**
 * Ingredient category enum for Zod validation
 */
const ingredientCategorySchema = z.enum([
  "protein",
  "vegetable",
  "fruit",
  "dairy",
  "grain",
  "spice",
  "oil",
  "beverage",
  "other",
]);

/**
 * Unit enum for Zod validation
 */
const unitSchema = z.enum(["kg", "g", "l", "ml", "pcs"]);

/**
 * Schema for creating a new ingredient
 * 
 * Validates all required fields with appropriate constraints:
 * - No negative numbers
 * - Yield percentage between 0-100
 * - Required fields must be present
 */
export const createIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  
  category: ingredientCategorySchema,
  
  pricePerUnit: z
    .number({
      required_error: "Price per unit is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0")
    .finite("Price must be a valid number"),
  
  purchaseUnit: unitSchema,
  
  purchaseQuantity: z
    .number({
      required_error: "Purchase quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("Purchase quantity must be greater than 0")
    .finite("Quantity must be a valid number"),
  
  yieldPercentage: z
    .number({
      required_error: "Yield percentage is required",
      invalid_type_error: "Yield percentage must be a number",
    })
    .min(0, "Yield percentage cannot be negative")
    .max(100, "Yield percentage cannot exceed 100")
    .finite("Yield percentage must be a valid number"),
  
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

/**
 * Schema for updating an existing ingredient
 * All fields are optional except id
 */
export const updateIngredientSchema = z.object({
  id: z.string().min(1, "ID is required"),
  
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .optional(),
  
  category: ingredientCategorySchema.optional(),
  
  pricePerUnit: z
    .number()
    .positive("Price must be greater than 0")
    .finite("Price must be a valid number")
    .optional(),
  
  purchaseUnit: unitSchema.optional(),
  
  purchaseQuantity: z
    .number()
    .positive("Purchase quantity must be greater than 0")
    .finite("Quantity must be a valid number")
    .optional(),
  
  yieldPercentage: z
    .number()
    .min(0, "Yield percentage cannot be negative")
    .max(100, "Yield percentage cannot exceed 100")
    .finite("Yield percentage must be a valid number")
    .optional(),
  
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

/**
 * Type inference for create ingredient form
 */
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

/**
 * Type inference for update ingredient form
 */
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;

