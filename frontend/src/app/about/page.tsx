'use client';

import Link from 'next/link';
import {
  useSiteConfig,
  getAspectRatioClass,
  getObjectFitClass,
  getFocalPointClass,
} from '@/contexts/SiteConfigContext';

export default function AboutPage() {
  const { getSection } = useSiteConfig();
  const aboutSec = getSection('about', 'heritage-hero');
  const heroMedia = aboutSec?.media?.[0];
  const portraitMedia = aboutSec?.media?.[1];

  return (
    <main className="bg-background text-foreground">
      {/* Editorial Hero */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {aboutSec?.eyebrow || 'The Maison'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              {aboutSec?.title || 'Indian Craftsmanship, Tailored for the Modern Wardrobe'}
            </h1>
            <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed max-w-lg">
              {aboutSec?.subtitle ||
                'Needle Fashion unites centuries-old Indian handloom weaving and karigar embroidery with disciplined Western and Indian tailoring—producing bespoke suits, coats, shirts, trousers, and ceremonial Indian wear.'}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`relative ${getAspectRatioClass(
                heroMedia?.aspectRatio || aboutSec?.aspectRatio || '16:9'
              )} w-full overflow-hidden bg-muted`}
            >
              <img
                src={heroMedia?.url || '/images/vintage-hero-palace.webp'}
                alt={heroMedia?.alt || 'Needle Fashion Atelier Heritage'}
                className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                  heroMedia?.objectFit || aboutSec?.objectFit
                )} ${getFocalPointClass(heroMedia?.focalPoint || aboutSec?.focalPoint)}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="py-20 sm:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div
              className={`relative ${getAspectRatioClass(
                portraitMedia?.aspectRatio || '3:4'
              )} max-w-lg mx-auto overflow-hidden bg-muted`}
            >
              <img
                src={portraitMedia?.url || '/images/original-ivory-blazer.jpg'}
                alt={portraitMedia?.alt || 'Mughal Jaali Embroidered Tailored Suit'}
                className={`absolute inset-0 w-full h-full ${getObjectFitClass(
                  portraitMedia?.objectFit || aboutSec?.objectFit
                )} ${getFocalPointClass(portraitMedia?.focalPoint || 'top')}`}
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                Philosophy
              </p>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
                Where East Meets Savile Row
              </h2>
            </div>

            <div className="space-y-8 border-t border-border pt-8">
              <div>
                <h3 className="text-sm font-normal uppercase tracking-[0.16em] text-foreground mb-2">
                  48-Point Bespoke Tailoring
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  Every suit jacket, bandhgala, shirt, and trouser is drafted to individual posture and shoulder pitch across 48 anatomical checkpoints.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-normal uppercase tracking-[0.16em] text-foreground mb-2">
                  Handloom Textiles &amp; Zardozi
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  Our fabrics originate on pit looms in Varanasi, Chanderi, and Kashmir, finished by master karigars working in zardozi, resham, and fine tilla.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-normal uppercase tracking-[0.16em] text-foreground mb-2">
                  Artisan Guild Stewardship
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  We partner directly with over 150 master weaver and embroiderer families, preserving generational motif archives under fair patronage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Salon CTA */}
      <section className="py-20 sm:py-28 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Private Salon
          </p>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
            Experience the Atelier in Person
          </h2>
          <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            Reserve a private appointment to explore seasonal fabric swatches and commission a bespoke garment.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Book Consultation
            </Link>
            <Link
              href="/new-arrivals"
              className="px-8 py-4 border border-border text-foreground text-xs uppercase tracking-[0.22em] hover:border-foreground transition-colors"
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
