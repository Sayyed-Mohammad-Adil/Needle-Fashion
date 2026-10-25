'use client';

import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';
import ResponsiveSearchBar from '@/components/ResponsiveSearchBar';
import MobileUserMenu from '@/components/MobileUserMenu';

const navigation = {
  categories: [
    {
      id: 'sherwani',
      name: 'Sherwani',
      featured: [
        {
          name: 'Imperial Wedding Sherwanis',
          href: '/new-arrivals',
          imageSrc: '/images/hero-ethnic.jpg',
          imageAlt: 'Imperial Wedding Sherwani',
          desc: 'Antique Zari & 24K Gold Resham Wirework',
        },
        {
          name: 'Groom Coronation Sets',
          href: '/category/sherwani',
          imageSrc: '/images/category-sherwani.jpg',
          imageAlt: 'Coronation Sherwani Set',
          desc: 'Pure Mulberry Silk with Handcrafted Dabka',
        },
      ],
      sections: [
        {
          id: 'silhouettes',
          name: 'Royal Silhouettes',
          items: [
            { name: 'Imperial Achkan Sherwani', href: '/category/sherwani?style=achkan' },
            { name: 'Angrakha Asymmetric Cut', href: '/category/sherwani?style=angrakha' },
            { name: 'Classic Royal Jodhpuri', href: '/category/sherwani?style=jodhpuri' },
            { name: 'Heritage Velvet Brocade', href: '/category/sherwani?style=velvet' },
          ],
        },
        {
          id: 'palettes',
          name: 'Imperial Palettes',
          items: [
            { name: 'Royal Ivory & Antique Gold', href: '/category/sherwani?color=ivory' },
            { name: 'Slate Grey & Metallic Silver', href: '/category/sherwani?color=slate' },
            { name: 'Cashmere Cream & Pearl Resham', href: '/category/sherwani?color=cream' },
            { name: 'Midnight Charcoal Velvet', href: '/category/sherwani?color=charcoal' },
          ],
        },
      ],
    },
    {
      id: 'kurta',
      name: 'Kurta',
      featured: [
        {
          name: 'Signature Chanderi Kurtas',
          href: '/category/kurta',
          imageSrc: '/images/category-kurta.jpg',
          imageAlt: 'Chanderi Silk Kurta',
          desc: 'Woven on Generational Banaras Pit Looms',
        },
        {
          name: 'Pure Mulberry Silk Sets',
          href: '/new-arrivals',
          imageSrc: '/images/product-cream-kurta.jpg',
          imageAlt: 'Mulberry Silk Kurta',
          desc: 'Adorned with Marodi and Zari Borders',
        },
      ],
      sections: [
        {
          id: 'styles',
          name: 'Artisanal Styles',
          items: [
            { name: 'Lucknowi Chikankari Handloom', href: '/category/kurta?style=chikankari' },
            { name: 'Pathani & Sovereign Drapes', href: '/category/kurta?style=pathani' },
            { name: 'Kurta Pyjama Heirloom Sets', href: '/category/kurta?style=pyjama-set' },
            { name: 'Bespoke Bundi Coordinates', href: '/category/kurta?style=bundi' },
          ],
        },
        {
          id: 'fabrics',
          name: 'Noble Handlooms',
          items: [
            { name: 'Pure Chanderi Silk', href: '/category/kurta?fabric=chanderi' },
            { name: 'Banarasi Tussar Silk', href: '/category/kurta?fabric=tussar' },
            { name: 'Khadi Raw Silk Blend', href: '/category/kurta?fabric=khadi' },
            { name: 'Superfine Egyptian Cotton', href: '/category/kurta?fabric=cotton' },
          ],
        },
      ],
    },
    {
      id: 'bandhgala',
      name: 'Bandhgala',
      featured: [
        {
          name: 'Tailored Slate & Cream Jodhpuri',
          href: '/category/kurta-jacket',
          imageSrc: '/images/category-kurta-jacket.jpg',
          imageAlt: 'Tailored Slate Bandhgala',
          desc: 'Double-Breasted Silk Lapels & Brass Crests',
        },
        {
          name: 'Charcoal Gala Tuxedos',
          href: '/new-arrivals',
          imageSrc: '/images/menswear-indo-western.jpg',
          imageAlt: 'Charcoal Gala Tuxedo',
          desc: 'Sculpted Brocade for Diplomatic Galas',
        },
      ],
      sections: [
        {
          id: 'cuts',
          name: 'Couture Cuts',
          items: [
            { name: 'Classic Sovereign Bandhgala', href: '/category/kurta-jacket?type=bandhgala' },
            { name: 'Indo-Western Tuxedo', href: '/category/kurta-jacket?type=tuxedo' },
            { name: 'Nehru Silk Waistcoats', href: '/category/kurta-jacket?type=nehru' },
            { name: 'Prince Coat Ensembles', href: '/category/kurta-jacket?type=prince-coat' },
          ],
        },
      ],
    },
    {
      id: 'accessories',
      name: 'Regalia',
      featured: [
        {
          name: 'Cashmere Doshala & Shawls',
          href: '/about',
          imageSrc: '/images/menswear-doshala.jpg',
          imageAlt: 'Cashmere Royal Doshala',
          desc: 'Antique Tilla Embroidery Borders',
        },
        {
          name: 'Safa, Kalgi & Cufflinks',
          href: '/contact',
          imageSrc: '/images/menswear-accessories.jpg',
          imageAlt: 'Royal Accessories',
          desc: 'Jeweled Turban Brooches & 24K Crest Links',
        },
      ],
      sections: [
        {
          id: 'regalia',
          name: 'Heirloom Accents',
          items: [
            { name: 'Pure Pashmina Doshala', href: '/category/all?accessory=doshala' },
            { name: 'Ivory Chanderi Safa Turbans', href: '/category/all?accessory=safa' },
            { name: 'Antique Gold Kalgi Brooches', href: '/category/all?accessory=kalgi' },
            { name: 'Zardozi Handcrafted Mojaris', href: '/category/all?accessory=mojari' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Atelier', href: '/about' },
  ],
};

export default function Header() {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 transition-all duration-300">
      <header
        className={`relative transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#FAF8F5]/80 dark:bg-[#121317]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[#BF953F]/30'
            : 'bg-[#FAF8F5]/90 dark:bg-[#121317]/90 backdrop-blur-md border-[#BF953F]/20'
        }`}
      >
        {/* Luxury top announcement bar (Warm Ivory Cashmere Ribbon - No Black) */}
        <div
          className={`relative transition-all duration-300 ${
            isScrolled
              ? 'bg-[#F4EFE6]/90 dark:bg-[#181A22]/90'
              : 'bg-[#F2EDE4] dark:bg-[#161820]'
          } text-[#2D2518] dark:text-[#FCF6BA] px-3 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-1.5 sm:gap-3 overflow-hidden border-b border-[#BF953F]/25`}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px] opacity-90 shadow-[0_0_12px_rgba(234,236,236,0.6)]"
            style={{
              background:
                'linear-gradient(to right, #BF953F, #EAECEC, #FCF6BA, #B38728, #BBC2CC, #AA771C)',
            }}
          />
          <span
            className="text-transparent bg-clip-text font-bold"
            style={{
              backgroundImage:
                'linear-gradient(to right, #BF953F, #B38728, #AA771C)',
            }}
          >
            ✦
          </span>
          <span>COMPLIMENTARY WHITE-GLOVE DELIVERY ON ORDERS OVER ₹1,000</span>
          <span className="hidden md:inline text-[#B38728]/50">•</span>
          <span className="hidden md:inline text-[#8A651E] dark:text-[#EAECEC] font-bold tracking-[0.2em]">
            24K GOLD & STERLING SILVER ZARI
          </span>
          <span className="hidden md:inline text-[#B38728]/50">•</span>
          <span className="hidden md:inline text-[#3E382E] dark:text-white/80">
            HANDCRAFTED IN INDIA
          </span>
          <span
            className="text-transparent bg-clip-text font-bold"
            style={{
              backgroundImage:
                'linear-gradient(to right, #AA771C, #B38728, #BF953F)',
            }}
          >
            ✦
          </span>
          <button
            onClick={() => {
              if (
                typeof window !== 'undefined' &&
                (window as any).replayNeedleIntro
              ) {
                (window as any).replayNeedleIntro();
              }
            }}
            className="hidden sm:inline-flex items-center gap-1 ml-2 text-[9px] uppercase tracking-wider text-[#7A5310] dark:text-[#EAECEC] hover:text-[#B38728] transition-colors border border-[#BF953F]/40 rounded-full px-2.5 py-0.5 bg-white/50 dark:bg-white/5"
            title="Experience Atelier Intro"
          >
            <span>⚜ Replay Intro</span>
          </button>
        </div>

        {/* Floating Frosted Glass Navbar */}
        <nav
          aria-label="Top"
          className="relative mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-6 xl:px-8 transition-all duration-300"
        >
          <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
            {/* Mobile menu button */}
            <div className="flex lg:hidden flex-shrink-0 text-[#1F2026] dark:text-[#E0DDD5] hover:text-[#B38728]">
              <MobileMenu navigation={navigation} />
            </div>

            {/* Logo with Rolesor Dual-Tone Crest */}
            <div className="flex lg:ml-0 flex-shrink-0">
              <Link href="/" className="group flex items-center gap-2 sm:gap-3">
                <div
                  className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl p-[1.5px] shadow-[0_0_20px_rgba(191,149,63,0.35),0_0_12px_rgba(234,236,236,0.25)] group-hover:scale-105 transition-all duration-300 flex-shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg, #BF953F 0%, #EAECEC 30%, #B38728 60%, #BBC2CC 85%, #AA771C 100%)',
                  }}
                >
                  <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-white dark:bg-[#141518] flex items-center justify-center shadow-inner">
                    <span
                      className="font-serif text-base sm:text-xl font-black text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          'linear-gradient(135deg, #7A5310 0%, #BF953F 35%, #C69A3C 65%, #5E400B 100%)',
                      }}
                    >
                      N
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                    <span
                      className="text-transparent bg-clip-text font-black tracking-wider select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #383B46 0%, #6E7382 22%, #FFFFFF 48%, #EAECEC 60%, #464A57 100%)',
                      }}
                    >
                      NEEDLE
                    </span>{' '}
                    <span
                      className="text-transparent bg-clip-text font-black tracking-wider drop-shadow-[0_2px_10px_rgba(191,149,63,0.35)]"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #B38728, #FFFFFF, #BF953F, #FCF6BA, #AA771C)',
                      }}
                    >
                      FASHION
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase font-bold text-[#8A651E] dark:text-[#FCF6BA]">
                      HAUTE MENSWEAR
                    </span>
                    <span className="text-[7px] text-[#A8A9AD] hidden sm:inline">
                      •
                    </span>
                    <span className="text-[7.5px] tracking-[0.16em] uppercase font-semibold text-[#6F6960] dark:text-[#BBC2CC] hidden sm:inline">
                      EST. 2026
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Flyout menus */}
            <Popover.Group className="hidden lg:ml-3 xl:ml-6 lg:block lg:self-stretch">
              <div className="flex h-full space-x-2.5 xl:space-x-5">
                {navigation.categories.map((category) => (
                  <Popover key={category.name} className="flex">
                    {({ open }) => (
                      <>
                        <div className="relative flex">
                          <Popover.Button
                            className={`relative z-10 -mb-px flex items-center border-b-2 pt-px text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-bold transition-colors duration-200 ease-out outline-none whitespace-nowrap ${
                              open
                                ? 'border-[#B38728] text-[#B38728] dark:border-[#FCF6BA] dark:text-[#FCF6BA]'
                                : 'border-transparent text-[#202228] dark:text-[#E0DDD5] hover:text-[#B38728] dark:hover:text-[#FCF6BA]'
                            }`}
                          >
                            {category.name}
                          </Popover.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-2"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-2"
                        >
                          <Popover.Panel className="absolute inset-x-0 top-full text-sm glass-panel-gold border-y border-primary/30 shadow-2xl z-50">
                            <div className="mx-auto max-w-7xl px-8 py-10">
                              <div className="grid grid-cols-12 gap-8 items-start">
                                {/* Category Links */}
                                <div className="col-span-7 grid grid-cols-2 gap-6">
                                  {category.sections.map((section) => (
                                    <div
                                      key={section.name}
                                      className="glass-card p-5 rounded-2xl border border-primary/20"
                                    >
                                      <p
                                        id={`${section.name}-heading`}
                                        className="font-serif text-sm font-bold text-foreground flex items-center gap-2 mb-3"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        {section.name}
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`${section.name}-heading`}
                                        className="space-y-2.5"
                                      >
                                        {section.items.map((item) => (
                                          <li key={item.name}>
                                            <Link
                                              href={item.href}
                                              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/item"
                                            >
                                              <span className="text-primary text-[10px] group-hover/item:translate-x-0.5 transition-transform">
                                                ✦
                                              </span>
                                              <span>{item.name}</span>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>

                                {/* Featured Runway Cards */}
                                <div className="col-span-5 grid grid-cols-2 gap-4">
                                  {category.featured.map((item) => (
                                    <div
                                      key={item.name}
                                      className="group relative overflow-hidden rounded-2xl glass-card border border-primary/25 shadow-md hover:border-primary/50 transition-all p-2.5"
                                    >
                                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary/50">
                                        <Image
                                          src={item.imageSrc}
                                          alt={item.imageAlt}
                                          fill
                                          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-2 left-2 right-2">
                                          <span className="text-[9px] uppercase tracking-wider text-primary font-bold">
                                            Curated
                                          </span>
                                        </div>
                                      </div>
                                      <Link
                                        href={item.href}
                                        className="mt-2.5 block font-serif text-xs font-bold text-foreground group-hover:text-primary transition-colors"
                                      >
                                        <span
                                          className="absolute inset-0 z-10"
                                          aria-hidden="true"
                                        />
                                        {item.name}
                                      </Link>
                                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                        {item.desc}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                ))}

                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="flex items-center text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.16em] font-bold whitespace-nowrap text-[#202228] dark:text-[#E0DDD5] hover:text-[#B38728] dark:hover:text-[#FCF6BA] transition-colors"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </Popover.Group>

            {/* Right tools: Search, Account Dossier, Cart */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3.5">
              {/* Search */}
              <div className="flex">
                <ResponsiveSearchBar />
              </div>

              {/* Client Dossier / Account Icon */}
              <div className="flex">
                <Link
                  href={
                    isAuthenticated
                      ? isAdmin
                        ? '/admin'
                        : '/profile'
                      : '/auth/login'
                  }
                  className="relative group flex items-center p-2 rounded-full glass-pill bg-white/75 dark:bg-[#16181F]/80 backdrop-blur-md border border-[#BF953F]/35 text-[#202228] dark:text-[#E0DDD5] hover:text-[#B38728] dark:hover:text-[#FCF6BA] hover:border-[#B38728] transition-colors"
                  aria-label={
                    isAuthenticated ? 'Account Dossier' : 'Client Sign In'
                  }
                  title={isAuthenticated ? 'Account Dossier' : 'Client Sign In'}
                >
                  <UserIcon
                    className="h-5 w-5 text-[#202228] dark:text-[#E0DDD5] group-hover:text-[#B38728] dark:group-hover:text-[#FCF6BA] transition-colors"
                    aria-hidden="true"
                  />
                  {isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#BF953F] shadow-[0_0_8px_#BF953F]" />
                  )}
                </Link>
              </div>

              {/* Cart with Gold Jewel Badge */}
              <div className="flow-root pl-1 sm:pl-1.5 flex-shrink-0">
                <Link
                  href="/cart"
                  className="relative group flex items-center p-2 rounded-full glass-pill bg-white/75 dark:bg-[#16181F]/80 backdrop-blur-md border border-[#BF953F]/35 text-[#202228] dark:text-[#E0DDD5] hover:text-[#B38728] dark:hover:text-[#FCF6BA] hover:border-[#B38728] transition-colors"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBagIcon
                    className="h-5 w-5 text-[#202228] dark:text-[#E0DDD5] group-hover:text-[#B38728] dark:group-hover:text-[#FCF6BA] transition-colors"
                    aria-hidden="true"
                  />
                  {totalItems > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-black text-[#141518] shadow-md border border-white/60"
                      style={{
                        background:
                          'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">items in cart, view bag</span>
                </Link>
              </div>

              {/* Mobile user menu on tablets */}
              <div className="hidden sm:flex lg:hidden">
                <MobileUserMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* Luminous Two-Tone Gold & Shiny Silver Hairline at Bottom of Header (Edge to Edge) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-90 shadow-[0_1px_12px_rgba(234,236,236,0.5)] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #BF953F, #EAECEC, #FCF6BA, #B38728, #BBC2CC, #AA771C)',
          }}
        />
      </header>
    </div>
  );
}