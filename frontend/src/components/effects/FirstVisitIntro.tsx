'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function FirstVisitIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const knockerLeftGlow = useRef<HTMLDivElement>(null);
  const knockerRightGlow = useRef<HTMLDivElement>(null);

  // Check storage on client mount
  useEffect(() => {
    const hasEntered = sessionStorage.getItem('needle_intro_entered_v10');
    if (hasEntered === 'true') {
      setIsVisible(false);
      document.body.style.overflow = '';
      return;
    }

    // Prevent body scroll during Darwaza display
    document.body.style.overflow = 'hidden';

    // GSAP Entrance Timeline
    const tl = gsap.timeline();

    if (leftDoorRef.current) {
      gsap.set(leftDoorRef.current, { rotateY: 0, transformOrigin: 'left center' });
    }
    if (rightDoorRef.current) {
      gsap.set(rightDoorRef.current, { rotateY: 0, transformOrigin: 'right center' });
    }
    if (portalRef.current) {
      gsap.set(portalRef.current, { scale: 1, transformOrigin: '50% 60%' });
    }
    if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
    if (promptRef.current) gsap.set(promptRef.current, { opacity: 0, y: 15 });

    tl.to(promptRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.25,
    });

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Expose global replay function
  useEffect(() => {
    (window as any).replayNeedleIntro = () => {
      sessionStorage.removeItem('needle_intro_entered_v10');
      if (leftDoorRef.current) gsap.set(leftDoorRef.current, { rotateY: 0 });
      if (rightDoorRef.current) gsap.set(rightDoorRef.current, { rotateY: 0 });
      if (portalRef.current) gsap.set(portalRef.current, { scale: 1 });
      if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
      if (promptRef.current) gsap.set(promptRef.current, { opacity: 1, y: 0 });
      setIsVisible(true);
    };

    return () => {
      delete (window as any).replayNeedleIntro;
    };
  }, []);

  // Open the Palace Darwaza & Smoothly Reveal the Website through the Open Doors
  const handleEnter = () => {
    sessionStorage.setItem('needle_intro_entered_v10', 'true');
    document.body.style.overflow = '';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
      },
    });

    // 1. Minimal prompt indicator softly fades away
    tl.to(promptRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.35,
      ease: 'power2.in',
    })
      // 2. Both massive antique gilded brass & ebony doors swing open in 3D perspective
      .to(
        leftDoorRef.current,
        {
          rotateY: -82,
          duration: 1.6,
          ease: 'power2.inOut',
        },
        '-=0.1'
      )
      .to(
        rightDoorRef.current,
        {
          rotateY: 82,
          duration: 1.6,
          ease: 'power2.inOut',
        },
        '<0'
      )
      // 3. Subtle, elegant cinematic forward push (NO severe stretch blowup)
      .to(
        portalRef.current,
        {
          scale: 1.12,
          duration: 1.6,
          ease: 'power2.inOut',
        },
        '<0'
      )
      // 4. As doors part wide, smooth dissolve to homepage
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.65,
          ease: 'power2.inOut',
        },
        '-=0.7'
      );
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleEnter}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0C0806] select-none cursor-pointer"
    >
      {/* Golden Running Words along the Very Top Header (Urdu & Hindi Marquee) */}
      <div className="absolute top-0 left-0 right-0 z-40 overflow-hidden pointer-events-none py-2 bg-[#0C0806]/85 border-b border-[#C5A059]/30 backdrop-blur-sm">
        <div className="flex w-[200%] animate-mughal-marquee whitespace-nowrap">
          <span className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#F5EDD6] to-[#C5A059] px-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
            ✦ दस्तकारी • دستکاری ✦ शाही रिवायत • شاہی روایات ✦ ज़री का नूर • نورِ زردوزی ✦ नफ़ासत • نفاست ✦ ख़ानदानी हुनर • خاندانی ہنر ✦ शाही पोशाक • شاہی ملبوسات ✦ सोज़नकारी • سوزن کاری ✦ कारीगर विरासत • وراثتِ کاریگر
          </span>
          <span className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#F5EDD6] to-[#C5A059] px-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
            ✦ दस्तकारी • دستکاری ✦ शाही रिवायत • شاہی روایات ✦ ज़री का नूर • نورِ زردوزی ✦ नफ़ासत • نفاست ✦ ख़ानदानी हुनर • خاندانی ہنر ✦ शाही पोशाक • شاہی ملبوسات ✦ सोज़नकारी • سوزن کاری ✦ कारीगर विरासत • وراثتِ کاریگر
          </span>
        </div>
      </div>

      {/* Skip Button (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEnter();
        }}
        className="absolute top-3.5 right-4 sm:top-5 sm:right-6 z-50 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#E6D5B8] hover:text-[#C5A059] transition-all px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl bg-black/80 backdrop-blur-md cursor-pointer hover:border-[#C5A059]"
      >
        Skip &rarr;
      </button>

      {/* =========================================================================
          FULL-SCREEN EDGE-TO-EDGE ORNATE GOLDEN PALACE GATEWAY
          - Built from user-provided Ornate-Golden-Palace.svg
          - Exact 1672:941 Aspect Ratio Lock (Zero stretching, 100% full viewport fill)
          - Intricately Carved Scalloped Marble Arch & 24K Gold Filigree Details
          - Antique Gilded Brass & Ebony Wood Double Doors with Ring Knockers
          - 3D Perspective Hinges Parting Inward Revealing the Portal & Live Website
          - No Cheap Cards / No Obtrusive Overlays (Pure Royal Haute-Couture Aesthetic)
      ========================================================================= */}
      <div
        ref={portalRef}
        className="relative w-full h-full min-w-full min-h-full flex items-center justify-center overflow-hidden"
      >
        {/* Full Viewport Fill Wrapper with exact 1672:941 aspect lock */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: 'max(100vw, calc(100vh * (1672 / 941)))',
            height: 'max(100vh, calc(100vw * (941 / 1672)))',
          }}
        >
          {/* =========================================================================
              LAYER 1: INTERIOR PALACE PORTAL DEPTH (BEHIND DOORS)
              Revealed smoothly through the arched gateway when doors swing open
          ========================================================================= */}
          <div
            className="absolute z-10 overflow-hidden pointer-events-none"
            style={{
              left: '30.921%',
              top: '44.846%',
              width: '37.679%',
              height: '45.271%',
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#18110a] via-[#0d0806] to-[#070403] flex items-center justify-center relative">
              {/* Soft Warm Candlelit Hallway Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(218,165,32,0.22)_0%,rgba(20,12,8,0.75)_60%,rgba(0,0,0,0.98)_100%)]" />
              {/* Atmospheric Luxury Hallway Silhouette */}
              <div className="relative text-center px-4 opacity-80 transition-opacity">
                <div className="text-[12px] sm:text-[14px] tracking-[0.38em] uppercase text-[#F5EDD6] font-serif font-light drop-shadow-[0_0_12px_rgba(197,160,89,0.7)]">
                  NEEDLE FASHION
                </div>
                <div className="text-[8.5px] sm:text-[10px] tracking-[0.26em] text-[#C5A059] uppercase font-serif mt-1 opacity-85">
                  शाही रिवायत • شاہی روایات
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              LAYER 2: THE TWO MASSIVE 3D PALACE DOOR LEAVES
              Left and Right Leaves swing inward in 3D perspective
          ========================================================================= */}
          <div
            className="absolute z-20 [perspective:1400px]"
            style={{
              left: '30.921%',
              top: '44.846%',
              width: '37.679%',
              height: '45.271%',
            }}
          >
            {/* Left Massive 24K Gold & Ebony Door Leaf (बायाँ शाही कपाट) */}
            <div
              ref={leftDoorRef}
              className="absolute top-0 bottom-0 left-0 w-[50.635%] z-10 shadow-[18px_0_40px_rgba(0,0,0,0.9)]"
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
              }}
            >
              <picture>
                <source srcSet="/palace_door_left.webp" type="image/webp" />
                <img
                  src="/palace_door_left.png"
                  alt="शाही कपाट बायाँ"
                  className="w-full h-full object-fill select-none pointer-events-none drop-shadow-[2px_0_6px_rgba(0,0,0,0.7)]"
                />
              </picture>
              {/* Subtle Breathing Ring Knocker Pulse */}
              <div
                ref={knockerLeftGlow}
                className="absolute top-[56%] left-[72%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#C5A059]/45 pointer-events-none animate-ping opacity-35"
              />
            </div>

            {/* Right Massive 24K Gold & Ebony Door Leaf (दायाँ शाही कपाट) */}
            <div
              ref={rightDoorRef}
              className="absolute top-0 bottom-0 right-0 w-[49.365%] z-10 shadow-[-18px_0_40px_rgba(0,0,0,0.9)]"
              style={{
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
              }}
            >
              <picture>
                <source srcSet="/palace_door_right.webp" type="image/webp" />
                <img
                  src="/palace_door_right.png"
                  alt="शाही कपाट दायाँ"
                  className="w-full h-full object-fill select-none pointer-events-none drop-shadow-[-2px_0_6px_rgba(0,0,0,0.7)]"
                />
              </picture>
              {/* Subtle Breathing Ring Knocker Pulse */}
              <div
                ref={knockerRightGlow}
                className="absolute top-[56%] right-[72%] translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#C5A059]/45 pointer-events-none animate-ping opacity-35"
              />
            </div>
          </div>

          {/* =========================================================================
              LAYER 3: THE PALACE ARCHITECTURAL FRAME (LAYERED IN FRONT OF HINGES)
              Carved marble scalloped arch and grand Darbar hall facade
          ========================================================================= */}
          <div className="absolute inset-0 z-30 pointer-events-none select-none">
            <picture>
              <source srcSet="/palace_frame.webp" type="image/webp" />
              <img
                src="/palace_frame.png"
                alt="शाही महल मेहराब"
                className="w-full h-full object-fill pointer-events-none select-none"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ULTRA-PREMIUM MINIMALIST INTERACTION PROMPT (दहलीज़ / दस्तक)
          No clunky cards, no brand name overlay. Pure luxury aesthetic.
      ========================================================================= */}
      <div
        ref={promptRef}
        className="absolute bottom-9 sm:bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center"
      >
        <div className="group flex items-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C5A059]/60 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059] animate-pulse" />
          <span className="text-[10px] sm:text-[12px] font-serif uppercase tracking-[0.28em] text-[#F5EDD6] font-semibold drop-shadow-md">
            दस्तक दें • Tap to Enter
          </span>
          <span className="text-xs text-[#C5A059]">⚜</span>
        </div>
        <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.2em] text-[#C5A059]/80 font-serif mt-1.5 drop-shadow">
          (Click anywhere on the palace doors)
        </span>
      </div>

      {/* Golden Running Words along Bottom (Urdu & Hindi Marquee Reverse) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 overflow-hidden pointer-events-none py-2 bg-[#0C0806]/85 border-t border-[#C5A059]/30 backdrop-blur-sm">
        <div className="flex w-[200%] animate-mughal-marquee-reverse whitespace-nowrap">
          <span className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#F5EDD6] to-[#C5A059] px-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
            ❖ 48-नुकाती फ़रमान • ۴۸ نکاتی فرمان ❖ बनारसी रेशम • خالص ریشم ❖ २4 कैरेट ज़री • چوبیس قیراط زری ❖ शाही दस्तकार • شاہی کاریگر ❖ राजसी परिधान • خلعتِ شاہی ❖
          </span>
          <span className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#F5EDD6] to-[#C5A059] px-4 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
            ❖ 48-नुकाती फ़रमान • ۴۸ نکاتی فرمان ❖ बनारसी रेशम • خالص ریشم ❖ २4 कैरेट ज़री • چوبیس قیراط زری ❖ शाही दस्तकार • شاہی کاریگر ❖ राजसी परिधान • خلعتِ شاہی ❖
          </span>
        </div>
      </div>
    </div>
  );
}
