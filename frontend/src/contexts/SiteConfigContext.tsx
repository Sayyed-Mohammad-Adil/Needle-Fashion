'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  siteConfigService,
  CommerceSettings,
  PageSectionConfig,
  NavigationConfig,
  FooterConfig,
  AspectRatioOption,
  ObjectFitOption,
  FocalPointOption,
} from '@/lib/api/site-config-service';
import { setInrPerEur } from '@/lib/currency';

const DEFAULT_COMMERCE: CommerceSettings = {
  inrPerEur: 90,
  vatRatePercent: 18,
  shippingFeeInr: 2500,
  freeShippingThresholdInr: 50000,
  maintenanceMode: false,
  announcementText: '',
};

export const DEFAULT_NAVIGATION: NavigationConfig = {
  brandName: 'Needle Fashion',
  brandHref: '/',
  categories: [
    {
      id: 'suits',
      name: 'Suits',
      href: '/category/suits',
      enabled: true,
      sortOrder: 1,
      featured: [
        {
          name: 'Mughal Jaali Ivory Suit',
          href: '/category/suits',
          imageSrc: '/images/original-ivory-blazer.jpg',
          imageAlt: 'Mughal Jaali Ivory Tailored Suit',
          desc: 'Hand-embroidered heritage motif blazer',
        },
        {
          name: 'Sage Heritage Tailored Suit',
          href: '/category/suits',
          imageSrc: '/images/original-sage-suit.jpg',
          imageAlt: 'Sage Green Embroidered Suit',
          desc: 'Indian craftsmanship, Savile Row cut',
        },
      ],
      sections: [
        {
          id: 'tailoring',
          name: 'Tailoring',
          items: [
            { name: 'Embroidered Blazers', href: '/category/suits?style=blazer' },
            { name: 'Two-Piece Heritage Suits', href: '/category/suits?style=two-piece' },
            { name: 'Evening Tuxedos', href: '/category/suits?style=tuxedo' },
            { name: 'Tailored Coats', href: '/category/suits?style=coat' },
          ],
        },
        {
          id: 'fabrics',
          name: 'Fabrics',
          items: [
            { name: 'Raw Silk & Wool Blends', href: '/category/suits?fabric=silk-wool' },
            { name: 'Handloom Linen', href: '/category/suits?fabric=linen' },
            { name: 'Varanasi Jacquard', href: '/category/suits?fabric=jacquard' },
          ],
        },
      ],
    },
    {
      id: 'shirts',
      name: 'Shirts',
      href: '/category/shirts',
      enabled: true,
      sortOrder: 2,
      featured: [
        {
          name: 'Handloom Linen Dress Shirt',
          href: '/category/shirts',
          imageSrc: '/images/original-rose-bandhgala-shirt.jpg',
          imageAlt: 'Handloom Linen Shirt with Embroidered Jacket',
          desc: 'Breathable handspun ivory cotton-linen',
        },
        {
          name: 'Atelier Supima Crew Tee',
          href: '/category/shirts?style=t-shirt',
          imageSrc: '/images/original-rose-jacket-tee.jpg',
          imageAlt: 'Atelier Crewneck T-Shirt Layered Under Jacket',
          desc: 'Fine-gauge cotton tailored for layering',
        },
      ],
      sections: [
        {
          id: 'silhouettes',
          name: 'Styles',
          items: [
            { name: 'Crisp Dress Shirts', href: '/category/shirts?style=dress-shirt' },
            { name: 'Handloom Linen Shirts', href: '/category/shirts?style=linen' },
            { name: 'Subtle Embroidered Shirts', href: '/category/shirts?style=embroidered' },
            { name: 'Luxury Supima T-Shirts', href: '/category/shirts?style=t-shirt' },
          ],
        },
      ],
    },
    {
      id: 'pants',
      name: 'Pants',
      href: '/category/pants',
      enabled: true,
      sortOrder: 3,
      featured: [
        {
          name: 'Ivory Pleated Trousers',
          href: '/category/pants',
          imageSrc: '/images/original-ivory-achkan.jpg',
          imageAlt: 'Ivory Tailored Trousers',
          desc: 'High-twist cotton & silk-wool drape',
        },
        {
          name: 'Sage Tailored Suit Trousers',
          href: '/category/pants',
          imageSrc: '/images/original-sage-suit.jpg',
          imageAlt: 'Sage Tailored Trousers',
          desc: '48-point bespoke trouser cut',
        },
      ],
      sections: [
        {
          id: 'trouser-cuts',
          name: 'Silhouettes',
          items: [
            { name: 'Pleated Tailored Trousers', href: '/category/pants?style=pleated' },
            { name: 'Evening Tuxedo Trousers', href: '/category/pants?style=tuxedo' },
            { name: 'Relaxed Linen Trousers', href: '/category/pants?style=linen' },
            { name: 'Classic Chinos', href: '/category/pants?style=chinos' },
          ],
        },
      ],
    },
    {
      id: 'accessories',
      name: 'Accessories',
      href: '/category/accessories',
      enabled: true,
      sortOrder: 4,
      featured: [
        {
          name: 'Cashmere Doshala Shawls',
          href: '/category/accessories',
          imageSrc: '/images/menswear-doshala.jpg',
          imageAlt: 'Cashmere Royal Doshala',
          desc: 'Hand-spun Kashmiri pashmina weave',
        },
        {
          name: 'Silk Pocket Squares & Regalia',
          href: '/category/accessories',
          imageSrc: '/images/menswear-accessories.jpg',
          imageAlt: 'Menswear Accessories & Regalia',
          desc: 'Brooches, cufflinks & ceremonial accents',
        },
      ],
      sections: [
        {
          id: 'accents',
          name: 'Accents',
          items: [
            { name: 'Pure Pashmina Doshalas', href: '/category/accessories?type=doshala' },
            { name: 'Silk Pocket Squares', href: '/category/accessories?type=pocket-square' },
            { name: 'Monogram Cufflinks & Pins', href: '/category/accessories?type=cufflinks' },
            { name: 'Safas, Kalgis & Mojaris', href: '/category/accessories?type=regalia' },
          ],
        },
      ],
    },
    {
      id: 'indian-wear',
      name: 'Indian Wear',
      href: '/category/indian-wear',
      enabled: true,
      sortOrder: 5,
      featured: [
        {
          name: 'Noir Paisley Bandhgala Coat',
          href: '/category/indian-wear',
          imageSrc: '/images/original-noir-bandhgala.jpg',
          imageAlt: 'Black Kashmiri Embroidered Bandhgala Coat',
          desc: 'Kashmiri paisley embroidery on wool-silk',
        },
        {
          name: 'Chanderi Kurta Pyjama Sets',
          href: '/category/kurta',
          imageSrc: '/images/category-kurta.jpg',
          imageAlt: 'Chanderi Silk Kurta Pyjama',
          desc: 'Banaras pit-loom silk & tailored pyjamas',
        },
      ],
      sections: [
        {
          id: 'indian-silhouettes',
          name: 'Indian Silhouettes',
          items: [
            { name: 'Kurta Pyjama Sets', href: '/category/kurta' },
            { name: 'Imperial Sherwanis', href: '/category/sherwani' },
            { name: 'Jodhpur Bandhgalas', href: '/category/bandhgala' },
            { name: 'Embroidered Achkan Coats', href: '/category/indian-wear?style=achkan' },
            { name: 'Nehru & Bundi Jackets', href: '/category/kurta-jacket' },
          ],
        },
      ],
    },
  ],
  pages: [
    { id: 'new-arrivals', name: 'New Arrivals', href: '/new-arrivals', enabled: true, sortOrder: 1 },
    { id: 'atelier', name: 'Atelier', href: '/about', enabled: true, sortOrder: 2 },
  ],
};

export const DEFAULT_FOOTER: FooterConfig = {
  brandName: 'Needle Fashion',
  brandBio:
    'Indian handloom fabrics and artisanal embroidery tailored into modern suits, shirts, coats, and ceremonial Indian wear.',
  socialLinks: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
  columns: [
    {
      id: 'collections',
      title: 'Collections',
      items: [
        { name: 'Suits & Tuxedos', href: '/category/suits' },
        { name: 'Shirts & Luxury Tees', href: '/category/shirts' },
        { name: 'Tailored Pants', href: '/category/pants' },
        { name: 'Accessories', href: '/category/accessories' },
        { name: 'Indian Wear — Kurta Pyjama', href: '/category/kurta' },
        { name: 'Indian Wear — Sherwanis', href: '/category/sherwani' },
      ],
    },
    {
      id: 'services',
      title: 'Client Services',
      items: [
        { name: 'Private Appointments', href: '/contact' },
        { name: '48-Point Bespoke Tailoring', href: '/about' },
        { name: 'Shipping & Returns', href: '/returns' },
        { name: 'Care & FAQ', href: '/faq' },
        { name: 'Saved Wishlist', href: '/customer/wishlist' },
      ],
    },
    {
      id: 'maison',
      title: 'The Maison',
      items: [
        { name: 'The Archive', href: '/#needle-archive' },
        { name: 'Complete Looks', href: '/#try-the-look' },
        { name: 'The Atelier Rail', href: '/#atelier-rack' },
        { name: 'Artisanal Lineage', href: '/about' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  newsletterTitle: 'Private Salon',
  newsletterSubtitle: 'Private previews of seasonal collections and trunk show invitations.',
  newsletterPlaceholder: 'Email address',
  newsletterButtonLabel: 'Subscribe',
  copyrightText: 'Needle Fashion. All rights reserved.',
  bottomLinks: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

interface SiteConfigContextValue {
  commerce: CommerceSettings;
  sections: PageSectionConfig[];
  navigation: NavigationConfig;
  footer: FooterConfig;
  loading: boolean;
  refreshSiteConfig: () => Promise<void>;
  getSection: (pageKey: string, sectionKey: string) => PageSectionConfig | undefined;
  setCommerceLocal: (next: CommerceSettings) => void;
  setSectionsLocal: (next: PageSectionConfig[]) => void;
  setNavigationLocal: (next: NavigationConfig) => void;
  setFooterLocal: (next: FooterConfig) => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  commerce: DEFAULT_COMMERCE,
  sections: [],
  navigation: DEFAULT_NAVIGATION,
  footer: DEFAULT_FOOTER,
  loading: false,
  refreshSiteConfig: async () => {},
  getSection: () => undefined,
  setCommerceLocal: () => {},
  setSectionsLocal: () => {},
  setNavigationLocal: () => {},
  setFooterLocal: () => {},
});

export function getAspectRatioClass(ratio?: AspectRatioOption): string {
  switch (ratio) {
    case '1:1':
      return 'aspect-square';
    case '3:4':
      return 'aspect-[3/4]';
    case '4:5':
      return 'aspect-[4/5]';
    case '16:10':
      return 'aspect-[16/10]';
    case '16:9':
      return 'aspect-video';
    case '21:9':
      return 'aspect-[21/9]';
    case 'auto':
      return 'aspect-auto';
    default:
      return 'aspect-[3/4]';
  }
}

export function getObjectFitClass(fit?: ObjectFitOption): string {
  return fit === 'contain' ? 'object-contain' : 'object-cover';
}

export function getFocalPointClass(focal?: FocalPointOption): string {
  switch (focal) {
    case 'top':
      return 'object-top';
    case 'bottom':
      return 'object-bottom';
    case 'left':
      return 'object-left';
    case 'right':
      return 'object-right';
    default:
      return 'object-center';
  }
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [commerce, setCommerce] = useState<CommerceSettings>(DEFAULT_COMMERCE);
  const [sections, setSections] = useState<PageSectionConfig[]>([]);
  const [navigation, setNavigation] = useState<NavigationConfig>(DEFAULT_NAVIGATION);
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [loading, setLoading] = useState(true);

  const refreshSiteConfig = useCallback(async () => {
    try {
      const data = await siteConfigService.getSiteConfig();
      if (data?.commerce) {
        setCommerce(data.commerce);
        setInrPerEur(data.commerce.inrPerEur);
      }
      if (Array.isArray(data?.sections)) {
        setSections(data.sections);
      }
      if (data?.navigation) {
        setNavigation(data.navigation);
      }
      if (data?.footer) {
        setFooter(data.footer);
      }
    } catch {
      // Gracefully keep defaults if backend is unreachable during SSR/dev
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteConfig();
  }, [refreshSiteConfig]);

  const getSection = useCallback(
    (pageKey: string, sectionKey: string) =>
      sections.find((s) => s.pageKey === pageKey && s.sectionKey === sectionKey),
    [sections]
  );

  const setCommerceLocal = useCallback((next: CommerceSettings) => {
    setCommerce(next);
    setInrPerEur(next.inrPerEur);
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        commerce,
        sections,
        navigation,
        footer,
        loading,
        refreshSiteConfig,
        getSection,
        setCommerceLocal,
        setSectionsLocal: setSections,
        setNavigationLocal: setNavigation,
        setFooterLocal: setFooter,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

