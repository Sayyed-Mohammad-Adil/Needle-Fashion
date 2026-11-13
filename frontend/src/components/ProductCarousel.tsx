'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatEuro } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 640) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= products.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(products.length - itemsToShow, 0) : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
            Selected Pieces
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2.5 border border-border text-foreground/80 hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-4 w-4 stroke-[1.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2.5 border border-border text-foreground/80 hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {products.map((product) => {
            const imageSrc = product.imageSrc || '/images/category-kurta.jpg';
            const imageAlt = product.imageAlt || product.name;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <Link href={product.href} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="mt-4 space-y-1">
                    <h3 className="text-xs sm:text-sm font-normal text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatEuro(product.price)}
                      </p>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        EU 46–54
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
