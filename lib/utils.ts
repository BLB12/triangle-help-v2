import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, type: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);

  switch (type) {
    case "HOURLY": return `${formatted}/hr`;
    case "FLAT": return formatted;
    case "STARTING_AT": return `From ${formatted}`;
    default: return formatted;
  }
}

export function formatCategory(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const CATEGORIES = [
  { value: "LAWN_CARE", label: "Lawn & Garden" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "HANDYMAN", label: "Handyman" },
  { value: "PET_CARE", label: "Pet Care" },
  { value: "CHILDCARE", label: "Childcare" },
  { value: "TUTORING", label: "Tutoring" },
  { value: "MOVING", label: "Moving & Hauling" },
  { value: "PAINTING", label: "Painting" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "CARPENTRY", label: "Carpentry" },
  { value: "AUTO", label: "Auto & Vehicles" },
  { value: "TECH_SUPPORT", label: "Tech Support" },
  { value: "PERSONAL_TRAINING", label: "Personal Training" },
  { value: "COOKING", label: "Cooking & Meal Prep" },
  { value: "ERRANDS", label: "Errands & Delivery" },
  { value: "OTHER", label: "Other" },
];
