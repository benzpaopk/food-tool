/**
 * Core Domain Models for Food Cost Calculator
 * 
 * This file contains all the fundamental types and interfaces used throughout
 * the application for managing ingredients, recipes, and cost calculations.
 */

// ============================================================================
// UNIT SYSTEM
// ============================================================================

/**
 * Unit categories for measurement types
 */
export type UnitType = "weight" | "volume" | "quantity";

/**
 * Weight units (metric system)
 */
export type WeightUnit = "kg" | "g";

/**
 * Volume units (metric system)
 */
export type VolumeUnit = "l" | "ml";

/**
 * Quantity units (count-based)
 */
export type QuantityUnit = "pcs";

/**
 * Union type of all possible measurement units
 */
export type Unit = WeightUnit | VolumeUnit | QuantityUnit;

/**
 * Unit metadata for display and conversion purposes
 */
export interface UnitMetadata {
  /** The unit value (e.g., 'kg', 'ml', 'pcs') */
  unit: Unit;
  /** The category this unit belongs to */
  type: UnitType;
  /** Display label for the unit */
  label: string;
  /** Conversion factor to base unit (e.g., g -> kg = 0.001) */
  conversionFactor: number;
}

/**
 * Helper function to get unit metadata
 * Returns metadata for a given unit including its type and conversion factors
 */
export function getUnitMetadata(unit: Unit): UnitMetadata {
  const metadataMap: Record<Unit, UnitMetadata> = {
    // Weight units
    kg: {
      unit: "kg",
      type: "weight",
      label: "Kilogram",
      conversionFactor: 1,
    },
    g: {
      unit: "g",
      type: "weight",
      label: "Gram",
      conversionFactor: 0.001,
    },
    // Volume units
    l: {
      unit: "l",
      type: "volume",
      label: "Liter",
      conversionFactor: 1,
    },
    ml: {
      unit: "ml",
      type: "volume",
      label: "Milliliter",
      conversionFactor: 0.001,
    },
    // Quantity units
    pcs: {
      unit: "pcs",
      type: "quantity",
      label: "Pieces",
      conversionFactor: 1,
    },
  };

  return metadataMap[unit];
}

/**
 * Determines the unit type category for a given unit
 */
export function getUnitType(unit: Unit): UnitType {
  return getUnitMetadata(unit).type;
}

// ============================================================================
// INGREDIENT
// ============================================================================

/**
 * Ingredient category for organization and filtering
 */
export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "grain"
  | "spice"
  | "oil"
  | "beverage"
  | "other";

/**
 * Core ingredient model representing a purchasable food item
 * 
 * @property id - Unique identifier for the ingredient
 * @property name - Display name of the ingredient
 * @property category - Category for organization and filtering
 * @property pricePerUnit - Purchase price per unit (in the purchase unit)
 * @property purchaseUnit - Unit in which the ingredient is purchased
 * @property purchaseQuantity - Quantity purchased (used for calculating unit price)
 * @property yieldPercentage - Percentage of usable product after cleaning/prep (0-100)
 *                                Example: 80% means 20% is lost during prep
 * @property notes - Optional notes about the ingredient
 */
export interface Ingredient {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category for organization */
  category: IngredientCategory;
  /** Purchase price per unit (in purchaseUnit) */
  pricePerUnit: number;
  /** Unit in which ingredient is purchased */
  purchaseUnit: Unit;
  /** Quantity purchased (for reference, helps calculate effective unit price) */
  purchaseQuantity: number;
  /**
   * Yield percentage (0-100)
   * 
   * Represents the percentage of the purchased quantity that remains
   * usable after cleaning, trimming, and preparation.
   * 
   * Examples:
   * - 100%: No waste (e.g., packaged items)
   * - 80%: 20% waste (e.g., vegetables with peels/stems)
   * - 60%: 40% waste (e.g., whole fish that needs filleting)
   * 
   * This is crucial for accurate cost calculations.
   */
  yieldPercentage: number;
  /** Optional notes or additional information */
  notes?: string;
  /** Timestamp when ingredient was created */
  createdAt: Date;
  /** Timestamp when ingredient was last updated */
  updatedAt: Date;
}

/**
 * Calculates the effective cost per unit after accounting for yield loss
 * 
 * @param ingredient - The ingredient to calculate for
 * @param targetUnit - The unit to calculate cost for (must be compatible type)
 * @returns Effective cost per unit in target unit, accounting for yield
 * 
 * Example:
 * - Purchase: 1kg at $10 (pricePerUnit = $10/kg)
 * - Yield: 80%
 * - Effective cost: $10 / 0.8 = $12.50 per usable kg
 */
export function getEffectiveCostPerUnit(
  ingredient: Ingredient,
  targetUnit: Unit
): number {
  const purchaseMetadata = getUnitMetadata(ingredient.purchaseUnit);
  const targetMetadata = getUnitMetadata(targetUnit);

  // Can only convert within the same unit type
  if (purchaseMetadata.type !== targetMetadata.type) {
    throw new Error(
      `Cannot convert between ${purchaseMetadata.type} and ${targetMetadata.type}`
    );
  }

  // Convert purchase price to target unit
  const conversionFactor =
    purchaseMetadata.conversionFactor / targetMetadata.conversionFactor;
  const priceInTargetUnit = ingredient.pricePerUnit * conversionFactor;

  // Account for yield loss
  const effectiveCost = priceInTargetUnit / (ingredient.yieldPercentage / 100);

  return effectiveCost;
}

// ============================================================================
// RECIPE ITEM
// ============================================================================

/**
 * Links an Ingredient to a Recipe with usage information
 * 
 * Represents one ingredient used in a recipe, specifying:
 * - Which ingredient is used
 * - How much is used (quantity and unit)
 * 
 * @property id - Unique identifier for this recipe item
 * @property ingredientId - Reference to the ingredient being used
 * @property ingredient - Optional full ingredient object (for convenience)
 * @property usedQuantity - Amount of ingredient used in the recipe
 * @property usedUnit - Unit of measurement for the used quantity
 * @property notes - Optional notes about this specific usage
 */
export interface RecipeItem {
  /** Unique identifier */
  id: string;
  /** Reference to the ingredient */
  ingredientId: string;
  /** Optional full ingredient object (populated when needed) */
  ingredient?: Ingredient;
  /** Quantity of ingredient used in the recipe */
  usedQuantity: number;
  /** Unit of measurement for usedQuantity */
  usedUnit: Unit;
  /** Optional notes about this item's usage in the recipe */
  notes?: string;
}

/**
 * Calculates the cost of a recipe item based on ingredient pricing and yield
 * 
 * @param recipeItem - The recipe item to calculate cost for
 * @param ingredient - The full ingredient object (must be provided)
 * @returns Cost of this recipe item in the recipe
 */
export function calculateRecipeItemCost(
  recipeItem: RecipeItem,
  ingredient: Ingredient
): number {
  const effectiveCostPerUnit = getEffectiveCostPerUnit(
    ingredient,
    recipeItem.usedUnit
  );

  return effectiveCostPerUnit * recipeItem.usedQuantity;
}

// ============================================================================
// RECIPE
// ============================================================================

/**
 * Recipe model representing a complete dish or menu item
 * 
 * @property id - Unique identifier
 * @property name - Display name of the recipe
 * @property description - Optional description of the recipe
 * @property items - List of ingredients used in this recipe
 * @property totalCost - Total food cost for this recipe (calculated)
 * @property salePrice - Selling price of the finished dish
 * @property foodCostPercentage - Food cost as percentage of sale price (calculated)
 * @property servings - Number of servings this recipe produces
 * @property notes - Optional notes about the recipe
 */
export interface Recipe {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Optional description */
  description?: string;
  /** List of ingredients used in this recipe */
  items: RecipeItem[];
  /**
   * Total food cost for this recipe
   * 
   * Calculated as the sum of all recipe item costs.
   * This should be recalculated whenever items or ingredient prices change.
   */
  totalCost: number;
  /**
   * Selling price of the finished dish
   * Used to calculate food cost percentage and profitability
   */
  salePrice: number;
  /**
   * Food cost percentage (0-100)
   * 
   * Calculated as: (totalCost / salePrice) * 100
   * 
   * Industry standards:
   * - 28-35%: Ideal range for most restaurants
   * - < 25%: Very low (may indicate pricing issues)
   * - > 40%: High (may need price adjustment or cost reduction)
   */
  foodCostPercentage: number;
  /**
   * Number of servings this recipe produces
   * Used for per-serving cost calculations
   */
  servings: number;
  /** Optional notes about the recipe */
  notes?: string;
  /** Timestamp when recipe was created */
  createdAt: Date;
  /** Timestamp when recipe was last updated */
  updatedAt: Date;
}

/**
 * Calculates the total cost of a recipe based on its items
 * 
 * @param recipe - The recipe to calculate cost for
 * @param ingredientsMap - Map of ingredientId -> Ingredient for lookup
 * @returns Total cost of the recipe
 */
export function calculateRecipeTotalCost(
  recipe: Recipe,
  ingredientsMap: Map<string, Ingredient>
): number {
  return recipe.items.reduce((total, item) => {
    const ingredient = ingredientsMap.get(item.ingredientId);
    if (!ingredient) {
      console.warn(`Ingredient ${item.ingredientId} not found for recipe item ${item.id}`);
      return total;
    }
    return total + calculateRecipeItemCost(item, ingredient);
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
  if (salePrice === 0) return 0;
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
  if (servings === 0) return 0;
  return totalCost / servings;
}

// ============================================================================
// TYPE GUARDS & VALIDATORS
// ============================================================================

/**
 * Type guard to check if a unit is a weight unit
 */
export function isWeightUnit(unit: Unit): unit is WeightUnit {
  return unit === "kg" || unit === "g";
}

/**
 * Type guard to check if a unit is a volume unit
 */
export function isVolumeUnit(unit: Unit): unit is VolumeUnit {
  return unit === "l" || unit === "ml";
}

/**
 * Type guard to check if a unit is a quantity unit
 */
export function isQuantityUnit(unit: Unit): unit is QuantityUnit {
  return unit === "pcs";
}

/**
 * Validates that two units are compatible (same type)
 */
export function areUnitsCompatible(unit1: Unit, unit2: Unit): boolean {
  return getUnitType(unit1) === getUnitType(unit2);
}

