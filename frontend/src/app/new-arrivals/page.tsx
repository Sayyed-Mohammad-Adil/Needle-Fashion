import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, SparklesIcon, ScissorsIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

// Pure Men's Haute Couture Pieces (Out-classing Manyavar, Sabyasachi & Manish Malhotra)
const newArrivals = [
  {
    id: '1',
    name: 'Imperial Ivory Sherwani with Antique 24K Zardozi',
    price: 38999,
    imageSrc: '/images/hero-ethnic.jpg',
    imageAlt: 'Imperial Ivory Sherwani with Antique 24K Zardozi',
    href: '/product/1',
    category: 'Imperial Wedding Sherwani',
    tag: 'Haute Couture',
    fabric: 'Pure Mulberry Silk',
  },
  {
    id: '2',
    name: 'Gala Indo-Western Brocade Tuxedo with Silk Lapels',
    price: 24999,
    imageSrc: '/images/menswear-indo-western.jpg',
    imageAlt: 'Gala Indo-Western Brocade Tuxedo',
    href: '/product/2',
    category: 'Diplomatic Gala',
    tag: 'Limited Brocade',
    fabric: 'Tailored Slate & Antique Gold',
  },
  {
    id: '3',
    name: 'Tailored Slate Grey & Cream Silk Bandhgala Set',
    price: 18499,
    imageSrc: '/images/category-kurta-jacket.jpg',
    imageAlt: 'Tailored Slate Grey & Cream Silk Bandhgala Set',
    href: '/product/3',
    category: 'Atelier Jodhpuri',
    tag: 'Bespoke Fit',
    fabric: 'Raw Silk & Brass Crests',
  },
  {
    id: '4',
    name: 'Royal Cashmere Doshala Shawl with Tilla Border',
    price: 14499,
    imageSrc: '/images/menswear-doshala.jpg',
    imageAlt: 'Royal Cashmere Doshala Shawl',
    href: '/product/4',
    category: 'Heirloom Shawl',
    tag: 'Pure Pashmina',
    fabric: 'Cashmere Wool & Zari',
  },
  {
    id: '5',
    name: 'Pure Chanderi Silk Cream Embroidered Kurta',
    price: 6499,
    imageSrc: '/images/category-kurta.jpg',
    imageAlt: 'Pure Chanderi Silk Cream Embroidered Kurta',
    href: '/product/5',
    category: 'Signature Kurta',
    tag: 'Handloom Silk',
    fabric: 'Banaras Pit-Loom',
  },
  {
    id: '6',
    name: 'Ivory Chanderi Safa, Emerald Kalgi & Crest Cufflinks',
    price: 9999,
    imageSrc: '/images/menswear-accessories.jpg',
    imageAlt: 'Ivory Chanderi Safa with Emerald Kalgi',
    href: '/product/6',
    category: 'Coronation Regalia',
    tag: 'Royal Jewels',
    fabric: 'Silk Turban & 24K Plated',
  },
  {
    id: '7',
    name: 'Charcoal Grey Velvet Bandhgala with Lion Crest',
    price: 19999,
    imageSrc: '/images/kurta-2.jpg',
    imageAlt: 'Charcoal Grey Velvet Bandhgala',
    href: '/product/7',
    category: 'Imperial Achkan',
    tag: 'Bespoke Tailored',
    fabric: 'Velvet & Bullion Gold',
  },
  {
    id: '8',
    name: 'The Rajsabha Heritage Wedding Sherwani & Doshala',
    price: 44999,
    imageSrc: '/images/collection-wedding.jpg',
    imageAlt: 'The Rajsabha Heritage Wedding Sherwani',
    href: '/product/8',
    category: 'Sovereign Groom',
    tag: 'Masterpiece 01',
    fabric: '24K Gold Wire Zari',
  },
];

export default function NewArrivalsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-10 transition-colors relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ambient-gold-glow pointer-events-none -z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Glassmorphic Header Docket */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-primary/30 shadow-2xl mb-12 relative overflow-hidden">
          {/* Vintage Palace Architectural Backdrop */}
          <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
            <Image
              src="/images/vintage-hero-palace.webp"
              alt="Vintage Palace Architecture"
              fill
              className="object-cover object-center opacity-20 dark:opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/90 to-card/75 dark:from-[#14161E]/95 dark:via-[#14161E]/90 dark:to-[#14161E]/80" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 glass-pill px-4 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.24em] mb-4 shadow-sm">
                <SparklesIcon className="h-3.5 w-3.5" />
                <span>Autumn / Wedding 2026 Sovereign Runway • Menswear Exclusive</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                The Sovereign Runway
              </h1>
              <p className="mt-3 text-xs sm:text-base text-muted-foreground font-light max-w-2xl leading-relaxed">
                Sculpted exclusively for the discerning modern ruler. Pure Banarasi and Chanderi silks, tailored slate greys, cashmere creams, and heirloom 24K gold wire zardozi embroidery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <span className="glass-pill px-4 py-2 text-[11px] uppercase tracking-wider text-primary font-bold shadow-sm">
                8 Masterpieces Exhibited
              </span>
              <Link
                href="/contact"
                className="btn-glass-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Book Fitting Atelier
              </Link>
            </div>
          </div>
        </div>

        {/* 8-Masterpiece Glassmorphic Runway Grid */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <div 
              key={product.id} 
              className="group relative glass-card rounded-3xl p-3 flex flex-col justify-between border border-border/80 hover:border-primary/50 transition-all duration-500 shadow-md hover:shadow-2xl"
            >
              <div>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondary/50">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating Glass Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="glass-pill px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-primary font-bold shadow-md">
                      {product.tag}
                    </span>
                  </div>

                  {/* Fabric Provenance Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-cream/90 font-medium line-clamp-1">
                      {product.fabric}
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-primary font-bold block">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors mt-0.5 line-clamp-1">
                    <Link href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
              </div>

              <div className="mt-5 px-2 pt-3 border-t border-border/50 flex items-center justify-between relative z-10">
                <span className="font-serif text-base font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex items-center gap-1">
                  Commission <ArrowRightIcon className="h-3 w-3 text-primary" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke Fitting Consultation Banner with Glassmorphism */}
        <div className="mt-20 rounded-3xl glass-panel-gold p-8 sm:p-12 border border-primary/40 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass-pill px-3 py-1 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
              <ScissorsIcon className="w-3.5 h-3.5" />
              <span>Personal Master Cutter Service</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Desire an Exclusive One-of-a-Kind Commission?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Every garment in our New Arrivals runway can be individually customized with personalized heraldic embroidery monograms, bespoke chest-to-shoulder ratios, and archival silk color options.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-glass-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] shadow-xl"
              >
                Schedule Atelier Fitting
              </Link>
              <Link
                href="/about"
                className="glass-pill px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:border-primary hover:text-primary transition-all"
              >
                Our 400-Year Handloom Heritage &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}