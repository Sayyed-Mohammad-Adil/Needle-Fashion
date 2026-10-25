'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

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

  // Update items to show based on screen size
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

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, itemsToShow, products.length]);

  return (
    <div className="relative w-full py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.26em] uppercase text-primary mb-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Sovereign Menswear Gallery</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-all focus:outline-none shadow-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full glass-pill hover:border-primary text-foreground hover:text-primary transition-all focus:outline-none shadow-sm"
            aria-label="Next Slide"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile / responsive sliding track */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {products.map((product) => {
            const imageSrc = product.imageSrc || '/images/category-kurta.jpg';
            const imageAlt = product.imageAlt || product.name;

            return (
              <div 
                key={product.id} 
                className="flex-shrink-0 px-2.5"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div className="group relative glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-border/80 hover:border-primary/50 transition-all duration-300">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary/50">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="glass-pill px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-primary font-bold shadow-md">
                        Bespoke
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={product.href}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground tracking-wider uppercase font-medium">
                        Pure Handloom Silk
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Inspect &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-1.5">
        {Array.from({ length: Math.ceil(products.length - itemsToShow + 1) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 transition-all rounded-full ${
              index === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}