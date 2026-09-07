'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Magnet from '@/components/ui/Magnet';
import Lightning from '@/components/ui/Lightning';
import { setupHeroScroll } from '@/components/hero/HeroScrollController';
import {
  createHandSceneState,
  type HandSceneState,
} from '@/components/hero/ParticleHandScene';

const ParticleHandScene = dynamic(
  () => import('@/components/hero/ParticleHandScene'),
  { ssr: false, loading: () => null },
);

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { return false; }
}

function CrossMark({ className }: { className: string }) {
  return (
    <div className={`absolute pointer-events-none select-none z-[2] ${className}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <line x1="6" y1="0" x2="6" y2="12" stroke="#C3ED00" strokeWidth="0.7" strokeOpacity="0.4"/>
        <line x1="0" y1="6" x2="12" y2="6" stroke="#C3ED00" strokeWidth="0.7" strokeOpacity="0.4"/>
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [mounted,    setMounted]    = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyViewRef      = useRef<HTMLDivElement>(null);
  const bgRef              = useRef<HTMLDivElement>(null);   // black background div
  const lightningRef       = useRef<HTMLDivElement>(null);  // lightning bg layer
  const stateRef           = useRef<HandSceneState>(createHandSceneState());

  useEffect(() => {
    setMounted(true);
    setWebglReady(hasWebGL());
  }, []);

  // Idle tip-glow breathing — only while progress < 0.05
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    const tick = () => {
      const s = stateRef.current;
      if (s.progress < 0.05) {
        s.tipGlow = 0.35 + Math.sin(performance.now() * 0.0012) * 0.12;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // RAF loop — drives bg opacity, spark explosion clip-path, and canvas visibility.
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    const tick = () => {
      const bg     = bgRef.current;
      const flash  = document.getElementById('hero-spark-flash');
      const canvas = document.getElementById('hero-canvas-wrapper');
      const s      = stateRef.current;

      if (bg) {
        bg.style.opacity = String(Math.max(0, Math.min(1, s?.bgOpacity ?? 1)));
      }

      if (flash) {
        const burst = s?.sparkBurst ?? 0;
        // Circle expands from 0% (invisible) to 200% (full screen) as burst goes 0→1.
        // circle(radius at x% y%) — 200% covers every corner of the viewport.
        const radius = burst * 200;
        flash.style.clipPath = `circle(${radius}% at 50% 50%)`;
      }

      const p = s?.progress ?? 0;

      // ── Exit fade (0.86→1.0): the ENTIRE hero (hands + lightning) fades
      // out over the last part of the scroll, so it dissolves away in place
      // right as the About title fades in — no visible break / black gap.
      const exitRaw = Math.max(0, Math.min(1, (p - 0.86) / 0.14));
      const exit = exitRaw * exitRaw * (3 - 2 * exitRaw); // smoothstep
      const heroOpacity = 1 - exit;

      // Hide WebGL canvas once hands fully dissolved and spark gone
      if (canvas) {
        const done = (s?.dissolve ?? 0) >= 1.0 && (s?.sparkBurst ?? 0) < 0.02;
        canvas.style.visibility = done ? 'hidden' : 'visible';
        canvas.style.opacity = String(heroOpacity);
      }

      // Lightning background — fades in as hands close together (0.45→0.72),
      // then fades OUT with the exit envelope (0.86→1.0).
      if (lightningRef.current) {
        const lo = 0.45, hi = 0.72;
        const raw = Math.max(0, Math.min(1, (p - lo) / (hi - lo)));
        const inEased = raw * raw * (3 - 2 * raw);  // smoothstep in
        lightningRef.current.style.opacity = String(inEased * heroOpacity);
      }

      // Decorative cross markers — driven directly by hudOpacity from stateRef
      // so they stay in sync with the circle/HUD and never reappear.
      const decor = document.getElementById('hero-decor');
      if (decor) {
        decor.style.opacity = String(Math.max(0, Math.min(1, s?.hudOpacity ?? 1)));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // Hover magnetic interaction — listen on the sticky viewport directly.
  // This avoids all pointer-events-none / z-index issues.
  // Writes to stateRef.upperHoverX/Y + lowerHoverX/Y every RAF frame.
  useEffect(() => {
    if (!mounted) return;

    const UPPER_TARGET_X = -0.06;
    const UPPER_TARGET_Y = -0.10;
    const LOWER_TARGET_X = -0.05;
    const LOWER_TARGET_Y =  0.08;

    let hovering = false;
    let rafId    = 0;

    function tick() {
      const s = stateRef.current;
      if (s.progress > 0.18) {
        // Scroll has taken over — decay hover to zero
        s.upperHoverX = (s.upperHoverX ?? 0) * 0.85;
        s.upperHoverY = (s.upperHoverY ?? 0) * 0.85;
        s.lowerHoverX = (s.lowerHoverX ?? 0) * 0.85;
        s.lowerHoverY = (s.lowerHoverY ?? 0) * 0.85;
      } else {
        const tgtUX = hovering ? UPPER_TARGET_X : 0;
        const tgtUY = hovering ? UPPER_TARGET_Y : 0;
        const tgtLX = hovering ? LOWER_TARGET_X : 0;
        const tgtLY = hovering ? LOWER_TARGET_Y : 0;
        const lf = 0.07;
        s.upperHoverX = (s.upperHoverX ?? 0) + (tgtUX - (s.upperHoverX ?? 0)) * lf;
        s.upperHoverY = (s.upperHoverY ?? 0) + (tgtUY - (s.upperHoverY ?? 0)) * lf;
        s.lowerHoverX = (s.lowerHoverX ?? 0) + (tgtLX - (s.lowerHoverX ?? 0)) * lf;
        s.lowerHoverY = (s.lowerHoverY ?? 0) + (tgtLY - (s.lowerHoverY ?? 0)) * lf;
      }
      rafId = requestAnimationFrame(tick);
    }

    const sticky = stickyViewRef.current;
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    sticky?.addEventListener('mouseenter', onEnter);
    sticky?.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      sticky?.removeEventListener('mouseenter', onEnter);
      sticky?.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, stateRef]);

  useEffect(() => {
    if (!mounted || !scrollContainerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stateRef.current.brightness = 0.75;
      return;
    }
    const nextEl = document.getElementById('cinematic-next-section');
    void nextEl;
    return setupHeroScroll(scrollContainerRef.current, stateRef);
  }, [mounted]);

  const entry = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
  const trans = 'transition-all duration-700 ease-out';

  return (
    <div
      ref={scrollContainerRef}
      id="hero"
      className="relative w-full"
      style={{ height: '260vh' }}
    >
      <div
        ref={stickyViewRef}
        className="sticky top-0 left-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/*
         * Black background — driven to opacity 0 during stage 3
         */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-[#000000] z-0"
          style={{ willChange: 'opacity' }}
        />

        {/*
         * Lightning background effect — neon-green thunder (hue 78).
         * Sits behind the hands (z-0, above black bg). Opacity is driven by
         * scroll progress in the RAF loop above: fades in as hands converge.
         * pointer-events-none so it never blocks interaction.
         */}
        {/* Lightning disabled temporarily */}
        {false && mounted && webglReady && (
          <div
            ref={lightningRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0, opacity: 0, willChange: 'opacity' }}
            aria-hidden="true"
          >
            <Lightning hue={78} xOffset={0} speed={1} intensity={1} size={1.2} />
          </div>
        )}

        {/*
         * Spark explosion overlay — driven by s.sparkBurst (0→1→0).
         * Uses clip-path: circle() so the flash EXPANDS from center outward
         * like an explosion — not a flat fill.
         * At sparkBurst=0: circle radius = 0% (invisible)
         * At sparkBurst=1: circle radius = 200% (covers entire screen)
         * The bright lime gradient sits behind the clip mask.
         */}
        <div
          id="hero-spark-flash"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 30,
            clipPath: 'circle(0% at 50% 50%)',
            background: 'radial-gradient(circle at 50% 50%, rgba(240,255,50,1) 0%, rgba(195,237,0,1) 15%, rgba(180,220,0,0.95) 35%, rgba(160,200,0,0.8) 60%, rgba(100,150,0,0.4) 85%, transparent 100%)',
            willChange: 'clip-path',
          }}
        />

        {/* Particle canvas — z-[1] */}
        {mounted && webglReady && (
          <div
            id="hero-canvas-wrapper"
            className="absolute inset-0 z-[1]"
            style={{ willChange: 'opacity' }}
            aria-hidden="true"
          >
            <ParticleHandScene stateRef={stateRef} className="w-full h-full" />
          </div>
        )}

        {/* Decorative cross markers + floating text labels — z-[0].
            Fades with hudOpacity as content exits on scroll. */}
        {mounted && (
          <div id="hero-decor" className="absolute inset-0 z-[0] pointer-events-none" style={{ willChange: 'opacity' }}>
            <CrossMark className="top-[20%] left-[44%]" />
            <CrossMark className="top-[35%] left-[58%]" />
            <CrossMark className="top-[15%] right-[20%]" />
            <CrossMark className="top-[58%] right-[16%]" />
            <CrossMark className="bottom-[25%] right-[7%]" />
            <CrossMark className="top-[42%] right-[5%]" />

            {/* ── Stacked words — just right of the vertical line (~46%) ── */}
            <div className="absolute top-[14%] left-[47%] flex flex-col gap-[5px]">
              {['CREATE', 'CONNECT', 'ENGAGE'].map((word, i) => (
                <p
                  key={word}
                  className="font-sub font-bold uppercase"
                  style={{
                    fontSize: '8.5px',
                    letterSpacing: '0.26em',
                    color: i === 0 ? 'rgba(195,237,0,0.55)' : 'rgba(255,255,255,0.28)',
                  }}
                >
                  {word}
                </p>
              ))}
            </div>

            {/* ── Right side stacked — beside the upper hand ── */}
            <div
              className="absolute right-[4%] top-[18%] flex flex-col gap-[3px] text-right"
            >
              {['CULTURE', 'TRANSFORM', 'RESONATE'].map((word, i) => (
                <p
                  key={word}
                  className="font-sub text-[7px] font-bold tracking-[0.28em] uppercase"
                  style={{
                    color: i === 0 ? 'rgba(195,237,0,0.55)' : 'rgba(255,255,255,0.22)',
                    letterSpacing: '0.28em',
                  }}
                >
                  {word}
                </p>
              ))}
            </div>

            {/* ── Bottom-right corner tag ── */}
            <div className="absolute bottom-[14%] right-[5%]">
              <p
                className="font-sub text-[6.5px] font-semibold tracking-[0.32em] uppercase"
                style={{ color: 'rgba(195,237,0,0.35)' }}
              >
                EXPERIENTIAL
              </p>
            </div>
          </div>
        )}

        {/* Left content — z-[10] */}
        <div className="relative z-[10] flex h-full w-full flex-col">
          <div className="shrink-0" style={{ height: '82px' }} />

          <div className="flex flex-1 items-center">
            <div
              className="flex flex-col justify-center px-6 md:px-10 lg:px-14"
              style={{ width: '52%', maxWidth: '52%' }}
            >
              <div
                id="hero-eyebrow"
                className={`mb-5 inline-flex items-center gap-2 self-start rounded-full border border-scara-green/30 bg-scara-card-dark/80 px-4 py-1.5 backdrop-blur-md ${entry} ${trans}`}
                style={{ transitionDelay: '100ms' }}
              >
                <Sparkles className="h-3.5 w-3.5 text-scara-green animate-pulse flex-shrink-0" />
                <span className="font-sub text-[8px] sm:text-[9px] font-bold tracking-[0.22em] text-scara-green uppercase whitespace-nowrap">
                  GLOBAL CREATIVE AGENCY // MUMBAI • ISTANBUL • UAE
                </span>
              </div>

              <h1
                id="hero-headline"
                className={`font-heading font-extrabold uppercase tracking-tight text-scara-white leading-[0.92] ${entry} ${trans}`}
                style={{
                  transitionDelay: '180ms',
                  fontSize: 'clamp(2.2rem, 4.2vw, 4rem)',
                  whiteSpace: 'nowrap',
                }}
              >
                SHAPING <br />
                <span className="text-scara-green drop-shadow-[0_0_30px_rgba(195,237,0,0.3)]">
                  SPORTS, GAMING
                </span>
                <br />
                &amp; CULTURE.
              </h1>

              <p
                id="hero-subline"
                className={`mt-5 font-body text-sm text-scara-white/70 leading-relaxed ${entry} ${trans}`}
                style={{ transitionDelay: '260ms', maxWidth: '36ch' }}
              >
                Scara is a culture-first creative force built for brands that play to win.
                Turning fandom, communities, and moments into combat-ready experiences
                people want to be part of.
              </p>

              <div
                id="hero-cta"
                className={`mt-7 flex flex-wrap items-center gap-5 ${entry} ${trans}`}
                style={{ transitionDelay: '340ms' }}
              >
                <Magnet padding={60} magnetStrength={3}>
                  <a
                    href="#work"
                    className="group inline-flex items-center gap-3 rounded-full bg-scara-green px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-scara-black transition-all duration-300 hover:bg-scara-white hover:shadow-[0_0_26px_#C3ED00]"
                    data-cursor="EXPLORE"
                  >
                    <span>Explore Flagship Work</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Magnet>
                <a
                  href="#about"
                  className="font-sub text-xs font-semibold uppercase tracking-widest text-scara-grey hover:text-scara-green transition-colors"
                >
                  // Learn Why We Exist
                </a>
              </div>
            </div>

            <div className="flex-1" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
