'use client';

import Link from 'next/link';
import RoyalFiberCanvas from '@/components/3d/RoyalFiberCanvas';

const navigation = {
  categories: [
    {
      id: 'menswear',
      name: 'Haute Menswear',
      items: [
        { name: 'Imperial Sherwanis', href: '/category/sherwani' },
        { name: 'Jodhpur Bandhgalas', href: '/category/bandhgala' },
        { name: 'Heritage Silk Kurtas', href: '/category/kurta' },
        { name: 'Indo-Western Tuxedos', href: '/category/indo-western' },
        { name: 'Royal Regalia & Safas', href: '/category/regalia' },
        { name: 'Runway New Arrivals', href: '/new-arrivals' },
      ],
    },
    {
      id: 'concierge',
      name: 'Atelier Concierge',
      items: [
        { name: 'Book Master Fitting', href: '/contact' },
        { name: '48-Point Bespoke Guide', href: '/about' },
        { name: 'White-Glove Shipping & Returns', href: '/returns' },
        { name: 'Private Salon Inquiries', href: '/contact' },
        { name: 'Authenticity Guarantee', href: '/about' },
      ],
    },
    {
      id: 'maison',
      name: 'The Maison',
      items: [
        { name: 'The Needle Karigar Lineage', href: '/about' },
        { name: 'Handloom Heritage', href: '/about' },
        { name: 'Terms of Commission', href: '/terms' },
        { name: 'Privacy Protocol', href: '/privacy' },
      ],
    },
  ],
  social: [
    {
      name: 'Instagram',
      href: '#',
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
      href: '#',
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

export default function Footer() {
  return (
    <footer className="bg-[#0B0C0E] text-[#FAF8F5] relative overflow-hidden border-t border-[#BF953F]/30" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Minimalist Champagne Hairline spanning Edge-to-Edge */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-75 z-20"
        style={{ background: 'linear-gradient(to right, transparent, rgba(197, 160, 89, 0.3) 20%, rgba(197, 160, 89, 0.3) 80%, transparent)' }}
      />

      {/* 3D Flowing Silk Zari Threads Animation (Relocated from Main Page to Footer!) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-45 overflow-hidden">
        <RoyalFiberCanvas showRing={false} showBackgroundRibbon={true} className="w-full h-full" />
      </div>

      {/* Luxury Heritage Guarantee Bar with Obsidian & Dual-Metal Cards */}
      <div className="border-b border-[#252833]/80 bg-[#08090B]/75 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#12141A] p-5 rounded-2xl flex items-center gap-4 border border-[#C5A059]/25 shadow-lg hover:border-[#C5A059]/50 transition-all">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 flex-shrink-0 shadow-sm"
              >
                ✦
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">48-Point Bespoke</h4>
                <p className="text-xs text-[#D8D2C4] mt-0.5 font-light">Custom master paper pattern drafting</p>
              </div>
            </div>

            <div className="bg-[#12141A] p-5 rounded-2xl flex items-center gap-4 border border-[#BBC2CC]/30 shadow-lg hover:border-[#EAECEC]/60 transition-all">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-[#BBC2CC] bg-white/5 border border-[#BBC2CC]/30 flex-shrink-0 shadow-sm"
              >
                ❖
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">Pure Indian Silks</h4>
                <p className="text-xs text-[#D8D2C4] mt-0.5 font-light">Authentic Chanderi, Banarasi & Katan</p>
              </div>
            </div>

            <div className="bg-[#12141A] p-5 rounded-2xl flex items-center gap-4 border border-[#C5A059]/25 shadow-lg hover:border-[#C5A059]/50 transition-all">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 flex-shrink-0 shadow-sm"
              >
                ⚜
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">24K Gold & Silver Zari</h4>
                <p className="text-xs text-[#D8D2C4] mt-0.5 font-light">Hand-embroidered resham & pure silver tilla</p>
              </div>
            </div>

            <div className="bg-[#12141A] p-5 rounded-2xl flex items-center gap-4 border border-[#BBC2CC]/30 shadow-lg hover:border-[#EAECEC]/60 transition-all">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-[#BBC2CC] bg-white/5 border border-[#BBC2CC]/30 flex-shrink-0 shadow-sm"
              >
                ✈
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white tracking-wide">White-Glove Dispatch</h4>
                <p className="text-xs text-[#D8D2C4] mt-0.5 font-light">Insured global wooden valet cases</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:pt-20 lg:px-8 relative z-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-2xl p-[1px] bg-[#C5A059]/40 flex-shrink-0 shadow-sm"
              >
                <div className="w-full h-full rounded-[14px] bg-[#141518] flex items-center justify-center">
                  <span 
                    className="font-serif text-xl font-black text-[#C5A059]"
                  >
                    N
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                  <span
                    className="inline-block text-white font-black tracking-wider select-none"
                  >
                    NEEDLE
                  </span>{' '}
                  <span 
                    className="text-[#C5A059] font-black tracking-wider"
                  >
                    FASHION
                  </span>
                </span>
                <span className="text-[9px] tracking-[0.32em] uppercase text-[#C5A059]/80 font-bold mt-1">
                  EXCLUSIVELY MENS HAUTE COUTURE • 24K GOLD & STERLING SILVER
                </span>
              </div>
            </div>
            <p className="text-xs leading-6 text-[#D6D0C4] max-w-md">
              Elevating Indian imperial menswear beyond the legendary courts of royal Rajasthan and Varanasi. Handwoven pure silks, genuine 24K gold & sterling silver zari threadwork, and 48-point bespoke tailoring.
            </p>
            <div className="flex space-x-3">
              {navigation.social.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="w-10 h-10 rounded-full bg-[#181B22] border border-[#BF953F]/40 flex items-center justify-center text-[#D6D0C4] hover:text-[#FCF6BA] hover:border-[#BF953F] transition-all shadow-sm"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 
                  className="text-xs uppercase tracking-widest font-bold text-[#C5A059]"
                >
                  {navigation.categories[0].name}
                </h3>
                <ul role="list" className="mt-6 space-y-3.5">
                  {navigation.categories[0].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs text-[#D8D2C4] hover:text-white hover:translate-x-1 transition-all inline-block">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 
                  className="text-xs uppercase tracking-widest font-bold text-[#C5A059]"
                >
                  {navigation.categories[1].name}
                </h3>
                <ul role="list" className="mt-6 space-y-3.5">
                  {navigation.categories[1].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs text-[#D8D2C4] hover:text-white hover:translate-x-1 transition-all inline-block">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 
                  className="text-xs uppercase tracking-widest font-bold text-[#C5A059]"
                >
                  {navigation.categories[2].name}
                </h3>
                <ul role="list" className="mt-6 space-y-3.5">
                  {navigation.categories[2].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs text-[#D8D2C4] hover:text-white hover:translate-x-1 transition-all inline-block">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <div className="bg-[#13151C] p-6 rounded-3xl border border-[#C5A059]/25 shadow-xl">
                  <h3 
                    className="text-xs uppercase tracking-widest font-bold text-[#C5A059]"
                  >
                    Private Salon Circle
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#D8D2C4]">
                    Private invites to groom runway previews and new karigar collections.
                  </p>
                  <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-2.5">
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full bg-[#090A0D] border border-[#C5A059]/30 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-[#8A8477] focus:outline-none focus:border-[#C5A059] shadow-inner"
                        placeholder="gentleman@domain.com"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-[#141518] bg-[#C5A059] hover:bg-[#B8924A] shadow-md rounded-full transition-all"
                      >
                        Request Invitation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#252833] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A8A295]">&copy; {new Date().getFullYear()} Needle Fashion Atelier. Handcrafted exclusively for men.</p>
          <div className="flex items-center gap-6 text-xs text-[#A8A295]">
            <Link href="/privacy" className="text-[#D8D2C4] hover:text-white transition-colors">Privacy Protocol</Link>
            <span>•</span>
            <Link href="/terms" className="text-[#D8D2C4] hover:text-white transition-colors">Terms of Commission</Link>
            <span>•</span>
            <span 
              className="text-[#C5A059]/80 font-medium tracking-wide"
            >
              Imperial Edition
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}