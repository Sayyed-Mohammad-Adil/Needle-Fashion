'use client';

import ResponsiveCheckout from '@/components/ResponsiveCheckout';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 transition-colors">
      <ResponsiveCheckout />
    </div>
  );
}
