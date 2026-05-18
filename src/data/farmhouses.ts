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
};

/**
 * ────────────────────────────────────────────────
 *  HOW TO ADD / EDIT A FARMHOUSE:
 *  1. Add a new entry below following the same shape.
 *  2. Create a folder in /public/farmhouses/<slug>/
 *  3. Add images named 1.jpg, 2.jpg, 3.jpg etc.
 *  4. Set coverImage to the first image (1.jpg).
 *  5. The site will pick it up automatically.
 * ────────────────────────────────────────────────
 */

export const FARMHOUSES: FarmhouseType[] = [
  // ──────────────── CASA DE FAZENDA ────────────────
  {
    id: "casa-defazenda",
    name: "Casa De Fazenda",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A luxurious Portuguese-inspired farmhouse with 3 pools, 10 washrooms, and outdoor dining for up to 40 guests.",
    fullDescription:
      "Casa De Fazenda is a stunning Portuguese-inspired estate that brings European elegance to the heart of Karachi. Featuring 3 bedrooms with attached bathrooms, 2 AC rooms, and 3 swimming pools, this property is built for grand celebrations. The outdoor dining area accommodates up to 40 persons, complemented by an open kitchen, lush green gardens, and a spacious cricket ground. With 10 washrooms, 2 sitting rooms, and a kids play area, it delivers a premium hospitality experience for weddings, corporate gatherings, and milestone celebrations.",
    pricePerNight: 35000,
    weekendSurcharge: 8000,
    maxGuests: 40,
    bedrooms: 3,
    bathrooms: 10,
    amenities: [
      "3 Swimming Pools",
      "Outdoor Dining (40 Persons)",
      "Open Kitchen",
      "2 Sitting Rooms",
      "Kids Play Area",
      "Indoor Games",
      "Cricket Ground",
      "Lush Green Garden",
      "Air Conditioning",
      "Car Parking",
      "Generator Backup",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/casa-defazenda/1.jpg",
    images: [
      "/farmhouses/casa-defazenda/1.jpg",
      "/farmhouses/casa-defazenda/2.jpg",
      "/farmhouses/casa-defazenda/3.jpg",
      "/farmhouses/casa-defazenda/4.jpg",
      "/farmhouses/casa-defazenda/5.jpg",
    ],
    available: true,
  },

  // ──────────────── GREEN PARADISE RESORT ────────────────
  {
    id: "green-paradise",
    name: "Green Paradise Resort",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A lush green resort with tropical landscaping, multiple pools, and premium outdoor dining areas for unforgettable events.",
    fullDescription:
      "Green Paradise Resort is a well-maintained resort featuring tropical landscaping, crystal-clear swimming pools, and shaded cabana areas. The resort features multiple event zones that can be configured for intimate family gatherings or large-scale celebrations. With dedicated BBQ stations, outdoor dining pavilions, and mood lighting throughout, every evening here feels magical. The resort also provides professional catering and event coordination services.",
    pricePerNight: 40000,
    weekendSurcharge: 10000,
    maxGuests: 30,
    bedrooms: 8,
    bathrooms: 6,
    amenities: [
      "Swimming Pool",
      "BBQ Area",
      "Outdoor Dining Pavilion",
      "Generator Backup",
      "Car Parking",
      "Air Conditioning",
      "Catering Available",
      "Security Personnel",
      "Mood Lighting",
      "Cabana Seating",
      "Kids Play Area",
    ],
    coverImage: "/farmhouses/green-paradise/1.jpg",
    images: [
      "/farmhouses/green-paradise/1.jpg",
      "/farmhouses/green-paradise/2.jpg",
      "/farmhouses/green-paradise/3.jpg",
      "/farmhouses/green-paradise/4.jpg",
      "/farmhouses/green-paradise/5.jpg",
    ],
    available: true,
  },

  // ──────────────── HAFIZ FARM HOUSE ────────────────
  {
    id: "hafiz-farmhouse",
    name: "Hafiz Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A spacious family-friendly farmhouse with modern amenities, large lawns, and comfortable indoor-outdoor living spaces.",
    fullDescription:
      "Hafiz Farm House offers a great balance of modern facilities and a welcoming environment. The property features generously sized bedrooms, a well-equipped kitchen, and expansive outdoor lawns ideal for family gatherings, birthday parties, and weekend picnics. The farmhouse is designed for comfort with air-conditioned rooms, a covered patio area, and beautifully maintained gardens. Its convenient location makes it a popular choice for day events and overnight stays alike.",
    pricePerNight: 22000,
    weekendSurcharge: 4000,
    maxGuests: 18,
    bedrooms: 4,
    bathrooms: 3,
    amenities: [
      "Large Lawn",
      "BBQ Area",
      "Generator Backup",
      "Car Parking",
      "Air Conditioning",
      "Fully Equipped Kitchen",
      "Covered Patio",
      "Security Personnel",
      "Bonfire Pit",
    ],
    coverImage: "/farmhouses/hafiz-farmhouse/1.jpg",
    images: [
      "/farmhouses/hafiz-farmhouse/1.jpg",
      "/farmhouses/hafiz-farmhouse/2.jpg",
      "/farmhouses/hafiz-farmhouse/3.jpg",
      "/farmhouses/hafiz-farmhouse/4.jpg",
      "/farmhouses/hafiz-farmhouse/5.jpg",
    ],
    available: true,
  },

  // ──────────────── LUMINIOUS FARM HOUSE ────────────────
  {
    id: "luminious",
    name: "Luminious Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A modern farmhouse with 4 bedrooms, a dedicated gaming room, 2 adult pools, and contemporary interiors.",
    fullDescription:
      "Luminious Farm House offers modern facilities and clean, comfortable rooms. The property features 4 bedrooms, 2 AC rooms, a dedicated AC gaming room, and a spacious hall - making it perfect for both relaxation and entertainment. The highlight is its 2 adult swimming pools, complemented by indoor games, a fully equipped kitchen, and round-the-clock security. Luminious is the go-to choice for stylish events, engagement ceremonies, and corporate dinners that demand a wow factor.",
    pricePerNight: 30000,
    weekendSurcharge: 7000,
    maxGuests: 20,
    bedrooms: 4,
    bathrooms: 4,
    amenities: [
      "2 Adult Swimming Pools",
      "AC Gaming Room",
      "1 Hall",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/luminious/1.jpg",
    images: [
      "/farmhouses/luminious/1.jpg",
      "/farmhouses/luminious/2.jpg",
      "/farmhouses/luminious/3.jpg",
      "/farmhouses/luminious/4.jpg",
      "/farmhouses/luminious/5.jpg",
    ],
    available: true,
  },

  // ──────────────── SHUGHAL MELA FARM HOUSE ────────────────
  {
    id: "shughal-mela",
    name: "Shughal Mela Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A festive-themed farmhouse with 3 bedrooms, adult & kids pools, cricket ground, and vibrant entertainment zones.",
    fullDescription:
      "Shughal Mela Farm House is built with celebration in mind. With 'Festival of Fun.' Featuring 3 bedrooms with attached bathrooms, 2 AC rooms, and dedicated pools for both adults and kids, this property delivers joy and comfort in equal measure. The lush green garden, cricket ground, cemented slide, and indoor games keep guests of all ages entertained. Complete with a kitchen, deep freezer, generator backup, and round-the-clock security, it is the ultimate party destination.",
    pricePerNight: 25000,
    weekendSurcharge: 5000,
    maxGuests: 18,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Cemented Slide",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guards",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/shughal-mela/1.jpg",
    images: [
      "/farmhouses/shughal-mela/1.jpg",
      "/farmhouses/shughal-mela/2.jpg",
      "/farmhouses/shughal-mela/3.jpg",
      "/farmhouses/shughal-mela/4.jpg",
      "/farmhouses/shughal-mela/5.jpg",
    ],
    available: true,
  },

  // ──────────────── SUMMER LAND FARM HOUSE ────────────────
  {
    id: "summerland",
    name: "Summer Land Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A sun-kissed farmhouse with 4 rooms, adult & kids pools, a baithak, and beautiful green gardens for summer getaways.",
    fullDescription:
      "Summer Land Farm House is a great option for a summer getaway. Featuring 4 rooms including 2 with AC, a spacious hall, and a traditional baithak, it blends comfort with character. The outdoor area shines with a lush green garden, cricket ground, cemented slide, and dedicated pools for both adults and kids. Indoor games, a fully equipped kitchen, deep freezer, and round-the-clock security make it a hassle-free retreat for pool parties, casual get-togethers, and relaxed family weekends.",
    pricePerNight: 28000,
    weekendSurcharge: 6000,
    maxGuests: 20,
    bedrooms: 4,
    bathrooms: 4,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "1 Hall",
      "Baithak",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Cemented Slide",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/summerland/1.jpg",
    images: [
      "/farmhouses/summerland/1.jpg",
      "/farmhouses/summerland/2.jpg",
      "/farmhouses/summerland/3.jpg",
      "/farmhouses/summerland/4.jpg",
      "/farmhouses/summerland/5.jpg",
    ],
    available: true,
  },

  // ──────────────── AL MUSTAFA FARM HOUSE ────────────────
  {
    id: "mustufa",
    name: "Al Mustafa Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A classic farmhouse with a spacious hall, adult & kids pools, fiber slide, and beautifully maintained green gardens.",
    fullDescription:
      "Al Mustafa Farm House is a classic farmhouse with its warm atmosphere and welcoming spaces. Featuring 2 rooms, a spacious hall, and lush green gardens, it offers a perfect setting for family get-togethers, mehndi celebrations, and weekend picnics. The outdoor area includes adult and kids swimming pools, a fiber slide, cricket ground, and a dedicated kids playing area. With indoor games, a full kitchen, deep freezer, and 24/7 security, every stay is comfortable and hassle-free.",
    pricePerNight: 18000,
    weekendSurcharge: 3000,
    maxGuests: 12,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Fiber Slide",
      "1 Hall",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/mustufa/1.jpg",
    images: [
      "/farmhouses/mustufa/1.jpg",
      "/farmhouses/mustufa/2.jpg",
      "/farmhouses/mustufa/3.jpg",
      "/farmhouses/mustufa/4.jpg",
      "/farmhouses/mustufa/5.jpg",
    ],
    available: true,
  },

  // ──────────────── HAPPYLAND FARM HOUSE ────────────────
  {
    id: "happyland",
    name: "HappyLand Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A vibrant farmhouse with 2 AC rooms, a big hall, adult & kids pools with fiber slide, and full entertainment facilities.",
    fullDescription:
      "HappyLand Farm House offers vibrant spaces and family-friendly facilities. Featuring 2 AC rooms, a big hall, and well-maintained washrooms, the indoor spaces are comfortable and inviting. Outside, guests enjoy adult and kids swimming pools with a big fiber slide, lush green gardens, a cricket ground, and a dedicated kids playing area. Indoor games, a full kitchen, deep freezer, and round-the-clock security with a dedicated care-taker ensure every visit is joyful and worry-free.",
    pricePerNight: 20000,
    weekendSurcharge: 5000,
    maxGuests: 15,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Big Fiber Slide",
      "1 Big Hall",
      "Air Conditioning",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/happyland/1.jpg",
    images: [
      "/farmhouses/happyland/1.jpg",
      "/farmhouses/happyland/2.jpg",
      "/farmhouses/happyland/3.jpg",
      "/farmhouses/happyland/4.jpg",
      "/farmhouses/happyland/5.jpg",
    ],
    available: true,
  },

  // ──────────────── LAVISH FARM HOUSE ────────────────
  {
    id: "lavish",
    name: "Lavish Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A premium farmhouse with 3 bedrooms, AC rooms, adult & kids pools, and a lush green garden with cricket ground.",
    fullDescription:
      "Lavish Farm House offers a premium getaway with 3 bedrooms with attached bathrooms, 2 AC rooms, and a comfortable baithak. The property features separate pools for adults and kids, a cemented slide, and a spacious lush green garden perfect for outdoor activities. With a cricket ground, kids playing area, indoor games, and a fully equipped kitchen, guests of all ages stay entertained. Generator backup, deep freezer, car parking, and round-the-clock security with a care-taker ensure a worry-free experience.",
    pricePerNight: 25000,
    weekendSurcharge: 5000,
    maxGuests: 15,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Cemented Slide",
      "Baithak",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/lavish/1.jpg",
    images: [
      "/farmhouses/lavish/1.jpg",
    ],
    available: true,
  },

  // ──────────────── GHAZI FARM HOUSE ────────────────
  {
    id: "ghazi",
    name: "Ghazi Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A spacious 4-bedroom farmhouse with adult pool, kids pool with slide, cricket ground, and full entertainment facilities.",
    fullDescription:
      "Ghazi Farm House is a spacious and well-equipped property featuring 4 bedrooms, 2 AC rooms, and generous outdoor areas. The highlight is the adult swimming pool paired with a kids pool that includes a water slide - perfect for family fun. A dedicated cricket ground, kids playing area, cemented slide, and indoor games ensure non-stop entertainment. The property comes fully equipped with a kitchen, deep freezer, generator backup, and 24/7 security with a care-taker on site.",
    pricePerNight: 22000,
    weekendSurcharge: 4000,
    maxGuests: 18,
    bedrooms: 4,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool with Slide",
      "Cemented Slide",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guards",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/ghazi/1.jpg",
    images: [
      "/farmhouses/ghazi/1.jpg",
      "/farmhouses/ghazi/2.jpg",
      "/farmhouses/ghazi/3.jpg",
      "/farmhouses/ghazi/4.jpg",
      "/farmhouses/ghazi/5.jpg",
    ],
    available: true,
  },

  // ──────────────── SARDAR FARM HOUSE ────────────────
  {
    id: "sardar",
    name: "Sardar Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "An affordable farmhouse with a hall, adult & kids pools, fiber slide, and lush green gardens - ideal for budget-friendly getaways.",
    fullDescription:
      "Sardar Farm House offers an excellent value-for-money farmhouse experience. Featuring 2 rooms, a spacious hall, and washrooms, it provides a comfortable base for family gatherings and casual celebrations. The outdoor area is where it shines - with an adult swimming pool, kids pool, fiber slide, and a lush green garden with a dedicated kids playing area and cricket ground. Indoor games, a kitchen, deep freezer, generator backup, and round-the-clock security make it a complete package at an affordable price.",
    pricePerNight: 15000,
    weekendSurcharge: 3000,
    maxGuests: 12,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Fiber Slide",
      "1 Hall",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/sardar/1.jpg",
    images: [
      "/farmhouses/sardar/1.jpg",
    ],
    available: true,
  },

  // ──────────────── SUMMER LAND 2 FARM HOUSE ────────────────
  {
    id: "summerland-2",
    name: "Summer Land 2 Farm House",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A companion property to Summer Land, featuring 3 rooms, a big fiber slide, adult & kids pools, and a sprawling green garden.",
    fullDescription:
      "Summer Land 2 is the companion property to the popular Summer Land farmhouse, offering its own unique charm. With 3 rooms including 2 with AC, a spacious hall, and dedicated washrooms, the indoor spaces are comfortable and modern. Outside, guests enjoy an adult swimming pool, kids pool, a big fiber slide, lush green garden, cricket ground, and a dedicated kids playing area. Fully equipped with indoor games, a kitchen, deep freezer, generator backup, and 24/7 security, it is perfect for groups looking for a relaxed weekend escape.",
    pricePerNight: 22000,
    weekendSurcharge: 4000,
    maxGuests: 15,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Big Fiber Slide",
      "1 Hall",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/summerland-2/1.jpg",
    images: [
      "/farmhouses/summerland-2/1.jpg",
      "/farmhouses/summerland-2/2.jpg",
      "/farmhouses/summerland-2/3.jpg",
      "/farmhouses/summerland-2/4.jpg",
      "/farmhouses/summerland-2/5.jpg",
    ],
    available: true,
  },

  // ──────────────── SHAYAN PHASE 1 ────────────────
  {
    id: "shayan-1",
    name: "Shayan Phase 1",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A well-maintained farmhouse with 3 bedrooms, adult & kids pools, cricket ground, and lush green gardens - ideal for family gatherings.",
    fullDescription:
      "Shayan Phase 1 is the flagship property of the Shayan farmhouses, offering a well-maintained and comfortable retreat for families and groups. Featuring 3 bedrooms with attached bathrooms, 2 AC rooms, and a spacious hall, it provides ample indoor space. Outside, guests enjoy an adult swimming pool, kids pool with slide, lush green gardens, a cricket ground, and a dedicated kids playing area. The property comes fully equipped with a kitchen, deep freezer, generator backup, and 24/7 security with a care-taker on site.",
    pricePerNight: 22000,
    weekendSurcharge: 5000,
    maxGuests: 18,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool with Slide",
      "1 Hall",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/shayan-1/1.jpg",
    images: [
      "/farmhouses/shayan-1/1.jpg",
      "/farmhouses/shayan-1/2.jpg",
      "/farmhouses/shayan-1/3.jpg",
      "/farmhouses/shayan-1/4.jpg",
      "/farmhouses/shayan-1/5.jpg",
    ],
    available: true,
  },

  // ──────────────── SHAYAN PHASE 2 ────────────────
  {
    id: "shayan-2",
    name: "Shayan Phase 2",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "The second phase of the Shayan properties, featuring 3 bedrooms, dual pools, a baithak, and enhanced outdoor entertainment areas.",
    fullDescription:
      "Shayan Phase 2 builds on the success of Phase 1, offering an upgraded experience with 3 bedrooms, 2 AC rooms, a spacious hall, and a traditional baithak for relaxed gatherings. The outdoor area features an adult swimming pool, kids pool with a cemented slide, beautifully maintained gardens, and a full-size cricket ground. With indoor games, a fully equipped kitchen, deep freezer, generator backup, and round-the-clock security, it delivers a complete farmhouse experience for weddings, birthday parties, and family weekends.",
    pricePerNight: 25000,
    weekendSurcharge: 5000,
    maxGuests: 20,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Cemented Slide",
      "1 Hall",
      "Baithak",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/shayan-2/1.jpg",
    images: [
      "/farmhouses/shayan-2/1.jpg",
      "/farmhouses/shayan-2/2.jpg",
      "/farmhouses/shayan-2/3.jpg",
      "/farmhouses/shayan-2/4.jpg",
      "/farmhouses/shayan-2/5.jpg",
      "/farmhouses/shayan-2/6.jpg",
    ],
    available: true,
  },

  // ──────────────── HOLIDAY FARMHOUSE ────────────────
  {
    id: "holiday",
    name: "Holiday Farmhouse",
    location: "Karachi, Sindh, Pakistan",
    shortDescription:
      "A complete holiday retreat featuring 3 bedrooms with attached bathrooms, dual pools, a baithak, and a dedicated cricket ground.",
    fullDescription:
      "Holiday Farmhouse is your ultimate destination for a perfect getaway. This beautifully designed property features 3 comfortable bedrooms with attached bathrooms (including 2 AC rooms) and a traditional baithak for gathering. The outdoors offer a lush green garden, adult swimming pool, kids pool, and a cemented slide for endless fun. Sports enthusiasts will love the dedicated cricket ground, kids playing area, and indoor games. Fully equipped with a kitchen, stand-by generator, deep freezer, water dispenser, and filled gas cylinder, we ensure a seamless experience. Round-the-clock security and a dedicated caretaker are on-site to make your stay safe and relaxing.",
    pricePerNight: 24000,
    weekendSurcharge: 5000,
    maxGuests: 20,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Adult Swimming Pool",
      "Kids Pool",
      "Cemented Slide",
      "Baithak",
      "Lush Green Garden",
      "Kids Playing Area",
      "Cricket Ground",
      "Indoor Games",
      "Air Conditioning",
      "Kitchen",
      "Car Parking",
      "Generator Backup",
      "Deep Freezer",
      "Water Dispenser",
      "Security Guard",
      "Care-Taker",
      "Gas Cylinder",
    ],
    coverImage: "/farmhouses/holiday/IMG-20220618-WA0048.jpg",
    images: [
      "/farmhouses/holiday/IMG-20220618-WA0048.jpg",
      "/farmhouses/holiday/IMG-20220618-WA0062.jpg",
      "/farmhouses/holiday/IMG-20220618-WA0066.jpg",
      "/farmhouses/holiday/IMG-20220618-WA0068.jpg",
      "/farmhouses/holiday/IMG-20220618-WA0072.jpg",
    ],
    available: true,
  },
];

export const FARMHOUSE_IDS = FARMHOUSES.map((f) => f.id) as [string, ...string[]];
