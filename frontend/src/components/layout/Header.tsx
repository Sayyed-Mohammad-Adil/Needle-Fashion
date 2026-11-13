'use client';

import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import MobileMenu from '@/components/MobileMenu';
import ResponsiveSearchBar from '@/components/ResponsiveSearchBar';
import MobileUserMenu from '@/components/MobileUserMenu';

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { navigation, commerce } = useSiteConfig();
  const [isScrolled, setIsScrolled] = useState(false);

  const activeCategories = (navigation.categories || [])
    .filter((c) => c.enabled !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const activePages = (navigation.pages || [])
    .filter((p) => p.enabled !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const activeNavigation = {
    brandName: navigation.brandName || 'Needle Fashion',
    brandHref: navigation.brandHref || '/',
    categories: activeCategories,
    pages: activePages,
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40">
      {commerce.announcementText?.trim() && (
        <div className="bg-foreground text-background text-center px-4 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.22em]">
          {commerce.announcementText}
        </div>
      )}
      <header
        className={`relative border-b border-border transition-colors duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md' : 'bg-background'
        }`}
      >
        {/* Main Navigation */}
        <nav aria-label="Top" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            {/* Mobile Menu */}
            <div className="flex lg:hidden flex-shrink-0">
              <MobileMenu navigation={activeNavigation} />
            </div>

            {/* Wordmark */}
            <div className="flex flex-shrink-0">
              <Link
                href={activeNavigation.brandHref}
                className="text-xs sm:text-base font-medium uppercase tracking-[0.22em] sm:tracking-[0.28em] text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {activeNavigation.brandName}
              </Link>
            </div>

            {/* Desktop Category Flyouts */}
            <Popover.Group className="hidden lg:flex lg:items-center lg:gap-8 xl:gap-10">
              {activeNavigation.categories.map((category) => {
                const hasNested =
                  (category.sections && category.sections.length > 0) ||
                  (category.featured && category.featured.length > 0);

                if (!hasNested) {
                  return (
                    <Link
                      key={category.id || category.name}
                      href={category.href || `/category/${category.id}`}
                      className="text-[11px] uppercase tracking-[0.2em] font-normal py-2 border-b border-transparent text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  );
                }

                return (
                  <Popover key={category.id || category.name} className="flex">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`text-[11px] uppercase tracking-[0.2em] font-normal py-2 border-b transition-colors outline-none whitespace-nowrap ${
                            open
                              ? 'border-foreground text-foreground'
                              : 'border-transparent text-foreground/80 hover:text-foreground'
                          }`}
                        >
                          {category.name}
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Popover.Panel className="absolute inset-x-0 top-full bg-background border-b border-border z-50">
                            <div className="mx-auto max-w-7xl px-8 lg:px-12 py-12">
                              <div className="grid grid-cols-12 gap-12 items-start">
                                <div className="col-span-6 grid grid-cols-2 gap-8">
                                  {category.sections.map((section) => (
                                    <div key={section.id || section.name}>
                                      <p
                                        id={`${section.name}-heading`}
                                        className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-medium mb-4"
                                      >
                                        {section.name}
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`${section.name}-heading`}
                                        className="space-y-3"
                                      >
                                        {section.items.map((item) => (
                                          <li key={item.name}>
                                            <Link
                                              href={item.href}
                                              className="text-xs text-foreground/80 hover:text-foreground transition-colors"
                                            >
                                              {item.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>

                                <div className="col-span-6 grid grid-cols-2 gap-6">
                                  {category.featured.map((item) => (
                                    <Link key={item.name} href={item.href} className="group block">
                                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                                        <Image
                                          src={item.imageSrc}
                                          alt={item.imageAlt || item.name}
                                          fill
                                          sizes="280px"
                                          className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                                        />
                                      </div>
                                      <p className="mt-3 text-xs font-medium tracking-wide text-foreground">
                                        {item.name}
                                      </p>
                                      {item.desc && (
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                          {item.desc}
                                        </p>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                );
              })}

              {activeNavigation.pages.map((page) => (
                <Link
                  key={page.id || page.name}
                  href={page.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-normal whitespace-nowrap text-foreground/80 hover:text-foreground transition-colors"
                >
                  {page.name}
                </Link>
              ))}
            </Popover.Group>

            {/* Right Utilities */}
            <div className="flex items-center gap-2 sm:gap-5">
              <ResponsiveSearchBar />

              <Link
                href={
                  isAuthenticated
                    ? isAdmin
                      ? '/admin'
                      : '/profile'
                    : '/auth/login'
                }
                className="relative p-1.5 text-foreground/80 hover:text-foreground transition-colors"
                aria-label={isAuthenticated ? 'Account' : 'Sign In'}
              >
                <UserIcon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                {isAuthenticated && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-1.5 text-foreground/80 hover:text-foreground transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBagIcon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[9px] font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="hidden sm:flex lg:hidden">
                <MobileUserMenu />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
