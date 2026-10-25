'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ShahiFarmanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const fabricBodyRef = useRef<HTMLDivElement>(null);
  const bottomRollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('openShahiFarman', handleOpen);
    (window as any).openShahiFarman = handleOpen;

    return () => {
      window.removeEventListener('openShahiFarman', handleOpen);
      delete (window as any).openShahiFarman;
    };
  }, []);

  // Realistic Scroll Unrolling Animation when isOpen becomes true
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const fabric = fabricBodyRef.current;
    const roller = bottomRollerRef.current;
    const content = contentRef.current;
    if (!fabric || !roller || !content) return;

    // Initial state: Scroll is completely rolled up!
    // The bottom roller is clamped directly at the top under the top roller, height is 0
    gsap.set(fabric, {
      maxHeight: 0,
      opacity: 1,
    });
    gsap.set(roller, {
      rotation: -180,
    });
    gsap.set(content, {
      opacity: 0,
      y: -20,
    });

    // Unrolling Timeline
    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(fabric, {
      maxHeight: 780,
      duration: 1.4,
      ease: 'power3.out',
    })
      .to(
        roller,
        {
          rotation: 0,
          duration: 1.4,
          ease: 'power3.out',
        },
        '<0'
      )
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6'
      );

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Realistic Scroll Rolling-Up Animation on close
  const handleClose = () => {
    const fabric = fabricBodyRef.current;
    const roller = bottomRollerRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = '';
      },
    });

    tl.to(content, {
      opacity: 0,
      y: -15,
      duration: 0.3,
      ease: 'power2.in',
    })
      .to(
        fabric,
        {
          maxHeight: 0,
          duration: 0.9,
          ease: 'power3.in',
        },
        '-=0.1'
      )
      .to(
        roller,
        {
          rotation: -180,
          duration: 0.9,
          ease: 'power3.in',
        },
        '<0'
      );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* Click outside to roll up */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Main Shahi Farman Scroll Assembly (Styled after the Royal Reference Image) */}
      <div
        ref={scrollWrapperRef}
        className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center pointer-events-auto"
      >
        {/* Top Floating Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 sm:-top-12 right-2 text-xs uppercase tracking-widest text-[#F5EDD6] hover:text-[#C5A059] transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-black/70 shadow-lg"
        >
          <XMarkIcon className="w-4 h-4" />
          <span>लपेटें (Close)</span>
        </button>

        {/* =========================================================================
            1. TOP HORIZONTAL ROLLER ROD WITH CLASSIC ACORN FINIALS
            (Exactly as in the reference image: cylindrical bar + 2 bulbous finials)
        ========================================================================= */}
        <div className="w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]">
          {/* Left Acorn Finial (बायाँ कलश / Knob) */}
          <div className="flex items-center -mr-1 z-30">
            <div
              className="w-4 h-3 rounded-l-full bg-gradient-to-r from-[#5E3E0E] to-[#B38728] border-y border-l border-[#F5EDD6]/60 shadow-md"
            />
            <div
              className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border border-[#F5EDD6]/70 shadow-[0_4px_10px_rgba(0,0,0,0.7)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #F5EDD6 0%, #C5A059 40%, #7A5310 75%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#C5A059]" />
            </div>
          </div>

          {/* Center Cylindrical Golden Rod Bar */}
          <div
            className="w-full h-5 sm:h-6 rounded-sm border-y border-[#F5EDD6]/70 shadow-2xl relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #5E3E0E 0%, #B38728 20%, #F5EDD6 48%, #C5A059 65%, #3D2606 100%)',
            }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-30" />
          </div>

          {/* Right Acorn Finial (दायाँ कलश / Knob) */}
          <div className="flex items-center -ml-1 z-30">
            <div
              className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border border-[#F5EDD6]/70 shadow-[0_4px_10px_rgba(0,0,0,0.7)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #F5EDD6 0%, #C5A059 40%, #7A5310 75%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#C5A059]" />
            </div>
            <div
              className="w-4 h-3 rounded-r-full bg-gradient-to-l from-[#5E3E0E] to-[#B38728] border-y border-r border-[#F5EDD6]/60 shadow-md"
            />
          </div>
        </div>

        {/* =========================================================================
            2. UNROLLING ROYAL IMPERIAL SILK FABRIC BODY
            Deep Royal Ruby/Crimson Silk Satin with Gold Vine Borders (Matching Reference Image!)
        ========================================================================= */}
        <div
          ref={fabricBodyRef}
          className="w-[90%] sm:w-[88%] z-20 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-x border-[#F5EDD6]/30 relative -mt-0.5 -mb-0.5"
          style={{
            background:
              'linear-gradient(180deg, #8C0E24 0%, #9E132D 30%, #911028 70%, #7A0A1F 100%)',
          }}
        >
          {/* Subtle Royal Satin Sheen Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />

          {/* LEFT GOLD FLORAL VINE BORDER (Bel-Boota Border exactly like Image) */}
          <div className="absolute top-0 bottom-0 left-1.5 sm:left-2.5 w-6 sm:w-8 border-r border-[#F5EDD6]/35 flex flex-col items-center overflow-hidden opacity-90 pointer-events-none">
            <div className="w-full h-full flex flex-col justify-around py-4">
              {[...Array(14)].map((_, i) => (
                <div key={`vine-l-${i}`} className="text-[#F5EDD6] text-[11px] sm:text-xs font-serif select-none">
                  ❦
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT GOLD FLORAL VINE BORDER (Bel-Boota Border exactly like Image) */}
          <div className="absolute top-0 bottom-0 right-1.5 sm:right-2.5 w-6 sm:w-8 border-l border-[#F5EDD6]/35 flex flex-col items-center overflow-hidden opacity-90 pointer-events-none">
            <div className="w-full h-full flex flex-col justify-around py-4">
              {[...Array(14)].map((_, i) => (
                <div key={`vine-r-${i}`} className="text-[#F5EDD6] text-[11px] sm:text-xs font-serif select-none">
                  ❦
                </div>
              ))}
            </div>
          </div>

          {/* TOP & BOTTOM GOLD HAILINE BORDERS */}
          <div className="absolute top-2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#F5EDD6] to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#F5EDD6] to-transparent opacity-60 pointer-events-none" />

          {/* Large Artistic Gold Floral Line Art in Lower Right (Directly inspired by Reference Image!) */}
          <div className="absolute bottom-3 right-6 sm:right-10 pointer-events-none opacity-25 text-5xl sm:text-7xl font-serif text-[#F5EDD6] select-none leading-none">
            𑁍
          </div>

          {/* =========================================================================
              SCROLL CONTENT BODY (Gold Inscribed Calligraphy & Royal Proclamation)
          ========================================================================= */}
          <div
            ref={contentRef}
            className="px-8 sm:px-14 py-8 sm:py-12 relative z-10 text-center flex flex-col items-center"
          >
            {/* Top Bismillah in Pure Gold Foil Nastaliq (Exactly like top of Reference Image) */}
            <p className="font-serif text-base sm:text-xl text-[#F5EDD6] tracking-widest drop-shadow-[0_2px_8px_rgba(245,237,214,0.6)] mb-2 select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Urdu & Hindi Sub-Invocation */}
            <p className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.22em] text-[#E6D5B8] drop-shadow-sm">
              ✦ باسمِ فن و نفاست • बा-अदब बा-मुलाहिज़ा ✦
            </p>

            {/* Main Shahi Farman Title */}
            <h2 className="font-serif text-2xl sm:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5EDD6] via-[#FFEBB0] to-[#E6D5B8] drop-shadow-[0_2px_12px_rgba(245,237,214,0.5)] mt-3 mb-1">
              शाही फ़रमान &bull; Royal Decree
            </h2>
            <div className="w-36 sm:w-56 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5EDD6] to-transparent my-2.5 opacity-80" />

            {/* Urdu Couture Couplet (शेर) */}
            <div className="bg-black/30 border-y border-[#F5EDD6]/35 py-2 px-4 rounded-lg my-2 max-w-md w-full backdrop-blur-sm">
              <p className="font-serif text-sm sm:text-base text-[#F5EDD6] tracking-wider leading-relaxed">
                &ldquo;ہنر کی بات ہے ورنہ لباس سب پہنتے ہیں&rdquo;
              </p>
              <p className="text-[9.5px] sm:text-[10.5px] text-[#E6D5B8] font-medium mt-0.5 tracking-wide">
                (हुनर की बात है वरना लिबास सब पहनते हैं — Needle Fashion Atelier)
              </p>
            </div>

            {/* Decree Body Paragraphs */}
            <div className="mt-3.5 space-y-3 text-xs sm:text-[12.5px] leading-relaxed text-[#F5EDD6]/95 max-w-lg font-light text-justify sm:text-center">
              <p>
                <strong className="font-serif font-bold text-[#FFEBB0]">दास्तान-ए-कारीगरी (The Ancestral Lineage):</strong>{' '}
                Tracing our master karigar lineage across 400 years to the royal courts of Agra and Varanasi. Every sherwani, bandhgala, and kurta is woven with authentic 24K gold wire (ज़री) and pure sterling silver tilla on hand-operated Banaras pit looms.
              </p>

              <p>
                <strong className="font-serif font-bold text-[#FFEBB0]">48-नुकाती नफ़ासत (48-Point Bespoke Fit):</strong>{' '}
                Rejecting mass industrial sizes, every royal ensemble is individually sculpted on custom master paper patterns, honoring the individual posture and grace of each gentleman.
              </p>

              <div className="p-2.5 rounded-lg bg-black/40 border border-[#F5EDD6]/35 text-[#F5EDD6] text-xs text-center mt-2">
                <span className="block font-bold uppercase tracking-wider text-[#FFEBB0] text-[10px] mb-0.5">
                  ✦ शाही इनायत • Imperial Valet Protocol ✦
                </span>
                Complimentary insured white-glove valet case delivery on commissions over ₹1,000 across India. Private salon master fittings available upon appointment.
              </div>
            </div>

            {/* Button to Accept & Roll Up */}
            <button
              onClick={handleClose}
              className="mt-6 px-8 sm:px-10 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-[#5C0A18] shadow-2xl hover:scale-105 active:scale-95 transition-all border border-[#F5EDD6]"
              style={{
                background:
                  'linear-gradient(to right, #F5EDD6, #FFF3D6, #E6D5B8, #F5EDD6)',
              }}
            >
              <span>फ़रमान स्वीकारें (Accept &amp; Enter)</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM HORIZONTAL ROLLER ROD WITH CLASSIC ACORN FINIALS
            (Unrolls downwards smoothly as the scroll opens!)
        ========================================================================= */}
        <div
          ref={bottomRollerRef}
          className="w-full flex items-center justify-center z-30 pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
        >
          {/* Left Acorn Finial */}
          <div className="flex items-center -mr-1 z-30">
            <div
              className="w-4 h-3 rounded-l-full bg-gradient-to-r from-[#5E3E0E] to-[#B38728] border-y border-l border-[#F5EDD6]/60 shadow-md"
            />
            <div
              className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border border-[#F5EDD6]/70 shadow-[0_4px_10px_rgba(0,0,0,0.7)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #F5EDD6 0%, #C5A059 40%, #7A5310 75%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#C5A059]" />
            </div>
          </div>

          {/* Center Cylindrical Golden Rod Bar */}
          <div
            className="w-full h-5 sm:h-6 rounded-sm border-y border-[#F5EDD6]/70 shadow-2xl relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #5E3E0E 0%, #B38728 20%, #F5EDD6 48%, #C5A059 65%, #3D2606 100%)',
            }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-30" />
          </div>

          {/* Right Acorn Finial */}
          <div className="flex items-center -ml-1 z-30">
            <div
              className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border border-[#F5EDD6]/70 shadow-[0_4px_10px_rgba(0,0,0,0.7)] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #F5EDD6 0%, #C5A059 40%, #7A5310 75%, #352106 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#3D2808] border border-[#C5A059]" />
            </div>
            <div
              className="w-4 h-3 rounded-r-full bg-gradient-to-l from-[#5E3E0E] to-[#B38728] border-y border-r border-[#F5EDD6]/60 shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
