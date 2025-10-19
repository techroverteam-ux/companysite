import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchData(filename: string) {
  try {
    const response = await fetch(`/api/data/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error)
    return null
  }
}