# Frontend Components Guide

This directory houses the modular UI, layout, 3D, heritage effect, and menswear showcase components for the **Needle Fashion** platform.

## Directory Breakdown

### 1. Menswear Showcase (`showcase/`)
Interactive menswear showcase sections integrated into the homepage (`src/app/page.tsx`):
- **`GoldAtelierTicker.tsx`** — Scrolling antique gold marquee with anchor links to each showcase section.
- **`NeedleArchiveMoods.tsx`** — *"Six Moods. Timeless Silhouettes."* framed in golden jharokha/temple-arch windows with kalash finials.
- **`TryTheLookShowcase.tsx`** — Multi-look groom ensemble carousel with an interactive *"In This Look"* piece checklist, 10% bundle discount calculation, and direct `CartContext` integration.
- **`PickAWeaveShowcase.tsx`** — Fanned arc of 3D cursor-tilting fabric cards (`ZARDOZI`, `JODHPUR`, `CHANDERI`, `BROCADE`, `KASHMIR`) with wishlist toggle and `+` quick add-to-bag.
- **`AtelierRackShowcase.tsx`** — Filterable brass clothing rail (`All`, `Sherwanis`, `Bandhgalas`, `Kurtas`, `Regalia`) with a blurred lift-off hanger detail modal, Front / Craft Detail toggle, and size chips (`36`–`44` & `48-Pt Bespoke`).
- **`CoronationCurvedCarousel.tsx`** — 3D curved arch carousel for the Groom Coronation Edit.
- **`AtelierMotionReels.tsx`** — 3D curved arc of five lookbook/karigar reels with play/pause controls, gold progress bar, and full-screen story modal.
- **`showcaseCartHelper.ts`** — Shared helper adapting showcase items into `CartItem` payloads for `CartContext`.

### 2. Layout Components (`layout/`)
- **`Header.tsx`** — Sticky frosted-glass header with menswear category flyouts (`Sherwani`, `Kurta`, `Bandhgala`, `Regalia`), search bar, client dossier/account link, and cart badge.
- **`Footer.tsx`** — Vintage royal Indian atelier footer featuring twilight palace & jaali filigree textures, subtle `RoyalFiberCanvas` zari threads, 4 heritage guarantee plaques, verified route navigation, *Shahi Farman* trigger, and Private Salon Circle invitation form.

### 3. 3D & Heritage Effects (`3d/` & `effects/`)
- **`3d/RoyalFiberCanvas.tsx`** — Three.js / React Three Fiber canvas rendering flowing metallic gold silk zari threads.
- **`effects/FirstVisitIntro.tsx`** — Animated *Darwaza* ceremonial entrance overlay (`replayNeedleIntro`).
- **`effects/ShahiFarmanModal.tsx` & `effects/ShahiFarmanTrigger.tsx`** — Unrollable royal Mughal decree modal.
- **`effects/CustomLuxuryCursor.tsx`** — Custom gold and silver luxury cursor enhancement.

### 4. Core Responsive E-Commerce Components
- **`ProductCarousel.tsx`** — Responsive featured masterpieces carousel (1/2/3/4 columns by breakpoint).
- **`ProductGrid.tsx`**, **`FilterSidebar.tsx`**, **`ResponsiveFilter.tsx`** — Catalog display and filtering.
- **`MobileMenu.tsx`**, **`MobileCartDrawer.tsx`**, **`MobileUserMenu.tsx`**, **`ResponsiveSearchBar.tsx`** — Mobile navigation, cart drawer, and search overlay.
- **`SizeSelector.tsx`**, **`FittingSelector.tsx`**, **`MeasurementForm.tsx`** — Bespoke sizing and 48-point measurement capture.
- **`ResponsiveCheckout.tsx`** — Multi-step checkout workflow.
- **`chat/ChatWidget.tsx`**, **`ChatBot.tsx`**, **`NotificationBell.tsx`** — Real-time support chat, FAQ bot, and notifications.
- **`ResponsiveAdminDashboard.tsx`**, **`admin/ProductPhotoManager.tsx`**, **`admin/ResponsiveProductForm.tsx`**, **`admin/ResponsiveAnalyticsDashboard.tsx`** — Admin portal components.
