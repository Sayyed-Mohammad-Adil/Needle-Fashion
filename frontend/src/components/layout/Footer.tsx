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
    symbol: '✦',
    title: '48-Point Bespoke',
    subtitle: 'Hand-drafted master paper patterns',
    metallic: false,
  },
  {
    symbol: '❖',
    title: 'Pure Indian Silks',
    subtitle: 'Varanasi Katan, Chanderi & Tussar',
    metallic: true,
  },
  {
    symbol: '⚜',
    title: '24K Gold & Silver Zari',
    subtitle: 'Heirloom dabka, marodi & tilla relief',
    metallic: false,
  },
  {
    symbol: '✈',
    title: 'Muslin Trunk Transit',
    subtitle: 'Insured global white-glove dispatch',
    metallic: true,
  },
];

export default function Footer() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const handleSalonInvite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    setInvited(true);
    setInviteEmail('');
    toast.success('Royal Salon Invitation logged for ' + trimmed);
  };

  return (
    <footer
      className="bg-[#0B0B0D] text-[#F5EFE6] relative overflow-hidden border-t-2 border-[#C5A059]/45"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Vintage Twilight Palace Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <Image
          src="/images/vintage-palace-night.webp"
          alt="Vintage Indian Heritage Palace Backdrop"
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-20 sepia-[0.35] contrast-[1.08] brightness-[0.65]"
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/images/vintage-jaali-motif.webp')",
            backgroundSize: '320px 320px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/95 via-[#0F0E11]/88 to-[#070709]" />
      </div>

      {/* Ornate Double Antique Brass Hairlines */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-20"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(223, 183, 108, 0.7) 25%, rgba(252, 246, 186, 0.9) 50%, rgba(223, 183, 108, 0.7) 75%, transparent)',
        }}
      />
      <div
        className="absolute top-[5px] left-6 right-6 h-[1px] opacity-40 z-20"
        style={{
          background:
            'linear-gradient(to right, transparent, #C5A059 20%, #C5A059 80%, transparent)',
        }}
      />

      {/* 3D Flowing Silk Zari Threads Animation */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-35 overflow-hidden">
        <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} className="w-full h-full" />
      </div>

      {/* Vintage Sovereign Guarantee Ledger Bar */}
      <div className="border-b border-[#C5A059]/25 bg-[#09090B]/70 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {heritagePillars.map((pillar) => (
              <div
                key={pillar.title}
                className={`relative bg-[#121114]/90 p-5 rounded-2xl flex items-center gap-4 border shadow-lg transition-all ${
                  pillar.metallic
                    ? 'border-[#BBC2CC]/25 hover:border-[#EAECEC]/55'
                    : 'border-[#C5A059]/30 hover:border-[#DFB76C]/65'
                }`}
              >
                {/* Vintage inner corner hairline */}
                <div className="absolute inset-1.5 rounded-xl border border-[#C5A059]/10 pointer-events-none" />
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold flex-shrink-0 shadow-sm border ${
                    pillar.metallic
                      ? 'text-[#D6DCE5] bg-white/5 border-[#BBC2CC]/30'
                      : 'text-[#DFB76C] bg-[#C5A059]/10 border-[#C5A059]/35'
                  }`}
                >
                  {pillar.symbol}
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#FAF5EB] tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#C7BFA9] mt-0.5 font-light">{pillar.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Vintage Ledger Body */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-14 sm:pt-18 lg:px-8 relative z-10">
        {/* Centered Vintage Maison Crest Divider */}
        <div className="flex items-center justify-center gap-4 mb-12 text-[#C5A059]/80">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/45" />
          <span className="text-[10px] font-serif uppercase tracking-[0.35em] text-[#DFB76C] text-center">
            ✦ Est. 2026 • Royal Menswear Archive • Varanasi &amp; Jaipur ✦
          </span>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/45" />
        </div>

        <div className="xl:grid xl:grid-cols-12 xl:gap-10">
          {/* Left Heritage Monogram & Epigraph */}
          <div className="xl:col-span-4 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl p-[1px] bg-gradient-to-b from-[#FCF6BA] via-[#C5A059] to-[#7D5E24] flex-shrink-0 shadow-md">
                <div className="w-full h-full rounded-[15px] bg-[#131215] flex items-center justify-center border border-[#C5A059]/30">
                  <span className="font-serif text-2xl font-black text-[#DFB76C]">N</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                  <span className="text-[#FAF5EB] font-black tracking-wider select-none">NEEDLE</span>{' '}
                  <span className="text-[#DFB76C] font-black tracking-wider">FASHION</span>
                </span>
                <span className="text-[9px] tracking-[0.28em] uppercase text-[#C5A059]/85 font-bold mt-1.5">
                  BESPOKE INDIAN MENSWEAR ATELIER
                </span>
              </div>
            </div>

            <p className="font-serif italic text-sm text-[#E8D7B5] border-l-2 border-[#C5A059]/60 pl-3.5">
              &ldquo;Woven by hand, tailored for a lifetime.&rdquo;
            </p>

            <p className="text-xs leading-6 text-[#CBC3B4] max-w-md">
              Preserving four centuries of Mughal and Rajput sartorial craft exclusively for men — handwoven Banarasi and Chanderi silks, 24K gold &amp; sterling silver zari, and 48-point bespoke tailoring.
            </p>

            <div className="flex items-center gap-3">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Needle Fashion on ${item.name}`}
                  className="w-10 h-10 rounded-full bg-[#161519] border border-[#C5A059]/45 flex items-center justify-center text-[#D6D0C4] hover:text-[#FCF6BA] hover:border-[#FCF6BA] transition-all shadow-sm"
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
                className="px-4 py-2 rounded-full bg-[#161519] border border-[#C5A059]/45 text-[10px] font-bold uppercase tracking-[0.18em] text-[#DFB76C] hover:border-[#FCF6BA] hover:text-[#FCF6BA] transition-all"
              >
                📜 Unroll Farman
              </button>
            </div>
          </div>

          {/* Right Navigation Ledger + Vintage Salon Dispatch Card */}
          <div className="mt-14 xl:mt-0 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {navigation.categories.map((group) => (
              <div key={group.id}>
                <h3 className="font-serif text-xs uppercase tracking-[0.22em] font-bold text-[#DFB76C] pb-2.5 border-b border-[#C5A059]/25">
                  {group.name}
                </h3>
                <ul role="list" className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-xs text-[#D8D0C0] hover:text-[#FCF6BA] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                      >
                        <span className="text-[#C5A059]/70 text-[9px]" aria-hidden="true">
                          ✦
                        </span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Vintage Framed Salon Invitation Card */}
            <div className="relative bg-[#141317]/95 p-5 rounded-2xl border border-[#C5A059]/40 shadow-xl">
              <div className="absolute inset-1.5 rounded-xl border border-[#C5A059]/15 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[9px] uppercase tracking-[0.26em] text-[#C5A059] font-bold block">
                  Royal Dispatch
                </span>
                <h3 className="font-serif text-base font-bold text-[#FAF5EB] mt-1">
                  Private Salon Circle
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-[#C7BFA9]">
                  Receive private invitations to groom trunk shows and limited karigar archive releases.
                </p>
                <form className="mt-4" onSubmit={handleSalonInvite}>
                  <div className="flex flex-col gap-2.5">
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
                      className="w-full bg-[#0A090B] border border-[#C5A059]/35 rounded-full px-3.5 py-2 text-xs text-white placeholder:text-[#8A8477] focus:outline-none focus:border-[#DFB76C]"
                      placeholder="patron@domain.com"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 text-[11px] uppercase tracking-[0.16em] font-bold text-[#141518] bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B28C44] hover:brightness-110 shadow-md rounded-full transition-all"
                    >
                      {invited ? 'Invitation Logged ✓' : 'Request Invitation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Heritage Colophon */}
        <div className="mt-14 border-t border-[#C5A059]/25 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#B5AD9E] font-serif">
            &copy; {new Date().getFullYear()} Needle Fashion Atelier. Handcrafted exclusively for men.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#B5AD9E]">
            <Link href="/privacy" className="text-[#D8D2C4] hover:text-[#FCF6BA] transition-colors">
              Privacy Protocol
            </Link>
            <span className="text-[#C5A059]/50">❖</span>
            <Link href="/terms" className="text-[#D8D2C4] hover:text-[#FCF6BA] transition-colors">
              Terms of Commission
            </Link>
            <span className="text-[#C5A059]/50">❖</span>
            <span className="text-[#DFB76C] font-serif italic tracking-wide">
              Imperial Vintage Edition
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
