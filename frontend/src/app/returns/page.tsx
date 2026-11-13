import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-border pb-10 mb-12">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
            Client Services
          </p>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Exchange &amp; Return Policy
          </h1>
          <p className="text-xs font-light text-muted-foreground mt-3 uppercase tracking-[0.18em]">
            Needle Fashion Atelier
          </p>
        </div>

        <div className="space-y-10 text-sm font-light leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-base font-normal text-foreground">
              1. Ready-to-Wear Guarantee
            </h2>
            <p>
              Standard-sized suits, shirts, trousers, accessories, and Indian wear may be exchanged or altered complimentarily within 14 days of delivery.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              2. Condition Requirements
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Unworn, unwashed condition with original security tags intact</li>
              <li>Original cotton muslin garment bag and presentation packaging</li>
              <li>Accompanied by the original invoice or certificate</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              3. Bespoke &amp; Made-to-Measure Commissions
            </h2>
            <p>
              Garments tailored to custom measurements or personalized monograms are not eligible for monetary refund, but carry our complimentary lifetime atelier alteration service.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              4. Concierge Desk
            </h2>
            <p>
              concierge@needlefashion.com &middot; +91 (022) 8800-NEEDLE
            </p>
          </section>

          <div className="pt-8 border-t border-border">
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
