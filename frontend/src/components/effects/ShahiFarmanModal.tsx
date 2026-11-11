'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ShahiFarmanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const fabricBodyRef = useRef<HTMLDivElement>(null);
  const sheenSweepRef = useRef<HTMLDivElement>(null);
  const topRodRef = useRef<HTMLDivElement>(null);
  const bottomRodRef = useRef<HTMLDivElement>(null);
  const bottomRodCylinderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const breezeTweenRef = useRef<gsap.core.Tween | null>(null);
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

  // Realistic Silk Cloth Unrolling Animation
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const fabric = fabricBodyRef.current;
    const sheen = sheenSweepRef.current;
    const topRod = topRodRef.current;
    const bottomRod = bottomRodRef.current;
    const cylinder = bottomRodCylinderRef.current;
    const content = contentRef.current;
    if (!fabric || !topRod || !bottomRod || !content) return;

    timelineRef.current?.kill();
    breezeTweenRef.current?.kill();

    gsap.set(fabric, { height: 'auto' });
    const naturalHeight = fabric.scrollHeight;

    gsap.set(fabric, { height: 0, opacity: 1 });
    gsap.set(topRod, { opacity: 0, y: -18, scaleX: 0.92 });
    gsap.set(bottomRod, { opacity: 0, y: -12, scaleX: 0.92 });
    gsap.set(content, { opacity: 0, y: -14 });

    const revealItems = content.querySelectorAll('[data-farman-reveal]');
    gsap.set(revealItems, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fabric, { clearProps: 'height' });
        if (sheen) {
          breezeTweenRef.current = gsap.to(sheen, {
            yPercent: 18,
            opacity: 0.42,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      },
    });
    timelineRef.current = tl;

    tl.to([topRod, bottomRod], {
      opacity: 1,
      y: 0,
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
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
      breezeTweenRef.current?.kill();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Smooth Cloth Roll-Up Animation on close
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
    breezeTweenRef.current?.kill();

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
        {/* Top Hanging Header & Roll-Up Button */}
        <div className="w-full flex items-center justify-between px-2 mb-2">
          <span className="font-serif text-[10px] uppercase tracking-[0.26em] text-[#E6D5B8]/85">
            ✦ Woven Crimson Silk Scroll &bull; Needle Fashion
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
            1. TOP HORIZONTAL BRASS ROD WITH WRAPPED SILK SLEEVES
        ===================================================================== */}
        <div
          ref={topRodRef}
          className="relative w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]"
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

          {/* Center Cylindrical Brass Rod + Cloth Sleeve Wraps */}
          <div
            className="flex-1 h-5 sm:h-6 border-y border-[#F5EDD6]/75 shadow-2xl relative overflow-visible"
            style={{
              background:
                'linear-gradient(180deg, #4E3209 0%, #B38728 18%, #FFF2CC 44%, #C5A059 68%, #3D2606 100%)',
            }}
          >
            {/* Crimson Silk Loops Wrapped Around Top Rod (kapda binding) */}
            <div
              className="absolute -inset-y-0.5 left-4 right-4 rounded-sm opacity-95 border-y border-[#DFB76C]/60"
              style={{
                background:
                  'linear-gradient(180deg, #4A0410 0%, #8E1128 32%, #AA1933 55%, #5C0615 100%)',
              }}
            />
            {/* Gold Zari Stitched Collar Rings on Cloth Sleeve */}
            <div className="absolute -inset-y-0.5 left-7 w-1.5 bg-gradient-to-b from-[#FFF3D6] via-[#C5A059] to-[#6B4A14] rounded-full shadow" />
            <div className="absolute -inset-y-0.5 right-7 w-1.5 bg-gradient-to-b from-[#FFF3D6] via-[#C5A059] to-[#6B4A14] rounded-full shadow" />
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
            2. UNROLLING WOVEN ROYAL SILK BROCADE CLOTH BODY
        ===================================================================== */}
        <div
          ref={fabricBodyRef}
          className="w-[88%] sm:w-[86%] z-20 overflow-hidden shadow-[0_28px_65px_rgba(0,0,0,0.95)] relative -mt-1 -mb-1"
          style={{
            backgroundColor: '#7D0B1F',
            backgroundImage: [
              // Soft silk drapery horizontal fold ripples
              'linear-gradient(180deg, rgba(25,2,6,0.55) 0%, rgba(165,24,48,0.22) 12%, rgba(75,5,17,0.35) 28%, rgba(175,30,54,0.2) 48%, rgba(70,4,15,0.3) 68%, rgba(165,24,48,0.22) 86%, rgba(25,2,6,0.6) 100%)',
              // Vertical edge tension folds (where cloth drapes inward between rods)
              'linear-gradient(90deg, rgba(18,2,5,0.68) 0%, rgba(255,220,180,0.06) 6%, rgba(0,0,0,0.18) 12%, transparent 25%, transparent 75%, rgba(0,0,0,0.18) 88%, rgba(255,220,180,0.06) 94%, rgba(18,2,5,0.68) 100%)',
              // Fine orthogonal silk warp & weft weave threads
              'repeating-linear-gradient(0deg, rgba(255,235,200,0.045) 0px, rgba(255,235,200,0.045) 1px, rgba(0,0,0,0.09) 1px, rgba(0,0,0,0.09) 3px)',
              'repeating-linear-gradient(90deg, rgba(255,235,200,0.04) 0px, rgba(255,235,200,0.04) 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 3px)',
            ].join(', '),
          }}
        >
          {/* Woven Jacquard Jaali Brocade Texture inside the Silk */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.16] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage: "url('/images/vintage-jaali-motif.webp')",
              backgroundSize: '210px 210px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Living Satin Sheen Sweep (simulates silk catching light in gentle breeze) */}
          <div
            ref={sheenSweepRef}
            aria-hidden="true"
            className="absolute -inset-x-10 -top-24 h-64 pointer-events-none opacity-25 mix-blend-screen"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,230,185,0.28) 0%, rgba(197,160,89,0.12) 40%, transparent 72%)',
            }}
          />

          {/* Woven Gota-Patti / Zari Kinari Left Selvedge Border + Stitched Thread Line */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 w-7 sm:w-9 pointer-events-none z-10 border-r border-dashed border-[#FFE4A8]/70 flex flex-col items-center justify-around py-4"
            style={{
              background:
                'linear-gradient(90deg, #5E4012 0%, #C5A059 25%, #8F641D 50%, rgba(125,11,31,0.25) 100%)',
            }}
          >
            {[...Array(14)].map((_, i) => (
              <span
                key={`zari-l-${i}`}
                className="text-[#FFF3D6] text-[10px] sm:text-xs font-serif select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                ❦
              </span>
            ))}
          </div>

          {/* Woven Gota-Patti / Zari Kinari Right Selvedge Border + Stitched Thread Line */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 right-0 w-7 sm:w-9 pointer-events-none z-10 border-l border-dashed border-[#FFE4A8]/70 flex flex-col items-center justify-around py-4"
            style={{
              background:
                'linear-gradient(270deg, #5E4012 0%, #C5A059 25%, #8F641D 50%, rgba(125,11,31,0.25) 100%)',
            }}
          >
            {[...Array(14)].map((_, i) => (
              <span
                key={`zari-r-${i}`}
                className="text-[#FFF3D6] text-[10px] sm:text-xs font-serif select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                ❦
              </span>
            ))}
          </div>

          {/* Embroidered Top & Bottom Gold Zari Piping */}
          <div className="absolute top-2.5 left-9 right-9 h-[2px] border-t border-dashed border-[#FFF3D6]/75 pointer-events-none z-10" />
          <div className="absolute bottom-2.5 left-9 right-9 h-[2px] border-b border-dashed border-[#FFF3D6]/75 pointer-events-none z-10" />

          {/* Faint Woven Zari Rosette Motif */}
          <div className="absolute bottom-5 right-10 pointer-events-none opacity-20 text-5xl sm:text-6xl font-serif text-[#FFEBB0] select-none leading-none">
            𑁍
          </div>

          {/* Scroll Embroidered Text Content */}
          <div
            ref={contentRef}
            className="px-10 sm:px-14 py-8 sm:py-10 relative z-10 text-center flex flex-col items-center"
          >
            {/* Bismillah Calligraphy */}
            <p
              data-farman-reveal
              className="font-serif text-lg sm:text-xl text-[#FFF3D6] tracking-widest drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] mb-1.5 select-none"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Sub-Invocation */}
            <p
              data-farman-reveal
              className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.22em] text-[#FFE8B8] drop-shadow-sm"
            >
              ✦ बा-अदब &bull; बा-मुलाहिज़ा &bull; Needle Fashion Atelier ✦
            </p>

            {/* Main Shahi Farman Title */}
            <h2
              data-farman-reveal
              className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D6] via-[#FFE29A] to-[#F5EDD6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] mt-3"
            >
              शाही फ़रमान &bull; Royal Decree
            </h2>
            <div
              data-farman-reveal
              className="w-40 sm:w-56 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFE8B8] to-transparent my-3 opacity-85"
            />

            {/* Stitched Velvet Couplet Patch */}
            <div
              data-farman-reveal
              className="bg-[#4B0511]/65 border border-dashed border-[#FFE4A8]/55 py-2.5 px-4 my-1.5 max-w-md w-full shadow-inner"
            >
              <p className="font-serif text-sm sm:text-base text-[#FFF3D6] tracking-wider leading-relaxed">
                &ldquo;ہنر کی بات ہے ورنہ لباس سب پہنتے ہیں&rdquo;
              </p>
              <p className="text-[10.5px] sm:text-[11px] text-[#FFE4A8] font-medium mt-1 tracking-wide">
                हुनर की बात है वरना लिबास सब पहनते हैं &mdash; Needle Fashion
              </p>
            </div>

            {/* Embroidered Decree Clauses */}
            <div className="mt-4 space-y-3 text-xs sm:text-[13px] leading-relaxed text-[#FFF3DE] max-w-md font-light">
              <p data-farman-reveal className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <strong className="font-serif font-bold text-[#FFE4A8] block mb-0.5">
                  I. दास्तान-ए-कारीगरी (Ancestral Karigar Lineage)
                </strong>
                Four centuries of Agra, Lucknow, and Varanasi royal craft — every sherwani, bandhgala, and kurta is handwoven on Banaras pit looms with genuine 24K gold &amp; sterling silver zari.
              </p>

              <p data-farman-reveal className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <strong className="font-serif font-bold text-[#FFE4A8] block mb-0.5">
                  II. 48-नुकाती नफ़ासत (48-Point Bespoke Fit)
                </strong>
                Rejecting off-the-rack sizing, each gentleman&apos;s silhouette is sculpted on an individual master paper pattern for effortless royal carriage.
              </p>

              <div
                data-farman-reveal
                className="p-3 bg-[#4B0511]/60 border border-dashed border-[#FFE4A8]/50 text-[#FFF3DE] text-xs mt-2 shadow-inner"
              >
                <span className="block font-serif font-bold uppercase tracking-widest text-[#FFE4A8] text-[10px] mb-1">
                  ✦ शाही इनायत &bull; Imperial Salon Privilege ✦
                </span>
                Private master cutter consultations, archival handloom swatches, and insured white-glove muslin trunk dispatch.
              </div>
            </div>

            {/* Stitched Zari Accept Button */}
            <button
              data-farman-reveal
              type="button"
              onClick={handleClose}
              className="mt-6 px-8 py-2.5 rounded-full text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#5C0A18] shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-[#FFF3D6]"
              style={{
                background: 'linear-gradient(to right, #F5EDD6, #FFF5DC, #E6D5B8, #F5EDD6)',
              }}
            >
              फ़रमान स्वीकारें (Accept &amp; Enter)
            </button>
          </div>
        </div>

        {/* =====================================================================
            3. BOTTOM HORIZONTAL BRASS ROLLER WITH ROLLED SILK CLOTH SLEEVE
        ===================================================================== */}
        <div
          ref={bottomRodRef}
          className="relative w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_14px_26px_rgba(0,0,0,0.95)]"
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

          {/* Center Rolling Cylinder with Wrapped Cloth Roll */}
          <div
            ref={bottomRodCylinderRef}
            className="flex-1 h-5 sm:h-6 border-y border-[#F5EDD6]/75 shadow-2xl relative overflow-visible"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, #4E3209 0px, #B38728 6px, #FFF2CC 12px, #C5A059 18px, #3D2606 24px)',
              backgroundSize: '100% 48px',
              backgroundPositionY: '0px',
            }}
          >
            {/* Rolled Silk Fabric Wrapped Around Bottom Rod */}
            <div
              className="absolute -inset-y-1 left-4 right-4 rounded-full opacity-95 border-y border-[#DFB76C]/65 shadow-[0_4px_12px_rgba(0,0,0,0.75)]"
              style={{
                background:
                  'linear-gradient(180deg, #4A0410 0%, #9E142E 35%, #750A1D 70%, #3A030C 100%)',
              }}
            />
            <div className="absolute -inset-y-1 left-7 w-1.5 bg-gradient-to-b from-[#FFF3D6] via-[#C5A059] to-[#6B4A14] rounded-full shadow" />
            <div className="absolute -inset-y-1 right-7 w-1.5 bg-gradient-to-b from-[#FFF3D6] via-[#C5A059] to-[#6B4A14] rounded-full shadow" />
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
