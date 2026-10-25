'use client';

import Link from 'next/link';
import { ScaleIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <ScaleIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Atelier Terms &amp; Conditions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Bespoke Service Terms
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-[0.14em]">Needle Fashion Haute Couture</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">1. Atelier Covenant</h2>
            <p>
              Welcome to Needle Fashion. These Terms govern your bespoke orders, salon consultations, and catalog purchases. By engaging our atelier or ordering online, you accept these terms in their entirety.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">2. Handcrafted Uniqueness</h2>
            <p>
              Our collections are handcrafted by master karigars using authentic pit-loom woven silks and artisanal zardozi embroidery. Minor nuances in thread lustre, metallic tint, and handloom texture are natural signatures of authenticity and artistic heritage, not defects.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">3. Bespoke Measurements &amp; Alterations</h2>
            <p>
              Custom-tailored commissions are tailored to the exact specifications submitted by the patron or recorded during an atelier fitting. Needle Fashion provides complimentary alterations on all bespoke orders to guarantee an impeccable silhouette.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p>
              All embroidery patterns, silhouette designs, photography, and brand assets are the exclusive intellectual property of Needle Fashion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">5. Legal Inquiries</h2>
            <div className="p-4 rounded-xl bg-background border border-border text-xs space-y-1">
              <p><strong className="text-foreground">Legal Concierge:</strong> legal@needlefashion.com</p>
              <p><strong className="text-foreground">Atelier HQ:</strong> Needle Fashion, Heritage Mile, Colaba, Mumbai 400001, India</p>
            </div>
          </section>

          <div className="pt-6 border-t border-border text-center">
            <Link 
              href="/contact"
              className="btn-luxury-gold inline-flex px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Contact Legal Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}