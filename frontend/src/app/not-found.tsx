'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const router = useRouter();

  // Auto-redirect after 15 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 15000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
          <SparklesIcon className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Atelier Wayfinding</span>
        </div>
        <h1 className="font-serif text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-cream to-primary">
          404
        </h1>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-4">
          Masterpiece Not Located
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The couture ensemble or salon corridor you are seeking appears to have moved or concluded its exhibition.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-luxury-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Return to Grand Atelier
          </Link>
          <Link
            href="/new-arrivals"
            className="btn-luxury-outline px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Explore New Arrivals
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          Returning you to the salon lobby in 15 seconds...
        </p>
      </div>

      {/* Featured Men's Categories section */}
      <div className="mt-20 max-w-5xl mx-auto w-full px-4">
        <div className="text-center mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Discover Handcrafted Heritage</span>
          <h3 className="font-serif text-xl font-bold text-foreground mt-1">Curated Royal Menswear</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Royal Kurtas', href: '/category/kurta', img: '/images/category-kurta.jpg' },
            { name: 'Bespoke Sherwanis', href: '/category/sherwani', img: '/images/category-sherwani.jpg' },
            { name: 'Kurta Jacket Sets', href: '/category/kurta-jacket', img: '/images/category-kurta-jacket.jpg' },
            { name: 'Imperial Wedding', href: '/new-arrivals', img: '/images/collection-wedding.jpg' },
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:border-primary/40 transition-all block"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <p className="font-serif text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-white/80">View Collection →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}