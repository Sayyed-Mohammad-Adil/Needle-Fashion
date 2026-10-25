'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import RoyalFiberCanvas from '@/components/3d/RoyalFiberCanvas';

export default function FirstVisitIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Check storage on client mount
  useEffect(() => {
    const hasEntered = sessionStorage.getItem('needle_intro_entered_v3');
    if (hasEntered === 'true') {
      setIsVisible(false);
      document.body.style.overflow = '';
      return;
    }

    // Prevent body scroll during curtain reveal
    document.body.style.overflow = 'hidden';

    // GSAP Entrance Timeline
    const tl = gsap.timeline();

    // 1. Initial State
    if (leftCurtainRef.current) gsap.set(leftCurtainRef.current, { xPercent: 0 });
    if (rightCurtainRef.current) gsap.set(rightCurtainRef.current, { xPercent: 0 });
    if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(contentRef.current, { opacity: 0 });
    gsap.set(crestRef.current, { scale: 0.7, opacity: 0 });
    gsap.set(titleRef.current, { y: 20, opacity: 0 });
    gsap.set(subtitleRef.current, { y: 15, opacity: 0 });
    gsap.set(goldLineRef.current, { scaleX: 0, transformOrigin: 'center' });
    gsap.set(buttonRef.current, { y: 20, opacity: 0 });
    if (canvasRef.current) {
      gsap.set(canvasRef.current, { opacity: 0 });
    }

    // 2. Play Entrance Sequence: Smooth 3D canvas reveal without DOM scale distortion
    if (canvasRef.current) {
      tl.to(canvasRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
      });
    }

    tl.to(contentRef.current, { opacity: 1, duration: 0.5 }, '-=0.8')
      .to(crestRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .to(
        titleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        goldLineRef.current,
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        '-=0.4'
      )
      .to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        buttonRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Expose global replay function
  useEffect(() => {
    (window as any).replayNeedleIntro = () => {
      sessionStorage.removeItem('needle_intro_entered_v3');
      if (leftCurtainRef.current) gsap.set(leftCurtainRef.current, { xPercent: 0 });
      if (rightCurtainRef.current) gsap.set(rightCurtainRef.current, { xPercent: 0 });
      if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
      setIsVisible(true);
    };

    return () => {
      delete (window as any).replayNeedleIntro;
    };
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('needle_intro_entered_v3', 'true');
    document.body.style.overflow = '';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
      },
    });

    // Fade out center dossier & 3D canvas
    tl.to([contentRef.current, canvasRef.current], {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    })
      // Split curtains with royal velocity
      .to(
        leftCurtainRef.current,
        {
          xPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
        },
        '-=0.15'
      )
      .to(
        rightCurtainRef.current,
        {
          xPercent: 100,
          duration: 1.1,
          ease: 'power4.inOut',
        },
        '<0'
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        '-=0.3'
      );
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Left Imperial Cashmere Silk & Frosted Glass Panel (Pure luxury, NO BLACK) */}
      <div
        ref={leftCurtainRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[#FAF8F5]/98 backdrop-blur-3xl border-r border-[#BF953F]/25 shadow-[15px_0_40px_rgba(191,149,63,0.06)] z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4EFE8]/95 via-[#FAF8F5]/85 to-[#FAF8F5]/60 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#BF953F]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Right Imperial Cashmere Silk & Frosted Glass Panel (Pure luxury, NO BLACK) */}
      <div
        ref={rightCurtainRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[#FAF8F5]/98 backdrop-blur-3xl border-l border-[#BF953F]/25 shadow-[-15px_0_40px_rgba(191,149,63,0.06)] z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#F4EFE8]/95 via-[#FAF8F5]/85 to-[#FAF8F5]/60 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#BF953F]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Interactive 3D Three.js Wavy Concentric Rings (Pure & Clean: No background ribbon clutter!) */}
      <div
        ref={canvasRef}
        className="fixed inset-0 z-20 pointer-events-none w-screen h-screen"
      >
        <RoyalFiberCanvas showRing={true} showBackgroundRibbon={false} />
      </div>

      {/* Skip Button in Top-Right - Responsive positioning */}
      <button
        onClick={handleEnter}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#554E44] hover:text-[#8C6418] transition-colors glass-pill px-3 py-1 sm:px-4 sm:py-1.5 border border-[#BF953F]/35 shadow-sm bg-white/70"
      >
        Skip &rarr;
      </button>

      {/* Center Royal Monogram Exhibition Docket */}
      <div
        ref={contentRef}
        className="relative z-30 text-center w-full max-w-4xl px-3 sm:px-4 flex flex-col items-center justify-center pointer-events-auto"
      >
        {/* Deep Luxury Smoked Atelier Dial Medallion (Framed inside the 3 Gold/Silver Wavy Rings) */}
        <div className="absolute w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[680px] lg:h-[680px] rounded-full bg-gradient-to-br from-[#12141A]/95 via-[#151821]/97 to-[#0E1015]/98 backdrop-blur-3xl border-2 border-[#BF953F]/45 shadow-[0_25px_80px_rgba(0,0,0,0.45),0_0_45px_rgba(191,149,63,0.25)] pointer-events-none -z-10 overflow-hidden">
          {/* Subtle 24K Gold Radial Inner Glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(191,149,63,0.18)_0%,transparent_70%)] pointer-events-none" />
          {/* Inner Hairline Ring */}
          <div className="absolute inset-4 sm:inset-6 rounded-full border border-[#BF953F]/25 pointer-events-none" />
        </div>

        {/* Monogram Crest with Rolesor Dual-Tone 18K Gold & Pure Shiny Silver (#EAECEC) Gradient */}
        <div
          ref={crestRef}
          className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl p-[1.5px] shadow-[0_0_35px_rgba(191,149,63,0.4),0_0_20px_rgba(234,236,236,0.35)] mb-2 sm:mb-3"
          style={{
            background:
              'linear-gradient(135deg, #BF953F 0%, #FFFFFF 30%, #B38728 65%, #EAECEC 85%, #AA771C 100%)',
          }}
        >
          <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-[#14161E] flex items-center justify-center relative overflow-hidden border border-[#BF953F]/40 shadow-inner">
            <span
              className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text select-none drop-shadow-[0_2px_8px_rgba(191,149,63,0.6)]"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #FCF6BA 0%, #BF953F 45%, #EAECEC 75%, #AA771C 100%)',
              }}
            >
              N
            </span>
          </div>
        </div>

        {/* Dual-Metallic Luxury Seal */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[8px] sm:text-[9.5px] uppercase font-bold tracking-[0.16em] sm:tracking-[0.2em] mb-2 sm:mb-2.5 bg-black/60 border border-[#BF953F]/50 text-[#FAF8F5] backdrop-blur-md shadow-lg">
          <span className="text-[#BF953F] text-[10px]">✦</span>
          <span>24K Gold &amp; Sterling Silver Zari</span>
          <span className="text-[#EAECEC] text-[10px]">✦</span>
        </div>

        {/* Brand Headline in ONE LINE with the SPACE between NEEDLE & FASHION exactly on the center line */}
        <h1
          ref={titleRef}
          className="w-full flex items-center justify-center font-serif text-[16px] xs:text-lg sm:text-2xl md:text-4xl lg:text-[46px] font-black uppercase leading-none select-none my-1.5 sm:my-2"
        >
          {/* Left Half: NEEDLE styled in Pure Ultra-Shiny Sterling Silver */}
          <div className="w-1/2 text-right pr-1 sm:pr-2 md:pr-3.5">
            <span
              className="inline-block text-transparent bg-clip-text font-black tracking-[0.06em] sm:tracking-[0.12em] md:tracking-[0.18em] whitespace-nowrap select-none drop-shadow-[0_2px_18px_rgba(234,236,236,0.85)] filter contrast-125"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #A8A9AD, #FFFFFF, #EAECEC, #FFFFFF, #BBC2CC)',
              }}
            >
              NEEDLE
            </span>
          </div>

          {/* Central Seam Alignment Point (Directly on 50% Curtain Seam) */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#BF953F] shadow-[0_0_12px_#FCF6BA] opacity-95" />
          </div>

          {/* Right Half: FASHION in 24K Iconic Gold aligned left */}
          <div className="w-1/2 text-left pl-1 sm:pl-2 md:pl-3.5">
            <span
              className="inline-block text-transparent bg-clip-text font-black tracking-[0.06em] sm:tracking-[0.12em] md:tracking-[0.18em] whitespace-nowrap select-none drop-shadow-[0_2px_18px_rgba(191,149,63,0.7)] filter contrast-125"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
              }}
            >
              FASHION
            </span>
          </div>
        </h1>

        {/* Bi-Metallic Gold & Shiny Silver Hairline Trace */}
        <div
          ref={goldLineRef}
          className="w-44 sm:w-64 md:w-80 lg:w-96 h-[1.5px] sm:h-[2px] my-2 sm:my-3 shadow-[0_0_15px_rgba(191,149,63,0.4)]"
          style={{
            background:
              'linear-gradient(to right, transparent, #BF953F, #EAECEC, #B38728, #BBC2CC, transparent)',
          }}
        />

        {/* Subtitle - Refined couture typography */}
        <p
          ref={subtitleRef}
          className="text-[9px] sm:text-xs md:text-sm font-medium text-[#D8D2C4] tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.28em] uppercase font-serif drop-shadow-sm"
        >
          Haute Menswear &bull; Bespoke Tailoring &bull; Est. 2026
        </p>

        {/* Enter Atelier Action Button with 24K Gold & Silver Rim */}
        <button
          ref={buttonRef}
          onClick={handleEnter}
          className="mt-4 sm:mt-6 md:mt-7 group relative px-7 sm:px-10 py-2.5 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#1A1814] shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden border border-[#EAECEC] shadow-[0_8px_25px_rgba(191,149,63,0.35)]"
          style={{
            background:
              'linear-gradient(to right, #BF953F, #FCF6BA, #EAECEC, #FBF5B7, #AA771C)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>Enter The Atelier</span>
            <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
