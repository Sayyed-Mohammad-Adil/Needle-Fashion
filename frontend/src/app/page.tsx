import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, ScissorsIcon, TruckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import ProductCarousel from '@/components/ProductCarousel';
import RoyalFiberCanvas from '@/components/3d/RoyalFiberCanvas';

// Curated luxury menswear masterpieces
const featuredProducts = [
  {
    id: '1',
    name: 'Imperial Ivory & Gold Embroidered Sherwani',
    price: 28999,
    imageSrc: '/images/hero-ethnic.jpg',
    imageAlt: 'Imperial Ivory & Gold Embroidered Sherwani',
    href: '/product/1',
  },
  {
    id: '2',
    name: 'Tailored Slate Grey & Cream Silk Bandhgala',
    price: 15499,
    imageSrc: '/images/category-kurta-jacket.jpg',
    imageAlt: 'Tailored Slate Grey & Cream Silk Bandhgala',
    href: '/product/2',
  },
  {
    id: '3',
    name: 'Pure Chanderi Silk Cream Embroidered Kurta',
    price: 5499,
    imageSrc: '/images/category-kurta.jpg',
    imageAlt: 'Pure Chanderi Silk Cream Embroidered Kurta',
    href: '/product/3',
  },
  {
    id: '4',
    name: 'Charcoal Gala Brocade Indo-Western Tuxedo',
    price: 18999,
    imageSrc: '/images/menswear-indo-western.jpg',
    imageAlt: 'Charcoal Gala Brocade Indo-Western Tuxedo',
    href: '/product/4',
  },
  {
    id: '5',
    name: 'Royal Cashmere Doshala Shawl with Tilla Border',
    price: 12499,
    imageSrc: '/images/menswear-doshala.jpg',
    imageAlt: 'Royal Cashmere Doshala Shawl',
    href: '/product/5',
  },
  {
    id: '6',
    name: 'Charcoal Grey Bandhgala with Gold Crest Motif',
    price: 13999,
    imageSrc: '/images/kurta-2.jpg',
    imageAlt: 'Charcoal Grey Bandhgala with Gold Crest Motif',
    href: '/product/6',
  },
];

// The 4 Core Menswear Haute Wings
const menswearWings = [
  {
    title: 'The Imperial Sherwani',
    subtitle: 'Antique Zardozi & Resham Embroidery on Pure Mulberry Silk',
    href: '/category/sherwani',
    imageSrc: '/images/category-sherwani.jpg',
    tag: 'Wedding & Coronation',
    hours: '120+ Karigar Hours',
    number: '01',
  },
  {
    title: 'The Jodhpur Bandhgala',
    subtitle: 'Tailored Slate Grey & Cream Silks with Polished Brass Buttons',
    href: '/category/kurta-jacket',
    imageSrc: '/images/category-kurta-jacket.jpg',
    tag: 'Atelier Jodhpuri',
    hours: '48 Anatomical Checks',
    number: '02',
  },
  {
    title: 'The Handloom Kurta',
    subtitle: 'Woven on Banaras Pit Looms with Marodi and Resham Detailing',
    href: '/category/kurta',
    imageSrc: '/images/category-kurta.jpg',
    tag: 'Pure Chanderi Silk',
    hours: '100% Pure Silks',
    number: '03',
  },
  {
    title: 'The Gala Indo-Western',
    subtitle: 'Sculpted Brocade Tuxedo Lapels for Diplomatic Receptions',
    href: '/new-arrivals',
    imageSrc: '/images/menswear-indo-western.jpg',
    tag: 'Evening Couture',
    hours: 'Limited Edition Cut',
    number: '04',
  },
];

// Testimonials from discerning patrons
const testimonials = [
  {
    quote: "Needle Fashion crafted my wedding sherwani in pure ivory cream with antique gold zardozi. The silhouette, fall, and handwork were absolutely peerless.",
    author: "Vikramaditya Sharma",
    location: "Udaipur & Mumbai",
    role: "Groom 2026",
  },
  {
    quote: "The slate grey silk bandhgala with engraved brass buttons was tailored to perfection. The 48-point bespoke measurement resulted in an effortless drape.",
    author: "Rohit Singhania",
    location: "South Mumbai",
    role: "Private Client",
  },
  {
    quote: "The pure cashmere doshala and hand-stitched Chanderi kurta have extraordinary texture and richness. Contemporary Indian menswear at its finest.",
    author: "Devendra Rathore",
    location: "Jaipur & Dubai",
    role: "Couture Collector",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground transition-colors overflow-hidden relative">
      {/* Ambient Atmospheric Gold Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] ambient-gold-glow pointer-events-none -z-0" />
      <div className="absolute top-[1600px] -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-[3200px] -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* 3D Flowing Silk Zari Threads Animation (Liquid-Metallic Zari Ribbons across Hero) */}
      <div className="absolute top-0 left-0 right-0 h-[680px] lg:h-[780px] opacity-45 pointer-events-none -z-0 overflow-hidden hidden md:block">
        <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} />
      </div>

      {/* 1. Grand Editorial Glassmorphic Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Glassmorphic Editorial Docket */}
            <div className="lg:col-span-7 z-10 flex flex-col justify-center">
              {/* Dual-Metallic Atelier Seal */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.22em] mb-4 bg-primary/10 border border-[#BBC2CC]/40 text-foreground w-fit shadow-sm backdrop-blur-md">
                <span className="text-[#BF953F]">✦</span>
                <span>24K Gold & Sterling Silver Zari</span>
                <span className="text-[#BBC2CC]">✦</span>
              </div>

              {/* Main Headline with Gold Foil Shimmer */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Heirloom Indian Menswear,{' '}
                <span className="text-gold-foil block mt-1">Tailored to Perfection.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground max-w-xl font-light">
                Needle Fashion sculpts pure Banarasi silks, tailored slate greys, and cashmere creams with master Karigar 24K gold & sterling silver zardozi embroidery and 48-point bespoke made-to-measure tailoring.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/new-arrivals"
                  className="btn-glass-gold rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.18em] font-bold shadow-xl flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="glass-pill px-5 sm:px-7 py-3.5 sm:py-4 text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:border-[#BBC2CC] hover:text-primary transition-all shadow-sm border border-border/80"
                >
                  Book Appointment &rarr;
                </Link>
              </div>

              {/* 3 Floating Glass Stat Capsules */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/70 grid grid-cols-3 gap-2 sm:gap-6">
                <div className="glass-card p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center">
                  <p className="font-serif text-base sm:text-2xl font-black text-foreground">120+ Hrs</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Zardozi Work</p>
                </div>
                <div className="glass-card p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center border-primary/30">
                  <p className="font-serif text-base sm:text-2xl font-black text-primary">100%</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Handloom Silks</p>
                </div>
                <div className="glass-card p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center">
                  <p className="font-serif text-base sm:text-2xl font-black text-foreground">48-Point</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Bespoke Fit</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Fashion Artwork with Frosted Glass Overlay Docket */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative golden ambient frame */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/30 via-transparent to-primary/20 blur-2xl opacity-70" />
                
                <div className="relative rounded-3xl overflow-hidden border border-primary/40 shadow-2xl glass-panel p-2">
                  <div className="relative h-[540px] sm:h-[620px] w-full rounded-2xl overflow-hidden">
                    <Image
                      src="/images/hero-ethnic.jpg"
                      alt="Needle Fashion Imperial Royal Groom Sherwani in Cream and Gold"
                      fill
                      priority
                      className="object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    
                    {/* Floating Frosted Glass Masterpiece Docket */}
                    <div className="absolute bottom-5 left-4 right-4 p-5 rounded-2xl glass-panel-gold border border-white/40 dark:border-primary/40 text-foreground flex items-center justify-between shadow-2xl">
                      <div>
                        <div className="flex items-center gap-1.5 text-[9.5px] tracking-[0.24em] uppercase text-primary font-bold">
                          <SparklesIcon className="w-3.5 h-3.5" />
                          <span>Imperial Commission 01/26</span>
                        </div>
                        <p className="font-serif text-base sm:text-lg font-bold text-foreground mt-0.5">
                          The Rajsabha Imperial Sherwani
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Pure Mulberry Silk with 24K Gold & Sterling Silver Zari
                        </p>
                      </div>
                      <Link
                        href="/new-arrivals"
                        className="btn-glass-gold px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                      >
                        Inspect Piece
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Frosted Glass Sovereign Guarantee Bar */}
      <section className="py-8 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <ScissorsIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">48-Point Bespoke Fit</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Tailored to your anatomical contour with lifetime complimentary alterations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">Master Karigar Lineage</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Generational pit-loom weavers from Varanasi, Lucknow, and Bengal handcraft every weave.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">24K Gold & Silver Zari</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Genuine metallic bullion wires, sterling silver dabka, and polished heraldic crest buttons.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <TruckIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">Diplomatic Insured Transit</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Dispatched globally in museum-grade unbleached muslin trunks across 45 countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Menswear Haute Wings (Glassmorphic Cards) */}
      <section aria-labelledby="wings-heading" className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2 block">
              ✦ Needle Fashion Royal Taxonomy ✦
            </span>
            <h2 id="wings-heading" className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              The Four Menswear Haute Wings
            </h2>
            <div className="w-24 h-0.5 mx-auto mt-4 mb-4 shadow-[0_0_10px_rgba(234,236,236,0.5)]" style={{ background: 'linear-gradient(to right, transparent, #BF953F, #EAECEC, #B38728, #BBC2CC, transparent)' }} />
            <p className="text-sm text-muted-foreground font-light">
              Exclusively created for gentlemen of distinction. Sculpted in tailored slate greys, royal creams, and white silks with antique gold and sterling silver flourishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menswearWings.map((wing) => (
              <div
                key={wing.title}
                className="group relative rounded-3xl overflow-hidden glass-card flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                  <Image
                    src={wing.imageSrc}
                    alt={wing.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Top Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="glass-pill px-3 py-1 text-[9.5px] uppercase tracking-wider text-primary font-bold shadow-md">
                      {wing.tag}
                    </span>
                  </div>

                  {/* Badge at Bottom of Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90">
                    <span className="text-[10px] uppercase tracking-wider text-cream/90 font-medium">{wing.hours}</span>
                    <span className="font-mono text-xs text-primary font-bold">{wing.number}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={wing.href}>
                        <span className="absolute inset-0" />
                        {wing.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 font-light leading-relaxed">
                      {wing.subtitle}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                      Explore Wing <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Masterpieces Carousel */}
      <section aria-labelledby="trending-heading" className="py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-12 rounded-3xl glass-panel border border-border/80 shadow-xl">
            <ProductCarousel products={featuredProducts} title="Featured Masterpieces" />

            <div className="mt-12 text-center">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 btn-glass-gold rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.18em] font-bold shadow-md hover:scale-105 transition-all"
              >
                <span>View Complete Runway Collection</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Master Karigar Artisanal Lineage Section (Beating Sabyasachi & Manish Malhotra) */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* 3D Liquid Zari Pit-Loom Threads Animation */}
        <div className="absolute inset-0 pointer-events-none -z-0 opacity-30 overflow-hidden hidden md:block">
          <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Image of Karigar Handwork */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-primary/30">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/menswear-karigar.jpg"
                    alt="Master Karigar Hands Weaving 24K Gold Zari"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-bold">Heirloom Handloom Archive</span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold mt-1">Varanasi &amp; Lucknow Zari Lineage</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Story & Technical Craft */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Museum-Grade Indian Craftsmanship</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Authentic 24K Gold Wire &amp; Hand-Operated Pit Looms
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                While commercial fashion houses rely on synthetic lurex threads and automated industrial presses, Needle Fashion commissions hereditary artisan families who trace their techniques back four centuries to the Mughal and Rajput royal courts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
                  <CheckBadgeIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-foreground">Marodi &amp; Dabka Antique Relief</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Bullion coils wound by hand to create three-dimensional sculpted heraldry on velvet and silk.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
                  <CheckBadgeIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-foreground">Pure Chanderi &amp; Banarasi Handlooms</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Woven without synthetic plastic or polyester, ensuring natural breathability and royal drape.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="btn-glass-gold rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.16em] font-bold inline-flex items-center gap-2"
                >
                  <span>Explore Atelier Craftsmanship &rarr;</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Royal Regalia & Accents (Pashmina Doshala, Safa, Kalgi) */}
      <section className="py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2 block">
              ✦ Imperial Groom Ensemble ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Royal Accents &amp; Heirloom Regalia
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              The crowning touches of the groom&apos;s ensemble: pure cashmere doshala shawls, ivory chanderi safas, and handcrafted kalgis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative rounded-3xl overflow-hidden glass-card p-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-secondary">
                <Image
                  src="/images/menswear-doshala.jpg"
                  alt="Pure Cashmere Royal Doshala Shawl"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 sm:p-6">
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Pure Pashmina Weave</span>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">The Royal Doshala Shawl</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Draped over the bandhgala or sherwani shoulder, framed with antique gold tilla paisley borders.
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="font-serif font-bold text-primary">₹12,499</span>
                  <Link href="/new-arrivals" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
                    Inspect Shawl &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden glass-card p-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-secondary">
                <Image
                  src="/images/menswear-accessories.jpg"
                  alt="Ivory Safa Turban with Emerald Kalgi and Monogram Cufflinks"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 sm:p-6">
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Coronation Jewelry</span>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">Safa, Kalgi &amp; Needle Cufflinks</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Ivory silk turban pre-tied with antique gold emerald kalgi brooch and hand-embroidered mojari footwear.
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="font-serif font-bold text-primary">Complete Set Available</span>
                  <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
                    Consult Stylist &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bespoke 48-Point Atelier Consultation Service (Superior to Manyavar & Manish Malhotra) */}
      <section className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl glass-panel-gold p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl border border-primary/40">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>The 48-Point Haute Couture Protocol</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Anatomical Fit Sculpted Exclusively for Your Physique
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                Standard sizing off-the-rack cannot match the regal carriage of bespoke tailoring. Our master cutters contour shoulder slope, chest curvature, armhole depth, and sleeve pitch for effortless authority.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border/80">
                <div className="p-4 rounded-2xl glass-card">
                  <span className="font-serif text-2xl font-black text-primary">01</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">Private Video Fitting</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">1-on-1 consultation with senior master cutter</p>
                </div>
                <div className="p-4 rounded-2xl glass-card">
                  <span className="font-serif text-2xl font-black text-primary">02</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">Archival Silk Swatches</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Pure Banarasi &amp; Chanderi sent to your home</p>
                </div>
                <div className="p-4 rounded-2xl glass-card">
                  <span className="font-serif text-2xl font-black text-primary">03</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">Museum-Grade Delivery</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Complimentary lifetime alteration guarantee</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="btn-glass-gold rounded-full px-8 py-4 text-xs uppercase tracking-[0.18em] font-bold shadow-xl"
                >
                  Commission Bespoke Piece
                </Link>
                <Link
                  href="/new-arrivals"
                  className="glass-pill px-7 py-4 text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
                >
                  Inspect Current Runway &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Patron Connoisseurs & Royal Testimonials */}
      <section className="py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2 block">
              ✦ Words of Patronage ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Client Perspectives &amp; Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-8 rounded-3xl glass-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-serif text-sm sm:text-base text-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/50">
                  <p className="font-serif text-sm font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role} • {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Sovereign Atelier Call to Action */}
      <section className="py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-primary/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 shadow-xl">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2 block">
                ✦ The Grand Atelier Awaits ✦
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Tailored with Distinction. Crafted for Defining Moments.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light max-w-xl">
                Explore our current runway creations or book an appointment at our private fitting salons.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 flex-shrink-0">
              <Link
                href="/new-arrivals"
                className="btn-glass-gold rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.18em] font-bold shadow-xl"
              >
                Explore Collection
              </Link>
              <Link
                href="/contact"
                className="glass-pill px-5 sm:px-7 py-3.5 sm:py-4 text-xs uppercase tracking-[0.18em] font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
              >
                Book Appointment &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
