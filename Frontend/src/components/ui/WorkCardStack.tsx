'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { type CaseStudy } from '@/data/scaraData';
import YearOdometer from '@/components/ui/YearOdometer';

interface WorkCardStackProps {
  items: CaseStudy[];
  onCardClick: (cs: CaseStudy) => void;
}

const NAVIGATION_COOLDOWN = 400;
const CARD_W = 340;
const CARD_H = 420;

// ─────────────────────────────────────────────────────────────────────────────
// WorkHeading
// Phase 1 (0.0–0.8s): white fill sweeps into SELECTED letter by letter
// Phase 2 (0.8–1.2s): white fill sweeps back out of SELECTED
// Phase 3 (1.2–2.0s): lime fill sweeps into WORK. letter by letter — stays
// ─────────────────────────────────────────────────────────────────────────────
function WorkHeading({ fontSize }: { fontSize: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0=idle 1=sel-in 2=sel-out 3=work-in

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          // Phase 1: white sweeps into SELECTED
          setPhase(1);
          // Phase 2: white sweeps out after full sweep finishes (~0+8*80ms+200ms hold)
          setTimeout(() => setPhase(2), 900);
          // Phase 3: lime sweeps into WORK. after white gone (~900+300ms)
          setTimeout(() => setPhase(3), 1250);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseFont: React.CSSProperties = {
    fontFamily: 'var(--font-anton), Anton, sans-serif',
    fontSize,
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const SEL = 'SELECTED';
  const WRK = 'WORK.';
  const CHAR_DUR = 0.18; // seconds per char sweep

  return (
    <div ref={ref} style={{ overflow: 'visible' }}>

      {/* ── SELECTED ── */}
      <div style={{ ...baseFont, display: 'flex', marginBottom: '0.12em' }}>
        {SEL.split('').map((ch, i) => {
          // Clip state for the white overlay
          let whiteClip = 'inset(0 100% 0 0)'; // hidden
          let whiteTransition = 'none';

          if (phase === 1) {
            // Sweep in left→right
            whiteClip = 'inset(0 0% 0 0)';
            whiteTransition = `clip-path ${CHAR_DUR}s cubic-bezier(.4,0,.2,1) ${i * 0.08}s`;
          } else if (phase === 2) {
            // Sweep out left→right (exits from left side)
            whiteClip = 'inset(0 100% 0 0)';
            whiteTransition = `clip-path ${CHAR_DUR}s cubic-bezier(.4,0,.2,1) ${i * 0.05}s`;
          }

          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                color: 'transparent',
                WebkitTextStroke: '1.5px #C3ED00',
                overflow: 'hidden',
              }}
            >
              {ch}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  color: '#ffffff',
                  WebkitTextStroke: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  clipPath: whiteClip,
                  transition: whiteTransition,
                  fontFamily: 'var(--font-anton), Anton, sans-serif',
                }}
              >
                {ch}
              </span>
            </span>
          );
        })}
      </div>

      {/* ── WORK. ── */}
      <div style={{ ...baseFont, display: 'flex' }}>
        {WRK.split('').map((ch, i) => {
          const limeClip = phase === 3 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
          const limeTransition = phase === 3
            ? `clip-path ${CHAR_DUR + 0.06}s cubic-bezier(.4,0,.2,1) ${i * 0.09}s`
            : 'none';

          return (
            <span
              key={i}
              style={{ position: 'relative', display: 'inline-block', color: 'transparent' }}
            >
              {/* Spacer */}
              <span style={{ visibility: 'hidden' }}>{ch}</span>
              {/* Lime fill */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  color: '#C3ED00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  clipPath: limeClip,
                  transition: limeTransition,
                  fontFamily: 'var(--font-anton), Anton, sans-serif',
                }}
              >
                {ch}
              </span>
            </span>
          );
        })}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function WorkCardStack({ items, onCardClick }: WorkCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastNavTime = useRef(0);
  const count = items.length;

  const navigate = useCallback((dir: number) => {
    const now = Date.now();
    if (now - lastNavTime.current < NAVIGATION_COOLDOWN) return;
    lastNavTime.current = now;
    setCurrentIndex((prev) => {
      if (dir > 0) return prev === count - 1 ? 0 : prev + 1;
      return prev === 0 ? count - 1 : prev - 1;
    });
  }, [count]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50) navigate(1);
    else if (info.offset.y > 50) navigate(-1);
  };

  const getCardProps = (index: number) => {
    let diff = index - currentIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    if (diff === 0)  return { y: 0,    scale: 1,    opacity: 1,    zIndex: 10 };
    if (diff === -1) return { y: -175, scale: 0.84, opacity: 0.52, zIndex: 7  };
    if (diff === -2) return { y: -310, scale: 0.72, opacity: 0.22, zIndex: 4  };
    if (diff === 1)  return { y: 175,  scale: 0.84, opacity: 0.52, zIndex: 7  };
    if (diff === 2)  return { y: 310,  scale: 0.72, opacity: 0.22, zIndex: 4  };
    return { y: diff > 0 ? 460 : -460, scale: 0.6, opacity: 0, zIndex: 0 };
  };

  const isVisible = (index: number) => {
    let diff = index - currentIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return Math.abs(diff) <= 2;
  };

  const current = items[currentIndex];

  return (
    <div className="relative w-full" style={{ touchAction: 'pan-y' }}>
      <div className="relative w-full" style={{ height: '700px' }}>

        {/* LEFT: heading + odometer */}
        <div
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-8 select-none z-20"
          style={{ width: '35%', overflow: 'visible' }}
        >
          <div style={{ overflow: 'visible', marginTop: '80px' }}>
            <div
              className="font-sub font-bold uppercase mb-4"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#C3ED00' }}
            >
              // FLAGSHIP CAMPAIGNS & IPS
            </div>
            <WorkHeading fontSize="clamp(64px, 8.5vw, 132px)" />
          </div>

          <div className="flex justify-end" style={{ paddingRight: '96px' }}>
            <YearOdometer year={Number(current?.year) || 2025} />
          </div>
        </div>

        {/* CARD STACK */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: '40%', right: '0', perspective: '1200px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{ width: `${CARD_W}px`, height: `${CARD_H}px` }}
            >
              {items.map((cs, index) => {
                if (!isVisible(index)) return null;
                const props = getCardProps(index);
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={cs.id}
                    className={`absolute ${isCurrent ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                    animate={{
                      y: props.y,
                      scale: props.scale,
                      opacity: props.opacity,
                      zIndex: props.zIndex,
                    }}
                    transition={{
                      y:       { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
                      scale:   { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { type: 'tween', duration: 0.28, ease: 'easeOut' },
                    }}
                    drag={isCurrent ? 'y' : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.15}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    style={{
                      zIndex: props.zIndex,
                      touchAction: isCurrent ? 'none' : 'pan-y',
                      willChange: 'transform',
                    }}
                    onClick={() => {
                      if (!isCurrent) {
                        navigate(index > currentIndex ? 1 : -1);
                      } else {
                        onCardClick(cs);
                      }
                    }}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl"
                      style={{
                        width: `${CARD_W}px`,
                        height: `${CARD_H}px`,
                        boxShadow: isCurrent
                          ? '0 32px 64px -16px rgba(0,0,0,0.85), 0 0 0 1px rgba(195,237,0,0.12)'
                          : '0 12px 32px -8px rgba(0,0,0,0.6)',
                      }}
                    >
                      <img
                        src={cs.heroImage}
                        alt={cs.title}
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover select-none"
                      />
                      <div
                        className="absolute inset-x-0 bottom-0"
                        style={{
                          height: '85%',
                          background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.65) 55%, transparent 100%)',
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-black/90 px-2.5 py-0.5 font-sub text-[10px] font-bold text-scara-green border border-scara-green/40 uppercase tracking-wider">
                          {cs.year} / {cs.market}
                        </span>
                      </div>
                      {cs.isFeaturedIP && (
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 rounded-full bg-scara-green px-2 py-0.5 font-sub text-[9px] font-bold text-scara-black uppercase">
                            <Sparkles className="h-2.5 w-2.5" /> IP
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 px-4" style={{ bottom: '28px' }}>
                        <h3 className="font-heading text-lg font-extrabold uppercase text-white leading-tight line-clamp-2">
                          {cs.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Counter + arrows — static */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-row items-center gap-3 select-none z-20"
              style={{ left: `calc(50% + ${CARD_W / 2 + 20}px)` }}
            >
              <div className="flex flex-col items-center pointer-events-none">
                <span className="font-heading text-3xl font-light text-white tabular-nums leading-none">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <div className="h-px w-5 my-1.5" style={{ background: 'rgba(255,255,255,0.2)' }} />
                <span className="font-sub text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {String(count).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black"
                  aria-label="Previous project"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black"
                  aria-label="Next project"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
