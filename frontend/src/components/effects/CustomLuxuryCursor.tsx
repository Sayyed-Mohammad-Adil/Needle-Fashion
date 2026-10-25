'use client';

import React, { useEffect, useState } from 'react';

/**
 * CustomLuxuryCursor
 * High-performance smooth custom cursor follower with Rolex/Haute Couture gold & shiny silver styling.
 * Disables automatically on touch devices to ensure optimal mobile performance.
 */
export default function CustomLuxuryCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Detect touch-only devices
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over any clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, label, [tabindex="0"], .clickable, .glass-card, .card, [onClick]')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Smooth Lerp animation loop for the outer luxury ring
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setFollowerPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Luxury Chronometer Ring Follower */}
      <div
        className="fixed top-0 left-0 rounded-full transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 0.75 : isHovered ? 1.6 : 1
          })`,
          width: '32px',
          height: '32px',
          border: isHovered
            ? '1.5px solid #FCF6BA'
            : '1px solid rgba(191, 149, 63, 0.55)',
          boxShadow: isHovered
            ? '0 0 16px rgba(252, 246, 186, 0.6), inset 0 0 8px rgba(234, 236, 236, 0.4)'
            : '0 0 10px rgba(191, 149, 63, 0.25)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(252, 246, 186, 0.15) 0%, rgba(234, 236, 236, 0.05) 50%, transparent 80%)'
            : 'transparent',
          transition: 'transform 0.12s ease-out, border 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        {/* Subtle Shiny Silver Micro Chronometer Accents on Hover */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#EAECEC] shadow-[0_0_6px_#EAECEC]" />
          </div>
        )}
      </div>

      {/* Tiny Center Precision Gold Core Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#BF953F] will-change-transform transition-opacity duration-150"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          boxShadow: '0 0 6px #FCF6BA, 0 0 2px #EAECEC',
          opacity: isHovered ? 0 : 0.9,
        }}
      />
    </div>
  );
}
