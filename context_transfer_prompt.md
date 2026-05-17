# Al Jannat Farmhouse Booking Platform — Context Transfer Prompt

> **Purpose**: Paste this into any new AI session to resume work on this project with full context.

---

## 🏗 Project Overview

**Al Jannat** is a premium farmhouse booking platform for Pakistan's most trusted farmhouse booking agency (est. 1994, 32+ years of legacy). The site is a production-grade Next.js application with Supabase backend, featuring 15 luxury farmhouse listings with a professional image carousel, online booking system, and agency branding.

**Live Location**: `D:\Projects\al-jannat` (MUST stay on D: drive — C: has storage limits)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Language | TypeScript |
| Fonts | Playfair Display (headings) + Inter (body) via next/font |
| Icons | Lucide React |
| Images | next/image with optimized WebP/AVIF |
| Default Browser | Firefox |

---

## 📁 Project Structure

```
D:\Projects\al-jannat\
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, metadata
│   │   ├── page.tsx            # Main single-page app (all sections)
│   │   ├── globals.css         # Tailwind + CSS custom properties
│   │   └── api/
│   │       ├── booking/route.ts    # POST booking → Supabase
│   │       └── bookings/route.ts   # GET bookings (admin)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppFAB.tsx         # Floating WhatsApp button
│   │   ├── BookingModal.tsx        # Booking form modal
│   │   ├── ImageCarousel.tsx       # ⭐ Professional Airbnb-style image carousel
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── PackagesSection.tsx # ⭐ 15 farmhouse cards with carousel
│   │       ├── ServicesSection.tsx
│   │       ├── AboutSection.tsx    # Stats: 32+ years, 500+ families, 15 farmhouses
│   │       └── ContactSection.tsx
│   ├── data/
│   │   └── farmhouses.ts          # ⭐ Master data: 15 farmhouses with amenities
│   └── lib/
│       └── supabase.ts            # Supabase client init
├── public/
│   └── farmhouses/                # Image assets per property
│       ├── casa-defazenda/       # 1.jpg–5.jpg (real photos)
│       ├── green-paradise/        # 1.jpg–5.jpg (real photos)
│       ├── hafiz-farmhouse/       # 1.jpg–5.jpg (real photos)
│       ├── luminious/             # 1.jpg–5.jpg (real photos)
│       ├── shughal-mela/          # 1.jpg–5.jpg (real photos)
│       ├── summerland/            # 1.jpg–5.jpg (real photos)
│       ├── mustufa/               # 1.jpg–5.jpg (real photos)
│       ├── happyland/             # 1.jpg (drone photo, needs more)
│       ├── lavish/                # 1.jpg (placeholder, needs photos)
│       ├── ghazi/                 # 1.jpg–5.jpg (real photos)
│       ├── sardar/                # 1.jpg (placeholder, needs photos)
│       ├── summerland-2/          # 1.jpg–5.jpg (real photos)
│       ├── shayan-1/              # 1.jpg–5.jpg (real photos)
│       └── shayan-2/              # 1.jpg–6.jpg (real photos)
├── .env.local                     # Supabase keys (NEVER commit)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🏠 14 Active Farmhouses (farmhouses.ts)

| # | ID | Name | Beds | Baths | MaxGuests | Price/Night | Weekend+ |
|---|-----|------|------|-------|-----------|-------------|----------|
| 1 | casa-de-fazenda | Casa De Fazenda | 3 | 10 | 40 | 35,000 | +8,000 |
| 2 | green-paradise | Green Paradise Resort | 8 | 6 | 30 | 40,000 | +10,000 |
| 3 | hafiz | Hafiz Farm House | 4 | 3 | 18 | 22,000 | +4,000 |
| 4 | luminious | Luminious Farm House | 4 | 4 | 20 | 30,000 | +7,000 |
| 5 | shughal-mela | Shughal Mela Farm House | 3 | 3 | 18 | 25,000 | +5,000 |
| 6 | summerland | Summer Land Farm House | 4 | 4 | 20 | 28,000 | +6,000 |
| 7 | al-mustafa | Al Mustafa Farm House | 2 | 2 | 12 | 18,000 | +3,000 |
| 8 | happyland | HappyLand Farm House | 2 | 2 | 15 | 20,000 | +5,000 |
| 9 | lavish | Lavish Farm House | 3 | 3 | 15 | 25,000 | +5,000 |
| 10 | ghazi | Ghazi Farm House | 4 | 3 | 18 | 22,000 | +4,000 |
| 11 | sardar | Sardar Farm House | 2 | 2 | 12 | 15,000 | +3,000 |
| 12 | summerland-2 | Summer Land 2 Farm House | 3 | 3 | 15 | 22,000 | +4,000 |
| 13 | shayan-1 | Shayan Phase 1 | 3 | 3 | 18 | 22,000 | +5,000 |
| 14 | shayan-2 | Shayan Phase 2 | 3 | 3 | 20 | 25,000 | +5,000 |

**Note**: Shayan 1 and 2 are active. Shayan Phase 3 was identified as the same property as HappyLand Farm House, so Shayan Phase 3 was removed and its 5 real photos were merged into HappyLand.

### Image Status
- **Full photo sets (1-5.jpg or 1-6.jpg)**: Casa De Fazenda, Green Paradise, Hafiz, Luminious, Shughal Mela, Summerland, Al Mustafa, Ghazi, Summerland 2, HappyLand, Shayan Phase 1, Shayan Phase 2
- **Placeholder only**: Lavish, Sardar (client to provide)

---

## ⭐ ImageCarousel Component

**File**: `src/components/ImageCarousel.tsx`

Professional Airbnb-style carousel with:
- **Smooth opacity crossfade** transitions between images
- **Hover-reveal arrow buttons** (left/right, hidden until mouseover)
- **Animated dot indicators** at bottom (active dot stretches wider)
- **Image counter badge** top-left ("1 / 5")
- **Graceful fallback**: If all images fail to load → branded gradient with star icon + "Photo coming soon"
- Used by `PackagesSection.tsx` for every farmhouse card

---

## 🎨 Design System

- **Color palette**: Amber/brown luxury theme
  - Primary: `#b45309` (amber-700)
  - Dark: `#451a03` (amber-950)
  - Light BG: `#fffbeb` (amber-50)
  - Accent: `#fcd34d` (amber-300)
  - Gold text: `#fef3c7`
- **Fonts**: Playfair Display (serif headings) + Inter (body)
- **Cards**: Rounded-2xl, subtle borders, hover lift animation
- **Gradients**: Warm amber-to-green for hero, brown-to-green for fallbacks

---

## 🔐 Backend & Security

- **Supabase Project**: Connected via `.env.local`
- **Database Table**: `bookings` with RLS enabled
- **API Routes**:
  - `POST /api/booking` — Creates booking (validates with Zod, inserts to Supabase)
  - `GET /api/bookings` — Admin endpoint (requires secret key header)
- **WhatsApp Integration**: Floating button links to agency WhatsApp

---

## 📊 Current Build Status

✅ **PASSING** — `npm run build` exits cleanly with code 0
- TypeScript: No errors
- All 14 farmhouses render correctly
- Carousel fully functional
- Dev server: `npm run dev` → `http://localhost:3000`

---

## 📋 Backlog / Next Steps

1. **Lavish Images** — ⏳ Client will send later
2. **Sardar Farm House** — ⚠️ Data came from the `amineti.docx` file the agency sent. User unsure if it's a real listing — needs confirmation from agency. May need to remove if not valid.
3. **Google Maps** — Can embed an iframe in ContactSection. Just need the office address (Hill Park area mentioned in brochure). No special API key needed for basic embed.
4. **Booking API Decision** — ⏳ Agency is testing the current Supabase GET/POST system. If they reject it, they'll provide their own API endpoint. We'd swap the Supabase insert in `src/app/api/booking/route.ts` for a `fetch()` to their URL. Form fields to share with them: `name`, `email`, `phone`, `farmhouseId`, `checkIn`, `checkOut`, `guests`, `message`. The frontend form/validation stays unchanged either way.
5. **Deployment** — Set Vercel env vars + map custom domain

---

## ⚠️ Important Rules

1. **Always work on D: drive** — never move project to C:
2. **Default browser is Firefox**
3. **Keep token usage minimal** — don't dump entire files unless necessary
4. **Build must pass** after every change — always run `npm run build`
5. **Never expose .env.local** keys
