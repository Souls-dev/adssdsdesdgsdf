import { supabase } from "./supabase";

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

// Map snake_case DB row → camelCase app type
function rowToFarmhouse(row: Record<string, unknown>): FarmhouseData {
  return {
    id: row.id as string,
    name: row.name as string,
    location: row.location as string,
    shortDescription: row.short_description as string,
    fullDescription: row.full_description as string,
    pricePerNight: row.price_per_night as number,
    weekendSurcharge: row.weekend_surcharge as number,
    maxGuests: row.max_guests as number,
    bedrooms: row.bedrooms as number,
    bathrooms: row.bathrooms as number,
    amenities: row.amenities as string[],
    coverImage: row.cover_image as string,
    images: row.images as string[],
    available: row.available as boolean,
    pricingEnabled: row.pricing_enabled as boolean,
  };
}

// Map camelCase app type → snake_case DB row
function farmhouseToRow(f: FarmhouseData) {
  return {
    id: f.id,
    name: f.name,
    location: f.location,
    short_description: f.shortDescription,
    full_description: f.fullDescription,
    price_per_night: f.pricePerNight,
    weekend_surcharge: f.weekendSurcharge,
    max_guests: f.maxGuests,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    amenities: f.amenities,
    cover_image: f.coverImage,
    images: f.images,
    available: f.available,
    pricing_enabled: f.pricingEnabled || false,
  };
}

/** Read all farmhouses from Supabase */
export async function readFarmhouses(): Promise<FarmhouseData[]> {
  const { data, error } = await supabase
    .from("farmhouses")
    .select("*")
    .order("name");
  if (error) {
    console.error("Failed to read farmhouses:", error);
    return [];
  }
  return (data || []).map(rowToFarmhouse);
}

/** Read only available farmhouses (for public display) */
export async function readAvailableFarmhouses(): Promise<FarmhouseData[]> {
  const { data, error } = await supabase
    .from("farmhouses")
    .select("*")
    .eq("available", true)
    .order("name");
  if (error) {
    console.error("Failed to read available farmhouses:", error);
    return [];
  }
  return (data || []).map(rowToFarmhouse);
}

/** Get a single farmhouse by ID */
export async function getFarmhouseById(
  id: string
): Promise<FarmhouseData | undefined> {
  const { data, error } = await supabase
    .from("farmhouses")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return undefined;
  return rowToFarmhouse(data);
}

/** Add a new farmhouse */
export async function addFarmhouse(farmhouse: FarmhouseData): Promise<void> {
  const { error } = await supabase
    .from("farmhouses")
    .insert(farmhouseToRow(farmhouse));
  if (error) {
    if (error.code === "23505") {
      throw new Error(`Farmhouse with id "${farmhouse.id}" already exists`);
    }
    throw new Error(error.message);
  }
}

/** Update an existing farmhouse */
export async function updateFarmhouse(
  id: string,
  updates: Partial<FarmhouseData>
): Promise<FarmhouseData> {
  // Build snake_case updates
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
  if (updates.fullDescription !== undefined) dbUpdates.full_description = updates.fullDescription;
  if (updates.pricePerNight !== undefined) dbUpdates.price_per_night = updates.pricePerNight;
  if (updates.weekendSurcharge !== undefined) dbUpdates.weekend_surcharge = updates.weekendSurcharge;
  if (updates.maxGuests !== undefined) dbUpdates.max_guests = updates.maxGuests;
  if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
  if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
  if (updates.amenities !== undefined) dbUpdates.amenities = updates.amenities;
  if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.available !== undefined) dbUpdates.available = updates.available;
  if (updates.pricingEnabled !== undefined) dbUpdates.pricing_enabled = updates.pricingEnabled;

  const { data, error } = await supabase
    .from("farmhouses")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || `Farmhouse with id "${id}" not found`);
  }
  return rowToFarmhouse(data);
}

/** Delete a farmhouse by ID */
export async function deleteFarmhouse(id: string): Promise<void> {
  const { error, count } = await supabase
    .from("farmhouses")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  // count may be null with service_role, so we don't check
}

/** Generate a slug ID from a name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
