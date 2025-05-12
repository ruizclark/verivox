// lib/utils.ts

// Importing necessary libraries for utility functions
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function takes a variable number of class names and merges them into a single string.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
