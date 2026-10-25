'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, MeasurementDetails } from '@/lib/types';
import { toast } from 'react-hot-toast';

export interface CartItem {
  product: Product;
  quantity: number;
  size: number | 'customize';
  fitting: 'Loose' | 'Medium' | 'Fit';
  measurements?: MeasurementDetails;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.product._id === item.product._id && i.size === item.size && i.fitting === item.fitting
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success('Cart updated');
        return updatedItems;
      } else {
        // Add new item
        toast.success('Item added to cart');
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.product._id !== productId);
      toast.success('Item removed from cart');
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};