'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AtelierReel {
  id: string;
  reelNumber: string;
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
    fabricType: '24K Zardozi on Silk',
    title: 'Dawn at the Karigar Frame',
    location: 'Lucknow Karkhana',
    storyNote:
      'Four master embroiderers hand-coiling antique dabka wires across an ivory sherwani chest panel.',
    imageSrc: '/images/menswear-karigar.jpg',
    href: '/about',
  },
  {
    id: 'reel-02',
    reelNumber: '02',
    fabricType: 'Pure Matka Bandhgala',
    title: 'The 48-Point Chalk Cut',
    location: 'Jodhpur Private Salon',
    storyNote:
      'Sculpting shoulder pitch and sleeve poise before basting the final slate-grey silk shell.',
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/category/kurta-jacket',
  },
  {
    id: 'reel-03',
    reelNumber: '03',
    fabricType: 'Mulberry Imperial Sherwani',
    title: 'Baraat at City Palace',
    location: 'Udaipur Courtyard',
    storyNote:
      'Ivory mulberry silk catching twilight gold as the groom steps onto the marble colonnade.',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'reel-04',
    reelNumber: '04',
    fabricType: 'Hand-Spun Pashmina',
    title: 'Draping the Royal Doshala',
    location: 'Srinagar Loom Collective',
    storyNote:
      'Tilla-bordered cashmere folded over a tailored bandhgala for crisp winter receptions.',
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/new-arrivals',
  },
  {
    id: 'reel-05',
    reelNumber: '05',
    fabricType: 'Pit-Loom Chanderi',
    title: 'The Sangeet Silhouette',
    location: 'Varanasi Atelier',
    storyNote:
      'Lightweight breathable handloom silk woven without synthetic threads for effortless movement.',
    imageSrc: '/images/category-kurta.jpg',
    href: '/category/kurta',
  },
];

export default function AtelierMotionReels() {
  const [selectedStory, setSelectedStory] = useState<AtelierReel | null>(null);

  return (
    <section className="py-20 sm:py-28 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
              Maison Journal
            </p>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Notes from the Atelier
            </h2>
          </div>
          <Link
            href="/about"
            className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors border-b border-border pb-1 self-start sm:self-auto"
          >
            Our Heritage
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {atelierReels.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStory(story)}
              className="group text-left flex flex-col focus:outline-none"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted mb-4">
                <Image
                  src={story.imageSrc}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
                {story.reelNumber} — {story.location}
              </p>
              <h3 className="text-sm font-normal text-foreground group-hover:text-accent transition-colors">
                {story.title}
              </h3>
              <p className="text-xs font-light text-muted-foreground mt-1">
                {story.fabricType}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-background border border-border grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              aria-label="Close story"
              className="absolute top-4 right-4 z-10 h-9 w-9 flex items-center justify-center bg-background/90 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            <div className="relative aspect-[3/4] w-full bg-muted">
              <Image
                src={selectedStory.imageSrc}
                alt={selectedStory.title}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover object-top"
              />
            </div>

            <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  {selectedStory.reelNumber} · {selectedStory.location}
                </p>
                <h3 className="text-2xl font-light tracking-tight text-foreground">
                  {selectedStory.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  {selectedStory.fabricType}
                </p>
                <p className="text-sm font-light text-muted-foreground leading-relaxed pt-2">
                  {selectedStory.storyNote}
                </p>
              </div>

              <Link
                href={selectedStory.href}
                onClick={() => setSelectedStory(null)}
                className="inline-block text-center px-6 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Explore Piece
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
