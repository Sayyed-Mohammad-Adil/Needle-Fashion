# Needle Fashion Frontend

A luxury men's ethnic wear and bespoke couture e-commerce frontend built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **Menswear Vintage Heritage Aesthetic**: Warm cream alabaster & imperial obsidian dark/light themes, antique champagne gold (`#C5A059`), vintage jaali filigree & palace backdrops, and frosted glassmorphism.
- **Interactive Menswear Showcase** (`src/components/showcase/`):
  - `GoldAtelierTicker` — Scrolling gold marquee linking directly to showcase sections.
  - `NeedleArchiveMoods` — *"Six Moods. Timeless Silhouettes."* framed in golden jharokha arches with kalash finials.
  - `TryTheLookShowcase` — Interactive look carousel with *"In This Look"* piece checklist, 10% full-ensemble discount, and direct cart integration.
  - `PickAWeaveShowcase` — Cursor-reactive 3D tilting fanned cards (`ZARDOZI`, `JODHPUR`, `CHANDERI`, `BROCADE`, `KASHMIR`) with quick `+` add-to-bag.
  - `AtelierRackShowcase` — Virtual brass rail with category tabs (`All`, `Sherwanis`, `Bandhgalas`, `Kurtas`, `Regalia`) and lift-off hanger detail modal (Front/Craft Detail toggle & chest size chips `36`–`44` / `48-Pt Bespoke`).
  - `CoronationCurvedCarousel` — 3D curved arch carousel for the Groom Coronation Edit.
  - `AtelierMotionReels` — 3D curved arc of five atelier lookbook reels with gold progress bar and story modal.
- **3D & Heritage Effects** (`src/components/3d/` & `src/components/effects/`):
  - `RoyalFiberCanvas` (`three` / `@react-three/fiber`) for flowing silk zari threads in the vintage footer.
  - `FirstVisitIntro` (*Replay Darwaza*), `ShahiFarmanModal`, `ShahiFarmanTrigger`, and `CustomLuxuryCursor`.
- **Full Storefront & Bespoke Flows**:
  - Product catalog (`/category/[category]`, `/new-arrivals`, `/product/[id]`) with dynamic filters and search.
  - Persistent cart (`CartContext`), 48-point bespoke measurement forms, and multi-step checkout (`/checkout`).
  - Customer portal (`/profile`, `/customer/wishlist`, `/customer/orders`, `/customer/catalog`, `/customer/profile`).
  - Informational & concierge pages (`/about`, `/contact`, `/faq`, `/returns`, `/privacy`, `/terms`).
  - Real-time chat widget (`Socket.IO`) and notification bell.
- **Admin Dashboard** (`/admin/*`):
  - Analytics, product & media manager, categories, inventory, orders, customer dossiers, inquiries, expenses, themes, notifications, and live chat.

## Tech Stack

- **Framework**: Next.js 15.5 (App Router, Turbopack)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS v4, Headless UI, Heroicons, React Icons
- **3D & Motion**: Three.js, `@react-three/fiber`, GSAP
- **Forms & Validation**: React Hook Form, Zod
- **HTTP & Real-Time**: Axios, Socket.IO Client
- **Auth & Notifications**: NextAuth, JWT contexts, React Hot Toast

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_APP_NAME=Needle Fashion
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start Next.js development server with Turbopack
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

## Project Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── about/                   # Karigar lineage & bespoke guide
│   ├── admin/                   # Admin portal (analytics, media, products, orders, inquiries, themes)
│   ├── auth/                    # Login, register, forgot-password
│   ├── cart/                    # Shopping bag
│   ├── category/[category]/     # Filtered menswear category catalog
│   ├── checkout/                # Multi-step checkout
│   ├── contact/                 # Atelier appointment & inquiry form
│   ├── customer/                # Customer profile, orders, wishlist, catalog
│   ├── faq/                     # Atelier FAQ
│   ├── new-arrivals/            # Runway new arrivals
│   ├── product/[id]/            # Product detail with bespoke measurements
│   └── returns/, privacy/, terms/
├── components/
│   ├── 3d/                      # RoyalFiberCanvas (Three.js silk zari threads)
│   ├── admin/                   # Admin forms, analytics, media manager
│   ├── chat/                    # Live chat widget
│   ├── effects/                 # FirstVisitIntro, ShahiFarmanModal, CustomLuxuryCursor
│   ├── layout/                  # Header & Vintage Heritage Footer
│   └── showcase/                # Interactive menswear showcase sections
├── contexts/                    # Auth, Cart, Chat, Notification, Theme contexts
└── lib/                         # API services & TypeScript types
```

## License

ISC License.
