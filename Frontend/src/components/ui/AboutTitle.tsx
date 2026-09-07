'use client';

/**
 * AboutTitle — pinned, scroll-linked cinematic narrative block.
 *
 * The block PINS to the viewport center and the entire choreography is driven
 * by scroll progress (scrub), so it reverses cleanly on scroll-up and never
 * breaks between sections.
 *
 * Timeline (progress 0→1 across the pinned scroll distance):
 *   0.00–0.12  Title pops up from below into screen center (translateY + fade)
 *   0.12–0.34  Line 1 fill wipes left→right
 *   0.34–0.56  Line 2 fill wipes left→right
 *   0.50–0.68  Line 1 fill wipes back OUT (empty stroke) — only line 2 filled
 *   0.68–0.90  Paragraph reveals word-by-word (fade + de-blur, rising)
 *   0.90–1.00  Hold — everything stays centered until pin releases
 *
 * The whole block stays centered the entire time (it's pinned), so the
 * content below never appears until the pin releases.
 *
 * Fully responsive: font size scales via viewBox + clamp width.
 */

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BBox { x: number; y: number; width: number; height: number; }

// Desktop: 2 long lines. Mobile: 4 short lines (each fills the narrow width
// → text renders much bigger). Group A = fill-then-empty. Group B = fill-and-stay.
const DESKTOP_GROUP_A = ['CULTURE TODAY IS EXPERIENCED DIGITALLY'];
const DESKTOP_GROUP_B = ['BUT REMEMBERED PHYSICALLY'];
const MOBILE_GROUP_A  = ['CULTURE TODAY', 'IS EXPERIENCED', 'DIGITALLY'];
const MOBILE_GROUP_B  = ['BUT REMEMBERED PHYSICALLY'];

const FONT_SIZE = 84;
const STROKE_W  = 1.6;

interface LineProps {
  text: string;
  strokeColor: string;
  fillColor: string;
  wipeRef: React.RefObject<SVGRectElement>;
  isMobile?: boolean;
}

function TitleLine({ text, strokeColor, fillColor, wipeRef, isMobile = false }: LineProps) {
  const strokeRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<BBox | null>(null);
  const rawId = useId();
  const clipId = `at-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const fontStyle = useMemo(
    () => ({ fontSize: `${FONT_SIZE}px`, fontWeight: 900, letterSpacing: '-2px' }),
    []
  );

  useLayoutEffect(() => {
    const measure = () => {
      const node = strokeRef.current;
      if (!node) return;
      let bb: DOMRect;
      try { bb = node.getBBox(); } catch { return; }
      if (!bb || !bb.width) return;
      const pad = Math.max(STROKE_W, FONT_SIZE * 0.08);
      setBox({ x: bb.x - pad, y: bb.y - pad, width: bb.width + pad * 2, height: bb.height + pad * 2 });
    };
    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [text]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-FONT_SIZE} 1000 ${FONT_SIZE * 1.2}`;

  return (
    <svg
      className="block w-full"
      // Mobile: bigger per-line height (short lines fill width → large text).
      // Desktop: unchanged.
      style={{ height: isMobile ? 'clamp(44px, 13vw, 80px)' : 'clamp(34px, 7vw, 92px)' }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect ref={wipeRef} x={box ? box.x : 0} y={box ? box.y : 0} width="0" height={box ? box.height : 200} />
        </clipPath>
      </defs>
      <text
        ref={strokeRef}
        x="0" y="0"
        fill="none"
        stroke={strokeColor}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={fontStyle}
      >
        {text}
      </text>
      <text
        x="0" y="0"
        fill={fillColor}
        stroke="none"
        style={fontStyle}
        clipPath={`url(#${clipId})`}
      >
        {text}
      </text>
    </svg>
  );
}

interface Props {
  paragraph: string;
}

export default function AboutTitle({ paragraph }: Props) {
  const pinRef   = useRef<HTMLDivElement>(null);   // the tall scroll track
  const stageRef = useRef<HTMLDivElement>(null);   // the pinned centered stage
  const titleRef = useRef<HTMLDivElement>(null);
  const paraRef  = useRef<HTMLParagraphElement>(null);

  // Responsive line sets
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const groupA = isMobile ? MOBILE_GROUP_A : DESKTOP_GROUP_A;
  const groupB = isMobile ? MOBILE_GROUP_B : DESKTOP_GROUP_B;

  // One wipe ref per line (group A first, then group B)
  const wipeARefs = useRef<React.RefObject<SVGRectElement>[]>([]);
  const wipeBRefs = useRef<React.RefObject<SVGRectElement>[]>([]);
  if (wipeARefs.current.length !== groupA.length) {
    wipeARefs.current = groupA.map(() => ({ current: null }));
  }
  if (wipeBRefs.current.length !== groupB.length) {
    wipeBRefs.current = groupB.map(() => ({ current: null }));
  }

  const words = useMemo(() => paragraph.split(/(\s+)/), [paragraph]);

  useEffect(() => {
    const pin   = pinRef.current;
    const stage = stageRef.current;
    const title = titleRef.current;
    const para  = paraRef.current;
    if (!pin || !stage || !title || !para) return;

    const wordEls = Array.from(para.querySelectorAll<HTMLElement>('.at-word'));

    const svgUnit = (r: React.RefObject<SVGRectElement>, which: 'w' | 'x') => {
      const rect = r.current;
      const svg = rect?.ownerSVGElement;
      if (!svg) return 0;
      return which === 'w' ? svg.viewBox.baseVal.width : svg.viewBox.baseVal.x;
    };
    const setWipe = (r: React.RefObject<SVGRectElement>, frac: number) => {
      if (!r.current) return;
      r.current.setAttribute('x', String(svgUnit(r, 'x')));
      r.current.setAttribute('width', String(svgUnit(r, 'w') * frac));
    };

    // Pre-pin entry fade: fade the stage in quickly as the section rises,
    // so it's visible well before the pin engages — minimises any black gap.
    const entry = ScrollTrigger.create({
      trigger: pin,
      start: 'top bottom',      // section top enters from viewport bottom
      end:   'top 55%',         // fully visible by the time it's just past mid — fast
      scrub: 1,
      onUpdate: (self) => {
        stage.style.opacity = String(self.progress);
      },
    });

    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end:   '+=220%',      // scroll distance the block stays pinned
      pin:   stage,
      scrub: 1,
      anticipatePin: 1,     // smooths the pin engage/release — no jerk
      pinReparent: false,
      onUpdate: (self) => {
        const p = self.progress;

        // ── Title pop-up (0–0.12): rise from below + fade in ────────
        const rise  = Math.min(1, p / 0.12);
        const riseE = rise * rise * (3 - 2 * rise);
        const ty    = (1 - riseE) * 70;
        title.style.transform = `translateY(${ty}px)`;
        title.style.opacity   = String(Math.min(1, p / 0.10));

        // ── Group A fill: in 0.12–0.34, OUT 0.50–0.68 (fill then empty) ─
        const aIn  = Math.max(0, Math.min(1, (p - 0.12) / 0.22));
        const aOut = Math.max(0, Math.min(1, (p - 0.50) / 0.18));
        const aFrac = Math.max(0, aIn - aOut);
        // ── Group B fill: in 0.34–0.56, then STAYS ──────────────────────
        const bFrac = Math.max(0, Math.min(1, (p - 0.34) / 0.22));

        // Stagger the fill across the lines within each group
        const nA = wipeARefs.current.length;
        wipeARefs.current.forEach((r, i) => {
          const s0 = (i / Math.max(nA, 1)) * 0.5;
          const local = Math.max(0, Math.min(1, (aFrac - s0) / (1 - s0 || 1)));
          setWipe(r, nA > 1 ? local : aFrac);
        });
        const nB = wipeBRefs.current.length;
        wipeBRefs.current.forEach((r, i) => {
          const s0 = (i / Math.max(nB, 1)) * 0.5;
          const local = Math.max(0, Math.min(1, (bFrac - s0) / (1 - s0 || 1)));
          setWipe(r, nB > 1 ? local : bFrac);
        });

        // ── Paragraph reveal (0.68–0.92): word-by-word fade + deblur ─
        const pStart = 0.68, pEnd = 0.92;
        const pProg = Math.max(0, Math.min(1, (p - pStart) / (pEnd - pStart)));
        const n = wordEls.length;
        wordEls.forEach((el, i) => {
          const wStart = (i / n) * 0.7;             // stagger across 70% of window
          const wLocal = Math.max(0, Math.min(1, (pProg - wStart) / 0.3));
          const e = wLocal * wLocal * (3 - 2 * wLocal);
          el.style.opacity = String(0.12 + e * 0.88);
          el.style.filter  = `blur(${(1 - e) * 6}px)`;
        });
        // Paragraph container fades in overall
        para.style.opacity = String(Math.min(1, Math.max(0, (p - 0.64) / 0.1)));
      },
    });

    return () => { st.kill(); entry.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    // Tall scroll track — the pinned stage stays centered while we scroll through it
    <div ref={pinRef} className="relative w-full">
      <div
        ref={stageRef}
        className="relative flex min-h-screen w-full items-center justify-center px-6 md:px-12"
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        {/* Centered stack — title is the vertical anchor, paragraph sits below */}
        <div className="relative flex w-full max-w-5xl flex-col items-center">
          {/* Title — group A (fill→empty) then group B (fill→stay) */}
          <div
            ref={titleRef}
            className="w-full flex flex-col items-center will-change-transform"
            style={{ opacity: 0 }}
          >
            {groupA.map((line, i) => (
              <TitleLine
                key={`a-${line}`}
                text={line}
                strokeColor="#C3ED00"
                fillColor="#FFFFFF"
                wipeRef={wipeARefs.current[i]}
                isMobile={isMobile}
              />
            ))}
            {groupB.map((line, i) => (
              <TitleLine
                key={`b-${line}`}
                text={line}
                strokeColor="#C3ED00"
                fillColor="#C3ED00"
                wipeRef={wipeBRefs.current[i]}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/*
           * Paragraph — absolutely positioned below the title so it does NOT
           * shift the title off-center. Reveals after the title choreography.
           */}
          <p
            ref={paraRef}
            className="absolute top-full mt-8 left-1/2 -translate-x-1/2 w-full max-w-3xl text-center font-body text-base md:text-lg leading-relaxed text-scara-white/85"
            style={{ opacity: 0 }}
          >
            {words.map((w, i) =>
              w.match(/^\s+$/) ? (
                w
              ) : (
                <span key={i} className="at-word inline-block" style={{ opacity: 0.12, filter: 'blur(6px)' }}>
                  {w}
                </span>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
