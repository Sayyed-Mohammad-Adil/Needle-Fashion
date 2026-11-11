import { Product } from '@/lib/types';
import { CartItem } from '@/contexts/CartContext';

export interface ShowcaseProductInput {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  categoryName: string;
  fabric?: string;
  work?: string;
  size?: number | 'customize';
}

/**
 * Converts a curated menswear showcase item into a CartItem compatible with CartContext.
 */
export function buildShowcaseCartItem(input: ShowcaseProductInput): CartItem {
  const product: Product = {
    _id: input.id,
    name: input.name,
    description: input.description,
    price: input.price,
    images: [{ data: input.imageSrc, alt: input.name }],
    category: {
      _id: `cat-${input.categoryName.toLowerCase().replace(/\s+/g, '-')}`,
      name: input.categoryName,
    },
    filters: {},
    sizes: [36, 38, 40, 42, 44],
    isMakeToOrder: true,
    isOutOfStock: false,
    fittingOptions: ['Loose', 'Medium', 'Fit'],
    stock: 10,
    averageRating: 4.9,
    numReviews: 24,
    fabric: input.fabric,
    work: input.work,
  };

  return {
    product,
    quantity: 1,
    size: input.size ?? 40,
    fitting: 'Medium',
  };
}

