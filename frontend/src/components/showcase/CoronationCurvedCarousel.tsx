'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';
import { formatEuro } from '@/lib/currency';

interface CoronationLook {
  id: string;
  name: string;
  fabricNote: string;
  price: number;
  tag?: string;
  imageSrc: string;
  href: string;
}

const coronationLooks: CoronationLook[] = [
  {
    id: 'coronation-1',
    name: 'Udaipur Palace Ivory Sherwani',
    fabricNote: 'Pure Mulberry Silk — Antique Zardozi & Pearl Buttons',
    price: 28999,
    tag: 'Signature Piece',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/product/1',
  },
  {
    id: 'coronation-2',
    name: 'Suryagarh Coronation Achkan',
    fabricNote: 'Handloom Raw Silk — 24K Bullion Collar Relief',
    price: 31999,
    tag: 'Atelier Edition',
    imageSrc: '/images/sherwani-wedding.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'coronation-3',
    name: 'Maharaja Velvet & Zari Sherwani',
    fabricNote: 'Banarasi Brocade — Sterling Dabka Shoulder Crest',
    price: 34499,
    imageSrc: '/images/category-sherwani.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'coronation-4',
    name: 'Royal Festive Cream Bandhgala',
    fabricNote: 'Tailored Matka Silk — Engraved Gold Heraldry',
    price: 19999,
    tag: 'Limited Run',
    imageSrc: '/images/sherwani-festive.jpg',
    href: '/category/kurta-jacket',
  },
  {
    id: 'coronation-5',
    name: 'Nizam Wedding Heritage Ensemble',
    fabricNote: 'Cashmere Cream — Paired with Tilla Doshala',
    price: 26499,
    imageSrc: '/images/collection-wedding.jpg',
    href: '/new-arrivals',
  },
];

export default function CoronationCurvedCarousel() {
  const { addItem } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  const total = coronationLooks.length;
  const active = coronationLooks[activeIndex];

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const next = () => setActiveIndex((i) => (i + 1) % total);

  const handleAdd = () => {
    addItem(
      buildShowcaseCartItem({
        id: active.id,
        name: active.name,
        description: active.fabricNote,
        price: active.price,
        imageSrc: active.imageSrc,
        categoryName: 'Sherwani',
        fabric: active.fabricNote,
      })
    );
    toast.success(`${active.name} added to bag`);
  };

  return (
    <section className="py-20 sm:py-28 border-t border-border bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] w-full max-w-lg mx-auto overflow-hidden bg-muted">
              <Image
                src={active.imageSrc}
                alt={active.name}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-top transition-opacity duration-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  The Coronation Edit
                </p>
                <span className="text-xs tabular-nums text-muted-foreground">
                  0{activeIndex + 1} / 0{total}
                </span>
              </div>

              {active.tag && (
                <p className="text-[10px] uppercase tracking-[0.24em] text-accent pt-2">
                  {active.tag}
                </p>
              )}

              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground leading-tight">
                {active.name}
              </h2>

              <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed max-w-md">
                {active.fabricNote}
              </p>

              <p className="text-lg font-normal text-foreground tabular-nums pt-2">
                {formatEuro(active.price)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleAdd}
                className="px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Add to Bag
              </button>
              <Link
                href={active.href}
                className="px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
              >
                View Silhouette
              </Link>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {coronationLooks.map((look, idx) => (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Select ${look.name}`}
                    className={`h-0.5 transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-8 bg-foreground'
                        : 'w-4 bg-border hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous look"
                  className="h-10 w-10 flex items-center justify-center border border-border text-foreground hover:border-foreground transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next look"
                  className="h-10 w-10 flex items-center justify-center border border-border text-foreground hover:border-foreground transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
