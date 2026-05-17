# Al Jannat Farmhouse — Website

Premium farmhouse rental website for Al Jannat, Pakistan's finest farmhouse booking experience.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Validation:** Zod v4
- **Notifications:** react-hot-toast
- **Icons:** lucide-react
- **Fonts:** Playfair Display + Inter (via next/font)
- **Deployment:** Vercel

---

## Local Development Setup

### 1. Install dependencies

```bash
cd al-jannat
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in the values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
SUPABASE_URL=https://ebcpihqssnufdtdiyold.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Dashboard → Settings → API → service_role key>
BOOKINGS_API_KEY=<any secure random string — this is the key the agency uses>
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Add a New Farmhouse

1. Open `src/data/farmhouses.ts`
2. Add a new entry to the `FARMHOUSES` array following the existing format
3. Create a folder: `public/farmhouses/<your-slug>/`
4. Add images named `1.jpg`, `2.jpg`, `3.jpg`, etc.
5. Set `coverImage` to the first image path
6. The site rebuilds and picks up the new farmhouse automatically

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Al Jannat deployment"
git push origin main
```

### Step 2: Import in Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework preset: **Next.js** (auto-detected)

### Step 3: Set Environment Variables

In Vercel → Project Settings → Environment Variables, add these **3 variables**:

| Variable                    | Where to Find It                                           |
|-----------------------------|------------------------------------------------------------|
| `SUPABASE_URL`              | Supabase Dashboard → Settings → API → Project URL         |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key  |
| `BOOKINGS_API_KEY`          | Generate any secure random string (32+ characters)         |

> ⚠️ **IMPORTANT:** None of these should have the `NEXT_PUBLIC_` prefix. They are server-side only.

### Step 4: Deploy

Click **Deploy**. Vercel will build and deploy automatically.

---

## What to Send the Agency

After deployment, send the agency team these two things:

1. **API Endpoint URL:** `https://your-vercel-domain.vercel.app/api/bookings`
2. **API Key:** The `BOOKINGS_API_KEY` value you set in Vercel env variables

They will use these to fetch booking inquiries from their management app. See `API_DOCS.md` for full API documentation.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── booking/route.ts      # POST — submit booking
│   │   └── bookings/route.ts     # GET — list bookings (API key required)
│   ├── globals.css               # Design system tokens
│   ├── layout.tsx                # Root layout with fonts & toaster
│   └── page.tsx                  # Main page (all sections)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFAB.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── PackagesSection.tsx
│       ├── ServicesSection.tsx
│       ├── AboutSection.tsx
│       └── ContactSection.tsx
├── data/
│   └── farmhouses.ts             # All farmhouse listings
├── lib/
│   ├── rateLimit.ts              # In-memory rate limiter
│   ├── schemas.ts                # Zod validation schemas
│   └── supabase.ts               # Server-side Supabase client
└── middleware.ts                  # CORS for API routes
```

---

## TODO Before Go-Live

Search the codebase for `TODO` to find all placeholder content that needs to be replaced:

- [ ] Replace phone numbers with real contact numbers
- [ ] Replace email addresses with real business email
- [ ] Replace WhatsApp number in FAB and contact section
- [ ] Replace address with real business address
- [ ] Add Google Maps embed code
- [ ] Replace About section text with real company story
- [ ] Replace About section images with real photos
- [ ] Update social media links
- [ ] Add real photos for HappyLand farmhouse
- [ ] Replace hero gradient with real hero image
- [ ] Add real logo image
- [ ] Update stats in About section with real numbers
- [ ] Restrict CORS origin to agency domain in middleware.ts
- [ ] Get SUPABASE_SERVICE_ROLE_KEY from dashboard

```bash
# Find all TODOs
grep -rn "TODO" src/ --include="*.tsx" --include="*.ts"
```
