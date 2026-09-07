'use client';

import dynamic from 'next/dynamic';
import { Globe } from 'lucide-react';
import ScrollExpand from '@/components/ui/ScrollExpand';
import AboutTitle from '@/components/ui/AboutTitle';
import { SCARA_ADVISORS } from '@/data/scaraData';
import CircularTeamGallery from '@/components/ui/CircularTeamGallery';

const GlobeCanvas = dynamic(() => import('@/components/canvas/GlobeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center font-sub text-xs text-scara-grey uppercase">
      LOADING 2D WORLD MAP...
    </div>
  ),
});

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-scara-black text-scara-white">
      {/* Cinematic pinned narrative header (title + paragraph). */}
      {/*
       * Pinned cinematic narrative: title pops up + stroke/fill choreography,
       * then paragraph reveals — all while pinned centered. Content below stays
       * hidden until the whole sequence completes and the pin releases.
       */}
      <AboutTitle
        paragraph="Scara is a global culture and experiences company shaping what's next across gaming, sports, entertainment, and live experiences. Founded in 2023, Scara operates across two core engines — Scara Gaming and Scara Live — backed by a unified technology infrastructure (Scara Tech) to turn audience attention into measurable business impact."
      />

      {/* ScrollExpand lives OUTSIDE the max-width container so it can be full-width */}
      <ScrollExpand
          src="/community_hero.jpg"
          alt="Scara Community — Thousands United"
          preTitle="// THE SCARA COMMUNITY"
          title={`Millions of Fans.\nOne Heartbeat.`}
          subtitle="We don't just build audiences — we build tribes. Loyal, electric, and unstoppable."
          scrollHint="Scroll"
          postTitle="Where Fandom Becomes Family."
          postSubtitle="// GAMING · ESPORTS · LIVE EXPERIENCES"
          postBody="From Discord servers to stadium floors, Scara connects creators, fans, and brands inside the moments that matter most — turning passive viewers into lifelong communities."
          scrollMultiplier={3}
        />

      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-24 pt-24 md:pt-36">

        {/* 3. Funnel Progression Sticky Stacking Engine Cards */}
        <div className="rounded-2xl border border-scara-green/30 bg-scara-card-dark p-6 sm:p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-scara-grey/15 pb-6">
            <div>
              <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                // THE SCARA CULTURAL ENGINE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-scara-white mt-1">
                Discover → Participate → Amplify
              </h3>
            </div>
            <p className="max-w-md font-body text-xs text-scara-grey leading-relaxed">
              "Together, Scara Gaming and Scara Live help brands move from attention to participation — and from participation to fandom."
            </p>
          </div>

          {/* Sticky Stacking Cards Engine (100% Production Ready & Mobile Responsive) */}
          <div className="space-y-6 md:space-y-8 relative">
            {/* Card 01 */}
            <div className="sticky top-24 sm:top-28 z-10 rounded-2xl border border-scara-grey/25 bg-scara-black p-6 sm:p-8 md:p-10 space-y-4 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-scara-green">01</span>
                <span className="font-sub text-[10px] sm:text-xs font-bold tracking-[0.2em] text-scara-green uppercase border border-scara-green/30 rounded-full px-3 py-1 bg-scara-green/10">
                  STAGE 01 // ATTENTION
                </span>
              </div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold uppercase text-scara-white">
                DIGITAL ATTENTION & VIRAL DROPS
              </h4>
              <p className="font-body text-xs sm:text-sm text-scara-grey leading-relaxed max-w-2xl">
                Viral digital drops, creator content campaigns, and publisher growth strategies capturing immediate youth focus where cultural momentum is born.
              </p>
            </div>

            {/* Card 02 */}
            <div className="sticky top-28 sm:top-32 z-20 rounded-2xl border border-scara-grey/30 bg-[#0d0f08] p-6 sm:p-8 md:p-10 space-y-4 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-scara-green">02</span>
                <span className="font-sub text-[10px] sm:text-xs font-bold tracking-[0.2em] text-scara-green uppercase border border-scara-green/30 rounded-full px-3 py-1 bg-scara-green/10">
                  STAGE 02 // PARTICIPATION
                </span>
              </div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold uppercase text-scara-white">
                COMMUNITY HUBS & UGC CHALLENGES
              </h4>
              <p className="font-body text-xs sm:text-sm text-scara-grey leading-relaxed max-w-2xl">
                Tournament registrations, UGC submission drives, active Discord community hubs, and interactive challenges turning passive viewers into active participants.
              </p>
            </div>

            {/* Card 03 */}
            <div className="sticky top-32 sm:top-36 z-30 rounded-2xl border border-scara-green/50 bg-[#121808] p-6 sm:p-8 md:p-10 space-y-4 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-scara-green">03</span>
                <span className="font-sub text-[10px] sm:text-xs font-bold tracking-[0.2em] text-scara-green uppercase border border-scara-green/40 rounded-full px-3 py-1 bg-scara-green/20 text-scara-white">
                  STAGE 03 // FANDOM
                </span>
              </div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold uppercase text-scara-white">
                PHYSICAL FANDOM & STADIUM EXPERIENCES
              </h4>
              <p className="font-body text-xs sm:text-sm text-scara-white/90 leading-relaxed max-w-2xl">
                Physical meet & greets, stadium arena experiences, co-branded merchandise, live broadcasts, and unshakeable lifelong brand loyalty.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Global Footprint Section (Left Content, Right Map) */}
        <div className="border-t border-b border-scara-grey/10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content & Location Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                  <Globe className="h-4 w-4" />
                  <span>GLOBAL FOOTPRINT // EXPANSION</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-scara-white leading-tight">
                  A Global Agency <br />
                  <span className="text-scara-green">In Constant Expansion.</span>
                </h3>
              </div>

              <p className="font-body text-sm text-scara-grey leading-relaxed">
                Operating live hubs across <strong>Mumbai (HQ)</strong>, <strong>Istanbul (Türkiye)</strong>, and <strong>UAE (Dubai)</strong>, connecting brands across India, MENA, and international markets.
              </p>

              {/* Location Hubs List */}
              <div className="space-y-4 pt-4 border-t border-scara-grey/15 font-sub text-xs uppercase">
                <div className="flex items-center justify-between border-b border-scara-grey/10 pb-3">
                  <span className="text-scara-grey font-bold">INDIA (HQ)</span>
                  <span className="text-scara-green font-bold tracking-wider">MUMBAI BANDRA EAST</span>
                </div>
                <div className="flex items-center justify-between border-b border-scara-grey/10 pb-3">
                  <span className="text-scara-grey font-bold">TÜRKIYE</span>
                  <span className="text-scara-green font-bold tracking-wider">ISTANBUL HUB</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-scara-grey font-bold">MIDDLE EAST</span>
                  <span className="text-scara-green font-bold tracking-wider">DUBAI & UAE</span>
                </div>
              </div>
            </div>

            {/* Right Map Image */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <GlobeCanvas />
            </div>
          </div>
        </div>

        {/* 5. Leadership Team Interactive Carousel */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                // LEADERSHIP & VISIONARIES
              </span>
              <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase text-scara-white mt-1">
                Built By Industry Veterans.
              </h3>
            </div>
          </div>

          {/* 3D Perspective Curved Circular Gallery */}
          <CircularTeamGallery />

          {/* Board of Advisors Strip */}
          <div className="mt-8 rounded-xl border border-scara-grey/20 bg-scara-card-dark p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
              BOARD OF ADVISORS
            </span>
            <div className="flex flex-wrap items-center gap-8 font-heading text-sm font-extrabold uppercase text-scara-white">
              {SCARA_ADVISORS.map((advisor) => (
                <div key={advisor.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-scara-green" />
                  <span>{advisor.name}</span>
                  <span className="font-sub text-xs text-scara-grey font-normal">({advisor.title})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
