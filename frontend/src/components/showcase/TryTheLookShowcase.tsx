'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';
import { formatEuro } from '@/lib/currency';

interface EnsemblePiece {
  id: string;
  role: string;
  name: string;
  craft: string;
  price: number;
  imageSrc: string;
  categoryName: string;
}

interface CuratedLook {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  heroImage: string;
  bundleDiscountPercent: number;
  pieces: EnsemblePiece[];
}

const curatedLooks: CuratedLook[] = [
  {
    id: 'look-rajsabha',
    code: 'Look 01',
    title: 'The Rajsabha Coronation Ensemble',
    subtitle:
      'Ivory mulberry silk sherwani layered with a hand-spun cashmere doshala and emerald kalgi regalia.',
    heroImage: '/images/hero-ethnic.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look1-sherwani',
        role: 'Primary Garment',
        name: 'Imperial Ivory Zardozi Sherwani',
        craft: 'Pure Mulberry Silk, 24K Gold Bullion',
        price: 28999,
        imageSrc: '/images/hero-ethnic.jpg',
        categoryName: 'Sherwani',
      },
      {
        id: 'nf-look1-doshala',
        role: 'Shoulder Drape',
        name: 'Royal Cashmere Doshala Shawl',
        craft: 'Hand-Spun Pashmina, Antique Tilla',
        price: 12499,
        imageSrc: '/images/menswear-doshala.jpg',
        categoryName: 'Regalia',
      },
      {
        id: 'nf-look1-regalia',
        role: 'Finishing Accents',
        name: 'Ivory Chanderi Safa & Emerald Kalgi',
        craft: 'Pre-Tied Silk Turban, Crest Cufflinks',
        price: 6499,
        imageSrc: '/images/menswear-accessories.jpg',
        categoryName: 'Regalia',
      },
    ],
  },
  {
    id: 'look-jodhpur',
    code: 'Look 02',
    title: 'The Jodhpur Darbar Bandhgala',
    subtitle:
      'Structured slate-grey silk bandhgala paired with an ivory Chanderi kurta and engraved brass buttons.',
    heroImage: '/images/category-kurta-jacket.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look2-bandhgala',
        role: 'Tailored Jacket',
        name: 'Tailored Slate Grey Silk Bandhgala',
        craft: '48-Point Bespoke Cut, Brass Buttons',
        price: 15499,
        imageSrc: '/images/category-kurta-jacket.jpg',
        categoryName: 'Bandhgala',
      },
      {
        id: 'nf-look2-kurta',
        role: 'Base Silhouette',
        name: 'Pure Chanderi Cream Silk Kurta',
        craft: 'Banaras Pit-Loom, Resham Neckline',
        price: 5499,
        imageSrc: '/images/category-kurta.jpg',
        categoryName: 'Kurta',
      },
      {
        id: 'nf-look2-cufflinks',
        role: 'Finishing Accent',
        name: 'Heraldic Gold Cufflink & Mojari Set',
        craft: 'Hand-Embroidered Velvet & Brass',
        price: 4299,
        imageSrc: '/images/menswear-accessories.jpg',
        categoryName: 'Regalia',
      },
    ],
  },
  {
    id: 'look-gala',
    code: 'Look 03',
    title: 'The Midnight Gala Indo-Western',
    subtitle:
      'Sculpted charcoal brocade tuxedo cut with asymmetric silk lapels and woven ceremonial stole.',
    heroImage: '/images/menswear-indo-western.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look3-tuxedo',
        role: 'Outerwear',
        name: 'Charcoal Gala Brocade Indo-Western',
        craft: 'Banarasi Jacquard, Satin Lapels',
        price: 18999,
        imageSrc: '/images/menswear-indo-western.jpg',
        categoryName: 'Bandhgala',
      },
      {
        id: 'nf-look3-kurta',
        role: 'Layered Kurta',
        name: 'Charcoal & Silver Zari Kurta Set',
        craft: 'Pure Tussar Silk, Asymmetric Placket',
        price: 7499,
        imageSrc: '/images/kurta-2.jpg',
        categoryName: 'Kurta',
      },
      {
        id: 'nf-look3-shawl',
        role: 'Evening Drape',
        name: 'Tilla-Bordered Ceremonial Stole',
        craft: 'Cashmere Blend, Hand-Knotted Fringe',
        price: 5999,
        imageSrc: '/images/menswear-doshala.jpg',
        categoryName: 'Regalia',
      },
    ],
  },
];

export default function TryTheLookShowcase() {
  const { addItem } = useCart();
  const [lookIndex, setLookIndex] = useState(0);
  const [selectedPieceIds, setSelectedPieceIds] = useState<Record<string, boolean>>({});

  const currentLook = curatedLooks[lookIndex];
  const isPieceSelected = (pieceId: string) => selectedPieceIds[pieceId] ?? true;

  const togglePiece = (pieceId: string) => {
    setSelectedPieceIds((prev) => ({
      ...prev,
      [pieceId]: !(prev[pieceId] ?? true),
    }));
  };

  const selectedPieces = currentLook.pieces.filter((p) => isPieceSelected(p.id));
  const rawTotal = selectedPieces.reduce((sum, p) => sum + p.price, 0);
  const isFullBundle = selectedPieces.length === currentLook.pieces.length;
  const discountedTotal = isFullBundle
    ? Math.round(rawTotal * (1 - currentLook.bundleDiscountPercent / 100))
    : rawTotal;

  const handleAddSelectedToBag = () => {
    selectedPieces.forEach((piece) => {
      addItem(
        buildShowcaseCartItem({
          id: piece.id,
          name: piece.name,
          description: `${piece.craft} — ${currentLook.title}`,
          price: piece.price,
          imageSrc: piece.imageSrc,
          categoryName: piece.categoryName,
          fabric: piece.craft,
        })
      );
    });
  };

  const handlePrev = () => {
    setLookIndex((prev) => (prev === 0 ? curatedLooks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLookIndex((prev) => (prev === curatedLooks.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="try-the-look"
      aria-labelledby="try-the-look-heading"
      className="py-20 sm:py-28 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
              Complete Styling
            </p>
            <h2
              id="try-the-look-heading"
              className="text-2xl sm:text-4xl font-light tracking-tight text-foreground"
            >
              Try the Look
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mr-2">
              {currentLook.code} / 0{curatedLooks.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-2.5 border border-border text-foreground/80 hover:border-foreground hover:text-foreground transition-colors"
              aria-label="Previous Look"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 border border-border text-foreground/80 hover:border-foreground hover:text-foreground transition-colors"
              aria-label="Next Look"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Large Portrait */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
              <Image
                src={currentLook.heroImage}
                alt={currentLook.title}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Minimal Breakdown */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2 pb-6 border-b border-border">
              <h3 className="text-2xl sm:text-3xl font-light text-foreground">
                {currentLook.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                {currentLook.subtitle}
              </p>
            </div>

            <div className="divide-y divide-border">
              {currentLook.pieces.map((piece) => {
                const checked = isPieceSelected(piece.id);
                return (
                  <div
                    key={piece.id}
                    onClick={() => togglePiece(piece.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        togglePiece(piece.id);
                      }
                    }}
                    className={`py-4 flex items-center justify-between gap-4 cursor-pointer transition-opacity ${
                      checked ? 'opacity-100' : 'opacity-45 hover:opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-4 h-4 flex items-center justify-center flex-shrink-0 border transition-colors ${
                          checked
                            ? 'bg-foreground border-foreground text-background'
                            : 'border-border bg-transparent'
                        }`}
                      >
                        {checked && <CheckIcon className="w-3 h-3 stroke-[2]" />}
                      </div>

                      <div className="relative w-12 h-16 flex-shrink-0 bg-secondary overflow-hidden">
                        <Image
                          src={piece.imageSrc}
                          alt={piece.name}
                          fill
                          sizes="48px"
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {piece.role}
                        </p>
                        <p className="text-sm font-normal text-foreground truncate mt-0.5">
                          {piece.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-light truncate">
                          {piece.craft}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-normal text-foreground flex-shrink-0 tabular-nums">
                      {formatEuro(piece.price)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {isFullBundle
                    ? `Complete Ensemble (${currentLook.bundleDiscountPercent}% Privilege Applied)`
                    : `${selectedPieces.length} of ${currentLook.pieces.length} Selected`}
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-light text-foreground tabular-nums">
                    {formatEuro(discountedTotal)}
                  </span>
                  {isFullBundle && rawTotal > discountedTotal && (
                    <span className="text-xs text-muted-foreground line-through tabular-nums">
                      {formatEuro(rawTotal)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleAddSelectedToBag}
                  disabled={selectedPieces.length === 0}
                  className="px-8 py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
                >
                  {isFullBundle ? 'Add Full Look' : 'Add Selected'}
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 border border-border text-foreground text-[11px] uppercase tracking-[0.2em] hover:border-foreground transition-colors"
                >
                  Book Styling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
