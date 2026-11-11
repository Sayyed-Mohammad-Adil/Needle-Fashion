import Link from 'next/link';

const tickerItems = [
  { label: 'SIX MOODS ARCHIVE', href: '#needle-archive' },
  { label: 'TRY THE LOOK', href: '#try-the-look' },
  { label: 'PICK A WEAVE', href: '#pick-a-weave' },
  { label: 'THE ATELIER RACK', href: '#atelier-rack' },
  { label: 'GROOM CORONATION', href: '#groom-coronation' },
  { label: 'CRAFT IN MOTION', href: '#craft-in-motion' },
  { label: '48-POINT BESPOKE FIT', href: '/contact' },
];

export default function GoldAtelierTicker() {
  const repeated = [...tickerItems, ...tickerItems];

  return (
    <div
      aria-label="Atelier Showcase Navigation Ticker"
      className="relative w-full overflow-hidden bg-[#18191D] dark:bg-[#0E1015] border-y border-[#C5A059]/35 py-3 select-none z-20"
    >
      <div className="flex w-max animate-mughal-marquee hover:[animation-play-state:paused]">
        {repeated.map((item, index) => (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            className="inline-flex items-center gap-4 px-5 text-[11px] font-bold uppercase tracking-[0.26em] text-[#E8D7B5] hover:text-[#FCF6BA] transition-colors whitespace-nowrap"
          >
            <span>{item.label}</span>
            <span className="text-[#C5A059] text-xs" aria-hidden="true">
              ✦
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

