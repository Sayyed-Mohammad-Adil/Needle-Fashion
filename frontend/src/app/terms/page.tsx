import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-border pb-10 mb-12">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
            Legal &amp; Discretion
          </p>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-xs font-light text-muted-foreground mt-3 uppercase tracking-[0.18em]">
            Needle Fashion Atelier
          </p>
        </div>

        <div className="space-y-10 text-sm font-light leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-base font-normal text-foreground">
              1. Scope of Service
            </h2>
            <p>
              These Terms govern your bespoke commissions, private salon appointments, and online purchases with Needle Fashion.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              2. Handloom &amp; Craftsmanship
            </h2>
            <p>
              Our garments are crafted from handwoven Indian textiles and artisanal embroidery. Subtle variations in slub, weave, and thread lustre are inherent hallmarks of handloom craft.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              3. Bespoke Measurements &amp; Alterations
            </h2>
            <p>
              Custom orders are drafted to the measurements provided by the client or recorded during an atelier fitting, and include complimentary post-delivery alterations.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              4. Intellectual Property
            </h2>
            <p>
              All embroidery motifs, garment patterns, photography, and brand marks remain the exclusive property of Needle Fashion.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              5. Legal Inquiries
            </h2>
            <p>
              legal@needlefashion.com &middot; Heritage Mile, Colaba, Mumbai 400001
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
