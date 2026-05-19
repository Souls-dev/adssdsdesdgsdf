// This module re-exports farmhouse data from the JSON file.
// The JSON file is the single source of truth, managed by the Admin Panel.
// This wrapper exists for backward compatibility with existing imports.

import farmhouseData from "./farmhouses.json";

export type FarmhouseType = {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  pricePerNight: number;
  weekendSurcharge: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  coverImage: string;
  images: string[];
  available: boolean;
  pricingEnabled?: boolean;
};

export const FARMHOUSES: FarmhouseType[] = farmhouseData as FarmhouseType[];

export const FARMHOUSE_IDS = FARMHOUSES.map((f) => f.id) as [string, ...string[]];
