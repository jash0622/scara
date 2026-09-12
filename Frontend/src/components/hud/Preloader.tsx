'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/*
  SCARA Preloader — stroke-dashoffset geometric construction
  Sequence: EMPTY → S → C → A → R → A → TM → HOLD → EXIT

  C + A1 note:
  The original SVG has C and A1 as ONE compound polygon (x:94–198).
  We render it as TWO separate <path> elements, each with a <clipPath>
  that uses ONLY the SVG `width` attribute (no CSS style.width) so
  GSAP `attr:{width}` works correctly.
*/

function polyToPath(points: string): string {
  const pairs = points.trim().split(/\s+/);
  const coords: string[] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    coords.push(`${pairs[i]},${pairs[i + 1]}`);
  }
  return `M ${coords.join(' L ')} Z`;
}

const RAW = {
  S:   '89.2 218.8 36.6 218.8 36.6 208.6 78.8 208.6 78.8 205 71.9 198.2 51.6 198.1 36.6 183.3 36.6 176.7 46.8 166.6 89.3 166.6 89.3 176.9 50.3 176.9 50.3 180.4 57.8 187.9 78.2 187.8 89.2 198.8 89.2 218.8',
  CA1: '187.6 176.8 178.1 176.9 157 197.8 146.8 197.8 146.7 204 131.8 218.9 94.1 218.9 94 177 104.4 166.7 136.5 166.7 136.5 177 104.4 177 104.5 198.4 94.2 208.7 125.5 208.7 136.4 197.8 146.7 197.8 146.7 191.5 171.8 166.6 187.9 166.5 187.9 176.6 187.9 176.8 198.2 176.8 198.2 218.8 187.9 218.8 187.8 208.6 155.9 208.6 155.9 218.8 145.5 218.8 145.5 208.5 155.9 198.2 187.9 198.2 187.9 177 187.6 176.8',
  R:   '235.1 204 235 197.6 245.3 197.6 245.3 176.9 213.3 176.9 213.3 218.8 202.9 218.8 202.9 176.9 213.3 166.6 245.4 166.6 255.7 176.9 255.7 197.6 245.4 197.7 256.4 208.6 256.4 218.8 250.1 218.9 235.1 204',
  A2:  '303.3 176.9 293.7 176.9 272.7 197.8 262.3 197.8 262.3 191.6 287.5 166.6 303.4 166.6 303.4 176.7 303.6 176.9 313.2 176.9 313.2 218.8 303.4 218.8 303.4 208.7 271.5 208.7 271.5 218.8 261.1 218.8 261.1 208.7 271.5 198.4 303.4 198.4 303.4 176.9 303.3 176.9',
};

const PATHS = {
  S:   polyToPath(RAW.S),
  CA1: polyToPath(RAW.CA1),
  R:   polyToPath(RAW.R),
  A2:  polyToPath(RAW.A2),
};

// SVG coordinate bounds — used for clip rects
// C  : x 94  → 147  (width 53)
// A1 : x 147 → 199  (width 52)
// Both: y 166.5, height 52.4
const CLIP = {
  y: 166.5, h: 52.4,
  C_x: 94,  C_w: 53,
  A_x: 147, A_w: 52,
};

const T = {
  START:    0.20,
  S_END:    0.90,
  C_END:    1.55,
  A1_END:   2.20,
  R_END:    2.90,
  A2_END:   3.55,
  HOLD_END: 4.60,
};

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [shutterStarted, setShutterStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Fill refs
  const pathSRef   = useRef<SVGPathElement>(null);
  const pathCRef   = useRef<SVGPathElement>(null);
  const pathA1Ref  = useRef<SVGPathElement>(null);
  const pathRRef   = useRef<SVGPathElement>(null);
  const pathA2Ref  = useRef<SVGPathElement>(null);

  // Stroke overlay refs
  const strokeSRef  = useRef<SVGPathElement>(null);
  const strokeRRef  = useRef<SVGPathElement>(null);
  const strokeA2Ref = useRef<SVGPathElement>(null);

  // ClipRect refs — GSAP animates the SVG `width` attribute directly
  const clipCRef  = useRef<SVGRectElement>(null);
  const clipA1Ref = useRef<SVGRectElement>(null);

  // TM refs
  const tmCircleRef = useRef<SVGCircleElement>(null);
  const tmTRef      = useRef<SVGPolygonElement>(null);
  const tmMRef      = useRef<SVGPolygonElement>(null);

  // Construction line refs — one group per letter
  const clineS   = useRef<SVGGElement>(null);
  const clineC   = useRef<SVGGElement>(null);
  const clineA1  = useRef<SVGGElement>(null);
  const clineR   = useRef<SVGGElement>(null);
  const clineA2  = useRef<SVGGElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      [pathSRef, pathCRef, pathA1Ref, pathRRef, pathA2Ref].forEach(r => {
        if (r.current) r.current.style.opacity = '1';
      });
      if (clipCRef.current)  clipCRef.current.setAttribute('width', String(CLIP.C_w));
      if (clipA1Ref.current) clipA1Ref.current.setAttribute('width', String(CLIP.A_w));
      if (tmCircleRef.current) tmCircleRef.current.style.opacity = '1';
      if (tmTRef.current)      tmTRef.current.style.opacity = '1';
      if (tmMRef.current)      tmMRef.current.style.opacity = '1';
      const t1 = setTimeout(() => setShutterStarted(true), 800);
      const t2 = setTimeout(() => { setIsDone(true); onComplete?.(); }, 1700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    const len = (el: SVGPathElement | null) => el ? el.getTotalLength() : 0;

    // ── Init: all hidden ────────────────────────────────────────────────

    // S, R, A2 fill — hidden
    [pathSRef, pathRRef, pathA2Ref].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity: 0 });
    });

    // C, A1 fill — hidden via opacity (clipRect controls reveal)
    if (pathCRef.current)  gsap.set(pathCRef.current,  { opacity: 1 });
    if (pathA1Ref.current) gsap.set(pathA1Ref.current, { opacity: 1 });

    // Reset clip rects to width=0 using setAttribute — most reliable for SVG
    if (clipCRef.current)  clipCRef.current.setAttribute('width', '0');
    if (clipA1Ref.current) clipA1Ref.current.setAttribute('width', '0');

    // TM hidden
    if (tmCircleRef.current) gsap.set(tmCircleRef.current, { opacity: 0 });
    if (tmTRef.current)      gsap.set(tmTRef.current,      { opacity: 0 });
    if (tmMRef.current)      gsap.set(tmMRef.current,      { opacity: 0 });

    // Stroke overlays — set dash but keep opacity 0 (JSX already sets opacity:0)
    [strokeSRef, strokeRRef, strokeA2Ref].forEach(r => {
      if (r.current) {
        const l = len(r.current);
        gsap.set(r.current, {
          strokeDasharray: l,
          strokeDashoffset: l,
          fill: 'none',
          stroke: '#000000',
          strokeWidth: 2,
        });
      }
    });

    // ── Timeline ────────────────────────────────────────────────────────
    const tl = gsap.timeline();
    tlRef.current = tl;

    // Stroke-draw helper for S, R, A2
    const buildStrokeLetter = (
      strokeEl: SVGPathElement | null,
      fillEl: SVGPathElement | null,
      start: number,
      end: number,
    ) => {
      if (!strokeEl || !fillEl) return;
      const dur  = end - start;
      const draw = dur * 0.78;
      const lock = dur * 0.22;
      const l = len(strokeEl);
      tl
        .set(strokeEl,  { strokeDasharray: l, strokeDashoffset: l, opacity: 1 }, start)
        .to(strokeEl,   { strokeDashoffset: 0, duration: draw, ease: 'expo.inOut' }, start)
        .to(fillEl,     { opacity: 1, duration: draw * 0.55, ease: 'power2.out' }, start + draw * 0.38)
        .to(strokeEl,   { opacity: 0, duration: lock * 0.35, ease: 'power3.in' }, start + draw + lock * 0.05)
        .set(fillEl,    { opacity: 1 }, end);
    };

    // ClipRect-expand helper for C and A1
    // Uses GSAP attr plugin to animate SVG attribute `width` directly
    const buildClipLetter = (
      clipRectEl: SVGRectElement | null,
      targetW: number,
      start: number,
      end: number,
    ) => {
      if (!clipRectEl) return;
      const draw = (end - start) * 0.82;
      tl.to(clipRectEl, {
        attr: { width: targetW },
        duration: draw,
        ease: 'expo.inOut',
      }, start);
    };

    // ── Construction-line helper ────────────────────────────────────────
    // Each letter group has several <line> elements.
    // They all draw in together just before the letter, then fade after fill.
    const animateConstructionLines = (
      groupEl: SVGGElement | null,
      letterStart: number,
      letterEnd: number,
    ) => {
      if (!groupEl) return;
      const lines = Array.from(groupEl.querySelectorAll('line'));
      // Init: lines hidden via strokeDashoffset = full length, group opacity 0
      lines.forEach((line) => {
        const length = Math.hypot(
          (line.x2.baseVal.value - line.x1.baseVal.value),
          (line.y2.baseVal.value - line.y1.baseVal.value),
        );
        gsap.set(line, {
          strokeDasharray: length || 100,
          strokeDashoffset: length || 100,
        });
      });
      // Group stays opacity:0 until we animate it in
      gsap.set(groupEl, { opacity: 0 });

      const drawDur  = (letterEnd - letterStart) * 0.55;
      const fadeDur  = 0.30;
      const fadeAt   = letterEnd - 0.05;
      const lineStart = Math.max(0, letterStart - drawDur * 0.6);

      tl
        // Fade group to a subtle opacity (not full 1) so lines look delicate
        .to(groupEl, { opacity: 0.30, duration: 0.12, ease: 'power2.out' }, lineStart)
        .to(lines, {
          strokeDashoffset: 0,
          duration: drawDur,
          stagger: 0.04,
          ease: 'expo.inOut',
        }, lineStart)
        .to(groupEl, {
          opacity: 0,
          duration: fadeDur,
          ease: 'power2.in',
        }, fadeAt);
    };

    // ── Sequence ────────────────────────────────────────────────────────
    animateConstructionLines(clineS.current,  T.START, T.S_END);
    buildStrokeLetter(strokeSRef.current,  pathSRef.current,  T.START,  T.S_END);

    animateConstructionLines(clineC.current,  T.S_END, T.C_END);
    buildClipLetter(clipCRef.current,   CLIP.C_w, T.S_END,  T.C_END);

    animateConstructionLines(clineA1.current, T.C_END, T.A1_END);
    buildClipLetter(clipA1Ref.current,  CLIP.A_w, T.C_END,  T.A1_END);

    animateConstructionLines(clineR.current,  T.A1_END, T.R_END);
    buildStrokeLetter(strokeRRef.current,  pathRRef.current,  T.A1_END, T.R_END);

    animateConstructionLines(clineA2.current, T.R_END, T.A2_END);
    buildStrokeLetter(strokeA2Ref.current, pathA2Ref.current, T.R_END,  T.A2_END);

    // TM
    tl.to(tmCircleRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' }, T.A2_END)
      .to(tmTRef.current,      { opacity: 1, duration: 0.20, ease: 'power2.out' }, T.A2_END + 0.15)
      .to(tmMRef.current,      { opacity: 1, duration: 0.20, ease: 'power2.out' }, T.A2_END + 0.25);

    // Exit
    tl.call(() => setShutterStarted(true), [], T.HOLD_END);
    tl.call(() => { setIsDone(true); onComplete?.(); }, [], T.HOLD_END + 1.15);

    return () => { tl.kill(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[999999] select-none pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#C3ED00' }}
      initial={{ y: '0%', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
      animate={
        shutterStarted
          ? { y: '-100%', borderBottomLeftRadius: '120px', borderBottomRightRadius: '120px' }
          : { y: '0%',   borderBottomLeftRadius: '0px',   borderBottomRightRadius: '0px' }
      }
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="relative w-full max-w-[820px] px-8 sm:px-12 md:px-16"
        animate={
          shutterStarted
            ? { opacity: 0, y: -40, scale: 1.03 }
            : { opacity: 1, y: 0,   scale: 1 }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg
          viewBox="28 154 318 72"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          style={{ overflow: 'visible' }}
          aria-label="SCARA logo"
          role="img"
        >
          <defs>
            {/*
              clipC  : reveals C  (x=94,  width 0→53)
              clipA1 : reveals A1 (x=147, width 0→52)
              IMPORTANT: NO style.width on the rect — only SVG `width` attribute.
              GSAP attr:{width} animates the attribute, not CSS property.
            */}
            <clipPath id="clipC">
              <rect
                ref={clipCRef}
                x={CLIP.C_x}
                y={CLIP.y}
                width="0"
                height={CLIP.h}
              />
            </clipPath>
            <clipPath id="clipA1">
              <rect
                ref={clipA1Ref}
                x={CLIP.A_x}
                y={CLIP.y}
                width="0"
                height={CLIP.h}
              />
            </clipPath>
          </defs>

          {/*
            ════════════════════════════════════════════
            CONSTRUCTION LINES — blueprint geometry guides
            Draw before each letter, fade after fill.
            stroke="#000" opacity controlled by GSAP.
            All lines start with strokeDashoffset = full length (hidden).
            ════════════════════════════════════════════
          */}

          {/* S construction lines — center: ~62, midY ~193 */}
          <g ref={clineS} stroke="#000000" strokeWidth="0.5" fill="none" opacity="0">
            {/* Horizontal mid line */}
            <line x1="28"  y1="192.7" x2="100" y2="192.7" />
            {/* Vertical center */}
            <line x1="62.9" y1="154" x2="62.9" y2="230" />
            {/* Top-right diagonal bracket */}
            <line x1="78"  y1="158" x2="96"  y2="175" />
            {/* Bottom-left diagonal bracket */}
            <line x1="30"  y1="210" x2="48"  y2="227" />
            {/* Top horizontal rule */}
            <line x1="28"  y1="166.6" x2="100" y2="166.6" />
            {/* Bottom horizontal rule */}
            <line x1="28"  y1="218.8" x2="100" y2="218.8" />
          </g>

          {/* C construction lines — center: ~120, midY ~193 */}
          <g ref={clineC} stroke="#000000" strokeWidth="0.5" fill="none" opacity="0">
            <line x1="86"  y1="192.7" x2="158" y2="192.7" />
            <line x1="120" y1="154"   x2="120" y2="230" />
            <line x1="133" y1="158"   x2="151" y2="175" />
            <line x1="88"  y1="210"   x2="106" y2="227" />
            <line x1="86"  y1="166.6" x2="158" y2="166.6" />
            <line x1="86"  y1="218.8" x2="158" y2="218.8" />
          </g>

          {/* A1 construction lines — center: ~173, midY ~193 */}
          <g ref={clineA1} stroke="#000000" strokeWidth="0.5" fill="none" opacity="0">
            <line x1="140" y1="192.7" x2="210" y2="192.7" />
            <line x1="173" y1="154"   x2="173" y2="230" />
            <line x1="186" y1="158"   x2="204" y2="175" />
            <line x1="141" y1="210"   x2="159" y2="227" />
            <line x1="140" y1="166.6" x2="210" y2="166.6" />
            <line x1="140" y1="218.8" x2="210" y2="218.8" />
          </g>

          {/* R construction lines — center: ~229, midY ~193 */}
          <g ref={clineR} stroke="#000000" strokeWidth="0.5" fill="none" opacity="0">
            <line x1="195" y1="192.7" x2="268" y2="192.7" />
            <line x1="229" y1="154"   x2="229" y2="230" />
            <line x1="244" y1="158"   x2="262" y2="175" />
            <line x1="197" y1="210"   x2="215" y2="227" />
            <line x1="195" y1="166.6" x2="268" y2="166.6" />
            <line x1="195" y1="218.8" x2="268" y2="218.8" />
            {/* Extra diagonal for R's leg — matches reference */}
            <line x1="245" y1="197.6" x2="262" y2="218.8" />
          </g>

          {/* A2 construction lines — center: ~287, midY ~193 */}
          <g ref={clineA2} stroke="#000000" strokeWidth="0.5" fill="none" opacity="0">
            <line x1="253" y1="192.7" x2="322" y2="192.7" />
            <line x1="287" y1="154"   x2="287" y2="230" />
            <line x1="302" y1="158"   x2="320" y2="175" />
            <line x1="255" y1="210"   x2="273" y2="227" />
            <line x1="253" y1="166.6" x2="322" y2="166.6" />
            <line x1="253" y1="218.8" x2="322" y2="218.8" />
          </g>
          <path
            ref={pathSRef}
            d={PATHS.S}
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />

          {/* C half of compound polygon — clipC expands to reveal */}
          <path
            ref={pathCRef}
            d={PATHS.CA1}
            fill="#000000"
            stroke="none"
            clipPath="url(#clipC)"
          />

          {/* A1 half of compound polygon — clipA1 expands to reveal */}
          <path
            ref={pathA1Ref}
            d={PATHS.CA1}
            fill="#000000"
            stroke="none"
            clipPath="url(#clipA1)"
          />

          {/* R — opacity 0 initially */}
          <path
            ref={pathRRef}
            d={PATHS.R}
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />

          {/* A2 — opacity 0 initially */}
          <path
            ref={pathA2Ref}
            d={PATHS.A2}
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />

          {/* Stroke overlays — opacity 0, GSAP sets to 1 when drawing starts */}
          <path
            ref={strokeSRef}
            d={PATHS.S}
            fill="none"
            stroke="#000000"
            strokeWidth={2}
            style={{ opacity: 0 }}
          />
          <path
            ref={strokeRRef}
            d={PATHS.R}
            fill="none"
            stroke="#000000"
            strokeWidth={2}
            style={{ opacity: 0 }}
          />
          <path
            ref={strokeA2Ref}
            d={PATHS.A2}
            fill="none"
            stroke="#000000"
            strokeWidth={2}
            style={{ opacity: 0 }}
          />

          {/* TM — all hidden initially */}
          <circle
            ref={tmCircleRef}
            cx="327.2" cy="163.4" r="9.4"
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />
          <polygon
            ref={tmTRef}
            points="324 166.7 322.6 166.7 322.6 161.8 320.7 161.8 320.7 160.6 325.9 160.6 325.9 161.8 324 161.8 324 166.7"
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />
          <polygon
            ref={tmMRef}
            points="332.2 166.6 332.1 163.3 330.1 166.4 328 163.3 328 166.7 326.7 166.7 326.7 160.6 328 160.6 330.1 164.4 332.3 160.6 333.5 160.6 333.5 166.7 332.2 166.6"
            fill="#000000"
            stroke="none"
            style={{ opacity: 0 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
