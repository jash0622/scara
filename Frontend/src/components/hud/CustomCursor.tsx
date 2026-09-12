'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Direct DOM manipulation via RAF — zero lag, no React re-render on move
  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let rafId: number;

    const update = () => {
      const outer = outerRef.current;
      const dot = dotRef.current;
      // Outer ring follows cursor instantly
      if (outer) {
        outer.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      // Inner dot lags with lerp — trails in the direction of movement
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      if (dot) {
        dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const label = target.getAttribute('data-cursor') || target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const interactive = !!(target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a'));
      if (label) { setCursorText(label); setIsHovered(true); }
      else if (interactive) { setCursorText(''); setIsHovered(true); }
      else { setCursorText(''); setIsHovered(false); }
    };

    const onLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []); // eslint-disable-line

  const size = cursorText ? 80 : isHovered ? 48 : 32;
  const offset = size / 2;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9990] hidden md:block"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-scara-green bg-scara-green/10"
        style={{
          width: size,
          height: size,
          marginLeft: -offset,
          marginTop: -offset,
          transition: 'width 0.18s ease, height 0.18s ease, margin 0.18s ease',
          willChange: 'transform',
        }}
      >
        {cursorText && (
          <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-scara-black bg-scara-green px-2 py-0.5 rounded-full shadow-lg select-none">
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full bg-scara-green shadow-[0_0_8px_#C3ED00]"
        style={{
          width: 6,
          height: 6,
          opacity: cursorText ? 0 : 1,
          transition: 'opacity 0.15s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
