// lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility to merge Tailwind CSS class names intelligently.
 * Combines clsx and tailwind-merge to dedupe and merge class lists.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
