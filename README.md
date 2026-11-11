# Needle Fashion — Luxury Men's Ethnic Wear & Bespoke Atelier

A full-stack luxury e-commerce and bespoke menswear showcase platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, **Node.js / Express**, and **MongoDB**.

> **100% Menswear Atelier** — Exclusively crafted for men's ethnic couture: Imperial Sherwanis, Jodhpur Bandhgalas, Handloom Chanderi & Banarasi Kurtas, Gala Indo-Western Tuxedos, Cashmere Doshalas, and Coronation Regalia.

---

## Architecture Overview

```
Needle-Fashion/
├── frontend/                                    # Next.js 15 (App Router) storefront & admin UI
├── backend/                                     # Express + TypeScript + MongoDB + Socket.IO API
├── needle-fashion-backend.postman_collection.json
└── README.md
```

---

## Key Highlights

### Menswear Showcase & Vintage Heritage Storefront (`frontend/`)
- **Grand Editorial Hero & Vintage Backdrops**: Royal palace, jaali filigree, karigar atelier, and twilight palace backdrops paired with frosted glassmorphism and antique champagne gold (`#C5A059`) accents.
- **Interactive Menswear Showcase** (`frontend/src/components/showcase/`):
  - **Gold Atelier Ticker** (`GoldAtelierTicker.tsx`) — Scrolling navigation marquee linking to showcase sections.
  - **Six Moods Archive** (`NeedleArchiveMoods.tsx`) — Six menswear moods framed inside golden jharokha/temple-arch windows with kalash finials.
  - **Try the Look** (`TryTheLookShowcase.tsx`) — Interactive groom ensemble switcher with an *"In This Look"* piece-by-piece breakdown, bundle privilege pricing, and direct `CartContext` integration.
  - **Pick a Weave** (`PickAWeaveShowcase.tsx`) — Fanned arc of cursor-tilting fabric cards with backdrop typography, wishlist toggle, and quick `+` add-to-bag actions.
  - **Browse the Atelier Rack** (`AtelierRackShowcase.tsx`) — Filterable brass clothing rail where clicking any hanger lifts it into a blurred inspection modal with Front / Craft Detail toggle and chest sizing (`36`–`44` + `48-Pt Bespoke`).
  - **Groom Coronation Edit** (`CoronationCurvedCarousel.tsx`) — 3D curved arch-card carousel with gold-bordered centerpiece selection.
  - **Tailoring, in Motion** (`AtelierMotionReels.tsx`) — 3D curved arc of atelier lookbook reels with playback progress and full-screen story modal.
- **Vintage Royal Footer & Atmospheric Effects**:
  - Vintage heritage footer with palace & jaali textures, 3D flowing silk zari threads (`RoyalFiberCanvas`), verified route ledger, and Private Salon Circle invitation form.
  - Interactive *Shahi Farman* modal, *Replay Darwaza* first-visit intro, and custom gold/silver cursor.
- **Full E-Commerce & Bespoke Tailoring**:
  - Multi-filter product catalog, 48-point custom measurement capture, persistent shopping cart, multi-step checkout, customer dashboard/wishlist, and real-time support chat.
- **Comprehensive Admin Portal** (`/admin`):
  - Revenue & search/view analytics, product & media manager, order management with GST PDF invoices, bespoke inquiry dossier, expense tracking, themes, and FAQ/chatbot management.

### Backend API & Real-Time Engine (`backend/`)
- **REST API** under `/api/*` for users, products, categories, filters, orders, reviews, FAQs, analytics, expenses, themes, notifications, chat, uploads, and bespoke inquiries.
- **Security**: Helmet headers, express-rate-limit, input sanitization, NoSQL injection prevention, suspicious-activity logging, and JWT access/refresh authentication.
- **Real-Time**: Socket.IO integration for live chat and notifications.
- **GST Invoices**: Automated PDF invoice generation via PDFKit.

---

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Configure MONGODB_URI, JWT secrets, PORT, CORS_ORIGIN
npm run seed           # Optional: seed initial categories, products, and sample data
npm run dev            # Runs Express + Socket.IO server (default http://localhost:5000)
```

### 2. Frontend
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev            # Runs Next.js dev server (default http://localhost:3000)
```

---

## Documentation
- [Frontend Documentation](frontend/README.md)
- [Frontend Components Guide](frontend/src/components/README.md)
- [Backend Documentation](backend/README.md)

## License
ISC License.
