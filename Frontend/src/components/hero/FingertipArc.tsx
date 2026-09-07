'use client';
/**
 * FingertipArc.tsx — thin flickering electric arc between fingertips.
 * Full-viewport transparent canvas. No box, no border.
 * mixBlendMode: screen so it blends naturally with the dark background.
 */

import { useRef, useEffect } from 'react';
import type { HandSceneState } from './ParticleHandScene';

interface Props {
  stateRef: React.RefObject<HandSceneState>;
}

export default function FingertipArc({ stateRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let frame = 0;
    let seed = 0xc0ffee42;

    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      return ((seed >>> 0) / 0xffffffff) * 2 - 1; // -1 to +1
    };

    const SEGS = 8;
    type Pt = { x: number; y: number };
    let pts: Pt[] = [];

    const buildArc = (x0: number, y0: number, x1: number, y1: number) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      // Perpendicular unit vector
      const px = -dy / len;
      const py =  dx / len;
      const newPts: Pt[] = [];
      for (let i = 0; i <= SEGS; i++) {
        const t   = i / SEGS;
        const bx  = x0 + dx * t;
        const by  = y0 + dy * t;
        // Small jag — only 4% of arc length, zero at endpoints
        const amp = Math.sin(t * Math.PI) * len * 0.04;
        const off = rand() * amp;
        newPts.push({ x: bx + px * off, y: by + py * off });
      }
      pts = newPts;
    };

    const tick = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W   = canvas.offsetWidth;
      const H   = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) { raf = requestAnimationFrame(tick); return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const s     = stateRef.current;
      const glow  = s?.tipGlow ?? 0;
      const alpha = Math.max(0, Math.min(1, (glow - 0.62) / 0.20));

      if (alpha > 0.01) {
        // Fingertip positions in viewport % — dial these to match your hands
        // lower thumb tip  → upper index fingertip
        const x0 = W * 0.484;
        const y0 = H * 0.540;
        const x1 = W * 0.497;
        const y1 = H * 0.370;

        frame++;
        if (frame % 3 === 0 || pts.length === 0) buildArc(x0, y0, x1, y1);
        if (pts.length >= 2) {
          // flicker multiplier — rapid brightness variation
          const flicker = 0.55 + 0.45 * Math.abs(Math.sin(Date.now() * 0.025));

          // Pass 1 — wide soft outer glow
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgba(160,220,0,${0.12 * alpha * flicker})`;
          ctx.lineWidth   = 9;
          ctx.lineCap     = 'round';
          ctx.lineJoin    = 'round';
          ctx.stroke();

          // Pass 2 — mid glow
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgba(195,237,0,${0.35 * alpha * flicker})`;
          ctx.lineWidth   = 3;
          ctx.stroke();

          // Pass 3 — bright core
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgba(230,255,100,${0.90 * alpha * flicker})`;
          ctx.lineWidth   = 1;
          ctx.stroke();

          // Tiny glint at both endpoints
          [[x0, y0], [x1, y1]].forEach(([ex, ey]) => {
            const rg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
            rg.addColorStop(0, `rgba(255,255,200,${0.75 * alpha})`);
            rg.addColorStop(1, 'rgba(195,237,0,0)');
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.fillStyle = rg;
            ctx.fill();
          });
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex:       0,           // behind hands
        mixBlendMode: 'screen',    // blends naturally — no box artifact
      }}
      aria-hidden="true"
    />
  );
}
