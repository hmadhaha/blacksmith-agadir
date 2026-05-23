import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function imageUrl(image: string | null | undefined): string {
  if (!image) return "";
  if (image.startsWith("data:") || image.startsWith("http")) return image;
  return `/food/${encodeURIComponent(image)}`;
}
