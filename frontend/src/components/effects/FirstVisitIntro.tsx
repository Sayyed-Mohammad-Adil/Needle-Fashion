'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function FirstVisitIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const lightGlowRef = useRef<HTMLDivElement>(null);

  // Check storage on client mount
  useEffect(() => {
    const hasEntered = sessionStorage.getItem('needle_intro_entered_v7');
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
      gsap.set(portalRef.current, { scale: 1, transformOrigin: '50% 56%' });
    }
    if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
    if (lightGlowRef.current) gsap.set(lightGlowRef.current, { opacity: 0, scale: 0.8 });
    if (emblemRef.current) gsap.set(emblemRef.current, { opacity: 0, scale: 0.9, y: 20 });

    tl.to(emblemRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay: 0.2,
    });

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Expose global replay function
  useEffect(() => {
    (window as any).replayNeedleIntro = () => {
      sessionStorage.removeItem('needle_intro_entered_v7');
      if (leftDoorRef.current) gsap.set(leftDoorRef.current, { rotateY: 0 });
      if (rightDoorRef.current) gsap.set(rightDoorRef.current, { rotateY: 0 });
      if (portalRef.current) gsap.set(portalRef.current, { scale: 1 });
      if (containerRef.current) gsap.set(containerRef.current, { opacity: 1 });
      if (lightGlowRef.current) gsap.set(lightGlowRef.current, { opacity: 0, scale: 0.8 });
      if (emblemRef.current) gsap.set(emblemRef.current, { opacity: 1, scale: 1, y: 0 });
      setIsVisible(true);
    };

    return () => {
      delete (window as any).replayNeedleIntro;
    };
  }, []);

  // Open the Palace Darwaza & Smoothly Reveal the Website through the Open Doors
  const handleEnter = () => {
    sessionStorage.setItem('needle_intro_entered_v7', 'true');
    document.body.style.overflow = '';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
      },
    });

    // 1. Royal emblem fades and lifts gently
    tl.to(emblemRef.current, {
      scale: 0.88,
      opacity: 0,
      y: -15,
      duration: 0.35,
      ease: 'power2.in',
    })
      // 2. Warm golden palace light pours out through the door opening
      .to(
        lightGlowRef.current,
        {
          opacity: 1,
          scale: 2.2,
          duration: 1.3,
          ease: 'power2.out',
        },
        '-=0.1'
      )
      // 3. Both massive antique gilded brass & teakwood doors swing open in 3D perspective
      .to(
        leftDoorRef.current,
        {
          rotateY: -85,
          duration: 1.6,
          ease: 'power3.inOut',
        },
        '<0'
      )
      .to(
        rightDoorRef.current,
        {
          rotateY: 85,
          duration: 1.6,
          ease: 'power3.inOut',
        },
        '<0'
      )
      // 4. Smooth cinematic forward push-in directly through the open doorway into the website
      .to(
        portalRef.current,
        {
          scale: 2.8,
          duration: 1.6,
          ease: 'power3.inOut',
        },
        '<0'
      )
      // 5. As the doors open wide and camera enters the doorway, smoothly dissolve to homepage
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '-=0.55'
      );
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0D0907] select-none"
    >
      {/* Golden Running Words along the Very Top Header (Urdu & Hindi Marquee) */}
      <div className="absolute top-0 left-0 right-0 z-40 overflow-hidden pointer-events-none py-2 bg-[#0D0907]/90 border-b border-[#C5A059]/30 backdrop-blur-sm">
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
        onClick={handleEnter}
        className="absolute top-3.5 right-4 sm:top-5 sm:right-6 z-50 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#E6D5B8] hover:text-[#C5A059] transition-all px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl bg-black/80 backdrop-blur-md cursor-pointer hover:border-[#C5A059]"
      >
        Skip &rarr;
      </button>

      {/* =========================================================================
          FULL-SCREEN EDGE-TO-EDGE ROYAL MUGHAL / JAIPUR PALACE GATEWAY
          - 100% Full Viewport Coverage (Zero side bars, full area capture)
          - Warm Terracotta Sandstone & White Marble Fresco (Authentic Brand Theme)
          - Massive Antique Gilded Brass & Teakwood Double Doors with Ring Knockers
          - Without Gumbat (Flat architectural elevation)
          - 3D Swinging Door leaves with Smooth Cinematic Push-in to the Website
      ========================================================================= */}
      <div
        ref={portalRef}
        className="relative w-full h-full min-w-full min-h-full flex items-center justify-center overflow-hidden"
      >
        {/* Full Viewport Fill Wrapper with exact 1376:768 aspect lock */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: 'max(100vw, calc(100vh * (1376 / 768)))',
            height: 'max(100vh, calc(100vw * (768 / 1376)))',
          }}
        >
          {/* Background Facade Image (Edge to edge, 100% full screen fill) */}
          <img
            src="/mughal_gate_bg.png"
            alt="शाही महल प्रवेश द्वार"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />

          {/* =========================================================================
              THE TWO MASSIVE PALACE DOOR LEAVES (3D PERSPECTIVE HINGES)
              Exact pixel bounds: left 36.9186%, top 28.125%, width 26.1628%, height 57.2917%
          ========================================================================= */}
          <div
            onClick={handleEnter}
            className="absolute z-20 cursor-pointer [perspective:1400px]"
            style={{
              left: '36.9186%',
              top: '28.125%',
              width: '26.1628%',
              height: '57.2917%',
            }}
          >
            {/* Palace Interior Warm Golden Illumination (Radiates through open doors) */}
            <div
              ref={lightGlowRef}
              className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,#FFF4D4_0%,#E6A93B_45%,#8B4B0A_80%,transparent_100%)] opacity-0 pointer-events-none filter blur-xl"
            />

            {/* Left Massive Gilded Brass Door Leaf (बायाँ कपाट) */}
            <div
              ref={leftDoorRef}
              className="absolute top-0 bottom-0 left-0 w-1/2 z-10 shadow-[15px_0_40px_rgba(0,0,0,0.95)]"
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/mughal_door_left.png"
                alt="शाही कपाट बायाँ"
                className="w-full h-full object-fill select-none pointer-events-none drop-shadow-[2px_0_5px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Right Massive Gilded Brass Door Leaf (दायाँ कपाट) */}
            <div
              ref={rightDoorRef}
              className="absolute top-0 bottom-0 right-0 w-1/2 z-10 shadow-[-15px_0_40px_rgba(0,0,0,0.95)]"
              style={{
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/mughal_door_right.png"
                alt="शाही कपाट दायाँ"
                className="w-full h-full object-fill select-none pointer-events-none drop-shadow-[-2px_0_5px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          {/* =========================================================================
              CENTER ROYAL MEDALLION / ACTION BADGE (दरवाज़ा खोलें • باب کھولئے)
              Positioned elegantly across the center of the massive doors
          ========================================================================= */}
          <div
            ref={emblemRef}
            className="absolute z-30 flex flex-col items-center justify-center pointer-events-auto"
            style={{
              left: '50%',
              top: '58%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-full min-w-[320px] max-w-[400px] p-4 sm:p-5 rounded-2xl bg-[#140D09]/95 border-2 border-[#C5A059]/65 shadow-[0_25px_65px_rgba(0,0,0,0.98),inset_0_2px_10px_rgba(197,160,89,0.3)] backdrop-blur-md text-center relative">
              {/* Ornate Brass Inlaid Corner Cartouches */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C5A059]" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C5A059]" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C5A059]" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C5A059]" />

              {/* Brand Title: NEEDLE in Polished Sterling Silver & FASHION in 24K Royal Gold */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="font-serif text-lg sm:text-2xl font-black uppercase tracking-[0.14em] text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(234,236,236,0.6)]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #A8A9AD, #FFFFFF, #EAECEC, #FFFFFF, #BBC2CC)',
                  }}
                >
                  NEEDLE
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C5A059] shadow-[0_0_6px_#C5A059]" />
                <span
                  className="font-serif text-lg sm:text-2xl font-black uppercase tracking-[0.14em] text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(197,160,89,0.6)]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #C5A059, #F5EDD6, #B38728, #FBF5B7, #7A5310)',
                  }}
                >
                  FASHION
                </span>
              </div>

              {/* Subtitle in Urdu & Hindi */}
              <p className="text-[9.5px] sm:text-[10.5px] text-[#D8CCA8] tracking-[0.2em] uppercase font-serif drop-shadow-sm mb-3.5 flex items-center justify-center gap-2">
                <span>शाही पोशाक एवं विरासत</span>
                <span className="text-[#C5A059]">•</span>
                <span>شاہی ملبوسات</span>
              </p>

              {/* Enter Button */}
              <button
                onClick={handleEnter}
                className="group relative px-7 sm:px-10 py-2.5 rounded-full text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#16110B] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[#FFF8D6] mx-auto cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, #C5A059, #F5EDD6, #C5A059, #DFCA9B)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2 font-serif">
                  <span>दरवाज़ा खोलें • باب کھولئے</span>
                  <span className="text-xs transition-transform group-hover:translate-x-1">⚜</span>
                </span>
              </button>

              <span className="block text-[8px] sm:text-[8.5px] text-[#A6977B] tracking-widest mt-1.5 uppercase">
                (Click the button or palace gates to enter)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Running Words along Bottom (Urdu & Hindi Marquee Reverse) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 overflow-hidden pointer-events-none py-2 bg-[#0D0907]/90 border-t border-[#C5A059]/30 backdrop-blur-sm">
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
