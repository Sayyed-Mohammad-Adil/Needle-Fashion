'use client';

import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon as HeartOutline, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';

interface WeaveCardData {
  id: string;
  backdropWord: string;
  title: string;
  subtitle: string;
  price: number;
  imageSrc: string;
  href: string;
  categoryName: string;
  bgClass: string;
  fanAngle: string;
  fanTranslate: string;
}

const weaveCards: WeaveCardData[] = [
  {
    id: 'weave-zardozi',
    backdropWord: 'ZARDOZI',
    title: 'Ivory Bullion Sherwani',
    subtitle: '24K Gold Wirework',
    price: 28999,
    imageSrc: '/images/sherwani-1.jpg',
    href: '/product/1',
    categoryName: 'Sherwani',
    bgClass: 'from-[#2A241B] via-[#4A3B26] to-[#1D1913]',
    fanAngle: 'lg:-rotate-6',
    fanTranslate: 'lg:translate-y-6',
  },
  {
    id: 'weave-jodhpuri',
    backdropWord: 'JODHPUR',
    title: 'Slate Silk Bandhgala',
    subtitle: 'Tailored Matka Weave',
    price: 15499,
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/product/2',
    categoryName: 'Bandhgala',
    bgClass: 'from-[#1F242D] via-[#343D4B] to-[#15181E]',
    fanAngle: 'lg:-rotate-3',
    fanTranslate: 'lg:translate-y-2',
  },
  {
    id: 'weave-chanderi',
    backdropWord: 'CHANDERI',
    title: 'Cream Pit-Loom Kurta',
    subtitle: 'Handspun Mulberry Silk',
    price: 5499,
    imageSrc: '/images/category-kurta.jpg',
    href: '/product/3',
    categoryName: 'Kurta',
    bgClass: 'from-[#3B3328] via-[#665640] to-[#231E17]',
    fanAngle: 'lg:rotate-0',
    fanTranslate: 'lg:translate-y-0',
  },
  {
    id: 'weave-brocade',
    backdropWord: 'BROCADE',
    title: 'Midnight Gala Tuxedo',
    subtitle: 'Varanasi Jacquard',
    price: 18999,
    imageSrc: '/images/menswear-indo-western.jpg',
    href: '/product/4',
    categoryName: 'Bandhgala',
    bgClass: 'from-[#181920] via-[#2D303D] to-[#101116]',
    fanAngle: 'lg:rotate-3',
    fanTranslate: 'lg:translate-y-2',
  },
  {
    id: 'weave-pashmina',
    backdropWord: 'KASHMIR',
    title: 'Tilla Doshala Shawl',
    subtitle: 'Pure Cashmere Drape',
    price: 12499,
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/product/5',
    categoryName: 'Regalia',
    bgClass: 'from-[#2B201E] via-[#4E3631] to-[#1A1312]',
    fanAngle: 'lg:rotate-6',
    fanTranslate: 'lg:translate-y-6',
  },
];

function TiltingWeaveCard({ card }: { card: WeaveCardData }) {
  const { addItem } = useCart();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, pressed: false });
  const [liked, setLiked] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({
      ...prev,
      rotateX: -y * 16,
      rotateY: x * 16,
    }));
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, pressed: false });
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      buildShowcaseCartItem({
        id: card.id,
        name: card.title,
        description: `${card.subtitle} — Pick a Weave signature piece`,
        price: card.price,
        imageSrc: card.imageSrc,
        categoryName: card.categoryName,
        fabric: card.subtitle,
      })
    );
  };

  return (
    <div
      className={`relative transition-all duration-300 ${card.fanAngle} ${card.fanTranslate} hover:rotate-0 hover:translate-y-0 hover:z-20`}
      style={{ perspective: '1000px' }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setTilt((p) => ({ ...p, pressed: true }))}
        onMouseUp={() => setTilt((p) => ({ ...p, pressed: false }))}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${
            tilt.pressed ? 0.97 : 1
          })`,
          transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b ${card.bgClass} border border-[#C5A059]/40 shadow-[0_24px_45px_-12px_rgba(0,0,0,0.45)]`}
      >
        {/* Giant Condensed Backdrop Word Behind the Garment */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-10 flex justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif font-black text-4xl sm:text-5xl tracking-[0.06em] uppercase text-[#FCF6BA]/20 group-hover:text-[#FCF6BA]/35 transition-colors">
            {card.backdropWord}
          </span>
        </div>

        {/* Garment Model Image */}
        <Link href={card.href} className="block relative w-full h-full">
          <Image
            src={card.imageSrc}
            alt={card.title}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 32vw, 20vw"
            className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />
        </Link>

        {/* Heart Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((prev) => !prev);
          }}
          aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:border-[#C5A059] transition-colors"
        >
          {liked ? (
            <HeartSolid className="w-4 h-4 text-[#DFB76C]" />
          ) : (
            <HeartOutline className="w-4 h-4" />
          )}
        </button>

        {/* Bottom Info + Round Plus Quick-Add Button */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-2">
          <Link href={card.href} className="min-w-0 text-white">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#FCF6BA] font-bold block">
              {card.subtitle}
            </span>
            <h3 className="font-serif text-base font-bold leading-snug truncate mt-0.5">
              {card.title}
            </h3>
            <p className="font-serif text-sm font-bold text-[#DFB76C] mt-1">
              ₹{card.price.toLocaleString('en-IN')}
            </p>
          </Link>

          <button
            onClick={handleQuickAdd}
            aria-label={`Quick add ${card.title} to bag`}
            title="Drop into bag"
            className="w-10 h-10 rounded-full bg-[#121316] hover:bg-[#C5A059] text-white hover:text-[#121316] border border-[#C5A059]/60 flex items-center justify-center flex-shrink-0 shadow-lg transition-all hover:scale-110 active:scale-95"
          >
            <PlusIcon className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PickAWeaveShowcase() {
  return (
    <section
      id="pick-a-weave"
      aria-labelledby="pick-a-weave-heading"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Tactile Handloom Deck</span>
          </div>
          <h2
            id="pick-a-weave-heading"
            className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Pick a <span className="text-gold-foil">Weave</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 italic font-serif">
            Tilt a card, press it, feel the weave — tap + to drop straight into your bag.
          </p>
        </div>

        {/* Fanned Arc Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 items-center pb-8">
          {weaveCards.map((card) => (
            <TiltingWeaveCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

