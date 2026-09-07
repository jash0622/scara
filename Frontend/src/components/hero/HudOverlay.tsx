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
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.65; const cy = H * 0.50; const radius = H * 0.30;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180,220,0,0.13)';
      ctx.lineWidth   = 0.9;
      ctx.stroke();
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
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      <HudCanvas />

      <div style={{
        position: 'absolute', left: '45%', top: '6%', bottom: '6%', width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(195,237,0,0.20) 20%, rgba(195,237,0,0.20) 80%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', left: '82%', top: '8%', bottom: '40%', width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(195,237,0,0.15) 25%, rgba(195,237,0,0.15) 75%, transparent 100%)',
      }} />

      <Plus x="46%"  y="14%" size={10} color="rgba(255,255,255,0.22)" />
      <Plus x="57%"  y="32%" size={10} color="rgba(195,237,0,0.30)" />
      <Plus x="78%"  y="18%" size={11} color="rgba(255,255,255,0.18)" />
      <Plus x="83%"  y="62%" size={9}  color="rgba(195,237,0,0.22)" />
      <Plus x="92%"  y="75%" size={8}  color="rgba(255,255,255,0.14)" />
      <Plus x="36%"  y="52%" size={8}  color="rgba(255,255,255,0.12)" />
      <Plus x="91%"  y="42%" size={8}  color="rgba(195,237,0,0.18)" />

      <div style={{
        position: 'absolute', top: 0, bottom: 0, width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(195,237,0,0.12) 45%, rgba(195,237,0,0.18) 50%, rgba(195,237,0,0.12) 55%, transparent 100%)',
        animation: 'hudScan 8s linear infinite',
      }} />

      <style>{`
        @keyframes hudScan {
          0%   { left: -1px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
