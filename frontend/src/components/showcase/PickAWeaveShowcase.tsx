'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import { buildShowcaseCartItem } from './showcaseCartHelper';
import { formatEuro } from '@/lib/currency';

interface WeaveCardData {
  id: string;
  origin: string;
  title: string;
  subtitle: string;
  price: number;
  imageSrc: string;
  href: string;
  categoryName: string;
}

const weaveCards: WeaveCardData[] = [
  {
    id: 'weave-zardozi',
    origin: 'Zardozi',
    title: 'Ivory Bullion Sherwani',
    subtitle: '24K Gold Wirework',
    price: 28999,
    imageSrc: '/images/sherwani-1.jpg',
    href: '/product/1',
    categoryName: 'Sherwani',
  },
  {
    id: 'weave-jodhpuri',
    origin: 'Jodhpur',
    title: 'Slate Silk Bandhgala',
    subtitle: 'Tailored Matka Weave',
    price: 15499,
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/product/2',
    categoryName: 'Bandhgala',
  },
  {
    id: 'weave-chanderi',
    origin: 'Chanderi',
    title: 'Cream Pit-Loom Kurta',
    subtitle: 'Handspun Mulberry Silk',
    price: 5499,
    imageSrc: '/images/category-kurta.jpg',
    href: '/product/3',
    categoryName: 'Kurta',
  },
  {
    id: 'weave-brocade',
    origin: 'Varanasi',
    title: 'Midnight Gala Tuxedo',
    subtitle: 'Handwoven Jacquard',
    price: 18999,
    imageSrc: '/images/menswear-indo-western.jpg',
    href: '/product/4',
    categoryName: 'Bandhgala',
  },
  {
    id: 'weave-pashmina',
    origin: 'Kashmir',
    title: 'Tilla Doshala Shawl',
    subtitle: 'Pure Cashmere Drape',
    price: 12499,
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/product/5',
    categoryName: 'Regalia',
  },
];

export default function PickAWeaveShowcase() {
  const { addItem } = useCart();

  const handleAdd = (card: WeaveCardData) => {
    addItem(
      buildShowcaseCartItem({
        id: card.id,
        name: card.title,
        description: card.subtitle,
        price: card.price,
        imageSrc: card.imageSrc,
        categoryName: card.categoryName,
        fabric: card.subtitle,
        work: card.origin,
      })
    );
    toast.success(`${card.title} added to bag`);
  };

  return (
    <section className="py-20 sm:py-28 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
              Textile Provenance
            </p>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Fabrics &amp; Weaves
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors border-b border-border pb-1 self-start sm:self-auto"
          >
            Explore All Fabrics
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {weaveCards.map((card) => (
            <article key={card.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted mb-4">
                <Link href={card.href} className="block w-full h-full">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => handleAdd(card)}
                  aria-label={`Add ${card.title} to bag`}
                  className="absolute bottom-3 right-3 h-9 w-9 flex items-center justify-center bg-background/90 text-foreground border border-border opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  <PlusIcon className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {card.origin}
                </p>
                <Link
                  href={card.href}
                  className="block text-sm font-normal text-foreground hover:text-accent transition-colors"
                >
                  {card.title}
                </Link>
                <p className="text-xs text-muted-foreground font-light">
                  {card.subtitle}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-foreground tabular-nums">
                    {formatEuro(card.price)}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    EU 46–54
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
