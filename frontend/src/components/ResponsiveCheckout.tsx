'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { SparklesIcon, ShieldCheckIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export default function ResponsiveCheckout() {
  const { isAuthenticated } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: 'India',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  // Calculate pricing
  const itemsPrice = totalPrice;
  const shippingPrice = itemsPrice > 2000 ? 0 : 100;
  const taxPrice = itemsPrice * 0.18; // 18% GST
  const totalOrderPrice = itemsPrice + shippingPrice + taxPrice;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!shippingAddress.address || !shippingAddress.city || 
          !shippingAddress.postalCode || !shippingAddress.state) {
        toast.error('Please complete all shipping address fields');
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to finalize your commission');
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    
    try {
      setLoading(true);
      clearCart();
      router.push('/order-confirmation?orderId=12345');
      toast.success('Bespoke order commissioned successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to commission order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Shipping Address
  const ShippingAddressStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A059]">Step 01</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">White-Glove Delivery Destination</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Insured courier dispatch directly from the master atelier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 pt-2">
        <div className="sm:col-span-6">
          <label htmlFor="address" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
            Street Address / Estate Name
          </label>
          <input
            type="text"
            id="address"
            placeholder="e.g. Royal Palm Residence, 42 Heritage Boulevard"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
            className="w-full rounded-2xl bg-card border-2 border-border/80 py-3.5 px-4 text-xs font-semibold text-foreground focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 focus:outline-none shadow-sm transition-all"
            required
          />
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="city" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="e.g. New Delhi"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
            className="w-full rounded-2xl bg-card border-2 border-border/80 py-3.5 px-4 text-xs font-semibold text-foreground focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 focus:outline-none shadow-sm transition-all"
            required
          />
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="state" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            placeholder="e.g. Delhi NCR"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
            className="w-full rounded-2xl bg-card border-2 border-border/80 py-3.5 px-4 text-xs font-semibold text-foreground focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 focus:outline-none shadow-sm transition-all"
            required
          />
        </div>
        
        <div className="sm:col-span-1">
          <label htmlFor="postalCode" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
            PIN Code
          </label>
          <input
            type="text"
            id="postalCode"
            placeholder="110001"
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
            className="w-full rounded-2xl bg-card border-2 border-border/80 py-3.5 px-4 text-xs font-semibold text-foreground focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 focus:outline-none shadow-sm transition-all"
            required
          />
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="country" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
            Country / Region
          </label>
          <select
            id="country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
            className="w-full rounded-2xl bg-card border-2 border-border/80 py-3.5 px-4 text-xs font-semibold text-foreground focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 focus:outline-none shadow-sm cursor-pointer transition-all"
            required
          >
            <option value="India" className="bg-card text-foreground font-semibold">India (Domestic Insured Dispatch)</option>
            <option value="United States" className="bg-card text-foreground font-semibold">United States (Global White-Glove)</option>
            <option value="United Kingdom" className="bg-card text-foreground font-semibold">United Kingdom (Global White-Glove)</option>
            <option value="United Arab Emirates" className="bg-card text-foreground font-semibold">United Arab Emirates (Global White-Glove)</option>
            <option value="Canada" className="bg-card text-foreground font-semibold">Canada (Global White-Glove)</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 2: Payment Method
  const PaymentMethodStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A059]">Step 02</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Bespoke Payment Settlement</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Encrypted 256-bit bank-grade vault protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {[
          { id: 'Credit Card', label: 'Imperial Credit / Debit Card', desc: 'Visa, Mastercard, Amex Centurion' },
          { id: 'UPI', label: 'Instant Royal UPI', desc: 'Google Pay, PhonePe, BHIM' },
          { id: 'Net Banking', label: 'Priority Net Banking', desc: 'All Major Indian Private Banks' },
          { id: 'Cash on Delivery', label: 'White-Glove Pay on Delivery', desc: 'Cash or Card at Handover' }
        ].map((method) => {
          const isSelected = paymentMethod === method.id;
          return (
            <label
              key={method.id}
              className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex items-start gap-3.5 ${
                isSelected
                  ? 'border-[#B38728] bg-card shadow-lg ring-1 ring-[#B38728]/30'
                  : 'border-border/80 bg-card/60 hover:border-[#B38728]/50'
              }`}
            >
              <input
                id={`payment-${method.id}`}
                name="payment-method"
                type="radio"
                checked={isSelected}
                onChange={() => setPaymentMethod(method.id)}
                className="mt-1 h-4 w-4 text-[#B38728] focus:ring-[#B38728] accent-[#B38728]"
              />
              <div>
                <span className="block text-xs font-bold text-foreground">{method.label}</span>
                <span className="block text-[11px] text-muted-foreground mt-0.5">{method.desc}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );

  // Step 3: Order Summary
  const OrderSummaryStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-3.5 h-3.5 text-[#B38728]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B38728]">Step 03</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Review Commission Dossier</h2>
      </div>
      
      {/* Items list */}
      <div className="space-y-3 pt-2">
        {items.map((item, idx) => {
          const product = item.product;
          const rawImg = product?.images?.[0] as any;
          const imageSrc: string = typeof rawImg === 'string'
            ? rawImg
            : rawImg?.data
              ? (rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                  ? rawImg.data
                  : `data:image/jpeg;base64,${rawImg.data}`)
              : '/images/category-kurta.jpg';
          return (
            <div key={idx} className="bg-card p-4 rounded-2xl flex items-center justify-between border-2 border-border/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-12 rounded-xl overflow-hidden border border-[#B38728]/40 flex-shrink-0">
                  <Image src={imageSrc} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-foreground">{product.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Qty: {item.quantity} • Size: {item.size === 'customize' ? 'Bespoke 48-Pt' : item.size} • Fit: {item.fitting}
                  </p>
                </div>
              </div>
              <p className="font-serif text-sm font-bold text-[#8A6418] dark:text-[#FCF6BA]">
                ₹{(product.price * item.quantity).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Investment breakdown */}
      <div className="bg-card p-6 rounded-2xl border-2 border-[#B38728]/40 space-y-3 text-xs shadow-md">
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">Commission Subtotal ({totalItems} items)</span>
          <span className="font-bold text-foreground">₹{itemsPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">White-Glove Insured Delivery</span>
          <span className="font-bold text-[#8A6418] dark:text-[#FCF6BA]">{shippingPrice === 0 ? 'Complimentary' : `₹${shippingPrice.toLocaleString()}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">GST (18% Imperial Duty)</span>
          <span className="font-bold text-foreground">₹{taxPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-[#B38728]/40 pt-3">
          <span className="font-serif text-sm font-bold text-foreground">Total Commission Investment</span>
          <span className="font-serif text-lg font-black text-[#8A6418] dark:text-[#FCF6BA]">₹{totalOrderPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-10">
        {[
          { step: 1, label: 'Delivery' },
          { step: 2, label: 'Payment' },
          { step: 3, label: 'Review' }
        ].map((item, idx) => (
          <div key={item.step} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === item.step 
                  ? 'btn-glass-gold shadow-md text-foreground' 
                  : currentStep > item.step 
                    ? 'bg-[#C5A059] text-white shadow-sm' 
                    : 'glass-pill text-muted-foreground'
              }`}>
                {currentStep > item.step ? (
                  <CheckIcon className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  item.step
                )}
              </div>
              <span className={`text-xs uppercase tracking-wider font-semibold ${
                currentStep === item.step ? 'text-[#C5A059]' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </div>
            {idx < 2 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-3 transition-colors ${
                currentStep > item.step ? 'bg-[#C5A059]' : 'bg-border/60'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Glass Docket */}
      <div className="glass-panel border border-[#C5A059]/30 shadow-2xl rounded-3xl p-6 sm:p-10">
        {currentStep === 1 && <ShippingAddressStep />}
        {currentStep === 2 && <PaymentMethodStep />}
        {currentStep === 3 && <OrderSummaryStep />}
        
        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-border/50 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              currentStep === 1
                ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                : 'glass-pill text-foreground hover:border-[#C5A059]'
            }`}
          >
            &larr; Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-glass-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] shadow-lg"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`btn-glass-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] shadow-xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Finalizing Commission...' : 'Authorize & Commission Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}