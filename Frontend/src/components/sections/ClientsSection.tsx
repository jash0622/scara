'use client';

import { SCARA_CLIENT_LOGOS } from '@/data/scaraData';
import LogoLoop from '@/components/ui/LogoLoop';

export default function ClientsSection() {
  return (
    <section id="clients" className="relative w-full bg-scara-black py-24 md:py-36 text-scara-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              // GLOBAL PARTNERS & CLIENTS
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-scara-white tracking-tight">
              Trusted by <span className="text-scara-green">Industry Giants.</span>
            </h2>
          </div>
          <span className="font-sub text-xs text-scara-grey uppercase">
            15+ GLOBAL BRANDS & PUBLISHERS
          </span>
        </div>

        {/* 1. React Bits LogoLoop Brand Image Ticker */}
        <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 space-y-8 overflow-hidden shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-scara-grey/15 pb-4">
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
              // OFFICIAL BRAND PARTNER ROSTER
            </span>
            <span className="font-sub text-xs text-scara-grey uppercase">
              2026 GLOBAL ALLIANCES
            </span>
          </div>

          {/* Primary Logo Loop (Moving Left) */}
          <div className="py-2">
            <LogoLoop
              logos={SCARA_CLIENT_LOGOS}
              speed={75}
              direction="left"
              logoHeight={48}
              gap={64}
              fadeOut={true}
              fadeOutColor="#0a0a0a"
              scaleOnHover={true}
              ariaLabel="Scara client brand partners"
            />
          </div>

          {/* Secondary Logo Loop (Moving Right) */}
          <div className="py-2 border-t border-scara-grey/10 pt-6">
            <LogoLoop
              logos={SCARA_CLIENT_LOGOS.slice().reverse()}
              speed={60}
              direction="right"
              logoHeight={44}
              gap={56}
              fadeOut={true}
              fadeOutColor="#0a0a0a"
              scaleOnHover={true}
              ariaLabel="Scara client brand roster reverse"
            />
          </div>
        </div>

        {/* Press strip removed — moved/hidden per site restructure */}


      </div>
    </section>
  );
}

