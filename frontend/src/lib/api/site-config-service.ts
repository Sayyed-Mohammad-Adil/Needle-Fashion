import apiClient from '../api-client';

export type AspectRatioOption = '1:1' | '3:4' | '4:5' | '16:10' | '16:9' | '21:9' | 'auto';
export type ObjectFitOption = 'cover' | 'contain';
export type FocalPointOption = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface SectionMediaItem {
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

export interface PageSectionConfig {
  pageKey: string;
  sectionKey: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  aspectRatio: AspectRatioOption;
  objectFit: ObjectFitOption;
  focalPoint: FocalPointOption;
  media: SectionMediaItem[];
}

export interface CommerceSettings {
  inrPerEur: number;
  vatRatePercent: number;
  shippingFeeInr: number;
  freeShippingThresholdInr: number;
  maintenanceMode: boolean;
  announcementText: string;
}

export interface NavFeaturedItem {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  desc?: string;
}

export interface NavSectionLink {
  name: string;
  href: string;
}

export interface NavSectionGroup {
  id: string;
  name: string;
  items: NavSectionLink[];
}

export interface NavCategory {
  id: string;
  name: string;
  href?: string;
  enabled?: boolean;
  sortOrder?: number;
  featured: NavFeaturedItem[];
  sections: NavSectionGroup[];
}

export interface NavPageLink {
  id?: string;
  name: string;
  href: string;
  enabled?: boolean;
  sortOrder?: number;
}

export interface NavigationConfig {
  brandName: string;
  brandHref: string;
  categories: NavCategory[];
  pages: NavPageLink[];
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  items: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  brandName: string;
  brandBio: string;
  socialLinks: FooterSocialLink[];
  columns: FooterColumn[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButtonLabel: string;
  copyrightText: string;
  bottomLinks: FooterLink[];
}

export interface SiteConfigResponse {
  success: boolean;
  commerce: CommerceSettings;
  sections: PageSectionConfig[];
  navigation?: NavigationConfig;
  footer?: FooterConfig;
  updatedAt?: string;
}

export const siteConfigService = {
  getSiteConfig: async (): Promise<SiteConfigResponse> => {
    const response = await apiClient.get('/api/site-config');
    return response.data;
  },

  updateCommerceSettings: async (
    commerce: Partial<CommerceSettings>
  ): Promise<{ success: boolean; commerce: CommerceSettings; updatedAt?: string }> => {
    const response = await apiClient.put('/api/site-config/commerce', commerce);
    return response.data;
  },

  updateNavigation: async (
    navigation: Partial<NavigationConfig>
  ): Promise<{ success: boolean; navigation: NavigationConfig; updatedAt?: string }> => {
    const response = await apiClient.put('/api/site-config/navigation', navigation);
    return response.data;
  },

  updateFooter: async (
    footer: Partial<FooterConfig>
  ): Promise<{ success: boolean; footer: FooterConfig; updatedAt?: string }> => {
    const response = await apiClient.put('/api/site-config/footer', footer);
    return response.data;
  },

  updatePageSection: async (
    pageKey: string,
    sectionKey: string,
    section: Partial<PageSectionConfig>
  ): Promise<{ success: boolean; sections: PageSectionConfig[]; updatedAt?: string }> => {
    const response = await apiClient.put(
      `/api/site-config/section/${encodeURIComponent(pageKey)}/${encodeURIComponent(sectionKey)}`,
      section
    );
    return response.data;
  },

  resetSiteConfig: async (): Promise<SiteConfigResponse> => {
    const response = await apiClient.post('/api/site-config/reset');
    return response.data;
  },
};

