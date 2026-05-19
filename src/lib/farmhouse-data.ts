import fs from "fs";
import path from "path";

export type FarmhouseData = {
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

const JSON_PATH = path.join(process.cwd(), "src", "data", "farmhouses.json");

/** Read all farmhouses from disk */
export function readFarmhouses(): FarmhouseData[] {
  try {
    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    return JSON.parse(raw) as FarmhouseData[];
  } catch (err) {
    console.error("Failed to read farmhouses.json:", err);
    return [];
  }
}

/** Write all farmhouses to disk */
export function writeFarmhouses(farmhouses: FarmhouseData[]): void {
  fs.writeFileSync(JSON_PATH, JSON.stringify(farmhouses, null, 2), "utf-8");
}

/** Get a single farmhouse by ID */
export function getFarmhouseById(id: string): FarmhouseData | undefined {
  return readFarmhouses().find((f) => f.id === id);
}

/** Add a new farmhouse */
export function addFarmhouse(farmhouse: FarmhouseData): void {
  const all = readFarmhouses();
  // Ensure no duplicate IDs
  if (all.some((f) => f.id === farmhouse.id)) {
    throw new Error(`Farmhouse with id "${farmhouse.id}" already exists`);
  }
  all.push(farmhouse);
  writeFarmhouses(all);
}

/** Update an existing farmhouse */
export function updateFarmhouse(
  id: string,
  updates: Partial<FarmhouseData>
): FarmhouseData {
  const all = readFarmhouses();
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) {
    throw new Error(`Farmhouse with id "${id}" not found`);
  }
  all[idx] = { ...all[idx], ...updates, id }; // id is immutable
  writeFarmhouses(all);
  return all[idx];
}

/** Delete a farmhouse by ID */
export function deleteFarmhouse(id: string): void {
  const all = readFarmhouses();
  const filtered = all.filter((f) => f.id !== id);
  if (filtered.length === all.length) {
    throw new Error(`Farmhouse with id "${id}" not found`);
  }
  writeFarmhouses(filtered);
}

/** Generate a slug ID from a name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
