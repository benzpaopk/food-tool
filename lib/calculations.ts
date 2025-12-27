/**
 * Calculation Utilities
 * 
 * Pure functions for performing food cost calculations including
 * unit conversions, ingredient cost calculations with yield percentage,
 * and recipe cost aggregations.
 */

import type { Unit, Ingredient, RecipeItem } from "@/types";
import { getUnitMetadata, getUnitType, areUnitsCompatible } from "@/types";

// ============================================================================
// UNIT CONVERSION
// ============================================================================

/**
 * Converts a quantity from one unit to another compatible unit
 * 
 * @param quantity - The quantity to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit (must be compatible with fromUnit)
 * @returns The converted quantity
 * @throws Error if units are not compatible (different unit types)
 * 
 * @example
 * ```ts
 * unitConversion(1000, 'g', 'kg') // Returns 1
 * unitConversion(2, 'l', 'ml') // Returns 2000
 * unitConversion(5, 'kg', 'ml') // Throws error (incompatible types)
 * ```
 */
export function unitConversion(
  quantity: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  // Check if units are compatible (same type)
  if (!areUnitsCompatible(fromUnit, toUnit)) {
    throw new Error(
      `Cannot convert between incompatible units: ${fromUnit} (${getUnitType(fromUnit)}) and ${toUnit} (${getUnitType(toUnit)})`
    );
  }

  // If same unit, no conversion needed
  if (fromUnit === toUnit) {
    return quantity;
  }

  // Get conversion factors
  const fromMetadata = getUnitMetadata(fromUnit);
  const toMetadata = getUnitMetadata(toUnit);

  // Convert to base unit first, then to target unit
  // Base unit has conversionFactor = 1
  const quantityInBaseUnit = quantity * fromMetadata.conversionFactor;
  const convertedQuantity = quantityInBaseUnit / toMetadata.conversionFactor;

  return convertedQuantity;
}

/**
 * Normalizes a quantity to its base unit (kg for weight, l for volume, pcs for quantity)
 * 
 * @param quantity - The quantity to normalize
 * @param unit - The unit of the quantity
 * @returns The quantity in base unit
 * 
 * @example
 * ```ts
 * normalizeToBaseUnit(1000, 'g') // Returns 1 (kg)
 * normalizeToBaseUnit(500, 'ml') // Returns 0.5 (l)
 * ```
 */
export function normalizeToBaseUnit(quantity: number, unit: Unit): number {
  const metadata = getUnitMetadata(unit);
  return quantity * metadata.conversionFactor;
}

/**
 * Converts a quantity from base unit to target unit
 * 
 * @param quantityInBaseUnit - The quantity in base unit
 * @param toUnit - The target unit
 * @returns The quantity in target unit
 * 
 * @example
 * ```ts
 * fromBaseUnit(1, 'g') // Returns 1000 (1 kg = 1000 g)
 * fromBaseUnit(0.5, 'ml') // Returns 500 (0.5 l = 500 ml)
 * ```
 */
export function fromBaseUnit(quantityInBaseUnit: number, toUnit: Unit): number {
  const metadata = getUnitMetadata(toUnit);
  return quantityInBaseUnit / metadata.conversionFactor;
}

// ============================================================================
// INGREDIENT COST CALCULATION
// ============================================================================

/**
 * Parameters for calculating ingredient cost
 */
export interface CalculateIngredientCostParams {
  /** Purchase price per unit (in purchaseUnit) */
  pricePerUnit: number;
  /** Quantity purchased */
  purchaseQuantity: number;
  /** Unit in which ingredient was purchased */
  purchaseUnit: Unit;
  /** Yield percentage (0-100) - percentage usable after prep */
  yieldPercentage: number;
  /** Quantity used in recipe */
  usedQuantity: number;
  /** Unit of the used quantity */
  usedUnit: Unit;
}

/**
 * Calculates the cost of an ingredient used in a recipe
 * 
 * This function accounts for:
 * - Unit conversion between purchase unit and used unit
 * - Yield percentage (waste during preparation)
 * 
 * Formula: (Price / (PurchaseQuantity * Yield%)) * UsedQuantity
 * All quantities are normalized to base units for accurate calculation.
 * 
 * @param params - Calculation parameters
 * @returns The cost of the ingredient used
 * 
 * @example
 * ```ts
 * // Example: Chicken breast
 * // Purchase: 1kg at 200 THB, Yield: 80%
 * // Used: 500g in recipe
 * calculateIngredientCost({
 *   pricePerUnit: 200,      // 200 THB per kg
 *   purchaseQuantity: 1,     // 1 kg purchased
 *   purchaseUnit: 'kg',
 *   yieldPercentage: 80,    // 80% usable
 *   usedQuantity: 500,       // 500g used
 *   usedUnit: 'g'
 * })
 * // Returns: 125 THB
 * // Calculation: (200 / (1 * 0.8)) * 0.5 = 250 * 0.5 = 125
 * ```
 */
export function calculateIngredientCost(
  params: CalculateIngredientCostParams
): number {
  const {
    pricePerUnit,
    purchaseQuantity,
    purchaseUnit,
    yieldPercentage,
    usedQuantity,
    usedUnit,
  } = params;

  // Validate yield percentage
  if (yieldPercentage <= 0 || yieldPercentage > 100) {
    throw new Error(
      `Yield percentage must be between 0 and 100, got ${yieldPercentage}`
    );
  }

  // Validate quantities
  if (purchaseQuantity <= 0 || usedQuantity <= 0) {
    throw new Error("Quantities must be greater than 0");
  }

  // Validate price
  if (pricePerUnit < 0) {
    throw new Error("Price cannot be negative");
  }

  // Check unit compatibility
  if (!areUnitsCompatible(purchaseUnit, usedUnit)) {
    throw new Error(
      `Purchase unit (${purchaseUnit}) and used unit (${usedUnit}) must be compatible`
    );
  }

  // Normalize all quantities to base units for calculation
  const purchaseQuantityBase = normalizeToBaseUnit(
    purchaseQuantity,
    purchaseUnit
  );
  const usedQuantityBase = normalizeToBaseUnit(usedQuantity, usedUnit);

  // Calculate effective usable quantity after yield loss
  // Yield percentage is converted to decimal (e.g., 80% = 0.8)
  const yieldDecimal = yieldPercentage / 100;
  const usableQuantity = purchaseQuantityBase * yieldDecimal;

  // Calculate cost per base unit (accounting for yield)
  // This gives us the effective cost per usable unit
  const costPerBaseUnit = pricePerUnit / usableQuantity;

  // Calculate total cost for the used quantity
  const totalCost = costPerBaseUnit * usedQuantityBase;

  return totalCost;
}

/**
 * Calculates ingredient cost using Ingredient and RecipeItem objects
 * 
 * Convenience wrapper around calculateIngredientCost that works with
 * domain objects directly.
 * 
 * @param ingredient - The ingredient object
 * @param recipeItem - The recipe item specifying usage
 * @returns The cost of the ingredient used
 */
export function calculateIngredientCostFromObjects(
  ingredient: Ingredient,
  recipeItem: RecipeItem
): number {
  return calculateIngredientCost({
    pricePerUnit: ingredient.pricePerUnit,
    purchaseQuantity: ingredient.purchaseQuantity,
    purchaseUnit: ingredient.purchaseUnit,
    yieldPercentage: ingredient.yieldPercentage,
    usedQuantity: recipeItem.usedQuantity,
    usedUnit: recipeItem.usedUnit,
  });
}

// ============================================================================
// RECIPE COST CALCULATION
// ============================================================================

/**
 * Calculates the total cost of a recipe
 * 
 * @param recipeItems - Array of recipe items
 * @param ingredientsMap - Map of ingredientId -> Ingredient for lookup
 * @returns Total cost of the recipe
 */
export function calculateRecipeTotalCost(
  recipeItems: RecipeItem[],
  ingredientsMap: Map<string, Ingredient>
): number {
  return recipeItems.reduce((total, item) => {
    const ingredient = ingredientsMap.get(item.ingredientId);
    if (!ingredient) {
      console.warn(
        `Ingredient ${item.ingredientId} not found for recipe item ${item.id}`
      );
      return total;
    }

    const itemCost = calculateIngredientCostFromObjects(ingredient, item);
    return total + itemCost;
  }, 0);
}

/**
 * Calculates food cost percentage
 * 
 * @param totalCost - Total food cost
 * @param salePrice - Selling price
 * @returns Food cost percentage (0-100)
 */
export function calculateFoodCostPercentage(
  totalCost: number,
  salePrice: number
): number {
  if (salePrice === 0) {
    return 0;
  }
  return (totalCost / salePrice) * 100;
}

/**
 * Calculates cost per serving
 * 
 * @param totalCost - Total recipe cost
 * @param servings - Number of servings
 * @returns Cost per serving
 */
export function calculateCostPerServing(
  totalCost: number,
  servings: number
): number {
  if (servings === 0) {
    return 0;
  }
  return totalCost / servings;
}

// ============================================================================
// PROFITABILITY CALCULATIONS
// ============================================================================

/**
 * Calculates gross profit (sale price - food cost)
 * 
 * @param salePrice - Selling price
 * @param foodCost - Food cost
 * @returns Gross profit
 */
export function calculateGrossProfit(salePrice: number, foodCost: number): number {
  return salePrice - foodCost;
}

/**
 * Calculates gross profit margin percentage
 * 
 * @param salePrice - Selling price
 * @param foodCost - Food cost
 * @returns Gross profit margin percentage (0-100)
 */
export function calculateGrossProfitMargin(
  salePrice: number,
  foodCost: number
): number {
  if (salePrice === 0) {
    return 0;
  }
  return ((salePrice - foodCost) / salePrice) * 100;
}

