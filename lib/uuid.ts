/**
 * UUID generation utility
 * 
 * Simple UUID v4 generator using crypto.randomUUID() when available,
 * with fallback for older environments.
 */

/**
 * Generates a UUID v4 string
 * 
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js 16+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: Simple UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

