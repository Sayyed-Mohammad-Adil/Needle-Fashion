'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter, useParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import ResponsiveFilter from '@/components/ResponsiveFilter';
import { productService } from '@/lib/api/product-service';
import { Product } from '@/lib/types';
import { SparklesIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { royalMenswearProducts } from '@/lib/royalCatalog';

// Ultra-Luxe Men's Ethnic Wear Filters (Sabyasachi / Manish Malhotra Level)
const royalMenswearFilters = [
  {
    id: 'silhouette',
    name: 'Royal Silhouette',
    options: [
      { value: 'sherwani', label: 'Imperial Sherwani', count: 18 },
      { value: 'bandhgala', label: 'Heritage Bandhgala', count: 14 },
      { value: 'kurta', label: 'Silk Kurta Set', count: 22 },
      { value: 'indo-western', label: 'Indo-Western Tuxedo', count: 11 },
      { value: 'doshala', label: 'Cashmere Doshala Shawl', count: 9 },
      { value: 'regalia', label: 'Safas, Kalgis & Regalia', count: 15 },
    ],
  },
  {
    id: 'fabric',
    name: 'Heritage Fabric Lineage',
    options: [
      { value: 'mulberry-silk', label: 'Pure Mulberry Silk', count: 16 },
      { value: 'banarasi-katan', label: 'Banarasi Katan Brocade', count: 12 },
      { value: 'pashmina-cashmere', label: 'Kashmiri Cashmere Wool', count: 8 },
      { value: 'chanderi', label: 'Woven Chanderi Silk', count: 14 },
      { value: 'raw-tussar', label: 'Antique Tussar Silk', count: 9 },
    ],
  },
  {
    id: 'craftsmanship',
    name: 'Karigar Craftsmanship',
    options: [
      { value: 'zari-24k', label: '24K Gold Wire Zari', count: 10 },
      { value: 'zardozi', label: 'Hand Zardozi & Resham', count: 18 },
      { value: 'chikankari', label: 'Lucknowi Chikankari', count: 14 },
      { value: 'tilla', label: 'Heritage Kashmiri Tilla', count: 7 },
      { value: 'dabka', label: 'Antique Dabka Embroidery', count: 11 },
    ],
  },
  {
    id: 'occasion',
    name: 'Occasion & Ceremony',
    options: [
      { value: 'groom-wedding', label: 'Royal Groom / Varmala', count: 20 },
      { value: 'sangeet-reception', label: 'Sangeet & Royal Reception', count: 17 },
      { value: 'imperial-durbar', label: 'Festive & Imperial Durbar', count: 15 },
      { value: 'black-tie', label: 'Black Tie Indo-Western', count: 8 },
    ],
  },
  {
    id: 'size',
    name: 'Bespoke Size / Fitting',
    options: [
      { value: '38', label: '38 Reg' },
      { value: '40', label: '40 Reg' },
      { value: '42', label: '42 Reg' },
      { value: '44', label: '44 Reg' },
      { value: '46', label: '46 Reg' },
      { value: 'bespoke', label: '48-Pt Made to Measure' },
    ],
  },
];

const categoryDescriptions: Record<string, { title: string; subtitle: string; lineage: string }> = {
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
          const filtered = fetchedProducts.filter(p =>
            p.category?.name?.toLowerCase() === slug ||
            p.category?.name?.toLowerCase().includes(slug) ||
            p.name?.toLowerCase().includes(slug) ||
            (p.filters?.silhouette && p.filters.silhouette.some(s => s.toLowerCase().includes(slug)))
          );
          fetchedProducts = filtered.length > 0 ? filtered : fetchedProducts;
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

  return (
    <div className="bg-background text-foreground min-h-screen py-10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Frosted Glass Category Hero Docket */}
        <div className="relative rounded-3xl overflow-hidden glass-panel-gold p-6 sm:p-10 mb-8 sm:mb-10 shadow-2xl border border-[#C5A059]/30">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1 mb-3 border border-[#C5A059]/40">
              <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                Exclusively Haute Menswear
              </span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {meta.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-foreground/80 font-serif italic mt-2 sm:mt-3">
              &ldquo;{meta.subtitle}&rdquo;
            </p>
            
            <p className="text-xs text-muted-foreground mt-3 sm:mt-4 leading-relaxed max-w-2xl font-light">
              {meta.lineage}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium">
              <span className="glass-pill px-3 py-1 text-[11px] sm:text-xs text-foreground/90 border border-border/50">
                ⚜ 100% Handcrafted Indian Heritage
              </span>
              <span className="glass-pill px-3 py-1 text-[11px] sm:text-xs text-foreground/90 border border-border/50">
                ✦ 48-Point Bespoke Fit
              </span>
              <span className="glass-pill px-3 py-1 text-[11px] sm:text-xs text-foreground/90 border border-border/50">
                📦 White-Glove Dispatch
              </span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 font-serif text-[120px] sm:text-[180px] font-bold text-[#C5A059] leading-none select-none pr-4 sm:pr-6">
            N
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground">
              Showing <span className="text-foreground font-bold">{products.length}</span> Masterpieces
            </span>
            <span className="h-1 w-1 rounded-full bg-[#C5A059] hidden sm:inline" />
            <span className="text-xs text-[#C5A059] font-medium hidden sm:inline">
              Pure Silk &amp; Gold Zari
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <label htmlFor="sort" className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
              Sort:
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none glass-pill py-2 pl-3.5 pr-8 sm:py-2.5 sm:pl-4 sm:pr-10 text-xs font-semibold text-foreground focus:border-[#C5A059] focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="featured" className="bg-card text-foreground">Royal Featured</option>
                <option value="price-low" className="bg-card text-foreground">Price: Low to High</option>
                <option value="price-high" className="bg-card text-foreground">Price: High to Low</option>
                <option value="rating" className="bg-card text-foreground">Highest Rating</option>
                <option value="newest" className="bg-card text-foreground">New Arrivals</option>
              </select>
              <ChevronUpDownIcon className="w-4 h-4 text-[#C5A059] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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