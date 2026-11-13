import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export type AspectRatioOption = '1:1' | '3:4' | '4:5' | '16:10' | '16:9' | '21:9' | 'auto';
export type ObjectFitOption = 'cover' | 'contain';
export type FocalPointOption = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface ISectionMediaItem {
  slotKey: string;
  url: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
  priceInr?: number;
  badge?: string;
  aspectRatio?: AspectRatioOption;
  objectFit?: ObjectFitOption;
  focalPoint?: FocalPointOption;
}

export interface IPageSectionConfig {
  pageKey: string;
  sectionKey: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  aspectRatio: AspectRatioOption;
  objectFit: ObjectFitOption;
  focalPoint: FocalPointOption;
  media: ISectionMediaItem[];
}

export interface ICommerceSettings {
  inrPerEur: number;
  vatRatePercent: number;
  shippingFeeInr: number;
  freeShippingThresholdInr: number;
  maintenanceMode: boolean;
  announcementText: string;
}

export interface INavFeaturedItem {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  desc?: string;
}

export interface INavSectionLink {
  name: string;
  href: string;
}

export interface INavSectionGroup {
  id: string;
  name: string;
  items: INavSectionLink[];
}

export interface INavCategory {
  id: string;
  name: string;
  href?: string;
  enabled?: boolean;
  sortOrder?: number;
  featured: INavFeaturedItem[];
  sections: INavSectionGroup[];
}

export interface INavPageLink {
  id?: string;
  name: string;
  href: string;
  enabled?: boolean;
  sortOrder?: number;
}

export interface INavigationConfig {
  brandName: string;
  brandHref: string;
  categories: INavCategory[];
  pages: INavPageLink[];
}

export interface IFooterLink {
  name: string;
  href: string;
}

export interface IFooterColumn {
  id: string;
  title: string;
  items: IFooterLink[];
}

export interface IFooterSocialLink {
  label: string;
  href: string;
}

export interface IFooterConfig {
  brandName: string;
  brandBio: string;
  socialLinks: IFooterSocialLink[];
  columns: IFooterColumn[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButtonLabel: string;
  copyrightText: string;
  bottomLinks: IFooterLink[];
}

export const DEFAULT_FOOTER: IFooterConfig = {
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

export const DEFAULT_NAVIGATION: INavigationConfig = {
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

export const DEFAULT_COMMERCE_SETTINGS: ICommerceSettings = {
  inrPerEur: 90,
  vatRatePercent: 18,
  shippingFeeInr: 2500,
  freeShippingThresholdInr: 50000,
  maintenanceMode: false,
  announcementText: '',
};

export const DEFAULT_SECTIONS: IPageSectionConfig[] = [
  {
    pageKey: 'home',
    sectionKey: 'hero',
    label: 'Home — Hero Banner',
    enabled: true,
    sortOrder: 1,
    eyebrow: 'Indian Textiles · Western Silhouettes · Royal Heritage',
    title: 'The Art of Sovereign Tailoring',
    subtitle:
      'Handwoven Indian silks, cashmere, and organic linens sculpted into timeless shirts, coats, tuxedos, and ceremonial Indian wear.',
    ctaLabel: 'Explore Collection',
    ctaHref: '/new-arrivals',
    aspectRatio: '4:5',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'hero-primary',
        url: '/images/original-ivory-blazer.jpg',
        alt: 'Mughal Jaali Ivory Tailored Suit',
        title: 'Mughal Jaali Ivory Tailored Suit',
        href: '/product/1',
      },
    ],
  },
  {
    pageKey: 'home',
    sectionKey: 'menswear-wings',
    label: 'Home — 5 Menswear Wings',
    enabled: true,
    sortOrder: 2,
    eyebrow: 'The Wardrobe Architecture',
    title: 'Five Pillars of Menswear',
    subtitle: 'Indian textiles tailored for Monaco, London, and Udaipur.',
    aspectRatio: '3:4',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'suits',
        url: '/images/original-sage-suit.jpg',
        alt: 'Suits',
        title: 'Suits',
        subtitle: 'Embroidered blazers, two-piece suits, coats & evening tuxedos',
        href: '/category/suits',
      },
      {
        slotKey: 'shirts',
        url: '/images/original-rose-bandhgala-shirt.jpg',
        alt: 'Shirts',
        title: 'Shirts',
        subtitle: 'Handloom linen shirts, crisp dress shirts & Supima t-shirts',
        href: '/category/shirts',
      },
      {
        slotKey: 'pants',
        url: '/images/original-ivory-achkan.jpg',
        alt: 'Pants',
        title: 'Pants',
        subtitle: 'Pleated tailored trousers, tuxedo pants & relaxed linens',
        href: '/category/pants',
      },
      {
        slotKey: 'accessories',
        url: '/images/menswear-accessories.jpg',
        alt: 'Accessories',
        title: 'Accessories',
        subtitle: 'Cashmere doshalas, silk pocket squares, safas & cufflinks',
        href: '/category/accessories',
      },
      {
        slotKey: 'indian-wear',
        url: '/images/original-noir-bandhgala.jpg',
        alt: 'Indian Wear',
        title: 'Indian Wear',
        subtitle: 'Kurta pyjama sets, imperial sherwanis & Jodhpur bandhgalas',
        href: '/category/indian-wear',
      },
    ],
  },
  {
    pageKey: 'home',
    sectionKey: 'featured-pieces',
    label: 'Home — Featured Pieces',
    enabled: true,
    sortOrder: 3,
    eyebrow: 'Curated Selection',
    title: 'Signature Atelier Creations',
    subtitle: 'Each piece is cut to order in European sizes or 48-point bespoke.',
    ctaLabel: 'View All Pieces',
    ctaHref: '/new-arrivals',
    aspectRatio: '3:4',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'featured-1',
        url: '/images/original-ivory-blazer.jpg',
        alt: 'Mughal Jaali Ivory Tailored Suit',
        title: 'Mughal Jaali Ivory Tailored Suit',
        href: '/product/1',
        priceInr: 32999,
      },
      {
        slotKey: 'featured-2',
        url: '/images/original-sage-suit.jpg',
        alt: 'Sage Heritage Embroidered Suit',
        title: 'Sage Heritage Embroidered Suit',
        href: '/product/2',
        priceInr: 34499,
      },
      {
        slotKey: 'featured-3',
        url: '/images/original-rose-jacket-tee.jpg',
        alt: 'Rose Ombré Jacket & Supima Tee',
        title: 'Rose Ombré Jacket & Supima Tee',
        href: '/product/3',
        priceInr: 21999,
      },
      {
        slotKey: 'featured-4',
        url: '/images/original-noir-bandhgala.jpg',
        alt: 'Noir Kashmiri Paisley Coat',
        title: 'Noir Kashmiri Paisley Coat',
        href: '/product/4',
        priceInr: 36999,
      },
      {
        slotKey: 'featured-5',
        url: '/images/original-ivory-achkan.jpg',
        alt: 'Ivory Botanical Achkan & Trousers',
        title: 'Ivory Botanical Achkan & Trousers',
        href: '/product/5',
        priceInr: 29499,
      },
      {
        slotKey: 'featured-6',
        url: '/images/original-rose-bandhgala-shirt.jpg',
        alt: 'Rose Bandhgala & Linen Shirt',
        title: 'Rose Bandhgala & Linen Shirt',
        href: '/product/6',
        priceInr: 24999,
      },
    ],
  },
  {
    pageKey: 'home',
    sectionKey: 'karigar-atelier',
    label: 'Home — Karigar Atelier Editorial',
    enabled: true,
    sortOrder: 4,
    eyebrow: 'Heritage Craftsmanship',
    title: 'Woven by Master Karigars',
    subtitle: 'Hand-spun Banarasi brocade, Kashmiri sozni, and organic Chanderi.',
    ctaLabel: 'Discover Our Story',
    ctaHref: '/about',
    aspectRatio: '16:10',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'karigar-main',
        url: '/images/vintage-karigar-atelier.webp',
        alt: 'Master Karigar Atelier',
        title: 'Karigar Atelier',
      },
    ],
  },
  {
    pageKey: 'home',
    sectionKey: 'royal-salon',
    label: 'Home — Private Salon & Bespoke',
    enabled: true,
    sortOrder: 5,
    eyebrow: 'Private Appointments',
    title: 'The Royal Bespoke Salon',
    subtitle: '48-point anatomical drafting for Monaco & international patrons.',
    ctaLabel: 'Book Private Fitting',
    ctaHref: '/contact',
    aspectRatio: '16:10',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'salon-main',
        url: '/images/vintage-royal-salon.webp',
        alt: 'Royal Bespoke Salon',
        title: 'Royal Bespoke Salon',
      },
    ],
  },
  {
    pageKey: 'home',
    sectionKey: 'palace-night',
    label: 'Home — Palace Night Full-Bleed Banner',
    enabled: true,
    sortOrder: 6,
    eyebrow: 'Evening & Gala',
    title: 'Nocturne Couture',
    subtitle: 'Midnight bandhgalas, velvet dinner jackets, and ceremonial silks.',
    ctaLabel: 'Explore Eveningwear',
    ctaHref: '/category/suits',
    aspectRatio: '21:9',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'palace-night-bg',
        url: '/images/vintage-palace-night.webp',
        alt: 'Nocturne Couture Palace Night',
        title: 'Nocturne Couture',
      },
    ],
  },
  {
    pageKey: 'about',
    sectionKey: 'heritage-hero',
    label: 'About / Maison — Hero & Portrait',
    enabled: true,
    sortOrder: 1,
    eyebrow: 'The Maison',
    title: 'A Dialogue Between Indian Looms & European Tailoring',
    subtitle: 'Founded to unite centuries-old Indian textile artistry with architectural menswear.',
    aspectRatio: '16:9',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'about-hero',
        url: '/images/vintage-hero-palace.webp',
        alt: 'Needle Fashion Maison Palace',
        title: 'Maison Hero',
        aspectRatio: '16:9',
      },
      {
        slotKey: 'about-portrait',
        url: '/images/original-ivory-blazer.jpg',
        alt: 'Needle Fashion Atelier Craft',
        title: 'Maison Portrait',
        aspectRatio: '3:4',
      },
    ],
  },
  {
    pageKey: 'new-arrivals',
    sectionKey: 'header-banner',
    label: 'New Arrivals — Collection Header',
    enabled: true,
    sortOrder: 1,
    eyebrow: 'Latest Atelier Release',
    title: 'New Arrivals',
    subtitle: 'Limited-edition handwoven pieces now available in EU 46–54 & Bespoke.',
    aspectRatio: '3:4',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      {
        slotKey: 'new-arrivals-lead',
        url: '/images/original-ivory-blazer.jpg',
        alt: 'New Arrivals Lead Piece',
        title: 'Season Lead Visual',
      },
    ],
  },
  {
    pageKey: 'categories',
    sectionKey: 'category-banners',
    label: 'Category Pages — Header Visuals',
    enabled: true,
    sortOrder: 1,
    eyebrow: 'Atelier Collections',
    title: 'Curated Categories',
    subtitle: 'Tailored silhouettes across Suits, Shirts, Pants, Accessories, and Indian Wear.',
    aspectRatio: '16:9',
    objectFit: 'cover',
    focalPoint: 'center',
    media: [
      { slotKey: 'suits', url: '/images/original-sage-suit.jpg', alt: 'Suits Banner', title: 'Suits', href: '/category/suits' },
      { slotKey: 'shirts', url: '/images/original-rose-bandhgala-shirt.jpg', alt: 'Shirts Banner', title: 'Shirts', href: '/category/shirts' },
      { slotKey: 'pants', url: '/images/original-ivory-achkan.jpg', alt: 'Pants Banner', title: 'Pants', href: '/category/pants' },
      { slotKey: 'accessories', url: '/images/menswear-accessories.jpg', alt: 'Accessories Banner', title: 'Accessories', href: '/category/accessories' },
      { slotKey: 'indian-wear', url: '/images/original-noir-bandhgala.jpg', alt: 'Indian Wear Banner', title: 'Indian Wear', href: '/category/indian-wear' },
    ],
  },
];

async function getOrCreateSiteConfig() {
  let config = await prisma.siteConfig.findUnique({ where: { key: 'default' } });
  if (!config) {
    config = await prisma.siteConfig.create({
      data: {
        key: 'default',
        commerce: DEFAULT_COMMERCE_SETTINGS as any,
        sections: DEFAULT_SECTIONS as any,
        navigation: DEFAULT_NAVIGATION as any,
        footer: DEFAULT_FOOTER as any,
      },
    });
  }
  return config;
}

export const getSiteConfig = async (_req: Request, res: Response) => {
  try {
    const config = await getOrCreateSiteConfig();
    res.json({
      success: true,
      commerce: config.commerce,
      sections: config.sections,
      navigation: config.navigation ?? DEFAULT_NAVIGATION,
      footer: config.footer ?? DEFAULT_FOOTER,
      updatedAt: config.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to load site configuration' });
  }
};

export const updateCommerceSettings = async (req: Request, res: Response) => {
  try {
    const config = await getOrCreateSiteConfig();
    const currentCommerce = { ...DEFAULT_COMMERCE_SETTINGS, ...(config.commerce as any) };
    const {
      inrPerEur,
      vatRatePercent,
      shippingFeeInr,
      freeShippingThresholdInr,
      maintenanceMode,
      announcementText,
    } = req.body;

    if (inrPerEur !== undefined) currentCommerce.inrPerEur = Math.max(1, Number(inrPerEur));
    if (vatRatePercent !== undefined) currentCommerce.vatRatePercent = Math.max(0, Math.min(100, Number(vatRatePercent)));
    if (shippingFeeInr !== undefined) currentCommerce.shippingFeeInr = Math.max(0, Number(shippingFeeInr));
    if (freeShippingThresholdInr !== undefined) currentCommerce.freeShippingThresholdInr = Math.max(0, Number(freeShippingThresholdInr));
    if (maintenanceMode !== undefined) currentCommerce.maintenanceMode = Boolean(maintenanceMode);
    if (announcementText !== undefined) currentCommerce.announcementText = String(announcementText);

    const updated = await prisma.siteConfig.update({
      where: { key: 'default' },
      data: { commerce: currentCommerce as any },
    });

    res.json({
      success: true,
      commerce: updated.commerce,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update commerce settings' });
  }
};

export const updatePageSection = async (req: Request, res: Response) => {
  try {
    const { pageKey, sectionKey } = req.params;
    const config = await getOrCreateSiteConfig();
    const sections = Array.isArray(config.sections)
      ? ([...config.sections] as unknown as IPageSectionConfig[])
      : [...DEFAULT_SECTIONS];

    const idx = sections.findIndex((s) => s.pageKey === pageKey && s.sectionKey === sectionKey);
    const payload = req.body;

    if (idx === -1) {
      sections.push({
        pageKey,
        sectionKey,
        label: payload.label || `${pageKey} — ${sectionKey}`,
        enabled: payload.enabled !== undefined ? Boolean(payload.enabled) : true,
        sortOrder: payload.sortOrder ?? sections.length + 1,
        eyebrow: payload.eyebrow,
        title: payload.title,
        subtitle: payload.subtitle,
        ctaLabel: payload.ctaLabel,
        ctaHref: payload.ctaHref,
        aspectRatio: payload.aspectRatio || '4:5',
        objectFit: payload.objectFit || 'cover',
        focalPoint: payload.focalPoint || 'center',
        media: Array.isArray(payload.media) ? payload.media : [],
      });
    } else {
      const existing = { ...sections[idx] };
      if (payload.label !== undefined) existing.label = payload.label;
      if (payload.enabled !== undefined) existing.enabled = Boolean(payload.enabled);
      if (payload.sortOrder !== undefined) existing.sortOrder = Number(payload.sortOrder);
      if (payload.eyebrow !== undefined) existing.eyebrow = payload.eyebrow;
      if (payload.title !== undefined) existing.title = payload.title;
      if (payload.subtitle !== undefined) existing.subtitle = payload.subtitle;
      if (payload.ctaLabel !== undefined) existing.ctaLabel = payload.ctaLabel;
      if (payload.ctaHref !== undefined) existing.ctaHref = payload.ctaHref;
      if (payload.aspectRatio !== undefined) existing.aspectRatio = payload.aspectRatio;
      if (payload.objectFit !== undefined) existing.objectFit = payload.objectFit;
      if (payload.focalPoint !== undefined) existing.focalPoint = payload.focalPoint;
      if (Array.isArray(payload.media)) existing.media = payload.media;
      sections[idx] = existing;
    }

    const updated = await prisma.siteConfig.update({
      where: { key: 'default' },
      data: { sections: sections as any },
    });

    res.json({
      success: true,
      sections: updated.sections,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update page section' });
  }
};

export const updateNavigation = async (req: Request, res: Response) => {
  try {
    const config = await getOrCreateSiteConfig();
    const currentNav: INavigationConfig = {
      ...DEFAULT_NAVIGATION,
      ...((config.navigation as any) || {}),
    };

    const { brandName, brandHref, categories, pages } = req.body;

    if (brandName !== undefined) currentNav.brandName = String(brandName).trim() || DEFAULT_NAVIGATION.brandName;
    if (brandHref !== undefined) currentNav.brandHref = String(brandHref).trim() || '/';
    if (Array.isArray(categories)) currentNav.categories = categories;
    if (Array.isArray(pages)) currentNav.pages = pages;

    const updated = await prisma.siteConfig.update({
      where: { key: 'default' },
      data: { navigation: currentNav as any },
    });

    res.json({
      success: true,
      navigation: updated.navigation ?? DEFAULT_NAVIGATION,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update navigation configuration' });
  }
};

export const updateFooter = async (req: Request, res: Response) => {
  try {
    const config = await getOrCreateSiteConfig();
    const currentFooter: IFooterConfig = {
      ...DEFAULT_FOOTER,
      ...((config.footer as any) || {}),
    };

    const {
      brandName,
      brandBio,
      socialLinks,
      columns,
      newsletterTitle,
      newsletterSubtitle,
      newsletterPlaceholder,
      newsletterButtonLabel,
      copyrightText,
      bottomLinks,
    } = req.body;

    if (brandName !== undefined) currentFooter.brandName = String(brandName).trim() || DEFAULT_FOOTER.brandName;
    if (brandBio !== undefined) currentFooter.brandBio = String(brandBio);
    if (Array.isArray(socialLinks)) currentFooter.socialLinks = socialLinks;
    if (Array.isArray(columns)) currentFooter.columns = columns;
    if (newsletterTitle !== undefined) currentFooter.newsletterTitle = String(newsletterTitle);
    if (newsletterSubtitle !== undefined) currentFooter.newsletterSubtitle = String(newsletterSubtitle);
    if (newsletterPlaceholder !== undefined) currentFooter.newsletterPlaceholder = String(newsletterPlaceholder);
    if (newsletterButtonLabel !== undefined) currentFooter.newsletterButtonLabel = String(newsletterButtonLabel);
    if (copyrightText !== undefined) currentFooter.copyrightText = String(copyrightText);
    if (Array.isArray(bottomLinks)) currentFooter.bottomLinks = bottomLinks;

    const updated = await prisma.siteConfig.update({
      where: { key: 'default' },
      data: { footer: currentFooter as any },
    });

    res.json({
      success: true,
      footer: updated.footer ?? DEFAULT_FOOTER,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update footer configuration' });
  }
};

export const resetSiteConfig = async (_req: Request, res: Response) => {
  try {
    const updated = await prisma.siteConfig.upsert({
      where: { key: 'default' },
      update: {
        commerce: DEFAULT_COMMERCE_SETTINGS as any,
        sections: DEFAULT_SECTIONS as any,
        navigation: DEFAULT_NAVIGATION as any,
        footer: DEFAULT_FOOTER as any,
      },
      create: {
        key: 'default',
        commerce: DEFAULT_COMMERCE_SETTINGS as any,
        sections: DEFAULT_SECTIONS as any,
        navigation: DEFAULT_NAVIGATION as any,
        footer: DEFAULT_FOOTER as any,
      },
    });

    res.json({
      success: true,
      commerce: updated.commerce,
      sections: updated.sections,
      navigation: updated.navigation ?? DEFAULT_NAVIGATION,
      footer: updated.footer ?? DEFAULT_FOOTER,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to reset site configuration' });
  }
};
