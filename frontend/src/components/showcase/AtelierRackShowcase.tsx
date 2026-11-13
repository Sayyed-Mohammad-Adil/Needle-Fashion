'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';
import { formatEuro } from '@/lib/currency';

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
    name: 'Rajsabha Ivory Sherwani',
    category: 'Sherwanis',
    price: 28999,
    fabric: 'Pure Mulberry Silk, 24K Zardozi',
    craftDetail: '140 karigar hours of antique dabka and marodi relief along the mandarin collar.',
    frontImage: '/images/hero-ethnic.jpg',
    detailImage: '/images/menswear-karigar.jpg',
    href: '/product/1',
  },
  {
    id: 'rack-2',
    name: 'Jodhpur Slate Bandhgala',
    category: 'Bandhgalas',
    price: 15499,
    fabric: 'Handwoven Matka Silk, Brass Crests',
    craftDetail: '48-point anatomical shoulder slope with hand-cast antique brass buttons.',
    frontImage: '/images/category-kurta-jacket.jpg',
    detailImage: '/images/kurta-jacket-1.jpg',
    href: '/product/2',
  },
  {
    id: 'rack-3',
    name: 'Chanderi Heirloom Kurta',
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
    name: 'Charcoal Gala Indo-Western',
    category: 'Bandhgalas',
    price: 18999,
    fabric: 'Midnight Brocade, Satin Lapels',
    craftDetail: 'Sculpted asymmetric front drape engineered for black-tie receptions.',
    frontImage: '/images/menswear-indo-western.jpg',
    detailImage: '/images/kurta-2.jpg',
    href: '/product/4',
  },
  {
    id: 'rack-5',
    name: 'Kashmir Tilla Doshala',
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
    name: 'Coronation Achkan Set',
    category: 'Sherwanis',
    price: 31999,
    fabric: 'Raw Silk, Sterling Silver Dabka',
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
      className="py-20 sm:py-28 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
              Private Showroom
            </p>
            <h2
              id="atelier-rack-heading"
              className="text-2xl sm:text-4xl font-light tracking-tight text-foreground"
            >
              The Atelier Rail
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-b border-border pb-2">
            {rackTabs.map((tab) => {
              const active = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedCategory(tab);
                    setActiveIndex(null);
                  }}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {visibleGarments.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => openGarment(idx)}
              className="group text-left focus:outline-none"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                <Image
                  src={item.frontImage}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="mt-3.5 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.category}
                </p>
                <p className="text-xs font-normal text-foreground line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatEuro(item.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Minimal Inspection Modal */}
      {activeGarment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Inspect ${activeGarment.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-background border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateHanger(-1)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Previous garment"
                >
                  <ChevronLeftIcon className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  onClick={() => navigateHanger(1)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Next garment"
                >
                  <ChevronRightIcon className="w-4 h-4 stroke-[1.5]" />
                </button>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground ml-2">
                  {(activeIndex ?? 0) + 1} / {visibleGarments.length}
                </span>
              </div>

              <button
                onClick={() => setActiveIndex(null)}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                <span>Close</span>
                <XMarkIcon className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="relative aspect-[3/4] w-full max-h-[440px] bg-secondary overflow-hidden">
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
                </div>
                <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.22em]">
                  <button
                    onClick={() => setViewMode('front')}
                    className={`pb-1 border-b transition-colors ${
                      viewMode === 'front'
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setViewMode('detail')}
                    className={`pb-1 border-b transition-colors ${
                      viewMode === 'detail'
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Craft Detail
                  </button>
                </div>
              </div>

              <div className="md:col-span-6 space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {activeGarment.category}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-light text-foreground mt-1">
                    {activeGarment.name}
                  </h3>
                  <p className="text-lg font-light text-foreground mt-2 tabular-nums">
                    {formatEuro(activeGarment.price)}
                  </p>
                </div>

                <div className="py-4 border-y border-border space-y-1.5">
                  <p className="text-xs font-medium text-foreground">
                    {activeGarment.fabric}
                  </p>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {activeGarment.craftDetail}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Chest Size
                    </span>
                    <Link
                      href={activeGarment.href}
                      className="text-[10px] uppercase tracking-[0.18em] text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      Full Details
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeChips.map((chip) => {
                      const active = selectedSize === chip;
                      return (
                        <button
                          key={String(chip)}
                          onClick={() => setSelectedSize(chip)}
                          className={`px-3.5 py-2 text-xs border transition-colors ${
                            active
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-border text-foreground hover:border-foreground'
                          }`}
                        >
                          {chip === 'customize' ? 'Bespoke' : chip}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAddActiveToBag}
                  className="w-full py-3.5 bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.22em] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
