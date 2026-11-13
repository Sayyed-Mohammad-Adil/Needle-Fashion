import Image from 'next/image';
import Link from 'next/link';

interface ArchiveMood {
  id: string;
  moodTitle: string;
  garmentName: string;
  imageSrc: string;
  href: string;
}

const archiveMoods: ArchiveMood[] = [
  {
    id: 'mood-01',
    moodTitle: 'Coronation Edit',
    garmentName: 'Imperial Zardozi Sherwani',
    imageSrc: '/images/hero-ethnic.jpg',
    href: '/category/sherwani',
  },
  {
    id: 'mood-02',
    moodTitle: 'Jodhpur Icons',
    garmentName: 'Tailored Slate Bandhgala',
    imageSrc: '/images/category-kurta-jacket.jpg',
    href: '/category/kurta-jacket',
  },
  {
    id: 'mood-03',
    moodTitle: 'Banarasi Heirlooms',
    garmentName: 'Pit-Loom Chanderi Kurta',
    imageSrc: '/images/category-kurta.jpg',
    href: '/category/kurta',
  },
  {
    id: 'mood-04',
    moodTitle: 'Gala Couture',
    garmentName: 'Sculpted Brocade Tuxedo',
    imageSrc: '/images/menswear-indo-western.jpg',
    href: '/new-arrivals',
  },
  {
    id: 'mood-05',
    moodTitle: 'Kashmir Regalia',
    garmentName: 'Pure Pashmina Doshala',
    imageSrc: '/images/menswear-doshala.jpg',
    href: '/new-arrivals',
  },
  {
    id: 'mood-06',
    moodTitle: 'Royal Insignia',
    garmentName: 'Safa, Kalgi & Mojaris',
    imageSrc: '/images/menswear-accessories.jpg',
    href: '/contact',
  },
];

export default function NeedleArchiveMoods() {
  return (
    <section
      id="needle-archive"
      aria-labelledby="archive-moods-heading"
      className="py-20 sm:py-28 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
              The Archive
            </p>
            <h2
              id="archive-moods-heading"
              className="text-2xl sm:text-4xl font-light tracking-tight text-foreground"
            >
              Six Moods. Timeless Silhouettes.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Woven by hand, tailored for a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {archiveMoods.map((item) => (
            <Link key={item.id} href={item.href} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                <Image
                  src={item.imageSrc}
                  alt={item.garmentName}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="mt-3.5 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.moodTitle}
                </p>
                <p className="text-xs font-normal text-foreground line-clamp-1">
                  {item.garmentName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
