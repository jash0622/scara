'use client';

/**
 * ArchitectureCards — "fan out from behind" scroll reveal.
 *
 * On entry only the CENTER card (Scara Live) is visible. As the user scrolls,
 * the LEFT card (Scara Gaming) and RIGHT card (Scara Tech) emerge from behind
 * the center card — rotating and sliding outward into their real grid slots.
 *
 * Fully scroll-scrubbed (reverses on scroll-up). Center card never moves.
 */

import { useEffect, useRef } from 'react';
import { Gamepad2, Tv, Cpu } from 'lucide-react';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth  = (t: number) => t * t * (3 - 2 * t);

export default function ArchitectureCards() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root  = rootRef.current;
    const left  = leftRef.current;
    const right = rightRef.current;
    if (!root || !left || !right) return;

    const apply = (p: number) => {
      // Left card reveals first (0.0–0.62), right card slightly after (0.18–0.85)
      const lp = smooth(clamp01((p - 0.00) / 0.62));
      const rp = smooth(clamp01((p - 0.18) / 0.67));

      // Left: starts behind center (x=0, rotated CW, scaled down, hidden),
      // ends at its real slot (x=0 relative to grid, rotate 0, scale 1, visible).
      // We animate a translateX that STARTS at +full-column (stacked on center)
      // and ENDS at 0 (real position). Column offset ≈ 105% of its own width.
      const lx = (1 - lp) * 108;      // % of own width, from stacked → home
      const lrot = (1 - lp) * -16;    // rotate in from -16°
      const lscale = 0.72 + lp * 0.28;
      left.style.transform = `translateX(${lx}%) rotate(${lrot}deg) scale(${lscale})`;
      left.style.opacity = String(lp);
      left.style.zIndex = lp < 0.9 ? '1' : '3';

      const rx = (1 - rp) * -108;     // right card slides left→home from behind
      const rrot = (1 - rp) * 16;
      const rscale = 0.72 + rp * 0.28;
      right.style.transform = `translateX(${rx}%) rotate(${rrot}deg) scale(${rscale})`;
      right.style.opacity = String(rp);
      right.style.zIndex = rp < 0.9 ? '1' : '3';
    };

    apply(0);

    // Manual scroll-position tracking via RAF + getBoundingClientRect.
    // getBoundingClientRect reflects Lenis's CSS transform, so this is
    // completely immune to any ScrollTrigger/Lenis sync issues.
    //
    // Progress 0→1 maps to the block's top travelling from 85% of the
    // viewport height (just entered from bottom) up to 30% (settled near top).
    let rafId = 0;
    const tick = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh * 0.85;   // block top here → progress 0
      const endY   = vh * 0.30;   // block top here → progress 1
      const p = clamp01((startY - rect.top) / (startY - endY));
      apply(p);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={rootRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Scara Gaming — LEFT (emerges from behind center) */}
      <div
        ref={leftRef}
        className="relative overflow-hidden rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 space-y-6 group hover:border-scara-green transition-colors will-change-transform"
        style={{ transformOrigin: 'center center', transform: 'translateX(108%) rotate(-16deg) scale(0.72)', opacity: 0 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black">
          <Gamepad2 className="h-6 w-6" />
        </div>
        <div>
          <span className="inline-block rounded-full bg-scara-green/20 px-3 py-1 font-sub text-[10px] font-bold text-scara-green uppercase mb-3">
            DIGITAL-FIRST FANDOM
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Gaming
          </h4>
        </div>
        <p className="font-body text-xs text-scara-grey leading-relaxed">
          Creators, communities, gaming platforms, always-on fandom building, publisher drops, and native in-game brand integrations.
        </p>
      </div>

      {/* Scara Live — CENTER (always visible, never moves) */}
      <div
        className="relative overflow-hidden rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 space-y-6 group hover:border-scara-green transition-colors z-[2]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black">
          <Tv className="h-6 w-6" />
        </div>
        <div>
          <span className="inline-block rounded-full bg-scara-green/20 px-3 py-1 font-sub text-[10px] font-bold text-scara-green uppercase mb-3">
            PHYSICAL-FIRST FANDOM
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Live
          </h4>
        </div>
        <p className="font-body text-xs text-scara-grey leading-relaxed">
          Live sports broadcast execution, arena IPs, music &amp; culture festivals, ticketed physical experiences at scale.
        </p>
      </div>

      {/* Scara Tech — RIGHT (emerges from behind center) */}
      <div
        ref={rightRef}
        className="relative overflow-hidden rounded-2xl border border-scara-green/40 bg-scara-olive-900/60 p-8 space-y-6 group hover:border-scara-green transition-colors will-change-transform"
        style={{ transformOrigin: 'center center', transform: 'translateX(-108%) rotate(16deg) scale(0.72)', opacity: 0 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black">
          <Cpu className="h-6 w-6" />
        </div>
        <div>
          <span className="inline-block rounded-full bg-scara-green px-3 py-1 font-sub text-[10px] font-bold text-scara-black uppercase mb-3">
            SHARED INFRASTRUCTURE
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Tech
          </h4>
        </div>
        <p className="font-body text-xs text-scara-white/90 leading-relaxed">
          Unified campaign planning, audience performance analytics, creator &amp; vendor logistics engine delivering measurable ROI.
        </p>
      </div>
    </div>
  );
}
