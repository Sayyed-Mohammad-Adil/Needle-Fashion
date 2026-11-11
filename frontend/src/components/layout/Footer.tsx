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
      urdu: 'शाही पोशाक',
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
      urdu: 'ख़ास ख़िदमत',
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
      urdu: 'शाही विरासत',
      name: 'The Mughal Maison',
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
    urdu: '४८-नुकाती नाप',
    title: '48-Point Bespoke',
    subtitle: 'Hand-drafted royal paper patterns',
  },
  {
    numeral: 'II',
    urdu: 'ख़ालिस रेशम',
    title: 'Pure Banarasi Silks',
    subtitle: 'Varanasi Katan, Chanderi & Tussar',
  },
  {
    numeral: 'III',
    urdu: 'ज़रदोज़ी व ज़री',
    title: '24K Gold & Silver Zari',
    subtitle: 'Hand-coiled dabka, marodi & tilla',
  },
  {
    numeral: 'IV',
    urdu: 'शाही संदूक़',
    title: 'Muslin Trunk Transit',
    subtitle: 'Insured global white-glove dispatch',
  },
];

const mughalCalligraphyText =
  '✦ दस्तकारी • دستکاری ✦ शाही रिवायत • شاہی روایات ✦ ज़री का नूर • نورِ زردوزی ✦ नफ़ासत • نفاست ✦ ख़ानदानी हुनर • خاندانی ہنر ✦ शाही पोशाक • شاہی ملبوسات ✦ कारीगर विरासत • وراثتِ کاریگر';

/** Scalloped Mughal Cusped Mehrab Arch SVG Border */
function MughalMehrabCrown() {
  return (
    <svg
      viewBox="0 0 1200 44"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="w-full h-7 sm:h-9 text-primary/70 block"
    >
      <defs>
        <pattern id="mughal-arch-tile" width="120" height="44" patternUnits="userSpaceOnUse">
          {/* Cusped multi-foil Mughal arch */}
          <path
            d="M0 42 C10 42, 16 34, 20 26 C26 28, 32 20, 38 14 C44 18, 52 10, 60 4 C68 10, 76 18, 82 14 C88 20, 94 28, 100 26 C104 34, 110 42, 120 42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M4 42 C14 42, 20 36, 24 29 C30 31, 36 24, 42 18 C48 21, 54 14, 60 9 C66 14, 72 21, 78 18 C84 24, 90 31, 96 29 C100 36, 106 42, 116 42"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeOpacity="0.55"
          />
          {/* Kalash finial dot at apex */}
          <circle cx="60" cy="3" r="2" fill="currentColor" />
          <circle cx="0" cy="40" r="1.5" fill="currentColor" />
          <circle cx="120" cy="40" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="1200" height="44" fill="url(#mughal-arch-tile)" />
    </svg>
  );
}

function MughalCornerPaisley({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`w-9 h-9 text-primary/75 pointer-events-none ${className}`}
    >
      <path d="M3 45V13C3 7.48 7.48 3 13 3H45" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 40V15C8 11.13 11.13 8 15 8H40"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      {/* Mughal lotus petal / floral corner motif */}
      <path
        d="M12 12 C16 10, 20 12, 18 16 C14 18, 12 15, 12 12 Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <circle cx="9.5" cy="9.5" r="1.8" fill="currentColor" />
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
    toast.success(`Shahi Dawat-Nama logged for ${trimmed}`);
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden bg-background text-foreground border-t-2 border-primary/50 transition-colors"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Mughal Palace & Jaali Filigree Backdrop (Theme-Aware) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <Image
          src="/images/vintage-palace-night.webp"
          alt="Royal Mughal Palace Archway Backdrop"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25 dark:opacity-30 sepia-[0.28] contrast-[1.08]"
        />
        <div
          className="absolute inset-0 opacity-[0.09] dark:opacity-[0.07]"
          style={{
            backgroundImage: "url('/images/vintage-jaali-motif.webp')",
            backgroundSize: '260px 260px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/78 to-secondary/95" />
      </div>

      {/* Subtle 3D Flowing Gold Zari Threads */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-25 dark:opacity-35 overflow-hidden">
        <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} className="w-full h-full" />
      </div>

      {/* 1. Mughal Bilingual Calligraphy Marquee Strip */}
      <div className="relative z-10 overflow-hidden border-b border-primary/35 bg-secondary/85 backdrop-blur-sm py-2">
        <div className="flex w-max animate-mughal-marquee whitespace-nowrap">
          <span className="font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-primary font-semibold px-4">
            {mughalCalligraphyText}
          </span>
          <span className="font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-primary font-semibold px-4">
            {mughalCalligraphyText}
          </span>
        </div>
      </div>

      {/* 2. Sculpted Mughal Cusped Mehrab Arch Frieze */}
      <div className="relative z-10 bg-secondary/40 border-b border-primary/25 pt-1">
        <MughalMehrabCrown />
      </div>

      {/* 3. Main Mughal Darbar Courtyard Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative glass-panel border-2 border-primary/45 p-5 sm:p-10 shadow-2xl">
          {/* Inner hairline border */}
          <div className="absolute inset-2 border border-primary/25 pointer-events-none" />

          {/* Four Mughal Lotus Corner Flourishes */}
          <MughalCornerPaisley className="absolute top-2.5 left-2.5" />
          <MughalCornerPaisley className="absolute top-2.5 right-2.5 rotate-90" />
          <MughalCornerPaisley className="absolute bottom-2.5 left-2.5 -rotate-90" />
          <MughalCornerPaisley className="absolute bottom-2.5 right-2.5 rotate-180" />

          {/* Centered Mughal Darbar Invocation */}
          <div className="relative z-10 text-center pb-8 mb-8 border-b border-primary/30">
            <p className="font-serif text-sm sm:text-base text-primary tracking-[0.18em]">
              بِسْمِ الفنّ والنّفاسة &bull; शाही दरबार-ए-कारीगरी
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-primary/70" />
              <span className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.3em] text-muted-foreground">
                Agra &bull; Delhi &bull; Lucknow &bull; Varanasi &bull; Jaipur
              </span>
              <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-primary/70" />
            </div>
          </div>

          {/* Four Mughal Jharokha / Mehrab Arch Plaques */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-10 border-b-2 border-double border-primary/35">
            {heritagePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative flex flex-col items-center text-center pt-5 pb-4 px-4 rounded-t-[44px] rounded-b-lg border border-primary/45 bg-card/85 backdrop-blur-md shadow-sm hover:border-primary transition-all"
              >
                {/* Kalash Finial on Top of Jharokha Arch */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="w-2 h-2 rotate-45 bg-primary border border-background" />
                </div>
                <div className="absolute inset-1.5 rounded-t-[38px] rounded-b border border-primary/20 pointer-events-none" />

                <span className="font-serif text-[10px] tracking-[0.18em] text-primary font-semibold">
                  {pillar.numeral} &bull; {pillar.urdu}
                </span>
                <h3 className="font-serif text-sm font-bold text-foreground tracking-wide mt-1">
                  {pillar.title}
                </h3>
                <p className="font-serif italic text-[11.5px] text-muted-foreground mt-0.5">
                  {pillar.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Center Darbar Grid */}
          <div className="relative z-10 pt-10 xl:grid xl:grid-cols-12 xl:gap-10">
            {/* Left: Mughal Shahi Seal & Royal Tughra */}
            <div className="xl:col-span-4 space-y-5">
              <div className="flex items-center gap-4">
                {/* Mughal Arch-Crowned Crimson & Gold Royal Seal */}
                <div className="relative flex flex-col items-center flex-shrink-0">
                  <span className="text-[9px] text-primary leading-none mb-0.5">⚜</span>
                  <div
                    className="w-14 h-14 rounded-full border-2 border-primary shadow-lg flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, #A91B34 0%, #7A0E22 62%, #4A0713 100%)',
                    }}
                  >
                    <div className="w-11 h-11 rounded-full border border-dashed border-[#F5EDD6]/70 flex items-center justify-center">
                      <span className="font-serif text-2xl font-black text-[#F5EDD6]">N</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-serif text-2xl font-black tracking-[0.08em] text-foreground block leading-none">
                    NEEDLE <span className="text-primary">FASHION</span>
                  </span>
                  <span className="font-serif text-[10px] tracking-[0.24em] uppercase text-primary font-bold mt-1.5 block">
                    शाही मर्दानी लिबास • Mughal Atelier
                  </span>
                </div>
              </div>

              <div className="border-y border-primary/30 py-3 bg-secondary/40 px-3.5">
                <p className="font-serif text-sm text-foreground tracking-wide">
                  &ldquo;ہنر کی بات ہے ورنہ لباس سب پہنتے ہیں&rdquo;
                </p>
                <p className="font-serif italic text-xs text-primary mt-1">
                  हुनर की बात है वरना लिबास सब पहनते हैं &mdash; Woven for Royalty
                </p>
              </div>

              <p className="font-serif text-xs leading-6 text-muted-foreground">
                Four centuries of Mughal court patronage reborn exclusively for gentlemen — Banarasi pit-loom silks, 24K gold &amp; silver zardozi, and 48-point bespoke tailoring.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Needle Fashion on ${item.name}`}
                    className="w-9 h-9 border border-primary/45 bg-card/85 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
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
                  className="px-4 py-2 border border-primary/60 bg-[#7A0E22] text-[#F5EDD6] font-serif text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#5E0A19] transition-colors shadow-sm"
                >
                  📜 शाही फ़रमान (Unroll Scroll)
                </button>
              </div>
            </div>

            {/* Right: 3 Mughal Ledger Columns + Arched Royal Farman Dispatch */}
            <div className="mt-12 xl:mt-0 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {navigation.categories.map((group) => (
                <div key={group.id}>
                  <span className="text-[10px] font-serif text-primary/80 block mb-0.5">
                    {group.urdu}
                  </span>
                  <h3 className="font-serif text-xs uppercase tracking-[0.18em] font-bold text-primary pb-2 border-b border-primary/35 flex items-center gap-1.5">
                    <span>{group.roman}</span>
                    <span>{group.name}</span>
                  </h3>
                  <ul role="list" className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="font-serif text-xs text-foreground/85 hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                        >
                          <span className="text-primary text-[10px]" aria-hidden="true">
                            ❦
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Arched Mughal Dawat-Nama (Invitation) Card */}
              <div className="relative rounded-t-[36px] rounded-b-lg border-2 border-primary/45 bg-card/90 p-5 pt-7 shadow-md">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-primary text-xs">
                  ⚜
                </div>
                <div className="absolute inset-1.5 rounded-t-[30px] rounded-b border border-primary/20 pointer-events-none" />

                <div className="relative z-10 text-center">
                  <span className="font-serif text-[10px] text-primary font-bold block">
                    शाही दावत-नामा
                  </span>
                  <h3 className="font-serif text-base font-bold text-foreground mt-0.5">
                    Private Salon Circle
                  </h3>
                  <p className="mt-1.5 font-serif italic text-[11px] leading-relaxed text-muted-foreground">
                    Receive royal invites to groom darbars &amp; karigar archive releases.
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
                      className="w-full bg-transparent border-0 border-b-2 border-primary/50 px-1 py-1.5 font-serif text-xs text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      placeholder="patron@domain.com"
                    />
                    <button
                      type="submit"
                      className="btn-glass-gold w-full py-2.5 font-serif text-[10.5px] uppercase tracking-[0.2em] font-bold"
                    >
                      {invited ? 'Dawat Recorded ✓' : 'Seal Invitation'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Mughal Colophon */}
          <div className="relative z-10 mt-12 pt-6 border-t-2 border-double border-primary/35 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Needle Fashion &mdash; शाही मर्दानी कारीगरी (Exclusively for Men).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 font-serif text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Protocol
              </Link>
              <span className="text-primary/70">𑁍</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Commission
              </Link>
              <span className="text-primary/70">𑁍</span>
              <span className="italic font-semibold text-primary">
                Mughal Darbar Edition
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
