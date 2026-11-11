'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon as HeartOutline,
  ShoppingBagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';

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
    fabricNote: 'Pure Mulberry Silk • Antique Zardozi & Pearl Buttons',
    price: 28999,
    tag: 'Signature',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/product/1',
  },
  {
    id: 'coronation-2',
    name: 'Suryagarh Coronation Achkan',
    fabricNote: 'Handloom Raw Silk • 24K Bullion Collar Relief',
    price: 31999,
    tag: '10% Atelier Privilege',
    imageSrc: '/images/sherwani-wedding.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'coronation-3',
    name: 'Maharaja Velvet & Zari Sherwani',
    fabricNote: 'Banarasi Brocade • Sterling Dabka Shoulder Crest',
    price: 34499,
    imageSrc: '/images/category-sherwani.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'coronation-4',
    name: 'Royal Festive Cream Bandhgala',
    fabricNote: 'Tailored Matka Silk • Engraved Gold Heraldry',
    price: 19999,
    tag: 'Limited Run',
    imageSrc: '/images/sherwani-festive.jpg',
    href: '/category/kurta-jacket',
  },
  {
    id: 'coronation-5',
    name: 'Nizam Wedding Heritage Ensemble',
    fabricNote: 'Cashmere Cream • Paired with Tilla Doshala',
    price: 26499,
    imageSrc: '/images/collection-wedding.jpg',
    href: '/new-arrivals',
  },
];

export default function CoronationCurvedCarousel() {
  const { addItem } = useCart();
  const [centerIndex, setCenterIndex] = useState(1);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const total = coronationLooks.length;
  const active = coronationLooks[centerIndex];

  const prev = () => setCenterIndex((i) => (i - 1 + total) % total);
  const next = () => setCenterIndex((i) => (i + 1) % total);

  const getRelativeOffset = (index: number) => {
    let diff = index - centerIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const handleAddCenter = () => {
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
  };

  return (
    <section
      id="groom-coronation"
      aria-labelledby="groom-coronation-heading"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>The Groom Coronation Edit</span>
          </div>
          <h2
            id="groom-coronation-heading"
            className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            For the Baraat &amp; <span className="text-gold-foil">Every Vow After</span>
          </h2>
        </div>

        {/* 3D Curved Arch Carousel Stage */}
        <div className="relative h-[430px] sm:h-[490px] flex items-center justify-center overflow-hidden">
          {coronationLooks.map((item, idx) => {
            const offset = getRelativeOffset(idx);
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const isVisible = absOffset <= 2;

            const translateX = offset * 230;
            const translateY = absOffset * absOffset * 18;
            const rotateZ = offset * 7;
            const scale = isCenter ? 1 : absOffset === 1 ? 0.84 : 0.7;
            const opacity = !isVisible ? 0 : isCenter ? 1 : absOffset === 1 ? 0.68 : 0.35;
            const zIndex = 20 - absOffset * 5;

            return (
              <div
                key={item.id}
                onClick={() => setCenterIndex(idx)}
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotateZ}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                className="absolute w-[250px] sm:w-[290px] aspect-[3/4.2] transition-all duration-500 ease-out cursor-pointer"
              >
                <div
                  className={`relative w-full h-full rounded-t-full rounded-b-3xl overflow-hidden p-[3px] transition-all duration-500 ${
                    isCenter
                      ? 'bg-gradient-to-b from-[#FCF6BA] via-[#C5A059] to-[#9C7A3C] shadow-[0_25px_60px_-10px_rgba(197,160,89,0.5)]'
                      : 'bg-border/60 shadow-xl'
                  }`}
                >
                  <div className="relative w-full h-full rounded-t-full rounded-b-[21px] overflow-hidden bg-secondary">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="290px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    {item.tag && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#C5A059]/60 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#FCF6BA] whitespace-nowrap">
                          {item.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Center Card Caption & Controls */}
        <div className="mt-6 max-w-xl mx-auto text-center space-y-4">
          <div>
            <Link
              href={active.href}
              className="font-serif text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {active.name}
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {active.fabricNote}
            </p>
            <p className="font-serif text-2xl font-black text-primary mt-2">
              ₹{active.price.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={prev}
              aria-label="Previous coronation piece"
              className="p-3 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddCenter}
              className="btn-glass-gold rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] inline-flex items-center gap-2 shadow-lg"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={() =>
                setLiked((p) => ({ ...p, [active.id]: !p[active.id] }))
              }
              aria-label="Wishlist piece"
              className="p-3 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-colors"
            >
              {liked[active.id] ? (
                <HeartSolid className="w-4 h-4 text-primary" />
              ) : (
                <HeartOutline className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={next}
              aria-label="Next coronation piece"
              className="p-3 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

