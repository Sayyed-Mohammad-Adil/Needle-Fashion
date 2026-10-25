'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    name: 'Embroidered Kurta',
    price: 2999,
    image: '/images/products/kurta1.jpg',
    category: 'Kurta',
    inStock: true,
  },
  {
    id: '5',
    name: 'Festive Nehru Jacket',
    price: 1500,
    image: '/images/products/jacket1.jpg',
    category: 'Jacket',
    inStock: true,
  },
  {
    id: '8',
    name: 'Designer Sherwani',
    price: 8999,
    image: '/images/products/sherwani1.jpg',
    category: 'Sherwani',
    inStock: false,
  },
];

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
};

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/customer/wishlist');
      return;
    }
    
    // Fetch wishlist items
    const fetchWishlist = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch('/api/wishlist');
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data
        setWishlistItems(mockWishlistItems);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, loading, router]);
  
  const removeFromWishlist = async (itemId: string) => {
    try {
      // In a real app, send to API
      // await fetch(`/api/wishlist/${itemId}`, { method: 'DELETE' });
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };
  
  const addToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    
    // In a real app, we would fetch the full product details
    // For now, we'll create a simplified cart item
    addItem({
      product: {
        _id: item.id,
        id: item.id,
        name: item.name,
        price: item.price,
        images: [{ data: item.image, contentType: 'image/jpeg' }],
        category: { _id: 'cat1', name: item.category },
      } as any,
      quantity: 1,
      size: 40,
      fitting: 'Medium',
    });
    
    toast.success(`${item.name} added to cart`);
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="mt-12 text-center py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-sm rounded-lg">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Save items you love to your wishlist and find them here anytime.</p>
          <div className="mt-6">
            <Link
              href="/new-arrivals"
              className="btn-luxury-gold inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-white bg-red-500 rounded-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-sm text-gray-700">
                  <Link href={`/product/${item.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${item.inStock ? 'btn-luxury-gold' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                  >
                    <ShoppingCartIcon className="-ml-1 mr-2 h-4 w-4" />
                    Add to Bag
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center justify-center px-3 py-2 rounded-full border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}