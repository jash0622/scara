'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { type CaseStudy } from '@/lib/types';
import YearOdometer from '@/components/ui/YearOdometer';

interface WorkCardStackProps {
  items: CaseStudy[];
  onCardClick: (cs: CaseStudy) => void;
}

const NAVIGATION_COOLDOWN = 400;

// Desktop card dimensions — unchanged
const CARD_W = 340;
const CARD_H = 420;

// Mobile card: fills viewport width with 24px margin each side
// Capped at 320px so it never exceeds desktop card on medium screens
const MOBILE_CARD_MAX = 320;

// ─────────────────────────────────────────────────────────────────────────────
// WorkHeading — identical animation, font-size adapted per breakpoint
// ─────────────────────────────────────────────────────────────────────────────
function WorkHeading({ fontSize, allowWrap }: { fontSize: string; allowWrap?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          setPhase(1);
          setTimeout(() => setPhase(2), 900);
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
    // Allow wrapping on mobile so text never overflows narrow columns
    whiteSpace: allowWrap ? 'normal' : 'nowrap',
    userSelect: 'none',
  };

  const SEL = 'SELECTED';
  const WRK = 'WORK.';
  const CHAR_DUR = 0.18;

  return (
    <div ref={ref} style={{ overflow: 'visible' }}>
      {/* ── SELECTED ── */}
      <div style={{ ...baseFont, display: 'flex', flexWrap: allowWrap ? 'wrap' : 'nowrap', marginBottom: '0.12em' }}>
        {SEL.split('').map((ch, i) => {
          let whiteClip = 'inset(0 100% 0 0)';
          let whiteTransition = 'none';
          if (phase === 1) {
            whiteClip = 'inset(0 0% 0 0)';
            whiteTransition = `clip-path ${CHAR_DUR}s cubic-bezier(.4,0,.2,1) ${i * 0.08}s`;
          } else if (phase === 2) {
            whiteClip = 'inset(0 100% 0 0)';
            whiteTransition = `clip-path ${CHAR_DUR}s cubic-bezier(.4,0,.2,1) ${i * 0.05}s`;
          }
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', color: 'transparent', WebkitTextStroke: '1.5px #C3ED00', overflow: 'hidden' }}>
              {ch}
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, color: '#ffffff', WebkitTextStroke: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: whiteClip, transition: whiteTransition, fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
                {ch}
              </span>
            </span>
          );
        })}
      </div>

      {/* ── WORK. ── */}
      <div style={{ ...baseFont, display: 'flex', flexWrap: allowWrap ? 'wrap' : 'nowrap' }}>
        {WRK.split('').map((ch, i) => {
          const limeClip = phase === 3 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
          const limeTransition = phase === 3 ? `clip-path ${CHAR_DUR + 0.06}s cubic-bezier(.4,0,.2,1) ${i * 0.09}s` : 'none';
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', color: 'transparent' }}>
              <span style={{ visibility: 'hidden' }}>{ch}</span>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, color: '#C3ED00', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: limeClip, transition: limeTransition, fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
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

  // Swipe left/right on mobile to navigate
  const handleSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60) navigate(1);
    else if (info.offset.x > 60) navigate(-1);
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

  const getMobileCardProps = (index: number) => {
    let diff = index - currentIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    // On mobile: only current card fully visible, adjacent cards peeking
    if (diff === 0)  return { x: 0,    scale: 1,    opacity: 1,    zIndex: 10 };
    if (diff === -1) return { x: -260, scale: 0.88, opacity: 0.45, zIndex: 7  };
    if (diff === 1)  return { x: 260,  scale: 0.88, opacity: 0.45, zIndex: 7  };
    return { x: diff > 0 ? 400 : -400, scale: 0.7, opacity: 0, zIndex: 0 };
  };

  const isVisible = (index: number) => {
    let diff = index - currentIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return Math.abs(diff) <= 2;
  };

  const current = items[currentIndex];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md = < 768px)
          Stacked: heading top → card centered → counter + arrows bottom
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full">
        {/* Eyebrow */}
        <div className="font-sub font-bold uppercase mb-3 text-left" style={{ fontSize: '9px', letterSpacing: '0.22em', color: '#C3ED00' }}>
          // FLAGSHIP CAMPAIGNS & IPS
        </div>

        {/* Heading — left aligned, overflow visible so S/C not cut */}
        <div className="flex justify-start mb-3 overflow-visible" style={{ marginLeft: '-2px' }}>
          <WorkHeading fontSize="clamp(44px, 13vw, 68px)" allowWrap />
        </div>

        {/* Year odometer — left aligned, smaller, tighter to heading */}
        <div className="flex justify-start mb-2 pl-0 -mt-3">
          <div style={{ transform: 'scale(0.6)', transformOrigin: 'left center' }}>
            <YearOdometer year={Number(current?.year) || 2025} />
          </div>
        </div>
        </div>

        {/* Card area — full width, capped at MOBILE_CARD_MAX */}
        <div className="relative w-full overflow-hidden" style={{ height: `${MOBILE_CARD_MAX * 1.25}px` }}>
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{ width: `min(${MOBILE_CARD_MAX}px, calc(100vw - 48px))`, height: `${MOBILE_CARD_MAX * 1.25}px` }}
            >
              {items.map((cs, index) => {
                if (!isVisible(index)) return null;
                const props = getMobileCardProps(index);
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={cs.id}
                    className="absolute"
                    animate={{ x: props.x, scale: props.scale, opacity: props.opacity, zIndex: props.zIndex }}
                    transition={{ x: { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }, scale: { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }, opacity: { type: 'tween', duration: 0.28, ease: 'easeOut' } }}
                    drag={isCurrent ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    dragMomentum={false}
                    onDragEnd={handleSwipe}
                    style={{ zIndex: props.zIndex, touchAction: 'pan-y', willChange: 'transform', width: `min(${MOBILE_CARD_MAX}px, calc(100vw - 48px))`, height: `${MOBILE_CARD_MAX * 1.25}px` }}
                    onClick={() => { if (isCurrent) onCardClick(cs); else navigate(props.x > 0 ? -1 : 1); }}
                  >
                    <div className="relative overflow-hidden rounded-2xl w-full h-full" style={{ boxShadow: isCurrent ? '0 24px 48px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(195,237,0,0.12)' : '0 8px 24px -6px rgba(0,0,0,0.6)' }}>
                      <img src={cs.heroImage} alt={cs.title} draggable={false} className="absolute inset-0 w-full h-full object-cover select-none" />
                      <div className="absolute inset-x-0 bottom-0" style={{ height: '80%', background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.65) 55%, transparent 100%)' }} />
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
                      <div className="absolute inset-x-0 px-4" style={{ bottom: '24px' }}>
                        <h3 className="font-heading text-base font-extrabold uppercase text-white leading-tight line-clamp-2">
                          {cs.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counter + nav arrows */}
        <div className="flex items-center justify-center gap-6 mt-5">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black" aria-label="Previous project">
            <ChevronUp className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center pointer-events-none">
            <span className="font-heading text-2xl font-light text-white tabular-nums leading-none">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div className="h-px w-4 my-1" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span className="font-sub text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {String(count).padStart(2, '0')}
            </span>
          </div>
          <button onClick={() => navigate(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black" aria-label="Next project">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-center font-sub text-[10px] text-scara-grey/50 uppercase tracking-widest mt-3">
          Swipe to browse
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md = ≥ 768px)  — completely unchanged
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative w-full" style={{ touchAction: 'pan-y' }}>
        <div className="relative w-full" style={{ height: '700px' }}>

          {/* LEFT: heading + odometer */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-8 select-none z-20" style={{ width: '35%', overflow: 'visible' }}>
            <div style={{ overflow: 'visible', marginTop: '80px' }}>
              <div className="font-sub font-bold uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#C3ED00' }}>
                // FLAGSHIP CAMPAIGNS & IPS
              </div>
              <WorkHeading fontSize="clamp(64px, 8.5vw, 132px)" />
            </div>
            <div className="flex justify-end" style={{ paddingRight: '32px' }}>
              <YearOdometer year={Number(current?.year) || 2025} />
            </div>
          </div>

          {/* CARD STACK */}
          <div className="absolute top-0 bottom-0" style={{ left: '40%', right: '0', perspective: '1200px' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative flex items-center justify-center" style={{ width: `${CARD_W}px`, height: `${CARD_H}px` }}>
                {items.map((cs, index) => {
                  if (!isVisible(index)) return null;
                  const props = getCardProps(index);
                  const isCurrent = index === currentIndex;

                  return (
                    <motion.div
                      key={cs.id}
                      className={`absolute ${isCurrent ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                      animate={{ y: props.y, scale: props.scale, opacity: props.opacity, zIndex: props.zIndex }}
                      transition={{ y: { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }, scale: { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }, opacity: { type: 'tween', duration: 0.28, ease: 'easeOut' } }}
                      drag={isCurrent ? 'y' : false}
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0.15}
                      dragMomentum={false}
                      onDragEnd={handleDragEnd}
                      style={{ zIndex: props.zIndex, touchAction: isCurrent ? 'pan-x' : 'pan-y', willChange: 'transform' }}
                      onClick={() => { if (!isCurrent) navigate(index > currentIndex ? 1 : -1); else onCardClick(cs); }}
                    >
                      <div className="relative overflow-hidden rounded-2xl" style={{ width: `${CARD_W}px`, height: `${CARD_H}px`, boxShadow: isCurrent ? '0 32px 64px -16px rgba(0,0,0,0.85), 0 0 0 1px rgba(195,237,0,0.12)' : '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                        <img src={cs.heroImage} alt={cs.title} draggable={false} className="absolute inset-0 w-full h-full object-cover select-none" />
                        <div className="absolute inset-x-0 bottom-0" style={{ height: '85%', background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.65) 55%, transparent 100%)' }} />
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

              {/* Counter + arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 flex flex-row items-center gap-3 select-none z-20" style={{ left: `calc(50% + ${CARD_W / 2 + 20}px)` }}>
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
                  <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black" aria-label="Previous project">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => navigate(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-scara-green/40 bg-black/60 text-scara-green transition-colors hover:bg-scara-green hover:text-black" aria-label="Next project">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
