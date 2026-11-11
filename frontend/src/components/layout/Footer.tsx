'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import RoyalFiberCanvas from '@/components/3d/RoyalFiberCanvas';

const navigation = {
  categories: [
    {
      id: 'menswear',
      roman: 'I.',
      name: 'Haute Menswear',
      items: [
        { name: 'Imperial Sherwanis', href: '/category/sherwani' },
        { name: 'Jodhpur Bandhgalas', href: '/category/kurta-jacket' },
        { name: 'Heritage Silk Kurtas', href: '/category/kurta' },
        { name: 'Indo-Western Tuxedos', href: '/category/kurta-jacket?type=tuxedo' },
        { name: 'Royal Regalia & Safas', href: '/category/all?accessory=safa' },
        { name: 'Runway New Arrivals', href: '/new-arrivals' },
      ],
    },
    {
      id: 'concierge',
      roman: 'II.',
      name: 'Atelier Concierge',
      items: [
        { name: 'Book Master Fitting', href: '/contact' },
        { name: '48-Point Bespoke Guide', href: '/about' },
        { name: 'Shipping & Returns', href: '/returns' },
        { name: 'Atelier FAQ & Care', href: '/faq' },
        { name: 'Saved Wishlist', href: '/customer/wishlist' },
      ],
    },
    {
      id: 'maison',
      roman: 'III.',
      name: 'The Vintage Maison',
      items: [
        { name: 'Six Moods Archive', href: '/#needle-archive' },
        { name: 'Try the Look Stylist', href: '/#try-the-look' },
        { name: 'Browse the Atelier Rack', href: '/#atelier-rack' },
        { name: 'Karigar Lineage', href: '/about' },
        { name: 'Terms of Commission', href: '/terms' },
        { name: 'Privacy Protocol', href: '/privacy' },
      ],
    },
  ],
  social: [
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

const heritagePillars = [
  {
    numeral: 'I',
    title: '48-Point Bespoke',
    subtitle: 'Hand-drafted master paper patterns',
  },
  {
    numeral: 'II',
    title: 'Pure Banarasi Silks',
    subtitle: 'Varanasi Katan, Chanderi & Tussar',
  },
  {
    numeral: 'III',
    title: '24K Gold & Silver Zari',
    subtitle: 'Hand-coiled dabka, marodi & tilla',
  },
  {
    numeral: 'IV',
    title: 'Muslin Trunk Transit',
    subtitle: 'Insured global white-glove dispatch',
  },
];

function VintageCornerFlourish({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`w-7 h-7 text-[#9E752E] dark:text-[#DFB76C] pointer-events-none ${className}`}
    >
      <path
        d="M2 38V10C2 5.58 5.58 2 10 2H38"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 34V12C7 9.24 9.24 7 12 7H34"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeOpacity="0.65"
      />
      <circle cx="10" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const handleSalonInvite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    setInvited(true);
    setInviteEmail('');
    toast.success(`Royal Salon Dispatch recorded for ${trimmed}`);
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden bg-[#EFE3CE] dark:bg-[#17100B] text-[#2A1B12] dark:text-[#F4E9D5] border-t-4 border-double border-[#9A712C] dark:border-[#C5A059]/75 transition-colors"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Vintage Palace Engraving & Jaali Filigree Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <Image
          src="/images/vintage-palace-night.webp"
          alt="Vintage Indian Heritage Palace Engraving"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 dark:opacity-30 sepia-[0.65] contrast-[1.08] brightness-[0.95] dark:brightness-[0.65]"
        />
        <div
          className="absolute inset-0 opacity-[0.09] dark:opacity-[0.08]"
          style={{
            backgroundImage: "url('/images/vintage-jaali-motif.webp')",
            backgroundSize: '280px 280px',
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Aged Paper Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EFE3CE]/88 via-[#E9DAC0]/80 to-[#DFCCA9]/92 dark:from-[#17100B]/88 dark:via-[#140D09]/82 dark:to-[#0E0906]/94" />
      </div>

      {/* Subtle 3D Flowing Silk Zari Threads */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20 dark:opacity-30 overflow-hidden">
        <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} className="w-full h-full" />
      </div>

      {/* Top Ornamental Bel-Boota Ribbon */}
      <div className="relative z-10 border-b border-[#9A712C]/40 dark:border-[#C5A059]/30 bg-[#E5D3B3]/70 dark:bg-[#221710]/80 py-2.5 px-4 text-center">
        <p className="font-serif text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#6E4916] dark:text-[#DFB76C] font-semibold">
          ❦ &nbsp; Agra &bull; Varanasi &bull; Jaipur &bull; Bombay &nbsp; ✦ &nbsp; Est. 2026 &nbsp; ❦
        </p>
      </div>

      {/* Main Broadsheet Container with Double-Ruled Brass Frame */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative border-2 border-[#9A712C]/70 dark:border-[#C5A059]/55 p-5 sm:p-10 bg-[#F7EEDF]/70 dark:bg-[#1C130D]/75 shadow-[0_20px_50px_rgba(42,27,18,0.18)] backdrop-blur-[2px]">
          {/* Inner hairline border */}
          <div className="absolute inset-2 border border-[#9A712C]/35 dark:border-[#C5A059]/30 pointer-events-none" />

          {/* Four Antique Corner Scrollwork Flourishes */}
          <VintageCornerFlourish className="absolute top-3 left-3" />
          <VintageCornerFlourish className="absolute top-3 right-3 rotate-90" />
          <VintageCornerFlourish className="absolute bottom-3 left-3 -rotate-90" />
          <VintageCornerFlourish className="absolute bottom-3 right-3 rotate-180" />

          {/* Four Brass-Studded Heritage Guarantee Plaques */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 border-b-2 border-double border-[#9A712C]/45 dark:border-[#C5A059]/35">
            {heritagePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="relative p-4 border border-[#9A712C]/55 dark:border-[#C5A059]/40 bg-[#FBF5E9]/85 dark:bg-[#241911]/85 flex items-center gap-3.5 shadow-sm"
              >
                {/* Brass corner rivets */}
                <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#9A712C] dark:bg-[#DFB76C]" />
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#9A712C] dark:bg-[#DFB76C]" />
                <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#9A712C] dark:bg-[#DFB76C]" />
                <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#9A712C] dark:bg-[#DFB76C]" />

                <div className="w-11 h-11 border border-[#9A712C]/70 dark:border-[#DFB76C]/60 bg-[#EFE1C6] dark:bg-[#312116] flex items-center justify-center font-serif text-base font-bold text-[#7A5316] dark:text-[#F5EDD6] flex-shrink-0">
                  {pillar.numeral}
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2A1B12] dark:text-[#FAF0DC] tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="font-serif italic text-[11.5px] text-[#5F4731] dark:text-[#CBBBA0] mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Emblem & Broadsheet Grid */}
          <div className="relative z-10 pt-10 xl:grid xl:grid-cols-12 xl:gap-10">
            {/* Left: Royal Wax-Seal Monogram & Epigraph */}
            <div className="xl:col-span-4 space-y-5">
              <div className="flex items-center gap-4">
                {/* Crimson & Antique Brass Wax Seal Medallion */}
                <div
                  className="w-14 h-14 rounded-full border-2 border-[#C5A059] shadow-[0_4px_14px_rgba(92,10,24,0.4)] flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #A91B34 0%, #7A0E22 60%, #4A0713 100%)',
                  }}
                >
                  <div className="w-11 h-11 rounded-full border border-dashed border-[#F5EDD6]/60 flex items-center justify-center">
                    <span className="font-serif text-2xl font-black text-[#F5EDD6]">N</span>
                  </div>
                </div>

                <div>
                  <span className="font-serif text-2xl font-black tracking-[0.08em] text-[#2A1B12] dark:text-[#FAF0DC] block leading-none">
                    NEEDLE FASHION
                  </span>
                  <span className="font-serif text-[10px] tracking-[0.28em] uppercase text-[#8A5F1D] dark:text-[#DFB76C] font-bold mt-1.5 block">
                    Royal Menswear Atelier
                  </span>
                </div>
              </div>

              <div className="border-y border-[#9A712C]/40 dark:border-[#C5A059]/30 py-3">
                <p className="font-serif italic text-sm text-[#4A321F] dark:text-[#EFE2C8]">
                  &ldquo;Woven by hand, tailored for a lifetime.&rdquo;
                </p>
                <p className="text-[11px] text-[#7A5316] dark:text-[#DFB76C]/90 mt-1 tracking-wide">
                  हुनर की बात है वरना लिबास सब पहनते हैं
                </p>
              </div>

              <p className="font-serif text-xs leading-6 text-[#4D3827] dark:text-[#CDBFA8]">
                Preserving four centuries of Mughal and Rajput sartorial craft exclusively for gentlemen — Banarasi pit-loom silks, 24K gold &amp; silver zari, and 48-point bespoke paper patterns.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Needle Fashion on ${item.name}`}
                    className="w-9 h-9 border border-[#9A712C]/70 dark:border-[#C5A059]/60 bg-[#FAF2E4] dark:bg-[#261A12] flex items-center justify-center text-[#5A3D22] dark:text-[#E8D7B5] hover:bg-[#9A712C] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-[#17100B] transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('openShahiFarman'));
                    }
                  }}
                  className="px-4 py-2 border border-[#7A0E22]/70 dark:border-[#C5A059]/70 bg-[#7A0E22] dark:bg-[#2C1C12] text-[#F5EDD6] font-serif text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#5E0A19] dark:hover:bg-[#C5A059] dark:hover:text-[#17100B] transition-colors"
                >
                  📜 Unroll Shahi Farman
                </button>
              </div>
            </div>

            {/* Right: Classical Ledger Columns + Postal Salon Dispatch */}
            <div className="mt-12 xl:mt-0 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {navigation.categories.map((group) => (
                <div key={group.id}>
                  <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-[#7A5316] dark:text-[#DFB76C] pb-2 border-b border-[#9A712C]/50 dark:border-[#C5A059]/40 flex items-center gap-1.5">
                    <span className="opacity-75">{group.roman}</span>
                    <span>{group.name}</span>
                  </h3>
                  <ul role="list" className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="font-serif text-xs text-[#3C291B] dark:text-[#DFD2BC] hover:text-[#7A0E22] dark:hover:text-[#FCF6BA] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                        >
                          <span className="text-[#9A712C] dark:text-[#C5A059] text-[9px]" aria-hidden="true">
                            ❧
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Vintage Postal Ledger Card: Private Salon Circle */}
              <div className="relative border-2 border-[#9A712C]/70 dark:border-[#C5A059]/55 bg-[#FBF4E7] dark:bg-[#22170F] p-5 shadow-md">
                <div className="absolute inset-1 border border-[#9A712C]/30 dark:border-[#C5A059]/25 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-[#9A712C]/40 dark:border-[#C5A059]/30 pb-2">
                    <span className="font-serif text-[9px] uppercase tracking-[0.25em] text-[#7A0E22] dark:text-[#DFB76C] font-bold">
                      Royal Post
                    </span>
                    <span className="font-serif text-[9px] text-[#7A5316] dark:text-[#C5A059]">
                      No. IV
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#2A1B12] dark:text-[#FAF0DC] mt-3">
                    Private Salon Circle
                  </h3>
                  <p className="mt-1.5 font-serif italic text-[11.5px] leading-relaxed text-[#5A4028] dark:text-[#CBBBA0]">
                    Enter your missive address for trunk show previews &amp; archive commissions.
                  </p>

                  <form className="mt-4 space-y-3" onSubmit={handleSalonInvite}>
                    <label htmlFor="footer-salon-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-salon-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => {
                        setInviteEmail(e.target.value);
                        if (invited) setInvited(false);
                      }}
                      className="w-full bg-transparent border-0 border-b-2 border-[#9A712C]/65 dark:border-[#C5A059]/55 px-1 py-1.5 font-serif text-xs text-[#2A1B12] dark:text-[#FAF0DC] placeholder:text-[#8A7156] dark:placeholder:text-[#9A8B74] focus:outline-none focus:border-[#7A0E22] dark:focus:border-[#FCF6BA]"
                      placeholder="patron@domain.com"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 border border-[#7A0E22] dark:border-[#C5A059] bg-[#7A0E22] dark:bg-[#C5A059] text-[#F5EDD6] dark:text-[#17100B] font-serif text-[10.5px] uppercase tracking-[0.22em] font-bold hover:bg-[#5E0A19] dark:hover:bg-[#DFB76C] transition-colors"
                    >
                      {invited ? 'Missive Recorded ✓' : 'Seal Invitation'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Vintage Broadsheet Colophon */}
          <div className="relative z-10 mt-12 pt-6 border-t-2 border-double border-[#9A712C]/50 dark:border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif text-xs text-[#4D3827] dark:text-[#CBBBA0]">
              &copy; {new Date().getFullYear()} Needle Fashion Atelier &mdash; Handcrafted Exclusively for Men.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 font-serif text-xs text-[#4D3827] dark:text-[#CBBBA0]">
              <Link
                href="/privacy"
                className="hover:text-[#7A0E22] dark:hover:text-[#FCF6BA] transition-colors"
              >
                Privacy Protocol
              </Link>
              <span className="text-[#9A712C] dark:text-[#C5A059]">❖</span>
              <Link
                href="/terms"
                className="hover:text-[#7A0E22] dark:hover:text-[#FCF6BA] transition-colors"
              >
                Terms of Commission
              </Link>
              <span className="text-[#9A712C] dark:text-[#C5A059]">❖</span>
              <span className="italic font-semibold text-[#7A5316] dark:text-[#DFB76C]">
                Imperial Vintage Edition
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
