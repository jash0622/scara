'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import Magnet from '@/components/ui/Magnet';

const GlobeCanvas = dynamic(() => import('@/components/canvas/GlobeCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  const [mounted] = useState(true);

  const entry = 'opacity-100 translate-y-0';
  const trans = 'transition-all duration-700 ease-out';

  return (
    <div id="hero" className="relative w-full bg-scara-black" style={{ minHeight: '100vh' }}>
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
        <div className="shrink-0" style={{ height: '82px' }} />

        <div className="flex flex-1 items-center w-full px-6 md:px-10 lg:px-14 gap-8 lg:gap-6">

          {/* LEFT — text content */}
          <div className="flex flex-col justify-center w-full lg:max-w-[40%] shrink-0">

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

            {/* Headline */}
            <h1
              className={`font-heading font-extrabold uppercase tracking-tight text-scara-white leading-[0.92] ${entry} ${trans}`}
              style={{
                transitionDelay: '180ms',
                fontSize: 'clamp(2.2rem, 4.2vw, 4rem)',
                whiteSpace: 'nowrap',
              }}
            >
              SHAPING <br />
              <span className="text-scara-green drop-shadow-[0_0_30px_rgba(195,237,0,0.3)]">
                SPORTS, GAMING,
              </span>
              <br />
              <span className="text-scara-green drop-shadow-[0_0_30px_rgba(195,237,0,0.3)]">
                MUSIC
              </span>{' '}&amp;{' '}
              CULTURE.
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

          {/* RIGHT — Map, takes remaining space */}
          <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 overflow-hidden">
            <GlobeCanvas />
          </div>

        </div>
      </div>
    </div>
  );
}
