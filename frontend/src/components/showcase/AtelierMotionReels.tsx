'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface AtelierReel {
  id: string;
  reelNumber: string;
  duration: string;
  fabricType: string;
  title: string;
  location: string;
  storyNote: string;
  imageSrc: string;
  href: string;
}

const atelierReels: AtelierReel[] = [
  {
    id: 'reel-01',
    reelNumber: '01',
    duration: '0:42',
    fabricType: '24K Zardozi on Silk',
    title: 'Dawn at the Karigar Frame',
    location: 'Lucknow Zari Karkhana',
    storyNote: 'Four master embroiderers hand-coiling antique dabka wires across an ivory sherwani chest panel.',
    imageSrc: '/images/menswear-karigar.jpg',
    href: '/about',
  },
  {
    id: 'reel-02',
    reelNumber: '02',
    duration: '0:36',
    fabricType: 'Pure Matka Bandhgala',
    title: 'The 48-Point Chalk Cut',
    location: 'Jodhpur Private Salon',
    storyNote: 'Sculpting shoulder pitch and sleeve poise before basting the final slate-grey silk shell.',
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/category/kurta-jacket',
  },
  {
    id: 'reel-03',
    reelNumber: '03',
    duration: '0:54',
    fabricType: 'Mulberry Imperial Sherwani',
    title: 'Baraat Entry at City Palace',
    location: 'Udaipur Courtyard',
    storyNote: 'Ivory mulberry silk catching twilight gold as the groom steps onto the marble colonnade.',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'reel-04',
    reelNumber: '04',
    duration: '0:31',
    fabricType: 'Hand-Spun Pashmina',
    title: 'Draping the Royal Doshala',
    location: 'Srinagar Loom Collective',
    storyNote: 'Tilla-bordered cashmere folded over a tailored bandhgala for crisp winter receptions.',
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/new-arrivals',
  },
  {
    id: 'reel-05',
    reelNumber: '05',
    duration: '0:48',
    fabricType: 'Banaras Pit-Loom Chanderi',
    title: 'The Sangeet Silhouette',
    location: 'Varanasi Ghats Atelier',
    storyNote: 'Lightweight breathable handloom silk woven without synthetic threads for effortless movement.',
    imageSrc: '/images/category-kurta.jpg',
    href: '/category/kurta',
  },
];

export default function AtelierMotionReels() {
  const [centerIndex, setCenterIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fullscreenReel, setFullscreenReel] = useState<AtelierReel | null>(null);

  const total = atelierReels.length;

  useEffect(() => {
    if (!isPlaying || fullscreenReel) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCenterIndex((c) => (c + 1) % total);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isPlaying, fullscreenReel, total]);

  const handleSelectReel = (idx: number) => {
    if (idx === centerIndex) {
      setFullscreenReel(atelierReels[idx]);
    } else {
      setCenterIndex(idx);
      setProgress(0);
    }
  };

  const getOffset = (idx: number) => {
    let diff = idx - centerIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="craft-in-motion"
      aria-labelledby="craft-in-motion-heading"
      className="py-20 sm:py-28 relative overflow-hidden bg-white/50 dark:bg-[#13151B]/70 border-y border-primary/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row: Title + Play/Pause/Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Atelier Lookbook Reels</span>
            </div>
            <h2
              id="craft-in-motion-heading"
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
            >
              Tailoring, <span className="text-gold-foil">in motion.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCenterIndex((c) => (c - 1 + total) % total);
                setProgress(0);
              }}
              aria-label="Previous reel"
              className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause reels' : 'Play reels'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-pill hover:border-primary text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCenterIndex((c) => (c + 1) % total);
                setProgress(0);
              }}
              aria-label="Next reel"
              className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Curved Arc of Vertical Lookbook Reels */}
        <div className="relative h-[430px] sm:h-[480px] flex items-center justify-center overflow-hidden">
          {atelierReels.map((reel, idx) => {
            const offset = getOffset(idx);
            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            const visible = abs <= 2;

            const translateX = offset * 215;
            const translateY = abs * abs * 16;
            const rotateY = offset * -12;
            const scale = isCenter ? 1 : abs === 1 ? 0.84 : 0.68;
            const opacity = !visible ? 0 : isCenter ? 1 : abs === 1 ? 0.72 : 0.4;
            const zIndex = 20 - abs * 5;

            return (
              <div
                key={reel.id}
                onClick={() => handleSelectReel(idx)}
                style={{
                  transform: `perspective(1200px) translateX(${translateX}px) translateY(${translateY}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: visible ? 'auto' : 'none',
                }}
                className="absolute w-[235px] sm:w-[270px] aspect-[9/15] rounded-3xl overflow-hidden border border-[#C5A059]/45 shadow-2xl transition-all duration-500 ease-out cursor-pointer group"
              >
                <Image
                  src={reel.imageSrc}
                  alt={reel.title}
                  fill
                  sizes="270px"
                  className={`object-cover object-top transition-transform duration-[4000ms] ease-out ${
                    isCenter && isPlaying ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35" />

                {/* Top Meta Row */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-[#C5A059]/40 text-[10px] font-mono text-[#FCF6BA]">
                    REEL {reel.reelNumber}
                  </span>
                  <span className="text-[10px] font-mono text-white/80 bg-black/45 px-2 py-0.5 rounded-full">
                    {reel.duration}
                  </span>
                </div>

                {/* Center Play Badge */}
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-[#FCF6BA]/60 flex items-center justify-center text-[#FCF6BA] group-hover:scale-110 transition-transform shadow-xl">
                      <PlayIcon className="w-6 h-6 ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Caption & Gold Progress Bar */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#DFB76C] block">
                    {reel.fabricType}
                  </span>
                  <h3 className="font-serif text-lg font-bold leading-snug">
                    {reel.title}
                  </h3>
                  <p className="text-[11px] text-white/75">{reel.location}</p>

                  {isCenter && (
                    <div className="pt-2">
                      <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C5A059] to-[#FCF6BA] transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[9.5px] text-white/60 mt-1.5">
                        Tap center reel to expand atelier story
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Atelier Story Modal */}
      {fullscreenReel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fullscreenReel.title}
          onClick={() => setFullscreenReel(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#C5A059]/50 bg-[#121316] shadow-2xl"
          >
            <button
              onClick={() => setFullscreenReel(null)}
              aria-label="Close reel"
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:text-[#DFB76C] border border-white/20"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="relative aspect-[9/14] w-full">
              <Image
                src={fullscreenReel.imageSrc}
                alt={fullscreenReel.title}
                fill
                sizes="448px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2.5">
                <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCF6BA]">
                  {fullscreenReel.fabricType} • {fullscreenReel.location}
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  {fullscreenReel.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {fullscreenReel.storyNote}
                </p>
                <div className="pt-2">
                  <Link
                    href={fullscreenReel.href}
                    onClick={() => setFullscreenReel(null)}
                    className="btn-glass-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.16em]"
                  >
                    Explore This Collection &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

