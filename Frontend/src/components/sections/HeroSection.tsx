'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Magnet from '@/components/ui/Magnet';

const GlobeCanvas = dynamic(() => import('@/components/canvas/GlobeCanvas'), {
  ssr: false,
  loading: () => null,
});

interface HeroSectionProps {
  preloaderFinished?: boolean;
}

/**
 * GreenReveal — each LETTER turns from white to green, one after another
 * (left→right), when `trigger` is true. No overlay, no ghost text — the
 * actual letter colour animates. `delay` staggers whole words.
 */
function GreenReveal({ text, trigger, delay }: { text: string; trigger: boolean; delay: number }) {
  const letters = text.split('');
  const perLetter = 0.06; // seconds between each letter turning green
  return (
    // Keep the whole word together (no wrapping mid-word)
    <span style={{ whiteSpace: 'nowrap' }}>
      {letters.map((ch, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{
            animation: trigger
              ? `heroLetterGreen 0.3s ease ${delay + i * perLetter}s forwards`
              : 'none',
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection({ preloaderFinished = false }: HeroSectionProps) {
  const [mounted] = useState(true);
  const [wipeStart, setWipeStart] = useState(false);

  // Text shows fully WHITE first. Once the preloader finishes and the hero
  // reveals, wait 1.5s then run the green letter-by-letter reveal
  // (SPORTS → GAMING → MUSIC). Fallback: if the preloader was already done
  // on mount, still trigger after a short delay.
  useEffect(() => {
    if (!preloaderFinished) return;
    const t = setTimeout(() => setWipeStart(true), 1500);
    return () => clearTimeout(t);
  }, [preloaderFinished]);

  // Safety fallback — if preloaderFinished never flips (e.g. skipped),
  // trigger anyway ~6.5s after mount so the title never stays plain white.
  useEffect(() => {
    const t = setTimeout(() => setWipeStart(true), 6500);
    return () => clearTimeout(t);
  }, []);

  const entry = 'opacity-100 translate-y-0';
  const trans = 'transition-all duration-700 ease-out';

  return (
    <div id="hero" className="relative w-full bg-scara-black">
      {/* Black background */}
      <div className="absolute inset-0 bg-scara-black z-0" />

      {/* Green radial glow — starts from text, sweeps wide into map area */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            /* Main glow — originates from text area, extends right towards map */
            'radial-gradient(ellipse 90% 65% at 18% 55%, rgba(195,237,0,0.13) 0%, rgba(195,237,0,0.04) 55%, transparent 78%)',
            /* Secondary deeper glow — goes further behind the map */
            'radial-gradient(ellipse 70% 80% at 30% 50%, rgba(195,237,0,0.06) 0%, transparent 65%)',
          ].join(', '),
        }}
      />

      {/* Main two-column layout */}
      <div className="relative z-10 flex h-full min-h-screen w-full flex-col">
        {/* Navbar spacer */}
        <div className="shrink-0 h-16 sm:h-20" style={{ height: undefined }} />

        <div className="relative lg:static flex flex-col lg:flex-row flex-1 items-center w-full px-6 md:px-10 lg:px-14 2xl:px-20 3xl:px-28 gap-0 lg:gap-6 pt-8 sm:pt-12 lg:pt-0 pb-6 lg:pb-0">

          {/* TEXT content — on mobile: top, on desktop: normal flow */}
          <div className="
            lg:static lg:flex lg:flex-col lg:justify-center lg:w-full lg:max-w-[40%] lg:shrink-0
            relative lg:relative
            flex flex-col w-full shrink-0
            px-0 pt-4 pb-2 lg:pb-0
            z-10 lg:z-auto
            order-1 lg:order-none
          ">

            {/* Eyebrow pill */}
            <div
              className={`mb-5 inline-flex items-center gap-2 self-start rounded-full border border-scara-green/30 bg-scara-card-dark/80 px-4 py-1.5 backdrop-blur-md ${entry} ${trans}`}
              style={{ transitionDelay: '100ms' }}
            >
              <Sparkles className="h-3.5 w-3.5 text-scara-green animate-pulse flex-shrink-0" />
              <span className="font-sub text-[8px] sm:text-[9px] font-bold tracking-[0.22em] text-scara-green uppercase whitespace-nowrap">
                GLOBAL CREATIVE AGENCY
              </span>
            </div>

            {/* Headline — MOBILE (each word on its own line, same as before) */}
            <h1
              className="sm:hidden font-heading font-extrabold uppercase tracking-tight text-scara-white leading-[0.92]"
              style={{ fontSize: 'clamp(2.4rem, 11vw, 4rem)' }}
            >
              SHAPING <br />
              <GreenReveal text="SPORTS," trigger={wipeStart} delay={0} /> <br />
              <GreenReveal text="GAMING," trigger={wipeStart} delay={0.45} /> <br />
              <GreenReveal text="MUSIC" trigger={wipeStart} delay={0.9} />
              {' '}&amp;{' '}CULTURE.
            </h1>

            {/* Headline — DESKTOP (fixed line breaks, unchanged layout) */}
            <h1
              className={`hidden sm:block font-heading font-extrabold uppercase tracking-tight text-scara-white leading-[0.92] ${entry} ${trans}`}
              style={{
                transitionDelay: '180ms',
                fontSize: 'clamp(2.2rem, 4.2vw, 4rem)',
              }}
            >
              SHAPING <br />
              <span className="lg:whitespace-nowrap">
                <GreenReveal text="SPORTS," trigger={wipeStart} delay={0} />{' '}
                <GreenReveal text="GAMING," trigger={wipeStart} delay={0.45} />
              </span>
              <br />
              <span className="lg:whitespace-nowrap">
                <GreenReveal text="MUSIC" trigger={wipeStart} delay={0.9} />
                {' '}&amp;{' '}CULTURE.
              </span>
            </h1>

            {/* Subline */}
            <p
              className={`mt-5 font-body text-sm text-scara-white/70 leading-relaxed ${entry} ${trans}`}
              style={{ transitionDelay: '260ms', maxWidth: '36ch' }}
            >
              A Global Agency in Constant Expansion.
            </p>

            {/* CTAs */}
            <div
              className={`mt-7 flex flex-wrap items-center gap-5 ${entry} ${trans}`}
              style={{ transitionDelay: '340ms' }}
            >
              <Magnet padding={60} magnetStrength={3}>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-3 rounded-full bg-scara-green px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-scara-black transition-all duration-300 hover:bg-scara-white hover:shadow-[0_0_26px_#C3ED00]"
                >
                  <span>Explore Flagship Work</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Magnet>
              <a
                href="#about"
                className="font-sub text-xs font-semibold uppercase tracking-widest text-scara-grey hover:text-scara-green transition-colors"
              >
                // This is Our Jam
              </a>
            </div>
          </div>

          {/* Globe/Map — below content on mobile, beside text on desktop */}
          <div className="
            lg:flex lg:flex-1 lg:items-center lg:justify-center lg:min-w-0 lg:overflow-hidden
            relative lg:static
            flex items-center justify-center w-full
            opacity-100
            order-2 lg:order-none
            mt-4 lg:mt-0
          "
               style={{ height: undefined }}>
            <div className="w-full lg:w-auto lg:overflow-visible overflow-hidden max-h-[48vw] sm:max-h-[52vw] lg:max-h-none">
              <GlobeCanvas />
            </div>
          </div>

        </div>
      </div>

      {/* Hero title letter-by-letter green reveal keyframe */}
      <style jsx global>{`
        .hero-letter {
          color: #ffffff;
        }
        @keyframes heroLetterGreen {
          from {
            color: #ffffff;
            text-shadow: none;
          }
          to {
            color: #c3ed00;
            text-shadow: 0 0 30px rgba(195, 237, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
