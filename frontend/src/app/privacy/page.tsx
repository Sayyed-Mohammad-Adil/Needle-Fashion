'use client';

import Link from 'next/link';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Data Protection &amp; Confidentiality</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Patron Privacy Charter
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-[0.14em]">Needle Fashion Atelier</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">1. Atelier Discretion &amp; Commitment</h2>
            <p>
              Needle Fashion (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Atelier&rdquo;) holds the privacy and bespoke details of our patrons in the highest esteem. We treat your personal measurements, commission histories, and contact coordinates with strict diplomatic confidentiality.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-2">To tailor your garments with millimeter precision, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact coordinates (Full name, encrypted email, phone/WhatsApp for fitting consults)</li>
              <li>Anatomical fit specifications (Shoulder breadth, chest profile, sleeve pitch, inseam)</li>
              <li>Delivery coordinates for secure white-glove transit</li>
              <li>Encrypted transaction logs handled exclusively via certified payment gateways</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">3. Zero Data Commercialization</h2>
            <p>
              We will never sell, lease, or distribute patron profiles or measurement registries to external marketing entities. Your data exists solely to power your luxury shopping journey and personal styling consultations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-foreground mb-3">4. Atelier Contact</h2>
            <div className="p-4 rounded-xl bg-background border border-border text-xs space-y-1">
              <p><strong className="text-foreground">Privacy Officer:</strong> privacy@needlefashion.com</p>
              <p><strong className="text-foreground">Headquarters:</strong> Needle Fashion Atelier, Heritage Mile, Colaba, Mumbai 400001</p>
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