'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SparklesIcon, ShieldCheckIcon, ScissorsIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero section */}
      <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-ethnic.jpg"
            alt="Needle Fashion Royal Atelier"
            fill
            className="object-cover object-top filter brightness-[0.4] saturate-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
        </div>
        
        <div className="relative max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">The Royal Indian Atelier</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Preserving Indian Grandeur, Tailored for the Modern Sovereign
          </h1>
          <p className="mt-4 text-base sm:text-lg text-cream/90 max-w-2xl mx-auto font-light leading-relaxed">
            Needle Fashion is a bespoke luxury fashion house dedicated to artisanal mastery, handcrafted zardozi embroidery, and timeless silhouettes for modern connoisseurs.
          </p>
        </div>
      </div>

      {/* Our Story section */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Artisanal Lineage</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
            A Celebration of Handcrafted Heritage
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-6" />
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Established with an unwavering devotion to India&apos;s rich handloom weaving legacy, Needle Fashion unites master karigars from Varanasi, Lucknow, and Bengal with world-class contemporary tailoring.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div className="relative group">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-xl">
              <Image
                src="/images/category-sherwani.jpg"
                alt="Master Karigars Hand Embroidery"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Handloom Archive</span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">Zardozi & Antique Dabka Mastery</h3>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:pl-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <ScissorsIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">Bespoke Couture Precision</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Every sherwani and bandhgala is tailored to individual measurements with 48 distinct anatomical checkpoints, ensuring effortless poise and drape.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">Authentic Metallic Resham & Zari</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  We use genuine silver and gold-tinted resham threads woven on hand-operated pit looms, creating a distinctive antique luminescence that never fades.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">Artisan Guild Support</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Over 150 master artisan families across Lucknow and Banaras earn equitable luxury wages and retain full patent ownership over generational motif archives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-card border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">The Haute Atelier Standard</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Our Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all duration-300 shadow-sm group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Pure Handwoven Silks</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We reject synthetic blends. Only pure Chanderi, Banarasi Mulberry, and Raw Tussar silks are accepted by our master cutters.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all duration-300 shadow-sm group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <HeartIcon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Conscious Heritage</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Vegetable dyes, water recycling, zero fabric incineration, and ethical handloom preservation define every collection we release.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all duration-300 shadow-sm group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <ScissorsIcon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Lifetime Preservation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Each bespoke creation includes complimentary lifetime alteration and restoration care, ensuring your wedding ensemble becomes an enduring family heirloom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-primary/30 p-10 sm:p-16 text-center bg-gradient-to-r from-card via-background to-card shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Experience Needle Fashion In Person
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 font-light">
            Book a private atelier fitting with our royal stylists or commission a custom couture ensemble for your special occasion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new-arrivals"
              className="btn-luxury-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em]"
            >
              Explore Royal Catalogue
            </Link>
            <Link
              href="/contact"
              className="btn-luxury-outline px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em]"
            >
              Consult with Stylist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}