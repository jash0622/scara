'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SCARA_TEAM } from '@/data/scaraData';
import CursorGrid, { CursorGridRef } from '@/components/ui/CursorGrid';

// LinkedIn SVG icon (white on black)
function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="26" height="26" aria-hidden="true">
      <rect width="72" height="72" rx="10" fill="#1a1a1a" />
      <circle cx="19" cy="19" r="5.5" fill="white" />
      <rect x="14" y="28" width="10" height="30" fill="white" />
      <path d="M36 28h9v4h.1c1.3-2.3 4.3-4.8 8.9-4.8C63.5 27.2 66 33 66 40.5V58h-10V42.3c0-3.7-.1-8.5-5.2-8.5-5.2 0-6 4.1-6 8.2V58H36V28z" fill="white" />
    </svg>
  );
}

export default function CircularTeamGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorGridRef = useRef<CursorGridRef>(null);
  const [scrollPos, setScrollPos] = useState(0);

  // Drag state — all in refs to avoid stale closure issues
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);
  const didMoveRef = useRef(false);     // true if pointer moved > threshold
  const isDragActiveRef = useRef(false); // true during active pointer-captured drag

  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Responsive card width — narrower on mobile so fewer cards are needed to fill
  const [cardWidth, setCardWidth] = useState(270);

  useEffect(() => {
    function updateCardWidth() {
      const vw = window.innerWidth;
      if (vw < 480)       setCardWidth(200);  // xs phones
      else if (vw < 768)  setCardWidth(230);  // sm phones/tablets
      else                setCardWidth(270);  // desktop — unchanged
    }
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth, { passive: true });
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const cardGap = 24;
  const itemTotalWidth = cardWidth + cardGap;
  const totalSetWidth = SCARA_TEAM.length * itemTotalWidth;

  // ── Smooth scroll animation loop ─────────────────────────────────────────
  const updateCardTransforms = useCallback(() => {
    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.1;
    setScrollPos(currentScrollRef.current);

    if (Math.abs(targetScrollRef.current - currentScrollRef.current) > 0.05) {
      animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
    } else {
      currentScrollRef.current = targetScrollRef.current;
      setScrollPos(targetScrollRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const scrollTo = useCallback((newPos: number) => {
    targetScrollRef.current = newPos;
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
    }
  }, [updateCardTransforms]);

  // ── Snap to nearest card index ────────────────────────────────────────────
  const snapToNearest = useCallback((currentPos: number) => {
    const nearest = Math.round(currentPos / itemTotalWidth) * itemTotalWidth;
    scrollTo(nearest);
  }, [itemTotalWidth, scrollTo]);

  // ── Prev / Next buttons ───────────────────────────────────────────────────
  const handlePrev = () => {
    const snapped = Math.round(targetScrollRef.current / itemTotalWidth) * itemTotalWidth;
    scrollTo(snapped - itemTotalWidth);
  };

  const handleNext = () => {
    const snapped = Math.round(targetScrollRef.current / itemTotalWidth) * itemTotalWidth;
    scrollTo(snapped + itemTotalWidth);
  };

  // ── Pointer events on the container (mouse drag) ──────────────────────────
  // We use setPointerCapture so we keep receiving events even when the pointer
  // leaves the container mid-drag. This is the most reliable cross-browser approach.

  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore right-click / middle-click
    if (e.button !== 0) return;
    // If the click target is (or is inside) an <a> tag, do NOT start drag
    if ((e.target as HTMLElement).closest('a')) return;

    isDraggingRef.current = true;
    isDragActiveRef.current = false;
    didMoveRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollStartRef.current = targetScrollRef.current;

    // Capture so pointermove/pointerup fire on this element even outside bounds
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Update CursorGrid regardless of drag state
    if (containerRef.current && cursorGridRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      cursorGridRef.current.energize(e.clientX - rect.left, e.clientY - rect.top);
    }

    if (!isDraggingRef.current) return;

    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 4) {
      didMoveRef.current = true;
      isDragActiveRef.current = true;
    }

    if (isDragActiveRef.current) {
      scrollTo(dragScrollStartRef.current - delta * 1.3);
    }
  };

  const handleContainerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Release capture
    try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch (_) {}

    if (isDragActiveRef.current) {
      // Snap to nearest card
      snapToNearest(targetScrollRef.current);
    }
    isDragActiveRef.current = false;
    didMoveRef.current = false;
  };

  // ── Touch events ──────────────────────────────────────────────────────────
  const touchStartXRef = useRef(0);
  const touchScrollStartRef = useRef(0);
  const touchDidMoveRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchScrollStartRef.current = targetScrollRef.current;
    touchDidMoveRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && cursorGridRef.current && e.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      cursorGridRef.current.energize(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
    const delta = e.touches[0].clientX - touchStartXRef.current;
    if (Math.abs(delta) > 4) touchDidMoveRef.current = true;
    scrollTo(touchScrollStartRef.current - delta * 1.3);
  };

  const handleTouchEnd = () => {
    if (touchDidMoveRef.current) {
      snapToNearest(targetScrollRef.current);
    }
    touchDidMoveRef.current = false;
  };

  // ── Horizontal wheel — native listener so we can register as passive:false ──
  // React's synthetic onWheel is always non-passive (blocks compositor).
  // We attach directly to the DOM with passive:false ONLY when needed, and
  // only preventDefault when it's a horizontal swipe so vertical page scroll
  // is never interrupted.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        scrollTo(targetScrollRef.current + e.deltaX * 1.2);
      }
      // vertical scroll: do nothing — let it bubble to Lenis/browser
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scrollTo]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 w-full">
      {/* Controls Bar */}
      <div className="flex items-center justify-end font-sub text-xs text-scara-grey uppercase">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-scara-grey/30 bg-scara-black text-scara-white hover:border-scara-green hover:text-scara-green transition-all shadow-lg"
            aria-label="Previous Team Member"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-scara-grey/30 bg-scara-black text-scara-white hover:border-scara-green hover:text-scara-green transition-all shadow-lg"
            aria-label="Next Team Member"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Curved Circular Gallery Container */}
      <div
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        onPointerMove={handleContainerPointerMove}
        onPointerUp={handleContainerPointerUp}
        onPointerCancel={handleContainerPointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] overflow-hidden rounded-2xl border border-scara-grey/20 bg-scara-card-dark/50 backdrop-blur-md flex items-center justify-center cursor-grab active:cursor-grabbing isolate"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 50%', touchAction: 'pan-y' }}
      >
        {/* CursorGrid Background */}
        <div className="absolute inset-0" style={{ zIndex: -1, pointerEvents: 'none' }}>
          <CursorGrid
            ref={cursorGridRef}
            cellSize={40}
            color="#C3ED00"
            radius={320}
            falloff="smooth"
            holdTime={500}
            fadeDuration={800}
            lineWidth={1}
            maxOpacity={0.12}
            fillOpacity={0.03}
            gridOpacity={0.04}
            cellRadius={0}
            clickPulse={false}
            pulseSpeed={700}
          />
        </div>

        <div
          className="relative flex items-center justify-center w-full h-full"
          style={{ transformStyle: 'preserve-3d', zIndex: 1 }}
        >
          {SCARA_TEAM.map((member, i) => {
            // Infinite modulo wrapping
            const rawX = i * itemTotalWidth - scrollPos;
            const itemX =
              (((rawX + totalSetWidth / 2) % totalSetWidth) + totalSetWidth) % totalSetWidth -
              totalSetWidth / 2;

            const rotationY = Math.max(-38, Math.min(38, itemX * 0.08));
            const translateY = Math.min(50, Math.pow(Math.abs(itemX), 2) * 0.00012);
            const translateZ = -Math.min(180, Math.abs(itemX) * 0.32);
            const scale = Math.max(0.78, 1 - Math.abs(itemX) * 0.0005);
            const opacity = Math.max(0.25, 1 - Math.abs(itemX) * 0.0012);

            // Cards that are far away (nearly invisible) don't need pointer events
            const isVisible = opacity > 0.35;

            return (
              <div
                key={member.name}
                className="absolute w-[200px] sm:w-[230px] md:w-[280px] rounded-2xl border border-scara-grey/25 bg-[#0d0f0a] p-4 shadow-2xl transition-colors duration-300 hover:border-scara-green/60 hover:shadow-[0_0_25px_rgba(195,237,0,0.2)] group/card"
                style={{
                  transform: `translate3d(${itemX}px, ${translateY}px, ${translateZ}px) rotateY(${rotationY}deg) scale(${scale})`,
                  opacity,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                  zIndex: Math.max(1, Math.round(100 - Math.abs(itemX) * 0.1)),
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onPointerMove={(e) => {
                  if (containerRef.current && cursorGridRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    cursorGridRef.current.energize(e.clientX - rect.left, e.clientY - rect.top);
                  }
                }}
              >
                {/* Photo */}
                <div className="relative h-[200px] sm:h-[240px] md:h-[280px] w-full overflow-hidden rounded-xl bg-scara-black mb-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scara-card-dark via-transparent to-transparent opacity-60" />

                  {/* LinkedIn badge */}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      title={`Connect with ${member.name} on LinkedIn`}
                      className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-[8px] transition-all duration-200 hover:scale-110 shadow-lg"
                      style={{
                        // Sit above everything in this card's stacking context
                        zIndex: 30,
                        // Must be 'auto' so clicks actually reach this element
                        pointerEvents: 'auto',
                        // Prevent the drag handler from treating this click as a drag start
                        userSelect: 'none',
                      }}
                      // Stop drag from starting when clicking the badge
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                </div>

                {/* Member details */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="font-heading text-base sm:text-lg font-black uppercase text-scara-white">
                    {member.name}
                  </h4>
                  <div className="inline-block font-sub text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-scara-green bg-scara-green/10 border border-scara-green/20 rounded-md px-2.5 py-0.5">
                    {member.role}
                  </div>
                  {member.bio && (
                    <p className="font-body text-[11px] text-scara-grey leading-relaxed line-clamp-2 pt-1 border-t border-scara-grey/15 mt-2">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
