'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/contexts/CartContext';
import { productService } from '@/lib/api';
import { Product, MeasurementDetails } from '@/lib/types';
import { toast } from 'react-hot-toast';
import SizeSelector from '@/components/SizeSelector';
import {
  HeartIcon as HeartIconOutline,
  HeartIcon as HeartIconSolid,
  ShoppingBagIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckBadgeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

import { royalMenswearProducts } from '@/lib/royalCatalog';

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | 'custom'>('custom');
  const [selectedFitting, setSelectedFitting] = useState<'Loose' | 'Medium' | 'Fit'>('Medium');
  const [customMeasurements, setCustomMeasurements] = useState<MeasurementDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let data: Product | null = null;
      try {
        data = await productService.getProductById(id);
      } catch (err) {
        // Fallback to royal menswear collection
        const found = royalMenswearProducts.find(p => p._id === id || String(p._id) === String(id));
        data = found || royalMenswearProducts[0];
      }

      if (!data) {
        const found = royalMenswearProducts.find(p => p._id === id || String(p._id) === String(id));
        data = found || royalMenswearProducts[0];
      }

      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.isMakeToOrder && selectedSize === 'custom' && !customMeasurements) {
      toast.error('Please input your 48-Point bespoke measurements');
      return;
    }

    if (!product.isMakeToOrder && selectedSize === 'custom') {
      toast.error('This piece is exclusively ready-to-wear');
      return;
    }

    const cartItem: CartItem = {
      product,
      quantity,
      size: selectedSize === 'custom' ? 'customize' : (selectedSize as number),
      fitting: selectedFitting,
      measurements: selectedSize === 'custom' ? customMeasurements || undefined : undefined,
    };

    addItem(cartItem);
    toast.success('Added to your Bespoke Shopping Bag');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to reserve in your private salon');
      return;
    }

    try {
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from salon wishlist' : 'Reserved in private salon');
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#C5A059]">
            Retrieving Atelier Piece...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 glass-panel rounded-3xl max-w-md">
          <h1 className="font-serif text-2xl font-bold text-foreground">Piece Not Located</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            This bespoke garment may have been archived or acquired by private commission.
          </p>
          <Link href="/new-arrivals" className="mt-6 inline-block btn-glass-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
            Explore Runway Pieces
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.images?.[imageIndex];
  const imageSrc = primaryImage?.data
    ? (primaryImage.data.startsWith('http') || primaryImage.data.startsWith('/')
        ? primaryImage.data
        : `data:image/jpeg;base64,${primaryImage.data}`)
    : '/images/category-sherwani.jpg';

  return (
    <div className="bg-background text-foreground min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Atelier
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category?.name?.toLowerCase() || 'all'}`} className="hover:text-[#C5A059] transition-colors capitalize">
            {product.category?.name || 'Menswear'}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          
          {/* Image Exhibition Docket (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse">
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 sm:mt-5 w-full">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                  {product.images.map((img, index) => {
                    const thumbSrc = img.data
                      ? (img.data.startsWith('http') || img.data.startsWith('/')
                          ? img.data
                          : `data:image/jpeg;base64,${img.data}`)
                      : '/images/category-sherwani.jpg';
                    return (
                      <button
                        key={index}
                        onClick={() => setImageIndex(index)}
                        className={`relative h-16 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          imageIndex === index ? 'border-[#C5A059] shadow-lg scale-102' : 'border-border/60 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={thumbSrc}
                          alt={`${product.name} detail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Stage Image with Glass Badges */}
            <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden glass-panel shadow-2xl group border border-[#C5A059]/30">
              <div className="relative h-[420px] sm:h-[640px] w-full overflow-hidden bg-muted/20">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>

              {/* Frosted Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="glass-pill px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A059] border border-[#C5A059]/40">
                  {product.isMakeToOrder ? '⚜ Bespoke Haute Couture' : '✦ Ready to Wear'}
                </span>
                <span className="glass-pill px-3.5 py-1 text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-md">
                  Hand-Zari Embroidery
                </span>
              </div>

              <div className="absolute bottom-4 right-4">
                <span className="glass-pill px-3 py-1 text-[10px] text-white/80 bg-black/50 backdrop-blur-md">
                  Roll over image to expand view
                </span>
              </div>
            </div>
          </div>

          {/* Couture Dossier (Col 8-12) */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C5A059]/30 shadow-xl space-y-6">
              
              <div>
                <div className="flex items-center gap-1.5 text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>The Royal Menswear Archive</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                  {product.name}
                </h1>
                
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Inclusive of luxury tailoring & GST
                  </span>
                </div>
              </div>

              {/* Provenance Description */}
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs text-foreground/80 leading-relaxed font-light">
                  {product.description ||
                    'Mastercrafted exclusively for the modern royal groom. Woven on traditional Indian handlooms with 24K gold-plated zari and fine resham needlework.'}
                </p>
              </div>

              {/* Size & 48-Point Bespoke Selector */}
              <div className="border-t border-border/50 pt-5">
                <SizeSelector
                  sizes={product.sizes || [38, 40, 42, 44, 46]}
                  isMakeToOrder={product.isMakeToOrder ?? true}
                  selectedSize={selectedSize}
                  selectedFitting={selectedFitting}
                  customMeasurements={customMeasurements || undefined}
                  onSizeChange={setSelectedSize}
                  onFittingChange={setSelectedFitting}
                  onMeasurementsChange={setCustomMeasurements}
                />
              </div>

              {/* Quantity Counter */}
              <div className="border-t border-border/50 pt-5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block">
                    Quantity
                  </span>
                  <span className="text-[10px] text-[#C5A059]">Limited Atelier Edition</span>
                </div>
                <div className="flex items-center glass-pill p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-[#C5A059]/20 transition-colors text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-[#C5A059]/20 transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.isOutOfStock}
                  className={`flex-1 py-3.5 sm:py-4 px-6 rounded-full text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-xl transition-all ${
                    product.isOutOfStock
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'btn-glass-gold hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  {product.isOutOfStock ? 'Piece Reserved' : 'Commission to Bag'}
                </button>

                <button
                  type="button"
                  onClick={handleWishlist}
                  className="glass-pill py-4 px-5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-[#C5A059] hover:text-[#C5A059] transition-all flex items-center justify-center gap-2"
                >
                  {isWishlisted ? (
                    <>
                      <HeartIconSolid className="h-4 w-4 text-red-500" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <HeartIconOutline className="h-4 w-4" />
                      <span>Salon Save</span>
                    </>
                  )}
                </button>
              </div>

              {/* Royal Guarantees Bar */}
              <div className="border-t border-border/50 pt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-foreground/80">
                  <CheckBadgeIcon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>Complimentary Master Tailor Virtual Consultation & 1 Re-fitting</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-foreground/80">
                  <ShieldCheckIcon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>Handloom Mark & 24K Gold Zari Purity Certification Included</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-foreground/80">
                  <TruckIcon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>Insured Global White-Glove Dispatch in Custom Wooden Valet Case</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Heritage Provenance Docket */}
        <div className="mt-16 glass-panel p-8 sm:p-12 rounded-3xl border border-[#C5A059]/30 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              Atelier Lineage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Heritage Fabric & Master Craftsmanship
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="font-serif font-bold text-foreground text-sm mb-1">100% Pure Silk Weft</h4>
                <p>Woven on ancestral pit-looms using unadulterated Mulberry and Katan silk threads.</p>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="font-serif font-bold text-foreground text-sm mb-1">24K Antique Zari</h4>
                <p>Real electroplated silver and gold metallic wires twisted into heirloom motifs.</p>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <h4 className="font-serif font-bold text-foreground text-sm mb-1">Preservation Protocol</h4>
                <p>Dry clean only. Stored with unbleached muslin wrap and pure cedarwood blocks.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
