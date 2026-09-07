'use client';
/**
 * HudOverlay.tsx
 *
 * Accepts optional stateRef. When provided, a RAF loop reads
 * s.hudOpacity every frame and applies it to the wrapper — zero React
 * re-renders, fully composited by the browser.
 *
 * Stage 5 (85–100%): hudOpacity fades 1→0 driven by scroll controller.
 */

import { useEffect, useRef } from 'react';
import type { HandSceneState } from './ParticleHandScene';

function HudCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ─────────────────────────────────────────────────────────────────
      // REFERENCE ANALYSIS (pixel-measured from the reference image):
      //
      //  Circle center : ~x:67%  y:48%
      //  Circle radius : ~H * 0.365  (fits neatly on screen, right edge clips slightly)
      //  Glow origin   : ~x:63%  y:48%  (slightly left of circle center)
      //
      //  Box / rect    : top ~y:8%, bottom ~y:88%, left ~x:44%, right ~x:88%
      //                  (4 thin lines forming one rectangle around the composition)
      //
      //  Diagonal line : from ~(28%,15%) → ~(63%,48%)  thin lime, fades in/out
      //                  with 3 "node" spots along it where it brightens + thickens
      //
      //  Vertical bar  : x~46%, y:14%→44%  bright lime (tallish)
      //  Vertical bar  : x~92%, y:42%→68%  dimmer
      //
      //  Small squares : scattered top-right area
      //  Bottom line   : y~88% full-width faint
      // ─────────────────────────────────────────────────────────────────

      const circleCX = W * 0.672;
      const circleCY = H * 0.480;
      const radius   = H * 0.365;

      // ── 1. STRUCTURAL LINES — removed (box/L-shape removed per user request)
      // No horizontal or vertical construction lines.

      // ── 2. CIRCLE with 2 thick glow segments — NW and SE ────────────
      // As shown in the hand-drawn reference: only 2 spots on the circle
      // are thick/bright — top-left (north-west) and bottom-right (south-east).
      // Rest of the ring is thin and dim.

      // Base thin ring
      const ringGrad = ctx.createLinearGradient(
        circleCX - radius, circleCY - radius,
        circleCX + radius, circleCY + radius,
      );
      ringGrad.addColorStop(0.0,  'rgba(180,220,0,0.06)');
      ringGrad.addColorStop(0.35, 'rgba(195,237,0,0.35)');
      ringGrad.addColorStop(0.65, 'rgba(195,237,0,0.30)');
      ringGrad.addColorStop(1.0,  'rgba(180,220,0,0.07)');

      ctx.beginPath();
      ctx.arc(circleCX, circleCY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth   = 1.15;
      ctx.stroke();

      // NW segment: angle = -Math.PI * 0.75  (225° from east = top-left of circle)
      // SE segment: angle = Math.PI * 0.25   (45° from east = bottom-right)
      // arcSpan controls how wide each thick segment is
      const thickNodes = [
        { angle: -Math.PI * 0.78, span: 0.38 },  // NW — top-left
        { angle:  Math.PI * 0.22, span: 0.38 },  // SE — bottom-right
      ];

      thickNodes.forEach(({ angle, span }) => {
        const nx = circleCX + Math.cos(angle) * radius;
        const ny = circleCY + Math.sin(angle) * radius;

        // Outer glow arc (widest, most transparent)
        ctx.beginPath();
        ctx.arc(circleCX, circleCY, radius, angle - span * 1.4, angle + span * 1.4);
        ctx.strokeStyle = 'rgba(195,237,0,0.12)';
        ctx.lineWidth = 7;
        ctx.stroke();

        // Mid glow arc
        ctx.beginPath();
        ctx.arc(circleCX, circleCY, radius, angle - span, angle + span);
        ctx.strokeStyle = 'rgba(205,245,0,0.40)';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Inner bright arc (sharpest)
        ctx.beginPath();
        ctx.arc(circleCX, circleCY, radius, angle - span * 0.5, angle + span * 0.5);
        ctx.strokeStyle = 'rgba(215,255,0,0.80)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tiny radial glow dot at the center of the node
        const glowR = ctx.createRadialGradient(nx, ny, 0, nx, ny, 6);
        glowR.addColorStop(0.0, 'rgba(230,255,100,0.50)');
        glowR.addColorStop(1.0, 'rgba(195,237,0,0.0)');
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fillStyle = glowR;
        ctx.fill();
      });

      // ── 3. DIAGONAL LINE — plain thin line, no nodes ─────────────────
      // Reference: one straight thin line from upper-left to glow center.
      // No thick spots on the line itself — thickness only on the circle.
      const lx0 = W * 0.280;
      const ly0 = H * 0.148;
      const lx1 = W * 0.630;
      const ly1 = H * 0.482;

      {
        const g = ctx.createLinearGradient(lx0, ly0, lx1, ly1);
        g.addColorStop(0.0,  'rgba(195,237,0,0.0)');
        g.addColorStop(0.12, 'rgba(195,237,0,0.28)');
        g.addColorStop(0.85, 'rgba(195,237,0,0.55)');
        g.addColorStop(1.0,  'rgba(195,237,0,0.68)');
        ctx.beginPath();
        ctx.moveTo(lx0, ly0);
        ctx.lineTo(lx1, ly1);
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // ── 4. VERTICAL LIGHT BAR — left (bright) ────────────────────────
      {
        const bx = W * 0.460;
        const by0 = H * 0.140;
        const by1 = H * 0.440;
        const g = ctx.createLinearGradient(0, by0, 0, by1);
        g.addColorStop(0.0,  'rgba(205,240,0,0.0)');
        g.addColorStop(0.15, 'rgba(215,250,0,0.55)');
        g.addColorStop(0.85, 'rgba(215,250,0,0.55)');
        g.addColorStop(1.0,  'rgba(205,240,0,0.0)');
        ctx.beginPath();
        ctx.moveTo(bx, by0);
        ctx.lineTo(bx, by1);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── 5. VERTICAL LIGHT BAR — right edge (dim) ─────────────────────
      {
        const bx = W * 0.921;
        const by0 = H * 0.420;
        const by1 = H * 0.680;
        const g = ctx.createLinearGradient(0, by0, 0, by1);
        g.addColorStop(0.0,  'rgba(195,237,0,0.0)');
        g.addColorStop(0.2,  'rgba(195,237,0,0.35)');
        g.addColorStop(0.8,  'rgba(195,237,0,0.35)');
        g.addColorStop(1.0,  'rgba(195,237,0,0.0)');
        ctx.beginPath();
        ctx.moveTo(bx, by0);
        ctx.lineTo(bx, by1);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      // ── 6. SMALL YELLOW SQUARES ──────────────────────────────────────
      // Reference has ~6 scattered glowing squares, mostly top-right area.
      const squares = [
        { x: W * 0.686, y: H * 0.052, s: 5,  a: 0.92 },  // bright top
        { x: W * 0.726, y: H * 0.105, s: 3,  a: 0.60 },  // smaller right of it
        { x: W * 0.630, y: H * 0.446, s: 6,  a: 0.95 },  // large left-of-glow
        { x: W * 0.896, y: H * 0.780, s: 5,  a: 0.80 },  // bottom-right
        { x: W * 0.812, y: H * 0.348, s: 3,  a: 0.42 },  // small mid-right
        { x: W * 0.635, y: H * 0.588, s: 3,  a: 0.38 },  // faint below glow
      ];
      squares.forEach((sq) => {
        ctx.fillStyle = `rgba(210,245,0,${sq.a})`;
        ctx.fillRect(sq.x - sq.s / 2, sq.y - sq.s / 2, sq.s, sq.s);
      });

      // ── 7. SMALL SCATTERED DOTS (lime) ───────────────────────────────
      // A few tiny dot glints in the upper-right region near the circle top.
      const dots = [
        { x: W * 0.760, y: H * 0.040, r: 1.5, a: 0.55 },
        { x: W * 0.810, y: H * 0.090, r: 1.2, a: 0.42 },
        { x: W * 0.870, y: H * 0.060, r: 1.0, a: 0.38 },
        { x: W * 0.948, y: H * 0.120, r: 1.5, a: 0.48 },
        { x: W * 0.970, y: H * 0.200, r: 1.2, a: 0.35 },
        { x: W * 0.955, y: H * 0.290, r: 1.8, a: 0.50 },
        { x: W * 0.920, y: H * 0.360, r: 1.0, a: 0.30 },
      ];
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,240,0,${d.a})`;
        ctx.fill();
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function Plus({ x, y, size = 10, color = 'rgba(255,255,255,0.20)' }: {
  x: string; y: string; size?: number; color?: string;
}) {
  return (
    <svg
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)' }}
      width={size} height={size} viewBox="0 0 10 10"
      className="pointer-events-none"
    >
      <line x1="5" y1="0" x2="5" y2="10" stroke={color} strokeWidth="0.9" />
      <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth="0.9" />
    </svg>
  );
}

interface Props {
  stateRef?: React.RefObject<HandSceneState>;
}

export default function HudOverlay({ stateRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // RAF loop: read s.hudOpacity every frame → set wrapper opacity.
  // No React state updates. Default opacity=1 until stateRef drives it.
  useEffect(() => {
    if (!stateRef) return;
    let raf = 0;
    const tick = () => {
      const wrap = wrapRef.current;
      if (wrap) {
        const op = stateRef.current?.hudOpacity ?? 1;
        wrap.style.opacity = String(Math.max(0, Math.min(1, op)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <HudCanvas />

      {/* Plus / crosshair markers — exact positions from reference:
          - White "+" upper-left area ~(40%, 21%)
          - Lime "+" just left of glow center ~(53%, 46%)
          - White "+" right of glow ~(80%, 47%)
          - Lime "+" lower-center ~(53%, 84%)
          - White "+" far bottom-left ~(4%, 76%) and ~(5%, 85%)
      */}
      <Plus x="40%"  y="21%" size={12} color="rgba(255,255,255,0.60)" />
      <Plus x="53%"  y="46%" size={11} color="rgba(195,237,0,0.55)" />
      <Plus x="80%"  y="47%" size={12} color="rgba(255,255,255,0.35)" />
      <Plus x="53%"  y="84%" size={10} color="rgba(195,237,0,0.40)" />
      <Plus x="4%"   y="76%" size={11} color="rgba(195,237,0,0.65)" />
      <Plus x="5%"   y="85%" size={11} color="rgba(255,255,255,0.40)" />
    </div>
  );
}
