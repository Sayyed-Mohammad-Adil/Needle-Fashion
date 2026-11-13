import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-border pb-10 mb-12">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
            Legal &amp; Discretion
          </p>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Privacy Charter
          </h1>
          <p className="text-xs font-light text-muted-foreground mt-3 uppercase tracking-[0.18em]">
            Needle Fashion Atelier
          </p>
        </div>

        <div className="space-y-10 text-sm font-light leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-base font-normal text-foreground">
              1. Client Discretion
            </h2>
            <p>
              Needle Fashion treats your personal measurements, bespoke commission records, and contact details with strict confidentiality.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Contact details (name, email address, phone number for fittings)</li>
              <li>Anatomical tailoring specifications (shoulder, chest, sleeve, trouser measurements)</li>
              <li>Delivery address and encrypted payment confirmations</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              3. No Third-Party Sale
            </h2>
            <p>
              We never sell, rent, or distribute client profiles or measurement archives to third parties.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-base font-normal text-foreground">
              4. Privacy Officer
            </h2>
            <p>
              privacy@needlefashion.com &middot; Heritage Mile, Colaba, Mumbai 400001
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
