'use client';

import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function ReturnsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <SparklesIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Atelier Policy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Bespoke Exchange &amp; Return Policy
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-[0.14em]">Updated for Current Collections</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">1. Bespoke &amp; Ready-to-Wear Guarantee</h2>
            <p>
              At Needle Fashion, every creation is hand-finished with meticulous zardozi craftsmanship. If any standard-sized garment does not meet your discerning expectations, our atelier offers complimentary exchanges and alterations within 14 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">2. Eligibility for Exchange &amp; Returns</h2>
            <p className="mb-2">To preserve artisanal purity, items submitted for return or exchange must adhere to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pristine, unworn, unwashed condition with intact gold security tags</li>
              <li>Original archival muslin bag and protective presentation box</li>
              <li>No personal perfumery, alterations, or fabric creases</li>
              <li>Accompanied by the original bespoke certificate of authenticity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">3. Custom Measurements &amp; Bridal Couture</h2>
            <p>
              Custom-tailored commissions with personalized measurements or bespoke embroidery monograms cannot be returned for monetary refund, but include our <strong>Complimentary Lifetime Atelier Alteration Guarantee</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">4. White-Glove Return Concierge</h2>
            <p>
              To initiate an exchange, please notify your personal atelier concierge:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-background border border-border text-xs space-y-1">
              <p><strong className="text-foreground">Email:</strong> concierge@needlefashion.com</p>
              <p><strong className="text-foreground">Private Stylist Desk:</strong> +91 (022) 8800-NEEDLE (633353)</p>
              <p><strong className="text-foreground">Atelier Salons:</strong> Mumbai (Colaba) &amp; New Delhi (Defence Colony)</p>
            </div>
          </section>

          <div className="pt-6 border-t border-border text-center">
            <Link 
              href="/contact"
              className="btn-luxury-gold inline-flex px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Contact Atelier Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}