'use client';

import Link from 'next/link';
import ProductCarousel from '@/components/ProductCarousel';
import NeedleArchiveMoods from '@/components/showcase/NeedleArchiveMoods';
import TryTheLookShowcase from '@/components/showcase/TryTheLookShowcase';
import PickAWeaveShowcase from '@/components/showcase/PickAWeaveShowcase';
import AtelierRackShowcase from '@/components/showcase/AtelierRackShowcase';
import CoronationCurvedCarousel from '@/components/showcase/CoronationCurvedCarousel';
import AtelierMotionReels from '@/components/showcase/AtelierMotionReels';
import {
  useSiteConfig,
  getAspectRatioClass,
  getObjectFitClass,
  getFocalPointClass,
} from '@/contexts/SiteConfigContext';

const defaultFeaturedProducts = [
  {
    id: '1',
    name: 'Mughal Jaali Ivory Tailored Suit',
    price: 32999,
    imageSrc: '/images/original-ivory-blazer.jpg',
    imageAlt: 'Mughal Jaali Ivory Tailored Suit',
    href: '/product/1',
  },
  {
    id: '2',
    name: 'Sage Heritage Embroidered Suit',
    price: 34499,
    imageSrc: '/images/original-sage-suit.jpg',
    imageAlt: 'Sage Heritage Embroidered Suit',
    href: '/product/2',
  },
  {
    id: '3',
    name: 'Rose Ombré Jacket & Supima Tee',
    price: 21999,
    imageSrc: '/images/original-rose-jacket-tee.jpg',
    imageAlt: 'Rose Ombré Jacket & Supima Tee',
    href: '/product/3',
  },
  {
    id: '4',
    name: 'Noir Kashmiri Paisley Coat',
    price: 36999,
    imageSrc: '/images/original-noir-bandhgala.jpg',
    imageAlt: 'Noir Kashmiri Paisley Coat',
    href: '/product/4',
  },
  {
    id: '5',
    name: 'Ivory Botanical Achkan & Trousers',
    price: 29499,
    imageSrc: '/images/original-ivory-achkan.jpg',
    imageAlt: 'Ivory Botanical Achkan & Trousers',
    href: '/product/5',
  },
  {
    id: '6',
    name: 'Rose Bandhgala & Linen Shirt',
    price: 24999,
    imageSrc: '/images/original-rose-bandhgala-shirt.jpg',
    imageAlt: 'Rose Bandhgala & Linen Shirt',
    href: '/product/6',
  },
];

const defaultMenswearWings = [
  {
    title: 'Suits',
    subtitle: 'Embroidered blazers, two-piece suits, coats & evening tuxedos',
    href: '/category/suits',
    image: '/images/original-sage-suit.jpg',
  },
  {
    title: 'Shirts',
    subtitle: 'Handloom linen shirts, crisp dress shirts & Supima t-shirts',
    href: '/category/shirts',
    image: '/images/original-rose-bandhgala-shirt.jpg',
  },
  {
    title: 'Pants',
    subtitle: 'Pleated tailored trousers, tuxedo pants & relaxed linens',
    href: '/category/pants',
    image: '/images/original-ivory-achkan.jpg',
  },
  {
    title: 'Accessories',
    subtitle: 'Cashmere doshalas, silk pocket squares, safas & cufflinks',
    href: '/category/accessories',
    image: '/images/menswear-accessories.jpg',
  },
  {
    title: 'Indian Wear',
    subtitle: 'Kurta pyjama sets, imperial sherwanis & Jodhpur bandhgalas',
    href: '/category/indian-wear',
    image: '/images/original-noir-bandhgala.jpg',
  },
];

const clientPerspectives = [
  {
    quote:
      'The drape of the ivory sherwani required zero adjustment on the morning of our ceremony in Udaipur. Quietly extraordinary tailoring.',
    author: 'Raghavendra Singhania',
    location: 'Udaipur',
  },
  {
    quote:
      'Needle Fashion understands restraint. My midnight bandhgala had the precision of Savile Row with unmistakable Indian soul.',
    author: 'Vikramaditya Kapoor',
    location: 'New Delhi',
  },
  {
    quote:
      'From the first fabric swatch to the final basted fitting, every detail felt personal, unhurried, and deeply considered.',
    author: 'Arjun & Kabir Malhotra',
    location: 'Mumbai',
  },
];

export default function HomePage() {
  const { getSection, commerce } = useSiteConfig();

  const heroSection = getSection('home', 'hero');
  const wingsSection = getSection('home', 'menswear-wings');
  const featuredSection = getSection('home', 'featured-pieces');
  const karigarSection = getSection('home', 'karigar-atelier');
  const salonSection = getSection('home', 'royal-salon');
  const palaceSection = getSection('home', 'palace-night');

  const heroImg = heroSection?.media?.[0];
  const menswearWings =
    wingsSection?.media && wingsSection.media.length > 0
      ? wingsSection.media.map((m) => ({
          title: m.title || m.alt || 'Category',
          subtitle: m.subtitle || '',
          href: m.href || '/categories',
          image: m.url,
          alt: m.alt || m.title || 'Category',
        }))
      : defaultMenswearWings.map((w) => ({ ...w, alt: w.title }));

  const featuredProducts =
    featuredSection?.media && featuredSection.media.length > 0
      ? featuredSection.media.map((m, idx) => ({
          id: m.slotKey || String(idx + 1),
          name: m.title || m.alt || 'Atelier Piece',
          price: m.priceInr ?? 29999,
          imageSrc: m.url,
          imageAlt: m.alt || m.title || 'Atelier Piece',
          href: m.href || `/product/${idx + 1}`,
        }))
      : defaultFeaturedProducts;

  return (
    <main className="bg-background text-foreground">
      {commerce.announcementText && (
        <div className="bg-foreground text-background text-center py-2 px-4 text-[11px] uppercase tracking-[0.22em]">
          {commerce.announcementText}
        </div>
      )}

      {/* Editorial Hero */}
      {heroSection?.enabled !== false && (
        <section className="relative border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
                <div className="space-y-5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    {heroSection?.eyebrow || 'Indian Craft · Modern Tailoring'}
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.08]">
                    {heroSection?.title || 'Indian Heritage Fabric, Tailored for the World'}
                  </h1>
                  <p className="text-base sm:text-lg font-light text-muted-foreground leading-relaxed max-w-lg">
                    {heroSection?.subtitle ||
                      'Bespoke suits, coats, tuxedos, shirts, and ceremonial Indian wear—uniting handloom textiles and karigar embroidery with timeless Western and Indian silhouettes.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={heroSection?.ctaHref || '/new-arrivals'}
                    className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {heroSection?.ctaLabel || 'Explore Collection'}
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 border border-border text-foreground text-xs uppercase tracking-[0.22em] hover:border-foreground transition-colors"
                  >
                    Private Appointment
                  </Link>
                </div>

                <div className="pt-8 border-t border-border grid grid-cols-3 gap-6 max-w-md">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
                      Origin
                    </p>
                    <p className="text-xs text-foreground">Varanasi &amp; Lucknow</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
                      Tailoring
                    </p>
                    <p className="text-xs text-foreground">48-Point Bespoke</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
                      Service
                    </p>
                    <p className="text-xs text-foreground">Worldwide Salon</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <div
                  className={`relative ${getAspectRatioClass(
                    heroSection?.aspectRatio || '3:4'
                  )} w-full max-w-xl mx-auto overflow-hidden bg-muted`}
                >
                  <img
                    src={heroImg?.url || '/images/original-ivory-blazer.jpg'}
                    alt={heroImg?.alt || 'Needle Fashion Ivory Mughal Embroidered Tailored Suit'}
                    className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                      heroSection?.objectFit
                    )} ${getFocalPointClass(heroSection?.focalPoint || 'top')}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Couture Wings */}
      {wingsSection?.enabled !== false && (
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
                  {wingsSection?.eyebrow || 'The House Wardrobe'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
                  {wingsSection?.title || 'Couture Categories'}
                </h2>
              </div>
              <Link
                href={wingsSection?.ctaHref || '/categories'}
                className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors border-b border-border pb-1 self-start sm:self-auto"
              >
                {wingsSection?.ctaLabel || 'View All Categories'}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
              {menswearWings.map((wing) => (
                <Link key={wing.title} href={wing.href} className="group block">
                  <div
                    className={`relative ${getAspectRatioClass(
                      wingsSection?.aspectRatio || '3:4'
                    )} w-full overflow-hidden bg-muted mb-5`}
                  >
                    <img
                      src={wing.image}
                      alt={wing.alt}
                      className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                        wingsSection?.objectFit
                      )} ${getFocalPointClass(
                        wingsSection?.focalPoint || 'top'
                      )} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                    />
                  </div>
                  <h3 className="text-base font-normal text-foreground group-hover:text-accent transition-colors">
                    {wing.title}
                  </h3>
                  <p className="text-xs font-light text-muted-foreground mt-1.5 leading-relaxed">
                    {wing.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Six Moods Lookbook */}
      <NeedleArchiveMoods />

      {/* Featured Masterpieces */}
      {featuredSection?.enabled !== false && (
        <section className="py-20 sm:py-28 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
                  {featuredSection?.eyebrow || 'Curated Selection'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
                  {featuredSection?.title || 'Featured Masterpieces'}
                </h2>
              </div>
              <Link
                href={featuredSection?.ctaHref || '/new-arrivals'}
                className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors border-b border-border pb-1 self-start sm:self-auto"
              >
                {featuredSection?.ctaLabel || 'Shop New Arrivals'}
              </Link>
            </div>

            <ProductCarousel products={featuredProducts} title={featuredSection?.title || 'Featured Masterpieces'} />
          </div>
        </section>
      )}

      {/* Complete Groom Styling */}
      <TryTheLookShowcase />

      {/* Fabrics & Weaves */}
      <PickAWeaveShowcase />

      {/* Artisanal Heritage */}
      {karigarSection?.enabled !== false && (
        <section className="py-20 sm:py-28 border-t border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6">
                <div
                  className={`relative ${getAspectRatioClass(
                    karigarSection?.aspectRatio || '16:10'
                  )} w-full overflow-hidden bg-muted`}
                >
                  <img
                    src={karigarSection?.media?.[0]?.url || '/images/vintage-karigar-atelier.webp'}
                    alt={karigarSection?.media?.[0]?.alt || 'Master Karigar Atelier'}
                    className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                      karigarSection?.objectFit
                    )} ${getFocalPointClass(karigarSection?.focalPoint)}`}
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  {karigarSection?.eyebrow || 'Artisanal Lineage'}
                </p>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground leading-tight">
                  {karigarSection?.title || 'Two Hundred Hours of Hand Zardozi'}
                </h2>
                <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed max-w-lg">
                  {karigarSection?.subtitle ||
                    'Every ceremonial sherwani is stretched on a traditional wooden adda frame in our Lucknow workshop, where fourth-generation karigars coil bullion wire, resham, and pearls by hand.'}
                </p>
                <div className="pt-2">
                  <Link
                    href={karigarSection?.ctaHref || '/about'}
                    className="inline-block px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
                  >
                    {karigarSection?.ctaLabel || 'Discover Our Craft'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bespoke 48-Point Tailoring */}
      {salonSection?.enabled !== false && (
        <section className="py-20 sm:py-28 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  {salonSection?.eyebrow || 'Private Salon'}
                </p>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground leading-tight">
                  {salonSection?.title || '48-Point Bespoke Pattern Making'}
                </h2>
                <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed max-w-lg">
                  {salonSection?.subtitle ||
                    'From shoulder slope to collar height, each garment is drafted to your exact posture. Basted muslin trials are conducted in-salon or via private video consultation worldwide.'}
                </p>
                <div className="pt-2">
                  <Link
                    href={salonSection?.ctaHref || '/contact'}
                    className="inline-block px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {salonSection?.ctaLabel || 'Request a Fitting'}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <div
                  className={`relative ${getAspectRatioClass(
                    salonSection?.aspectRatio || '16:10'
                  )} w-full overflow-hidden bg-muted`}
                >
                  <img
                    src={salonSection?.media?.[0]?.url || '/images/vintage-royal-salon.webp'}
                    alt={salonSection?.media?.[0]?.alt || 'Needle Fashion Private Salon'}
                    className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                      salonSection?.objectFit
                    )} ${getFocalPointClass(salonSection?.focalPoint)}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Wardrobe Rail */}
      <AtelierRackShowcase />

      {/* The Coronation Edit */}
      <CoronationCurvedCarousel />

      {/* Notes from the Atelier */}
      <AtelierMotionReels />

      {/* Client Perspectives */}
      <section className="py-20 sm:py-28 border-t border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
              Clientele
            </p>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Words from Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {clientPerspectives.map((item) => (
              <blockquote
                key={item.author}
                className="border-t border-border pt-6 flex flex-col justify-between space-y-6"
              >
                <p className="text-sm sm:text-base font-light text-foreground leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer>
                  <p className="text-xs font-normal text-foreground">
                    {item.author}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {item.location}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Private Salon Banner */}
      {palaceSection?.enabled !== false && (
        <section className="relative py-28 sm:py-36 overflow-hidden bg-[#141414] text-[#FAF9F6]">
          <img
            src={palaceSection?.media?.[0]?.url || '/images/vintage-palace-night.webp'}
            alt={palaceSection?.media?.[0]?.alt || 'Needle Fashion Private Salon'}
            className={`absolute inset-0 w-full h-full ${getObjectFitClass(
              palaceSection?.objectFit
            )} ${getFocalPointClass(palaceSection?.focalPoint)} opacity-35`}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#FAF9F6]/70">
              {palaceSection?.eyebrow || 'By Appointment'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              {palaceSection?.title || 'Reserve Your Private Salon Consultation'}
            </h2>
            <p className="text-sm sm:text-base font-light text-[#FAF9F6]/80 max-w-xl mx-auto leading-relaxed">
              {palaceSection?.subtitle ||
                'Meet our master tailors in person or via private video appointment to select fabrics, weaves, and custom embroidery.'}
            </p>
            <div className="pt-4">
              <Link
                href={palaceSection?.ctaHref || '/contact'}
                className="inline-block px-8 py-4 border border-[#FAF9F6]/60 text-[#FAF9F6] text-xs uppercase tracking-[0.22em] hover:bg-[#FAF9F6] hover:text-[#141414] transition-colors"
              >
                {palaceSection?.ctaLabel || 'Book Private Consultation'}
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
