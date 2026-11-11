'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';

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
  occasion: string;
  subtitle: string;
  heroImage: string;
  bundleDiscountPercent: number;
  pieces: EnsemblePiece[];
}

const curatedLooks: CuratedLook[] = [
  {
    id: 'look-rajsabha',
    code: 'LOOK 01 / BARAAT',
    title: 'The Rajsabha Coronation Ensemble',
    occasion: 'Grand Wedding & Pheras',
    subtitle:
      'Ivory mulberry silk sherwani layered with a hand-spun cashmere doshala and antique emerald kalgi regalia.',
    heroImage: '/images/hero-ethnic.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look1-sherwani',
        role: 'Primary Garment',
        name: 'Imperial Ivory Zardozi Sherwani',
        craft: 'Pure Mulberry Silk • 24K Gold Bullion',
        price: 28999,
        imageSrc: '/images/hero-ethnic.jpg',
        categoryName: 'Sherwani',
      },
      {
        id: 'nf-look1-doshala',
        role: 'Shoulder Drape',
        name: 'Royal Cashmere Doshala Shawl',
        craft: 'Hand-Spun Pashmina • Antique Tilla Border',
        price: 12499,
        imageSrc: '/images/menswear-doshala.jpg',
        categoryName: 'Regalia',
      },
      {
        id: 'nf-look1-regalia',
        role: 'Coronation Accents',
        name: 'Ivory Chanderi Safa & Emerald Kalgi',
        craft: 'Pre-Tied Silk Turban • Crest Cufflinks',
        price: 6499,
        imageSrc: '/images/menswear-accessories.jpg',
        categoryName: 'Regalia',
      },
    ],
  },
  {
    id: 'look-jodhpur',
    code: 'LOOK 02 / DARBAR',
    title: 'The Jodhpur Darbar Bandhgala',
    occasion: 'Cocktail & Diplomatic Reception',
    subtitle:
      'Structured slate-grey silk bandhgala paired with an ivory Chanderi under-kurta and engraved brass crest buttons.',
    heroImage: '/images/category-kurta-jacket.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look2-bandhgala',
        role: 'Tailored Jacket',
        name: 'Tailored Slate Grey Silk Bandhgala',
        craft: '48-Point Bespoke Cut • Brass Crest Buttons',
        price: 15499,
        imageSrc: '/images/category-kurta-jacket.jpg',
        categoryName: 'Bandhgala',
      },
      {
        id: 'nf-look2-kurta',
        role: 'Base Silhouette',
        name: 'Pure Chanderi Cream Silk Kurta',
        craft: 'Banaras Pit-Loom • Resham Neckline',
        price: 5499,
        imageSrc: '/images/category-kurta.jpg',
        categoryName: 'Kurta',
      },
      {
        id: 'nf-look2-cufflinks',
        role: 'Finishing Accent',
        name: 'Heraldic Gold Cufflink & Mojari Set',
        craft: 'Hand-Embroidered Velvet & Sterling Brass',
        price: 4299,
        imageSrc: '/images/menswear-accessories.jpg',
        categoryName: 'Regalia',
      },
    ],
  },
  {
    id: 'look-gala',
    code: 'LOOK 03 / SANGEET',
    title: 'The Midnight Gala Indo-Western',
    occasion: 'Sangeet & Black-Tie Evening',
    subtitle:
      'Sculpted charcoal brocade tuxedo cut with asymmetric silk lapels, paired with tonal trousers and woven stole.',
    heroImage: '/images/menswear-indo-western.jpg',
    bundleDiscountPercent: 10,
    pieces: [
      {
        id: 'nf-look3-tuxedo',
        role: 'Statement Outerwear',
        name: 'Charcoal Gala Brocade Indo-Western',
        craft: 'Banarasi Jacquard • Satin Peak Lapels',
        price: 18999,
        imageSrc: '/images/menswear-indo-western.jpg',
        categoryName: 'Bandhgala',
      },
      {
        id: 'nf-look3-kurta',
        role: 'Layered Kurta',
        name: 'Charcoal & Silver Zari Kurta Set',
        craft: 'Pure Tussar Silk • Asymmetric Placket',
        price: 7499,
        imageSrc: '/images/kurta-2.jpg',
        categoryName: 'Kurta',
      },
      {
        id: 'nf-look3-shawl',
        role: 'Evening Drape',
        name: 'Tilla-Bordered Ceremonial Stole',
        craft: 'Cashmere Blend • Hand-Knotted Fringe',
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
          description: `${piece.craft} — from ${currentLook.title}`,
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
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Interactive Ensemble Stylist</span>
            </div>
            <h2
              id="try-the-look-heading"
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
            >
              Try the Look.{' '}
              <span className="text-gold-foil">Complete Groom Styling.</span>
            </h2>
          </div>

          {/* Look Switcher Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              {curatedLooks.map((look, idx) => (
                <button
                  key={look.id}
                  onClick={() => setLookIndex(idx)}
                  aria-label={`Select ${look.title}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === lookIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-all"
              aria-label="Previous Look"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-all"
              aria-label="Next Look"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Showcase: Styled Model Portrait + "In This Look" Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Styled Portrait Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-full min-h-[480px] sm:min-h-[580px] rounded-3xl overflow-hidden glass-panel p-2.5 border border-primary/35 shadow-2xl">
              <div className="relative w-full h-full min-h-[460px] sm:min-h-[560px] rounded-2xl overflow-hidden bg-secondary">
                <Image
                  src={currentLook.heroImage}
                  alt={currentLook.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="glass-pill px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {currentLook.code}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#FCF6BA] border border-[#C5A059]/40">
                    {currentLook.occasion}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {currentLook.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-2 font-light leading-relaxed">
                    {currentLook.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: "In This Look" Breakdown Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl glass-panel-gold p-6 sm:p-8 border border-primary/35 shadow-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-border/70">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    In This Look
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                    Curated Menswear Breakdown
                  </h3>
                </div>
                <span className="luxury-tag">
                  Save {currentLook.bundleDiscountPercent}% on Full Ensemble
                </span>
              </div>

              {/* Piece List */}
              <div className="mt-6 space-y-4">
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
                      className={`group flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        checked
                          ? 'glass-card border-primary/50 shadow-md'
                          : 'bg-background/40 border-border/60 opacity-65 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Selection Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${
                            checked
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted-foreground/40 bg-transparent'
                          }`}
                        >
                          {checked && <CheckIcon className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>

                        {/* Piece Thumbnail */}
                        <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-secondary border border-border/70">
                          <Image
                            src={piece.imageSrc}
                            alt={piece.name}
                            fill
                            sizes="64px"
                            className="object-cover object-top"
                          />
                        </div>

                        {/* Piece Info */}
                        <div className="min-w-0">
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-primary">
                            {piece.role}
                          </span>
                          <p className="font-serif text-sm sm:text-base font-bold text-foreground truncate">
                            {piece.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {piece.craft}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-serif text-sm sm:text-base font-bold text-foreground">
                          ₹{piece.price.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {checked ? 'Included' : 'Tap to add'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bundle Footer & Actions */}
            <div className="mt-8 pt-6 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {isFullBundle
                    ? `Complete Ensemble (${selectedPieces.length} Pieces • ${currentLook.bundleDiscountPercent}% Bundle Privilege)`
                    : `Selected Pieces (${selectedPieces.length} of ${currentLook.pieces.length})`}
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-serif text-2xl sm:text-3xl font-black text-foreground">
                    ₹{discountedTotal.toLocaleString('en-IN')}
                  </span>
                  {isFullBundle && rawTotal > discountedTotal && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{rawTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddSelectedToBag}
                  disabled={selectedPieces.length === 0}
                  className="btn-glass-gold rounded-full px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.16em] font-bold inline-flex items-center gap-2 disabled:opacity-40"
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>
                    {isFullBundle ? 'Add Full Look to Bag' : 'Add Selected to Bag'}
                  </span>
                </button>
                <Link
                  href="/contact"
                  className="glass-pill px-5 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold text-foreground hover:text-primary transition-colors"
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

