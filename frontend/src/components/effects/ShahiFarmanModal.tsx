'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ShahiFarmanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const fabricBodyRef = useRef<HTMLDivElement>(null);
  const topRodRef = useRef<HTMLDivElement>(null);
  const bottomRodRef = useRef<HTMLDivElement>(null);
  const bottomRodCylinderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    const handleOpen = () => {
      isClosingRef.current = false;
      setIsOpen(true);
    };

    window.addEventListener('openShahiFarman', handleOpen);
    (window as unknown as { openShahiFarman?: () => void }).openShahiFarman = handleOpen;

    return () => {
      window.removeEventListener('openShahiFarman', handleOpen);
      delete (window as unknown as { openShahiFarman?: () => void }).openShahiFarman;
    };
  }, []);

  // Realistic Horizontal Scroll Unrolling Animation
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const fabric = fabricBodyRef.current;
    const topRod = topRodRef.current;
    const bottomRod = bottomRodRef.current;
    const cylinder = bottomRodCylinderRef.current;
    const content = contentRef.current;
    if (!fabric || !topRod || !bottomRod || !content) return;

    timelineRef.current?.kill();

    // Measure natural scroll height cleanly before collapsing to 0
    gsap.set(fabric, { height: 'auto' });
    const naturalHeight = fabric.scrollHeight;

    gsap.set(fabric, { height: 0, opacity: 1 });
    gsap.set(topRod, { opacity: 0, y: -18, scaleX: 0.92 });
    gsap.set(bottomRod, { opacity: 0, y: -12, scaleX: 0.92 });
    gsap.set(content, { opacity: 0, y: -16 });

    const revealItems = content.querySelectorAll('[data-farman-reveal]');
    gsap.set(revealItems, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fabric, { clearProps: 'height' });
      },
    });
    timelineRef.current = tl;

    // 1. Both royal brass rods appear pressed together
    tl.to([topRod, bottomRod], {
      opacity: 1,
      y: 0,
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
      // 2. Scroll unfurls smoothly to exact natural height while bottom rod rolls horizontally (never 2D flipping)
      .to(
        fabric,
        {
          height: naturalHeight,
          duration: 1.25,
          ease: 'power3.inOut',
        },
        '+=0.05'
      )
      .to(
        cylinder,
        {
          backgroundPositionY: '120px',
          duration: 1.25,
          ease: 'power3.inOut',
        },
        '<'
      )
      // 3. Fade in inscribed calligraphy container and stagger Farman sections
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.75'
      )
      .to(
        revealItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Smooth Scroll Roll-Up Animation on close
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const fabric = fabricBodyRef.current;
    const topRod = topRodRef.current;
    const bottomRod = bottomRodRef.current;
    const cylinder = bottomRodCylinderRef.current;
    const content = contentRef.current;

    if (!fabric || !topRod || !bottomRod || !content) {
      setIsOpen(false);
      document.body.style.overflow = '';
      return;
    }

    timelineRef.current?.kill();

    const currentHeight = fabric.offsetHeight;
    gsap.set(fabric, { height: currentHeight });

    const tl = gsap.timeline({
      onComplete: () => {
        isClosingRef.current = false;
        setIsOpen(false);
        document.body.style.overflow = '';
      },
    });
    timelineRef.current = tl;

    tl.to(content, {
      opacity: 0,
      y: -12,
      duration: 0.28,
      ease: 'power2.in',
    })
      .to(
        fabric,
        {
          height: 0,
          duration: 0.85,
          ease: 'power3.inOut',
        },
        '-=0.1'
      )
      .to(
        cylinder,
        {
          backgroundPositionY: '0px',
          duration: 0.85,
          ease: 'power3.inOut',
        },
        '<'
      )
      .to(
        [topRod, bottomRod],
        {
          opacity: 0,
          y: -10,
          scaleX: 0.94,
          duration: 0.25,
          ease: 'power2.in',
        },
        '-=0.1'
      );
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Shahi Farman Royal Decree"
      className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-3 sm:p-6 pt-14 sm:pt-6 overflow-y-auto bg-black/85 backdrop-blur-md"
    >
      {/* Backdrop click to roll up */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Main Shahi Farman Scroll Assembly */}
      <div
        ref={scrollWrapperRef}
        className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center pointer-events-auto"
      >
        {/* Top Hanging Gold Silk Cord & Close Button */}
        <div className="w-full flex items-center justify-between px-2 mb-2">
          <span className="font-serif text-[10px] uppercase tracking-[0.26em] text-[#E6D5B8]/80">
            ✦ Imperial Scroll &bull; Needle Fashion
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="text-xs uppercase tracking-widest text-[#F5EDD6] hover:text-[#DFB76C] transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#C5A059]/50 bg-black/75 shadow-lg"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>लपेटें (Roll Up)</span>
          </button>
        </div>

        {/* =====================================================================
            1. TOP HORIZONTAL BRASS ROD WITH TURNED ACORN FINIALS
        ===================================================================== */}
        <div
          ref={topRodRef}
          className="w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]"
        >
          {/* Left Finial */}
          <div className="flex items-center -mr-1 z-30 flex-shrink-0">
            <div className="w-3.5 h-3 rounded-l-full bg-gradient-to-r from-[#4A2E07] to-[#B38728] border-y border-l border-[#F5EDD6]/60 shadow-md" />
            <div className="w-2 h-5 bg-gradient-to-b from-[#F5EDD6] via-[#C5A059] to-[#5E3E0E] border-y border-[#F5EDD6]/50" />
            <div
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-[#F5EDD6]/75 shadow-[0_4px_10px_rgba(0,0,0,0.75)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FFF6DC 0%, #DFB76C 35%, #8C6018 72%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#DFB76C]" />
            </div>
          </div>

          {/* Center Cylindrical Brass Rod Bar */}
          <div
            className="flex-1 h-5 sm:h-6 border-y border-[#F5EDD6]/75 shadow-2xl relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #4E3209 0%, #B38728 18%, #FFF2CC 44%, #C5A059 68%, #3D2606 100%)',
            }}
          >
            <div className="absolute inset-y-0 left-3 w-1 bg-[#4E3209]/60" />
            <div className="absolute inset-y-0 right-3 w-1 bg-[#4E3209]/60" />
          </div>

          {/* Right Finial */}
          <div className="flex items-center -ml-1 z-30 flex-shrink-0">
            <div
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-[#F5EDD6]/75 shadow-[0_4px_10px_rgba(0,0,0,0.75)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FFF6DC 0%, #DFB76C 35%, #8C6018 72%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#DFB76C]" />
            </div>
            <div className="w-2 h-5 bg-gradient-to-b from-[#F5EDD6] via-[#C5A059] to-[#5E3E0E] border-y border-[#F5EDD6]/50" />
            <div className="w-3.5 h-3 rounded-r-full bg-gradient-to-l from-[#4A2E07] to-[#B38728] border-y border-r border-[#F5EDD6]/60 shadow-md" />
          </div>
        </div>

        {/* =====================================================================
            2. UNROLLING ROYAL CRIMSON SILK FARMAN BODY
        ===================================================================== */}
        <div
          ref={fabricBodyRef}
          className="w-[88%] sm:w-[86%] z-20 overflow-hidden shadow-[0_28px_65px_rgba(0,0,0,0.95)] border-x-2 border-[#DFB76C]/45 relative -mt-1 -mb-1"
          style={{
            background:
              'linear-gradient(180deg, #6E0A1B 0%, #98122A 16%, #8C0E24 52%, #9A122B 85%, #650817 100%)',
          }}
        >
          {/* Top & Bottom Rolled Shadow Depth */}
          <div className="absolute top-0 inset-x-0 h-5 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

          {/* Left & Right Gold Bel-Boota Vine Borders */}
          <div className="absolute top-0 bottom-0 left-1.5 sm:left-2.5 w-6 sm:w-7 border-r border-[#F5EDD6]/35 flex flex-col items-center justify-around py-4 opacity-85 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <span key={`vine-l-${i}`} className="text-[#F5EDD6] text-[10px] sm:text-xs font-serif select-none">
                ❦
              </span>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 right-1.5 sm:right-2.5 w-6 sm:w-7 border-l border-[#F5EDD6]/35 flex flex-col items-center justify-around py-4 opacity-85 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <span key={`vine-r-${i}`} className="text-[#F5EDD6] text-[10px] sm:text-xs font-serif select-none">
                ❦
              </span>
            ))}
          </div>

          {/* Faint Watermark Rosette */}
          <div className="absolute bottom-4 right-8 pointer-events-none opacity-20 text-5xl sm:text-6xl font-serif text-[#F5EDD6] select-none leading-none">
            𑁍
          </div>

          {/* Scroll Text Content */}
          <div
            ref={contentRef}
            className="px-9 sm:px-14 py-8 sm:py-10 relative z-10 text-center flex flex-col items-center"
          >
            {/* Bismillah Header */}
            <p
              data-farman-reveal
              className="font-serif text-lg sm:text-xl text-[#FFF3D6] tracking-widest drop-shadow-[0_2px_8px_rgba(245,237,214,0.5)] mb-1.5 select-none"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Sub-Invocation */}
            <p
              data-farman-reveal
              className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.22em] text-[#E6D5B8]"
            >
              ✦ बा-अदब &bull; बा-मुलाहिज़ा &bull; Needle Fashion Atelier ✦
            </p>

            {/* Main Shahi Farman Title */}
            <h2
              data-farman-reveal
              className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5EDD6] via-[#FFEBB0] to-[#E6D5B8] mt-3"
            >
              शाही फ़रमान &bull; Royal Decree
            </h2>
            <div
              data-farman-reveal
              className="w-40 sm:w-56 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5EDD6] to-transparent my-3 opacity-80"
            />

            {/* Classical Couplet Plaque */}
            <div
              data-farman-reveal
              className="bg-black/30 border-y border-[#F5EDD6]/40 py-2.5 px-4 my-1.5 max-w-md w-full"
            >
              <p className="font-serif text-sm sm:text-base text-[#FFF3D6] tracking-wider leading-relaxed">
                &ldquo;ہنر کی بات ہے ورنہ لباس سب پہنتے ہیں&rdquo;
              </p>
              <p className="text-[10.5px] sm:text-[11px] text-[#E6D5B8] font-medium mt-1 tracking-wide">
                हुनर की बात है वरना लिबास सब पहनते हैं &mdash; Needle Fashion
              </p>
            </div>

            {/* Clean Decree Clauses */}
            <div className="mt-4 space-y-3 text-xs sm:text-[13px] leading-relaxed text-[#F5EDD6]/95 max-w-md font-light">
              <p data-farman-reveal>
                <strong className="font-serif font-bold text-[#FFEBB0] block mb-0.5">
                  I. दास्तान-ए-कारीगरी (Ancestral Karigar Lineage)
                </strong>
                Four centuries of Agra, Lucknow, and Varanasi royal craft — every sherwani, bandhgala, and kurta is handwoven on Banaras pit looms with genuine 24K gold &amp; sterling silver zari.
              </p>

              <p data-farman-reveal>
                <strong className="font-serif font-bold text-[#FFEBB0] block mb-0.5">
                  II. 48-नुकाती नफ़ासत (48-Point Bespoke Fit)
                </strong>
                Rejecting off-the-rack sizing, each gentleman&apos;s silhouette is sculpted on an individual master paper pattern for effortless royal carriage.
              </p>

              <div
                data-farman-reveal
                className="p-3 bg-black/35 border border-[#F5EDD6]/35 text-[#F5EDD6] text-xs mt-2"
              >
                <span className="block font-serif font-bold uppercase tracking-widest text-[#FFEBB0] text-[10px] mb-1">
                  ✦ शाही इनायत &bull; Imperial Salon Privilege ✦
                </span>
                Private master cutter consultations, archival handloom swatches, and insured white-glove muslin trunk dispatch.
              </div>
            </div>

            {/* Accept Button */}
            <button
              data-farman-reveal
              type="button"
              onClick={handleClose}
              className="mt-6 px-8 py-2.5 rounded-full text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#5C0A18] shadow-2xl hover:scale-105 active:scale-95 transition-all border border-[#F5EDD6]"
              style={{
                background: 'linear-gradient(to right, #F5EDD6, #FFF3D6, #E6D5B8, #F5EDD6)',
              }}
            >
              फ़रमान स्वीकारें (Accept &amp; Enter)
            </button>
          </div>
        </div>

        {/* =====================================================================
            3. BOTTOM HORIZONTAL BRASS ROLLER ROD (Rolls smoothly without flipping!)
        ===================================================================== */}
        <div
          ref={bottomRodRef}
          className="w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_14px_26px_rgba(0,0,0,0.95)]"
        >
          {/* Left Finial */}
          <div className="flex items-center -mr-1 z-30 flex-shrink-0">
            <div className="w-3.5 h-3 rounded-l-full bg-gradient-to-r from-[#4A2E07] to-[#B38728] border-y border-l border-[#F5EDD6]/60 shadow-md" />
            <div className="w-2 h-5 bg-gradient-to-b from-[#F5EDD6] via-[#C5A059] to-[#5E3E0E] border-y border-[#F5EDD6]/50" />
            <div
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-[#F5EDD6]/75 shadow-[0_4px_10px_rgba(0,0,0,0.75)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FFF6DC 0%, #DFB76C 35%, #8C6018 72%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#DFB76C]" />
            </div>
          </div>

          {/* Center Rolling Brass Cylinder */}
          <div
            ref={bottomRodCylinderRef}
            className="flex-1 h-5 sm:h-6 border-y border-[#F5EDD6]/75 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, #4E3209 0px, #B38728 6px, #FFF2CC 12px, #C5A059 18px, #3D2606 24px)',
              backgroundSize: '100% 48px',
              backgroundPositionY: '0px',
            }}
          >
            <div className="absolute inset-y-0 left-3 w-1 bg-[#4E3209]/60" />
            <div className="absolute inset-y-0 right-3 w-1 bg-[#4E3209]/60" />
          </div>

          {/* Right Finial */}
          <div className="flex items-center -ml-1 z-30 flex-shrink-0">
            <div
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-[#F5EDD6]/75 shadow-[0_4px_10px_rgba(0,0,0,0.75)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FFF6DC 0%, #DFB76C 35%, #8C6018 72%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#DFB76C]" />
            </div>
            <div className="w-2 h-5 bg-gradient-to-b from-[#F5EDD6] via-[#C5A059] to-[#5E3E0E] border-y border-[#F5EDD6]/50" />
            <div className="w-3.5 h-3 rounded-r-full bg-gradient-to-l from-[#4A2E07] to-[#B38728] border-y border-r border-[#F5EDD6]/60 shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
