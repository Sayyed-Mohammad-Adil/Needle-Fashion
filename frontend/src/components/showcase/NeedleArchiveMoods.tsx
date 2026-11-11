'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SparklesIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface ArchiveMood {
  id: string;
  moodTitle: string;
  garmentName: string;
  weaveNote: string;
  karigarHours: string;
  imageSrc: string;
  href: string;
  accentTag: string;
}

const archiveMoods: ArchiveMood[] = [
  {
    id: 'mood-01',
    moodTitle: 'CORONATION EDIT',
    garmentName: 'Imperial Zardozi Sherwani',
    weaveNote: 'Pure Mulberry Silk • 24K Gold Bullion',
    karigarHours: '140 Hrs',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/category/sherwani',
    accentTag: 'Barat & Muhurtham',
  },
  {
    id: 'mood-02',
    moodTitle: 'JODHPUR ICONS',
    garmentName: 'Tailored Slate Bandhgala',
    weaveNote: 'Handwoven Matka Silk • Brass Crests',
    karigarHours: '64 Hrs',
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/category/kurta-jacket',
    accentTag: 'State Reception',
  },
  {
    id: 'mood-03',
    moodTitle: 'BANARASI HEIRLOOMS',
    garmentName: 'Pit-Loom Chanderi Kurta',
    weaveNote: 'Real Silver Zari & Resham Marodi',
    karigarHours: '52 Hrs',
    imageSrc: '/images/category-kurta.jpg',
    href: '/category/kurta',
    accentTag: 'Sangeet & Puja',
  },
  {
    id: 'mood-04',
    moodTitle: 'GALA COUTURE',
    garmentName: 'Sculpted Brocade Tuxedo',
    weaveNote: 'Midnight Charcoal • Silk Satin Lapels',
    karigarHours: '88 Hrs',
    imageSrc: '/images/menswear-indo-western.jpg',
    href: '/new-arrivals',
    accentTag: 'Black-Tie Evening',
  },
  {
    id: 'mood-05',
    moodTitle: 'KASHMIR REGALIA',
    garmentName: 'Pure Pashmina Doshala',
    weaveNote: 'Hand-Spun Cashmere • Antique Tilla',
    karigarHours: '180 Hrs',
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/new-arrivals',
    accentTag: 'Shoulder Drape',
  },
  {
    id: 'mood-06',
    moodTitle: 'ROYAL INSIGNIA',
    garmentName: 'Safa, Kalgi & Mojaris',
    weaveNote: 'Chanderi Turban • Emerald Plume',
    karigarHours: '40 Hrs',
    imageSrc: '/images/menswear-accessories.jpg',
    href: '/contact',
    accentTag: 'Groom Accents',
  },
];

export default function NeedleArchiveMoods() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="needle-archive"
      aria-labelledby="archive-moods-heading"
      className="py-20 sm:py-28 relative overflow-hidden bg-white/60 dark:bg-[#14161D]/70 border-y border-primary/20"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[420px] ambient-gold-glow pointer-events-none -z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Bar with Left Title & Right Craft Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>The Needle Archive</span>
            </div>
            <h2
              id="archive-moods-heading"
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
            >
              Six Moods.{' '}
              <span className="text-gold-foil">Timeless Silhouettes.</span>
            </h2>
          </div>

          <p className="font-serif italic text-sm sm:text-base text-muted-foreground md:text-right border-l-2 md:border-l-0 md:border-r-2 border-primary/60 pl-3 md:pl-0 md:pr-3">
            &ldquo;Woven by hand, tailored for a lifetime.&rdquo;
          </p>
        </div>

        {/* Six Royal Jharokha / Gopuram Arch Windows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {archiveMoods.map((item, idx) => {
            const isHovered = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId(null)}
                className="group flex flex-col items-center text-center focus:outline-none"
              >
                {/* Ornate Golden Kalash Finial on Top of Arch */}
                <div className="relative flex flex-col items-center mb-1 transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-gradient-to-tr from-[#9C7A3C] via-[#DFB76C] to-[#FCF6BA] shadow-sm border border-[#C5A059]/60" />
                  <div className="w-5 h-1.5 rounded-t-full bg-gradient-to-r from-[#9C7A3C] via-[#C5A059] to-[#9C7A3C] -mt-0.5" />
                </div>

                {/* Royal Temple / Palace Arch Window Frame */}
                <div
                  className={`relative w-full aspect-[3/4.6] rounded-t-full rounded-b-2xl p-[3px] transition-all duration-500 ${
                    isHovered
                      ? 'bg-gradient-to-b from-[#FCF6BA] via-[#C5A059] to-[#9C7A3C] -translate-y-2 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.45)]'
                      : 'bg-gradient-to-b from-[#C5A059]/70 via-[#C5A059]/35 to-[#C5A059]/20 shadow-md'
                  }`}
                >
                  <div className="relative w-full h-full rounded-t-full rounded-b-[13px] overflow-hidden bg-secondary">
                    <Image
                      src={item.imageSrc}
                      alt={item.garmentName}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Subtle inner arch border line */}
                    <div className="absolute inset-1.5 rounded-t-full rounded-b-lg border border-white/30 dark:border-primary/30 pointer-events-none z-10" />

                    {/* Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Top Roman / Archive Number */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest bg-black/55 text-[#FCF6BA] backdrop-blur-md border border-[#C5A059]/40">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Bottom inside-arch details */}
                    <div className="absolute bottom-3 left-2.5 right-2.5 z-10 text-white">
                      <span className="inline-block text-[8.5px] uppercase tracking-[0.18em] text-[#FCF6BA] font-semibold">
                        {item.karigarHours}
                      </span>
                      <p className="font-serif text-xs sm:text-sm font-bold leading-snug line-clamp-1 mt-0.5">
                        {item.garmentName}
                      </p>
                      <p className="text-[9.5px] text-white/75 line-clamp-1 mt-0.5">
                        {item.weaveNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spaced Capitals Mood Label Below Arch */}
                <div className="mt-3.5 flex flex-col items-center">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    {item.moodTitle}
                    <ArrowUpRightIcon className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </span>
                  <span className="text-[9.5px] text-muted-foreground mt-0.5">
                    {item.accentTag}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

