'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import { SCARA_TEAM } from '@/data/scaraData';
import CursorGrid, { CursorGridRef } from '@/components/ui/CursorGrid';

export default function CircularTeamGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorGridRef = useRef<CursorGridRef>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragScrollStart, setDragScrollStart] = useState(0);

  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const cardWidth = 270;
  const cardGap = 24;
  const itemTotalWidth = cardWidth + cardGap;
  const totalSetWidth = SCARA_TEAM.length * itemTotalWidth;

  const updateCardTransforms = useCallback(() => {
    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
    setScrollPos(currentScrollRef.current);

    if (Math.abs(targetScrollRef.current - currentScrollRef.current) > 0.05) {
      animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
    } else {
      animationFrameRef.current = null;
    }
  }, []);

  const scrollTo = (newPos: number) => {
    targetScrollRef.current = newPos;
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
    }
  };

  const handlePrev = () => {
    scrollTo(targetScrollRef.current - itemTotalWidth);
  };

  const handleNext = () => {
    scrollTo(targetScrollRef.current + itemTotalWidth);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragScrollStart(targetScrollRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && cursorGridRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorGridRef.current.energize(x, y);
    }
    if (!isDragging) return;
    const deltaX = startX - e.clientX;
    scrollTo(dragScrollStart + deltaX * 1.3);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragScrollStart(targetScrollRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && cursorGridRef.current && e.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      cursorGridRef.current.energize(x, y);
    }
    if (!isDragging) return;
    const deltaX = startX - e.touches[0].clientX;
    scrollTo(dragScrollStart + deltaX * 1.3);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      scrollTo(targetScrollRef.current + e.deltaX * 1.2);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 w-full select-none" onMouseLeave={handleMouseUp}>
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative w-full h-[480px] sm:h-[540px] overflow-hidden rounded-2xl border border-scara-grey/20 bg-scara-card-dark/50 backdrop-blur-md flex items-center justify-center cursor-grab active:cursor-grabbing isolate"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}
      >
        {/* CursorGrid Background — z:-1 so it sits behind ALL cards always */}
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
            // Infinite Modulo Wrapping Math
            const rawX = i * itemTotalWidth - scrollPos;
            const itemX =
              (((rawX + totalSetWidth / 2) % totalSetWidth) + totalSetWidth) % totalSetWidth -
              totalSetWidth / 2;

            const rotationY = Math.max(-38, Math.min(38, itemX * 0.08));
            const translateY = Math.min(50, Math.pow(Math.abs(itemX), 2) * 0.00012);
            const translateZ = -Math.min(180, Math.abs(itemX) * 0.32);
            const scale = Math.max(0.78, 1 - Math.abs(itemX) * 0.0005);
            const opacity = Math.max(0.25, 1 - Math.abs(itemX) * 0.0012);

            return (
              <div
                key={member.name}
                className="absolute w-[250px] sm:w-[280px] rounded-2xl border border-scara-grey/25 bg-[#0d0f0a] p-4 shadow-2xl transition-colors duration-300 hover:border-scara-green/60 hover:shadow-[0_0_25px_rgba(195,237,0,0.2)] group/card"
                style={{
                  transform: `translate3d(${itemX}px, ${translateY}px, ${translateZ}px) rotateY(${rotationY}deg) scale(${scale})`,
                  opacity,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                  zIndex: Math.round(100 - Math.abs(itemX) * 0.1),
                }}
                onMouseMove={(e) => {
                  // Propagate mouse position to CursorGrid even when over a card
                  if (containerRef.current && cursorGridRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    cursorGridRef.current.energize(e.clientX - rect.left, e.clientY - rect.top);
                  }
                }}
              >
                {/* Full-Color Photo Container */}
                <div className="relative h-[240px] sm:h-[280px] w-full overflow-hidden rounded-xl bg-scara-black mb-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scara-card-dark via-transparent to-transparent opacity-60" />

                  {/* LinkedIn Floating Icon Badge */}
                  <a
                    href={member.linkedinUrl || 'https://linkedin.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-scara-green/40 bg-scara-black/80 text-scara-green backdrop-blur-md transition-all duration-300 hover:bg-scara-green hover:text-scara-black hover:scale-110 shadow-xl"
                    title={`Connect with ${member.name} on LinkedIn`}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>

                {/* Member Details directly underneath the photo */}
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
