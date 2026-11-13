'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter, useParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import ResponsiveFilter from '@/components/ResponsiveFilter';
import { productService } from '@/lib/api/product-service';
import { Product } from '@/lib/types';
import { royalMenswearProducts } from '@/lib/royalCatalog';
import {
  useSiteConfig,
  getAspectRatioClass,
  getObjectFitClass,
  getFocalPointClass,
} from '@/contexts/SiteConfigContext';

const royalMenswearFilters = [
  {
    id: 'silhouette',
    name: 'Category & Silhouette',
    options: [
      { value: 'suits', label: 'Suits, Blazers & Tuxedos' },
      { value: 'shirts', label: 'Shirts & Supima T-Shirts' },
      { value: 'pants', label: 'Tailored Pants & Trousers' },
      { value: 'accessories', label: 'Accessories & Doshalas' },
      { value: 'kurta', label: 'Indian Wear — Kurta Pyjama' },
      { value: 'sherwani', label: 'Indian Wear — Sherwani' },
      { value: 'bandhgala', label: 'Indian Wear — Bandhgala' },
    ],
  },
  {
    id: 'fabric',
    name: 'Fabric Lineage',
    options: [
      { value: 'mulberry-silk', label: 'Pure Mulberry Silk' },
      { value: 'silk-wool', label: 'Silk & Wool Blend' },
      { value: 'linen', label: 'Handloom Linen' },
      { value: 'chanderi', label: 'Woven Chanderi Silk' },
      { value: 'pashmina-cashmere', label: 'Kashmiri Cashmere' },
      { value: 'cotton', label: 'Supima & Handspun Cotton' },
    ],
  },
  {
    id: 'craftsmanship',
    name: 'Craftsmanship',
    options: [
      { value: 'zari-24k', label: '24K Gold Wire Zari' },
      { value: 'zardozi', label: 'Hand Zardozi & Resham' },
      { value: 'chikankari', label: 'Lucknowi Chikankari' },
      { value: 'tilla', label: 'Kashmiri Tilla' },
      { value: 'dabka', label: 'Antique Dabka' },
    ],
  },
  {
    id: 'size',
    name: 'Size & Fitting (EU)',
    options: [
      { value: '46', label: 'EU 46 (S)' },
      { value: '48', label: 'EU 48 (M)' },
      { value: '50', label: 'EU 50 (L)' },
      { value: '52', label: 'EU 52 (XL)' },
      { value: '54', label: 'EU 54 (XXL)' },
      { value: 'bespoke', label: '48-Point Bespoke' },
    ],
  },
];

const categoryDescriptions: Record<string, { title: string; subtitle: string; lineage: string }> = {
  suits: {
    title: 'Suits, Blazers & Tuxedos',
    subtitle: 'Western Tailoring Infused with Indian Craftsmanship',
    lineage: 'Structured blazers, two-piece suits, coats, and tuxedos featuring handwoven Indian silks and artisanal embroidery.',
  },
  shirts: {
    title: 'Shirts & Luxury T-Shirts',
    subtitle: 'Handloom Linens, Dress Shirts & Fine Supima Tees',
    lineage: 'Breathable Indian cottons and mulberry silks tailored for effortless everyday refinement and layered tailoring.',
  },
  pants: {
    title: 'Tailored Pants & Trousers',
    subtitle: '48-Point Bespoke Drape for Formal and Casual Wear',
    lineage: 'High-twist wool-silk trousers, pleated linen pants, and evening tuxedo cuts.',
  },
  accessories: {
    title: 'Accessories & Regalia',
    subtitle: 'Cashmere Doshalas, Pocket Squares, Cufflinks & Safas',
    lineage: 'Handcrafted finishing accents woven in Kashmir, Varanasi, and Jaipur.',
  },
  'indian-wear': {
    title: 'Indian Wear — Kurta Pyjama & Sherwani',
    subtitle: 'Ceremonial Sherwanis, Kurta Pyjamas & Bandhgalas',
    lineage: 'Timeless Indian silhouettes crafted in handloom Chanderi, Banarasi brocade, and 24K zardozi.',
  },
  sherwani: {
    title: 'The Imperial Sherwani Collection',
    subtitle: 'Woven for Royal Grooms and Heirloom Indian Weddings',
    lineage: 'Each piece undergoes 180+ karigar hours of pure gold zari embroidery on Banarasi brocade.'
  },
  kurta: {
    title: 'Heritage Silk Kurtas & Sets',
    subtitle: 'Bespoke handloom tailored for festive opulence',
    lineage: 'Crafted with delicate resham threadwork, mother-of-pearl buttons, and pure mulberry silk.'
  },
  bandhgala: {
    title: 'Jodhpur Bandhgalas & Bespoke Suits',
    subtitle: 'The zenith of aristocratic Indian bespoke tailoring',
    lineage: 'Architectural cuts engineered with Italian wool blends and antique royal crest buttons.'
  },
  'indo-western': {
    title: 'Indo-Western Tuxedos & Asymmetric Silhouettes',
    subtitle: 'Contemporary runway silhouettes meeting Indian heritage',
    lineage: 'Handcrafted shawl lapels adorned with subtle metallic brocade and structural drapes.'
  },
  regalia: {
    title: 'Royal Menswear Regalia & Accessories',
    subtitle: 'Safas, Kalgis, Zardozi Mojaris & Monogram Cufflinks',
    lineage: 'Handcrafted ceremonial adornments with pure emerald drops and antique zardozi borders.'
  },
  all: {
    title: 'The Needle Haute Menswear Atelier',
    subtitle: 'Exclusively Curated Luxury Indian Menswear',
    lineage: 'Surpassing royal standards with handwoven silks, 24K gold embroidery, and 48-point bespoke tailoring.'
  }
};

export default function CategoryPage() {
  const routeParams = useParams();
  const categorySlug = (routeParams?.category as string) || 'all';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters] = useState(royalMenswearFilters);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');

  const meta = categoryDescriptions[categorySlug.toLowerCase()] || categoryDescriptions.all;

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filterParams: Record<string, string[]> = {};

    royalMenswearFilters.forEach(filter => {
      const values = params.getAll(filter.id);
      if (values.length > 0) {
        filterParams[filter.id] = values;
      }
    });

    setSelectedFilters(filterParams);
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[] = [];
        try {
          const response = await productService.getProducts({});
          if (response?.products && response.products.length > 0) {
            fetchedProducts = response.products;
          }
        } catch (e) {
          // Use royal menswear collection
        }

        if (fetchedProducts.length === 0) {
          fetchedProducts = royalMenswearProducts;
        }

        if (categorySlug && categorySlug !== 'all') {
          const slug = categorySlug.toLowerCase();
          const filtered = fetchedProducts.filter((p) => {
            const catName = p.category?.name?.toLowerCase() || '';
            const prodName = p.name?.toLowerCase() || '';
            const silhouettes = p.filters?.silhouette || [];
            if (catName === slug || catName.replace(/\s+/g, '-') === slug) return true;
            if (prodName.includes(slug)) return true;
            return silhouettes.some((s) => s.toLowerCase() === slug || s.toLowerCase().includes(slug));
          });
          fetchedProducts = filtered.length > 0 ? filtered : fetchedProducts;
        }

        // Apply active sidebar filters
        const activeFilterEntries = Object.entries(selectedFilters).filter(
          ([, values]) => values.length > 0
        );
        if (activeFilterEntries.length > 0) {
          const sidebarFiltered = fetchedProducts.filter((p) =>
            activeFilterEntries.every(([key, values]) => {
              const productVals = (p.filters as Record<string, string[]> | undefined)?.[key] || [];
              return values.some((v) => productVals.includes(v));
            })
          );
          if (sidebarFiltered.length > 0) {
            fetchedProducts = sidebarFiltered;
          }
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(royalMenswearProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchParams]);

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const newSelectedFilters = { ...selectedFilters };

    if (checked) {
      if (!newSelectedFilters[filterType]) {
        newSelectedFilters[filterType] = [];
      }
      newSelectedFilters[filterType] = [...newSelectedFilters[filterType], value];
    } else {
      newSelectedFilters[filterType] = (newSelectedFilters[filterType] || []).filter(v => v !== value);
      if (newSelectedFilters[filterType].length === 0) {
        delete newSelectedFilters[filterType];
      }
    }

    setSelectedFilters(newSelectedFilters);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterType);
    newSelectedFilters[filterType]?.forEach(value => {
      params.append(filterType, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    const params = new URLSearchParams();
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const { getSection } = useSiteConfig();
  const catBannerSec = getSection('categories', 'category-banners');
  const catMedia = catBannerSec?.media?.find((m) => m.slotKey === categorySlug);

  return (
    <div className="bg-background text-foreground min-h-screen py-12 sm:py-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Minimal Editorial Category Header */}
        <div className="border-b border-border pb-10 mb-10 space-y-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
              {catBannerSec?.eyebrow || 'Needle Fashion Collection'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              {catMedia?.title || meta.title}
            </h1>
            <p className="text-sm sm:text-base font-light text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              {catMedia?.subtitle || `${meta.subtitle} — ${meta.lineage}`}
            </p>
          </div>

          {catMedia?.url && (
            <div
              className={`relative w-full ${getAspectRatioClass(
                catMedia.aspectRatio || catBannerSec?.aspectRatio || '21:9'
              )} overflow-hidden bg-muted`}
            >
              <img
                src={catMedia.url}
                alt={catMedia.alt || meta.title}
                className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                  catMedia.objectFit || catBannerSec?.objectFit
                )} ${getFocalPointClass(catMedia.focalPoint || catBannerSec?.focalPoint)}`}
              />
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3 sm:gap-4">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <label htmlFor="sort" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="bg-transparent border border-border py-2 px-3 text-xs text-foreground focus:border-foreground focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-background text-foreground">Featured</option>
              <option value="price-low" className="bg-background text-foreground">Price: Low to High</option>
              <option value="price-high" className="bg-background text-foreground">Price: High to Low</option>
              <option value="rating" className="bg-background text-foreground">Highest Rating</option>
              <option value="newest" className="bg-background text-foreground">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Catalog Body with Glass Sidebar */}
        <div className="pt-6 sm:pt-10 lg:grid lg:grid-cols-4 lg:gap-x-10">
          <div className="lg:col-span-1">
            <ResponsiveFilter
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3 mt-4 lg:mt-0">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}