'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ShahiFarmanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [stageLabel, setStageLabel] = useState('शाही ग़िलाफ़ • Royal Farman Cover');
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const coverLidRef = useRef<HTMLDivElement>(null);
  const coverSealRef = useRef<HTMLDivElement>(null);
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
      setStageLabel('शाही ग़िलाफ़ • Royal Farman Cover');
      setIsOpen(true);
    };

    window.addEventListener('openShahiFarman', handleOpen);
    (window as unknown as { openShahiFarman?: () => void }).openShahiFarman = handleOpen;

    return () => {
      window.removeEventListener('openShahiFarman', handleOpen);
      delete (window as unknown as { openShahiFarman?: () => void }).openShahiFarman;
    };
  }, []);

  // 3-Act Choreography: 1) Show Velvet Cover & Wax Seal -> 2) Pull Scroll Out -> 3) Unroll Silk Cloth
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const cover = coverRef.current;
    const coverLid = coverLidRef.current;
    const coverSeal = coverSealRef.current;
    const fabric = fabricBodyRef.current;
    const sheen = sheenSweepRef.current;
    const topRod = topRodRef.current;
    const bottomRod = bottomRodRef.current;
    const cylinder = bottomRodCylinderRef.current;
    const content = contentRef.current;
    if (!cover || !coverLid || !coverSeal || !fabric || !topRod || !bottomRod || !content) {
      return;
    }

    timelineRef.current?.kill();
    breezeTweenRef.current?.kill();

    gsap.set(fabric, { height: 'auto' });
    const naturalHeight = fabric.scrollHeight;

    // Initial state: Only the sealed Royal Velvet Cover (Ghilaf) is visible; scroll is hidden inside
    gsap.set(cover, { opacity: 0, scale: 0.9, y: 12, display: 'flex' });
    gsap.set(coverLid, { x: 0, opacity: 1 });
    gsap.set(coverSeal, { scale: 1, rotation: 0, opacity: 1 });

    gsap.set(fabric, { height: 0, opacity: 0 });
    gsap.set(topRod, { opacity: 0, x: -45, y: 0, scaleX: 0.9 });
    gsap.set(bottomRod, { opacity: 0, x: -45, y: 0, scaleX: 0.9 });
    gsap.set(content, { opacity: 0, y: -14 });

    const revealItems = content.querySelectorAll('[data-farman-reveal]');
    gsap.set(revealItems, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fabric, { clearProps: 'height' });
        setStageLabel('शाही फ़रमान • Royal Decree');
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

    // ACT 1: Present the Royal Velvet Cover & Wax Seal (0.0s -> 1.05s)
    tl.to(cover, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      ease: 'power3.out',
    })
      .to(coverSeal, {
        scale: 1.12,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
      })
      // Break / untie the Royal Wax Seal & open the right brass cap of the cover
      .add(() => setStageLabel('मोहर खुल रही है • Unsealing Cover...'))
      .to(coverSeal, {
        scale: 0.7,
        rotation: -18,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      })
      .to(
        coverLid,
        {
          x: 42,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.15'
      )
      // ACT 2: Pull the rolled scroll horizontally out of the velvet cover sleeve
      .add(() => setStageLabel('फ़रमान बाहर निकाला जा रहा है • Drawing Scroll...'))
      .to(
        [topRod, bottomRod],
        {
          opacity: 1,
          x: 0,
          scaleX: 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        '-=0.1'
      )
      .to(
        cover,
        {
          x: -70,
          opacity: 0,
          scale: 0.92,
          duration: 0.55,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(cover, { display: 'none' });
          },
        },
        '-=0.35'
      )
      // ACT 3: Unroll the woven crimson silk cloth downward
      .add(() => setStageLabel('शाही रेशम खुल रहा है • Unrolling Farman...'))
      .set(fabric, { opacity: 1 })
      .to(fabric, {
        height: naturalHeight,
        duration: 1.15,
        ease: 'power3.inOut',
      })
      .to(
        cylinder,
        {
          backgroundPositionY: '120px',
          duration: 1.15,
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
        '-=0.7'
      )
      .to(
        revealItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.07,
          ease: 'power2.out',
        },
        '-=0.38'
      );

    return () => {
      tl.kill();
      breezeTweenRef.current?.kill();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Roll Up Cloth & Tuck Back Into Cover on Close
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const cover = coverRef.current;
    const coverLid = coverLidRef.current;
    const coverSeal = coverSealRef.current;
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
    setStageLabel('फ़रमान लपेटा जा रहा है • Rolling Scroll...');

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
      duration: 0.24,
      ease: 'power2.in',
    })
      .to(
        fabric,
        {
          height: 0,
          duration: 0.7,
          ease: 'power3.inOut',
        },
        '-=0.08'
      )
      .to(
        cylinder,
        {
          backgroundPositionY: '0px',
          duration: 0.7,
          ease: 'power3.inOut',
        },
        '<'
      );

    if (cover && coverLid && coverSeal) {
      tl.set(cover, { display: 'flex', x: -50, opacity: 0, scale: 0.94 })
        .set(coverLid, { x: 35, opacity: 0 })
        .set(coverSeal, { opacity: 0, scale: 0.8 })
        .to(cover, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        })
        .to(
          [topRod, bottomRod],
          {
            x: -36,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
          },
          '<'
        )
        .to(coverLid, {
          x: 0,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
        })
        .to(cover, {
          opacity: 0,
          scale: 0.92,
          duration: 0.25,
          ease: 'power2.in',
        });
    } else {
      tl.to([topRod, bottomRod], {
        opacity: 0,
        duration: 0.25,
      });
    }
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

      {/* Main Shahi Farman Assembly */}
      <div
        ref={scrollWrapperRef}
        className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center pointer-events-auto"
      >
        {/* Top Hanging Header & Roll-Up Button */}
        <div className="w-full flex items-center justify-between px-2 mb-3">
          <span className="font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#FFE8B8]">
            ✦ {stageLabel}
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
            ACT 1 & 2: ROYAL BROCADE SILK & BRASS CYLINDRICAL FARMAN COVER (GHILAF)
        ===================================================================== */}
        <div
          ref={coverRef}
          className="relative w-[92%] sm:w-[88%] flex items-center justify-center my-6 z-40 select-none drop-shadow-[0_24px_45px_rgba(0,0,0,0.95)]"
        >
          {/* Left Closed Brass End-Cap of the Farman Cover */}
          <div className="flex items-center -mr-1 z-30 flex-shrink-0">
            <div className="w-3 h-7 rounded-l-full bg-gradient-to-r from-[#3D2406] to-[#B38728] border border-[#F5EDD6]/65" />
            <div
              className="w-7 h-20 sm:h-24 rounded-l-xl border-2 border-[#F5EDD6]/70 shadow-xl flex flex-col items-center justify-around py-2"
              style={{
                background:
                  'linear-gradient(180deg, #4E3209 0%, #DFB76C 28%, #FFF2CC 50%, #A97B2C 74%, #352106 100%)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D2808]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D2808]" />
            </div>
          </div>

          {/* Center Cylindrical Velvet & Zari Brocade Sleeve Body */}
          <div
            className="relative flex-1 h-20 sm:h-24 border-y-2 border-[#DFB76C]/80 shadow-inner flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: '#5B0715',
              backgroundImage: [
                // Cylindrical highlight & bottom shadow for 3D round tube feel
                'linear-gradient(180deg, rgba(15,1,4,0.8) 0%, rgba(165,24,48,0.45) 26%, rgba(255,220,175,0.16) 45%, rgba(92,8,22,0.7) 74%, rgba(12,1,3,0.92) 100%)',
                // Fine woven cloth grain
                'repeating-linear-gradient(90deg, rgba(255,235,200,0.05) 0px, rgba(255,235,200,0.05) 1px, transparent 1px, transparent 3px)',
              ].join(', '),
            }}
          >
            {/* Jaali Brocade Texture on Cover Cloth */}
            <div
              className="absolute inset-0 opacity-35 mix-blend-soft-light pointer-events-none"
              style={{
                backgroundImage: "url('/images/vintage-jaali-motif.webp')",
                backgroundSize: '140px 140px',
              }}
            />

            {/* Two Gold Zari Kinari Straps Around Cover */}
            <div className="absolute inset-y-0 left-8 w-3 bg-gradient-to-b from-[#6B4A14] via-[#FFF2CC] to-[#4E3209] border-x border-[#F5EDD6]/60 opacity-90" />
            <div className="absolute inset-y-0 right-8 w-3 bg-gradient-to-b from-[#6B4A14] via-[#FFF2CC] to-[#4E3209] border-x border-[#F5EDD6]/60 opacity-90" />

            {/* Cover Title Inscribed in Gold */}
            <div className="relative z-10 text-center px-12">
              <span className="font-serif text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#FFF3D6] font-bold block drop-shadow">
                शाही ग़िलाफ़ &bull; Royal Sleeve
              </span>
              <span className="font-serif italic text-[10px] text-[#E6D5B8]/85 block mt-0.5">
                Needle Fashion Imperial Dispatch
              </span>
            </div>
          </div>

          {/* Center Tied Gold Dori & Crimson Shahi Wax Seal */}
          <div
            ref={coverSealRef}
            className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-40 flex flex-col items-center"
          >
            <div
              className="w-12 h-12 rounded-full border-2 border-[#DFB76C] shadow-[0_6px_18px_rgba(0,0,0,0.85)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #B81D38 0%, #7A0E22 62%, #420510 100%)',
              }}
            >
              <div className="w-9 h-9 rounded-full border border-dashed border-[#FFF3D6]/75 flex items-center justify-center">
                <span className="font-serif text-lg font-black text-[#FFF3D6]">N</span>
              </div>
            </div>
          </div>

          {/* Right Removable Brass End-Cap (Slides off when unsealing!) */}
          <div
            ref={coverLidRef}
            className="flex items-center -ml-1 z-30 flex-shrink-0"
          >
            <div
              className="w-7 h-20 sm:h-24 rounded-r-xl border-2 border-[#F5EDD6]/70 shadow-xl flex flex-col items-center justify-around py-2"
              style={{
                background:
                  'linear-gradient(180deg, #4E3209 0%, #DFB76C 28%, #FFF2CC 50%, #A97B2C 74%, #352106 100%)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D2808]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D2808]" />
            </div>
            <div className="w-3 h-7 rounded-r-full bg-gradient-to-l from-[#3D2406] to-[#B38728] border border-[#F5EDD6]/65" />
          </div>
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
            <div
              className="absolute -inset-y-0.5 left-4 right-4 rounded-sm opacity-95 border-y border-[#DFB76C]/60"
              style={{
                background:
                  'linear-gradient(180deg, #4A0410 0%, #8E1128 32%, #AA1933 55%, #5C0615 100%)',
              }}
            />
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
              'linear-gradient(180deg, rgba(25,2,6,0.55) 0%, rgba(165,24,48,0.22) 12%, rgba(75,5,17,0.35) 28%, rgba(175,30,54,0.2) 48%, rgba(70,4,15,0.3) 68%, rgba(165,24,48,0.22) 86%, rgba(25,2,6,0.6) 100%)',
              'linear-gradient(90deg, rgba(18,2,5,0.68) 0%, rgba(255,220,180,0.06) 6%, rgba(0,0,0,0.18) 12%, transparent 25%, transparent 75%, rgba(0,0,0,0.18) 88%, rgba(255,220,180,0.06) 94%, rgba(18,2,5,0.68) 100%)',
              'repeating-linear-gradient(0deg, rgba(255,235,200,0.045) 0px, rgba(255,235,200,0.045) 1px, rgba(0,0,0,0.09) 1px, rgba(0,0,0,0.09) 3px)',
              'repeating-linear-gradient(90deg, rgba(255,235,200,0.04) 0px, rgba(255,235,200,0.04) 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 3px)',
            ].join(', '),
          }}
        >
          {/* Woven Jacquard Jaali Brocade Texture inside the Silk */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.28] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage: "url('/images/vintage-jaali-motif.webp')",
              backgroundSize: '210px 210px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Living Satin Sheen Sweep */}
          <div
            ref={sheenSweepRef}
            aria-hidden="true"
            className="absolute -inset-x-10 -top-24 h-64 pointer-events-none opacity-25 mix-blend-screen"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,230,185,0.28) 0%, rgba(197,160,89,0.12) 40%, transparent 72%)',
            }}
          />

          {/* Woven Gota-Patti / Zari Kinari Left Selvedge Border */}
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

          {/* Woven Gota-Patti / Zari Kinari Right Selvedge Border */}
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
            <p
              data-farman-reveal
              className="font-serif text-lg sm:text-xl text-[#FFF3D6] tracking-widest drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] mb-1.5 select-none"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <p
              data-farman-reveal
              className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.22em] text-[#FFE8B8] drop-shadow-sm"
            >
              ✦ बा-अदब &bull; बा-मुलाहिज़ा &bull; Needle Fashion Atelier ✦
            </p>

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
