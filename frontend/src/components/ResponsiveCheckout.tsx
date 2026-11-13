'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { formatEuro } from '@/lib/currency';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export default function ResponsiveCheckout() {
  const { isAuthenticated } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
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

  const itemsPrice = totalPrice;
  const shippingPrice = itemsPrice > 2000 ? 0 : 100;
  const taxPrice = itemsPrice * 0.18;
  const totalOrderPrice = itemsPrice + shippingPrice + taxPrice;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.postalCode ||
        !shippingAddress.state
      ) {
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
      toast.error('Please sign in to place your order');
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    try {
      setLoading(true);
      clearCart();
      router.push('/order-confirmation?orderId=12345');
      toast.success('Order placed');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, name: 'Delivery' },
    { number: 2, name: 'Payment' },
    { number: 3, name: 'Review' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      {/* Stepper */}
      <nav aria-label="Checkout Steps" className="mb-10 border-b border-border pb-4">
        <ol className="grid grid-cols-3 gap-4">
          {steps.map((step) => (
            <li key={step.number} className="text-center sm:text-left">
              <span
                className={`text-[11px] uppercase tracking-[0.2em] ${
                  currentStep === step.number
                    ? 'text-foreground font-medium'
                    : currentStep > step.number
                    ? 'text-accent'
                    : 'text-muted-foreground'
                }`}
              >
                0{step.number}. {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="border border-border p-6 sm:p-10">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Delivery Address
              </h2>
              <p className="text-xs font-light text-muted-foreground mt-1">
                Insured courier dispatch directly from our atelier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  placeholder="House number, street, locality"
                  className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Payment Method
              </h2>
              <p className="text-xs font-light text-muted-foreground mt-1">
                Select your preferred payment option.
              </p>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {['Credit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  className="flex items-center justify-between py-4 cursor-pointer"
                >
                  <span className="text-sm text-foreground">{method}</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-foreground"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Review Order
              </h2>
              <p className="text-xs font-light text-muted-foreground mt-1">
                Confirm your items and delivery details before placing your order.
              </p>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {items.map((item, index) => {
                const product = item.product;
                const rawImg = product?.images?.[0] as unknown as string | { data?: string };
                const imageSrc =
                  typeof rawImg === 'string'
                    ? rawImg
                    : rawImg?.data
                    ? rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                      ? rawImg.data
                      : `data:image/jpeg;base64,${rawImg.data}`
                    : '/images/original-ivory-blazer.jpg';

                return (
                  <div key={index} className="py-4 flex items-center gap-4">
                    <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={imageSrc}
                        alt={product?.name || 'Item'}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{product?.name}</p>
                      <p className="text-xs font-light text-muted-foreground">
                        Qty: {item.quantity} &middot; Size: {item.size}
                      </p>
                    </div>
                    <p className="text-sm tabular-nums text-foreground">
                      {formatEuro((product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums text-foreground">
                  {formatEuro(itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT / Duty (18%)</span>
                <span className="tabular-nums text-foreground">
                  {formatEuro(taxPrice)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-foreground">
                  {shippingPrice === 0 ? 'Complimentary' : formatEuro(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-border text-foreground">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatEuro(totalOrderPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border flex flex-col-reverse sm:flex-row justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="px-8 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
