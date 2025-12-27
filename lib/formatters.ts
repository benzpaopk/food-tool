/**
 * Formatting Utilities
 * 
 * Pure functions for formatting values for display, including currency,
 * numbers, percentages, and units.
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Formats a number as Thai Baht (THB) currency
 * 
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56) // Returns "฿1,234.56"
 * formatCurrency(1234.56, { showSymbol: false }) // Returns "1,234.56"
 * formatCurrency(1234.56, { decimals: 0 }) // Returns "฿1,235"
 * ```
 */
export function formatCurrency(
  amount: number,
  options: {
    /** Show currency symbol (default: true) */
    showSymbol?: boolean;
    /** Number of decimal places (default: 2) */
    decimals?: number;
    /** Use compact notation for large numbers (default: false) */
    compact?: boolean;
  } = {}
): string {
  const {
    showSymbol = true,
    decimals = 2,
    compact = false,
  } = options;

  // Handle NaN and Infinity
  if (!Number.isFinite(amount)) {
    return showSymbol ? "฿—" : "—";
  }

  // Format with locale-specific number formatting
  const formatter = new Intl.NumberFormat("th-TH", {
    style: compact ? "compact" : "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(amount);

  return showSymbol ? `฿${formatted}` : formatted;
}

/**
 * Formats a number as Thai Baht with no decimals (for whole amounts)
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string without decimals
 * 
 * @example
 * ```ts
 * formatCurrencyWhole(1234.56) // Returns "฿1,235"
 * ```
 */
export function formatCurrencyWhole(amount: number): string {
  return formatCurrency(amount, { decimals: 0 });
}

/**
 * Formats a number as Thai Baht with compact notation for large numbers
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string in compact notation
 * 
 * @example
 * ```ts
 * formatCurrencyCompact(1234567) // Returns "฿1.23M"
 * ```
 */
export function formatCurrencyCompact(amount: number): string {
  return formatCurrency(amount, { compact: true, decimals: 2 });
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Formats a number with specified decimal places
 * 
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 * 
 * @example
 * ```ts
 * formatNumber(1234.567, 2) // Returns "1,234.57"
 * formatNumber(1234.567, 0) // Returns "1,235"
 * ```
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number as a percentage
 * 
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 * 
 * @example
 * ```ts
 * formatPercentage(85.5) // Returns "85.5%"
 * formatPercentage(85.567, 2) // Returns "85.57%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) {
    return "—%";
  }

  const formatted = formatNumber(value, decimals);
  return `${formatted}%`;
}

// ============================================================================
// UNIT FORMATTING
// ============================================================================

import type { Unit } from "@/types";
import { getUnitMetadata } from "@/types";

/**
 * Formats a quantity with its unit
 * 
 * @param quantity - The quantity to format
 * @param unit - The unit of measurement
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted quantity string with unit
 * 
 * @example
 * ```ts
 * formatQuantity(1.5, 'kg') // Returns "1.50 kg"
 * formatQuantity(500, 'g') // Returns "500.00 g"
 * formatQuantity(2.5, 'l') // Returns "2.50 l"
 * ```
 */
export function formatQuantity(
  quantity: number,
  unit: Unit,
  decimals: number = 2
): string {
  if (!Number.isFinite(quantity)) {
    return `— ${unit}`;
  }

  const formatted = formatNumber(quantity, decimals);
  const metadata = getUnitMetadata(unit);
  return `${formatted} ${metadata.label}`;
}

/**
 * Formats a quantity with unit abbreviation (short form)
 * 
 * @param quantity - The quantity to format
 * @param unit - The unit of measurement
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted quantity string with unit abbreviation
 * 
 * @example
 * ```ts
 * formatQuantityShort(1.5, 'kg') // Returns "1.50 kg"
 * formatQuantityShort(500, 'g') // Returns "500.00 g"
 * ```
 */
export function formatQuantityShort(
  quantity: number,
  unit: Unit,
  decimals: number = 2
): string {
  if (!Number.isFinite(quantity)) {
    return `— ${unit}`;
  }

  const formatted = formatNumber(quantity, decimals);
  return `${formatted} ${unit}`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Formats a date in Thai locale format
 * 
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 * 
 * @example
 * ```ts
 * formatDate(new Date()) // Returns "15/01/2024"
 * formatDate(new Date(), { includeTime: true }) // Returns "15/01/2024, 14:30"
 * ```
 */
export function formatDate(
  date: Date,
  options: {
    /** Include time in format (default: false) */
    includeTime?: boolean;
    /** Use long date format (default: false) */
    longFormat?: boolean;
  } = {}
): string {
  const { includeTime = false, longFormat = false } = options;

  const formatter = new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: longFormat ? "long" : "2-digit",
    day: "2-digit",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  return formatter.format(date);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Checks if a value is a valid number for calculations
 * 
 * @param value - The value to check
 * @returns True if value is a valid finite number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Safely parses a string to a number
 * 
 * @param value - The string to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export function safeParseNumber(
  value: string,
  defaultValue: number = 0
): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

