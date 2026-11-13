'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatEuro } from '@/lib/currency';
import { useSiteConfig, getAspectRatioClass, getObjectFitClass, getFocalPointClass } from '@/contexts/SiteConfigContext';
import { productService } from '@/lib/api/product-service';

const defaultNewArrivals = [
  {
    id: '1',
    name: 'Mughal Jaali Ivory Tailored Suit',
    price: 32999,
    imageSrc: '/images/original-ivory-blazer.jpg',
    imageAlt: 'Mughal Jaali Ivory Tailored Suit',
    href: '/product/1',
    category: 'Suits',
    fabric: 'Handloom Silk-Cotton · Zari Motif',
  },
  {
    id: '2',
    name: 'Sage Heritage Embroidered Suit',
    price: 34499,
    imageSrc: '/images/original-sage-suit.jpg',
    imageAlt: 'Sage Heritage Embroidered Suit',
    href: '/product/2',
    category: 'Suits',
    fabric: 'Linen-Wool Blend · Floral Jaali',
  },
  {
    id: '3',
    name: 'Rose Ombré Bandhgala & Supima Tee',
    price: 21999,
    imageSrc: '/images/original-rose-jacket-tee.jpg',
    imageAlt: 'Rose Ombré Bandhgala Jacket',
    href: '/product/3',
    category: 'Shirts & Jackets',
    fabric: 'Ombré Raw Silk · Supima Cotton',
  },
  {
    id: '4',
    name: 'Noir Kashmiri Paisley Bandhgala Coat',
    price: 36999,
    imageSrc: '/images/original-noir-bandhgala.jpg',
    imageAlt: 'Noir Kashmiri Paisley Coat',
    href: '/product/4',
    category: 'Indian Wear',
    fabric: 'Wool-Silk · Kashmiri Paisley',
  },
  {
    id: '5',
    name: 'Ivory Botanical Achkan & Trousers',
    price: 29499,
    imageSrc: '/images/original-ivory-achkan.jpg',
    imageAlt: 'Ivory Botanical Achkan Coat',
    href: '/product/5',
    category: 'Indian Wear',
    fabric: 'Mulberry Silk · Botanical Work',
  },
  {
    id: '6',
    name: 'Rose Bandhgala & Handloom Linen Shirt',
    price: 24999,
    imageSrc: '/images/original-rose-bandhgala-shirt.jpg',
    imageAlt: 'Rose Bandhgala & Linen Shirt',
    href: '/product/6',
    category: 'Shirts',
    fabric: 'Handspun Linen · Resham Cuff',
  },
  {
    id: '7',
    name: 'Varanasi Pit-Loom Chanderi Kurta Pyjama',
    price: 6499,
    imageSrc: '/images/category-kurta.jpg',
    imageAlt: 'Chanderi Silk Kurta Pyjama',
    href: '/product/7',
    category: 'Indian Wear',
    fabric: 'Banaras Chanderi Silk',
  },
  {
    id: '8',
    name: 'Kashmir Tilla Pashmina Doshala',
    price: 14499,
    imageSrc: '/images/menswear-doshala.jpg',
    imageAlt: 'Kashmir Tilla Pashmina Doshala',
    href: '/product/8',
    category: 'Accessories',
    fabric: 'Pure Cashmere · Tilla Border',
  },
];

export default function NewArrivalsPage() {
  const { getSection } = useSiteConfig();
  const headerSec = getSection('new-arrivals', 'header-banner');
  const [items, setItems] = useState(defaultNewArrivals);

  useEffect(() => {
    let mounted = true;
    productService
      .getProducts()
      .then((res) => {
        const list = ((res as any)?.products || (Array.isArray(res) ? res : [])).slice(0, 12);
        if (mounted && Array.isArray(list) && list.length > 0) {
          setItems(
            list.map((p: any) => ({
              id: p._id || p.id,
              name: p.name,
              price: p.price,
              imageSrc: p.images?.[0] || '/images/original-ivory-blazer.jpg',
              imageAlt: p.name,
              href: `/product/${p._id || p.id}`,
              category: typeof p.category === 'object' ? p.category?.name : p.category || 'Collection',
              fabric: p.filters?.fabric || (p.isMakeToOrder ? 'Made to Order · Bespoke' : 'Ready to Ship'),
            }))
          );
        }
      })
      .catch(() => {
        // Keep curated defaults if backend is unavailable
      });
    return () => {
      mounted = false;
    };
  }, []);

  const bannerMedia = headerSec?.media?.[0];

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                {headerSec?.eyebrow || 'Seasonal Edit'}
              </p>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
                {headerSec?.title || 'New Arrivals'}
              </h1>
              <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
                {headerSec?.subtitle ||
                  'Where Indian handloom textiles and karigar embroidery meet crisp Western suits, shirts, trousers, and ceremonial Indian wear.'}
              </p>
            </div>

            <Link
              href={headerSec?.ctaHref || '/contact'}
              className="px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors self-start lg:self-auto"
            >
              {headerSec?.ctaLabel || 'Book Private Fitting'}
            </Link>
          </div>

          {bannerMedia?.url && (
            <div
              className={`relative w-full ${getAspectRatioClass(
                bannerMedia.aspectRatio || headerSec?.aspectRatio || '21:9'
              )} overflow-hidden bg-muted`}
            >
              <img
                src={bannerMedia.url}
                alt={bannerMedia.alt || headerSec?.title || 'New Arrivals'}
                className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                  bannerMedia.objectFit || headerSec?.objectFit
                )} ${getFocalPointClass(bannerMedia.focalPoint || headerSec?.focalPoint)}`}
              />
            </div>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-14 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <article key={product.id} className="group flex flex-col">
                <Link
                  href={product.href}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-muted mb-5 block"
                >
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {product.category}
                  </p>
                  <h2 className="text-sm font-normal text-foreground group-hover:text-accent transition-colors">
                    <Link href={product.href}>{product.name}</Link>
                  </h2>
                  <p className="text-xs font-light text-muted-foreground">
                    {product.fabric}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-foreground tabular-nums">
                      {formatEuro(product.price)}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      EU 46–54 · Bespoke
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Commission Note */}
      <section className="border-t border-border py-20 sm:py-28 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Made to Measure
          </p>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
            Commission a Bespoke Garment
          </h2>
          <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            Every silhouette can be tailored to your exact 48-point measurements in your choice of handloom fabric and embroidery density.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Schedule Appointment
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-border text-foreground text-xs uppercase tracking-[0.22em] hover:border-foreground transition-colors"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
