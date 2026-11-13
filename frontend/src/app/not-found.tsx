'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 15000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center space-y-5">
        <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
          404 &mdash; Page Not Found
        </p>
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
          The page you requested could not be found
        </h1>
        <p className="text-sm font-light text-muted-foreground leading-relaxed">
          It may have been moved or removed. You will be redirected to the homepage shortly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/new-arrivals"
            className="px-8 py-4 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
          >
            Explore New Arrivals
          </Link>
        </div>
      </div>

      <div className="mt-20 max-w-5xl mx-auto w-full">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground text-center mb-8">
          Explore Collections
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { name: 'Suits', href: '/category/suits', img: '/images/original-sage-suit.jpg' },
            { name: 'Shirts', href: '/category/shirts', img: '/images/original-rose-bandhgala-shirt.jpg' },
            { name: 'Pants', href: '/category/pants', img: '/images/original-ivory-achkan.jpg' },
            { name: 'Indian Wear', href: '/category/indian-wear', img: '/images/original-noir-bandhgala.jpg' },
          ].map((category) => (
            <Link key={category.name} href={category.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
