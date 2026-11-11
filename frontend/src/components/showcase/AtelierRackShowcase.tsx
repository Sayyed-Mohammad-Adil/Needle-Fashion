'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  HeartIcon as HeartOutline,
  ShoppingBagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';

type RackCategory = 'All' | 'Sherwanis' | 'Bandhgalas' | 'Kurtas' | 'Regalia';

interface RackGarment {
  id: string;
  name: string;
  category: Exclude<RackCategory, 'All'>;
  price: number;
  fabric: string;
  craftDetail: string;
  frontImage: string;
  detailImage: string;
  href: string;
}

const rackGarments: RackGarment[] = [
  {
    id: 'rack-1',
    name: 'RAJSABHA IVORY SHERWANI',
    category: 'Sherwanis',
    price: 28999,
    fabric: 'Pure Mulberry Silk • 24K Zardozi',
    craftDetail: '140 karigar hours of antique dabka and marodi bullion relief along the mandarin collar.',
    frontImage: '/images/hero-ethnic.jpg',
    detailImage: '/images/menswear-karigar.jpg',
    href: '/product/1',
  },
  {
    id: 'rack-2',
    name: 'JODHPUR SLATE BANDHGALA',
    category: 'Bandhgalas',
    price: 15499,
    fabric: 'Handwoven Matka Silk • Brass Crests',
    craftDetail: '48-point anatomical shoulder slope with hand-cast antique brass royal buttons.',
    frontImage: '/images/category-kurta-jacket.jpg',
    detailImage: '/images/kurta-jacket-1.jpg',
    href: '/product/2',
  },
  {
    id: 'rack-3',
    name: 'CHANDERI HEIRLOOM KURTA',
    category: 'Kurtas',
    price: 5499,
    fabric: 'Pure Banaras Pit-Loom Chanderi',
    craftDetail: 'Fine ivory resham embroidery with mother-of-pearl placket closures.',
    frontImage: '/images/category-kurta.jpg',
    detailImage: '/images/kurta-1.jpg',
    href: '/product/3',
  },
  {
    id: 'rack-4',
    name: 'CHARCOAL GALA INDO-WESTERN',
    category: 'Bandhgalas',
    price: 18999,
    fabric: 'Midnight Brocade • Satin Lapels',
    craftDetail: 'Sculpted asymmetric front drape engineered for black-tie receptions.',
    frontImage: '/images/menswear-indo-western.jpg',
    detailImage: '/images/kurta-2.jpg',
    href: '/product/4',
  },
  {
    id: 'rack-5',
    name: 'KASHMIR TILLA DOSHALA',
    category: 'Regalia',
    price: 12499,
    fabric: 'Hand-Spun Cashmere Pashmina',
    craftDetail: 'Heirloom paisley borders worked in metallic tilla thread over pure ivory wool.',
    frontImage: '/images/menswear-doshala.jpg',
    detailImage: '/images/menswear-accessories.jpg',
    href: '/product/5',
  },
  {
    id: 'rack-6',
    name: 'CORONATION ACHKAN SET',
    category: 'Sherwanis',
    price: 31999,
    fabric: 'Raw Silk • Sterling Silver Dabka',
    craftDetail: 'Full-length achkan cut paired with tailored churidar and tissue silk stole.',
    frontImage: '/images/sherwani-wedding.jpg',
    detailImage: '/images/sherwani-2.jpg',
    href: '/category/sherwani',
  },
];

const rackTabs: RackCategory[] = ['All', 'Sherwanis', 'Bandhgalas', 'Kurtas', 'Regalia'];
const sizeChips: Array<number | 'customize'> = [36, 38, 40, 42, 44, 'customize'];

export default function AtelierRackShowcase() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<RackCategory>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'detail'>('front');
  const [selectedSize, setSelectedSize] = useState<number | 'customize'>(40);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const visibleGarments =
    selectedCategory === 'All'
      ? rackGarments
      : rackGarments.filter((g) => g.category === selectedCategory);

  const activeGarment = activeIndex !== null ? visibleGarments[activeIndex] ?? null : null;

  const openGarment = (idx: number) => {
    setActiveIndex(idx);
    setViewMode('front');
  };

  const navigateHanger = (dir: -1 | 1) => {
    if (activeIndex === null || visibleGarments.length === 0) return;
    setViewMode('front');
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + dir + visibleGarments.length) % visibleGarments.length;
    });
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddActiveToBag = () => {
    if (!activeGarment) return;
    addItem(
      buildShowcaseCartItem({
        id: activeGarment.id,
        name: activeGarment.name,
        description: `${activeGarment.fabric} — ${activeGarment.craftDetail}`,
        price: activeGarment.price,
        imageSrc: activeGarment.frontImage,
        categoryName: activeGarment.category,
        fabric: activeGarment.fabric,
        size: selectedSize,
      })
    );
  };

  return (
    <section
      id="atelier-rack"
      aria-labelledby="atelier-rack-heading"
      className="py-20 sm:py-28 relative overflow-hidden bg-white/50 dark:bg-[#13151B]/70 border-y border-primary/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Private Showroom Rail</span>
            </div>
            <h2
              id="atelier-rack-heading"
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
            >
              Browse the <span className="text-gold-foil">Atelier Rack</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl">
              Tap any hanger to lift the garment off our brass rail, inspect the weave and craft notes, and select your bespoke chest size.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {rackTabs.map((tab) => {
              const active = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedCategory(tab);
                    setActiveIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all ${
                    active
                      ? 'btn-glass-gold shadow-md'
                      : 'glass-pill text-foreground hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Virtual Brass Clothing Rail */}
        <div className="relative pt-8 pb-4">
          {/* Horizontal Brass Rail Bar */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-8 left-4 right-4 h-2.5 rounded-full bg-gradient-to-b from-[#FCF6BA] via-[#C5A059] to-[#7D5E24] shadow-[0_6px_14px_rgba(0,0,0,0.25)] z-0"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 relative z-10">
            {visibleGarments.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => openGarment(idx)}
                className="group flex flex-col items-center text-left focus:outline-none"
              >
                {/* Brass Hook & Wooden Hanger Neck */}
                <div className="flex flex-col items-center -mb-1 transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="w-4 h-5 rounded-t-full border-2 border-[#C5A059] border-b-0" />
                  <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-[#5D3F24] via-[#8B6239] to-[#5D3F24] shadow-md border border-[#C5A059]/40" />
                </div>

                {/* Hanging Garment Card */}
                <div className="w-full rounded-2xl overflow-hidden glass-card border border-primary/30 p-1.5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_24px_45px_-12px_rgba(197,160,89,0.4)]">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
                    <Image
                      src={item.frontImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[8.5px] uppercase tracking-[0.18em] text-[#FCF6BA] font-bold block">
                        {item.category}
                      </span>
                      <p className="font-serif text-xs font-bold leading-snug line-clamp-1 mt-0.5">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-semibold text-[#DFB76C] mt-0.5">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lift-Off Rack Detail Inspection Overlay */}
      {activeGarment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Inspect ${activeGarment.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xl"
          onClick={() => setActiveIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl glass-panel-gold border border-primary/50 shadow-2xl overflow-hidden"
          >
            {/* Top Controls: Prev / Next / Close */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateHanger(-1)}
                  className="p-2 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-colors"
                  aria-label="Previous hanger"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateHanger(1)}
                  className="p-2 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-colors"
                  aria-label="Next hanger"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground ml-2">
                  Hanger {(activeIndex ?? 0) + 1} of {visibleGarments.length}
                </span>
              </div>

              <button
                onClick={() => setActiveIndex(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary"
              >
                <span>Close</span>
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8 items-center">
              {/* Left: Lifted Garment Image + Front / Craft Toggle */}
              <div className="md:col-span-6">
                <div className="relative aspect-[3/4] w-full max-h-[430px] rounded-2xl overflow-hidden border border-primary/35 bg-secondary shadow-xl">
                  <Image
                    src={
                      viewMode === 'front'
                        ? activeGarment.frontImage
                        : activeGarment.detailImage
                    }
                    alt={activeGarment.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover object-top"
                  />
                  {/* Front / Craft Detail Toggle */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-black/65 backdrop-blur-md border border-[#C5A059]/40">
                    <button
                      onClick={() => setViewMode('front')}
                      className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        viewMode === 'front'
                          ? 'bg-[#C5A059] text-[#121316]'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Front View
                    </button>
                    <button
                      onClick={() => setViewMode('detail')}
                      className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        viewMode === 'detail'
                          ? 'bg-[#C5A059] text-[#121316]'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Craft Detail
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Details, Size Chips, Add to Bag */}
              <div className="md:col-span-6 space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    {activeGarment.category} • Atelier Rail
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-foreground mt-1">
                    {activeGarment.name}
                  </h3>
                  <p className="font-serif text-2xl font-black text-primary mt-2">
                    ₹{activeGarment.price.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl glass-card space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {activeGarment.fabric}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeGarment.craftDetail}
                  </p>
                </div>

                {/* Size Chips 36–44 + Bespoke */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Select Chest Size
                    </span>
                    <Link
                      href={activeGarment.href}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      See full specification &rarr;
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeChips.map((chip) => {
                      const active = selectedSize === chip;
                      return (
                        <button
                          key={String(chip)}
                          onClick={() => setSelectedSize(chip)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            active
                              ? 'bg-primary text-primary-foreground border-primary shadow-md'
                              : 'glass-card text-foreground border-border hover:border-primary/60'
                          }`}
                        >
                          {chip === 'customize' ? '48-Pt Bespoke' : chip}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleAddActiveToBag}
                    className="flex-1 btn-glass-gold rounded-full py-3.5 px-6 text-xs font-bold uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => toggleLike(activeGarment.id)}
                    aria-label="Toggle wishlist"
                    className="w-12 h-12 rounded-full glass-pill flex items-center justify-center text-foreground hover:text-primary transition-colors"
                  >
                    {likedIds[activeGarment.id] ? (
                      <HeartSolid className="w-5 h-5 text-primary" />
                    ) : (
                      <HeartOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

