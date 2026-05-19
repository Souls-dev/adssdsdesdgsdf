// Seed script: reads local JSON files and inserts into Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey.includes('TODO')) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  console.error('Current SUPABASE_SERVICE_ROLE_KEY:', supabaseKey?.substring(0, 20) + '...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedFarmhouses() {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'farmhouses.json'), 'utf-8');
  const farmhouses = JSON.parse(raw);

  // Transform camelCase to snake_case for DB columns
  const rows = farmhouses.map(f => ({
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
  }));

  const { data, error } = await supabase.from('farmhouses').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Failed to seed farmhouses:', error);
  } else {
    console.log(`✅ Seeded ${rows.length} farmhouses`);
  }
}

async function seedSettings() {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'site-settings.json'), 'utf-8');
  const settings = JSON.parse(raw);

  const { error } = await supabase.from('site_settings').upsert({
    id: 'default',
    data: settings,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to seed settings:', error);
  } else {
    console.log('✅ Seeded site_settings');
  }
}

async function main() {
  console.log('Seeding Supabase...');
  await seedFarmhouses();
  await seedSettings();
  console.log('Done!');
}

main();
