'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Coffee, Users, Briefcase } from 'lucide-react';
import ScrollExpand from '@/components/ui/ScrollExpand';
import AboutTitle, { type ParagraphBlock } from '@/components/ui/AboutTitle';
import { SCARA_CLIENT_LOGOS } from '@/data/scaraData';
import ArchitectureCards from '@/components/ui/ArchitectureCards';
import LogoLoop from '@/components/ui/LogoLoop';

// ── useCountUp — counts from 0 to `end` when the ref enters the viewport ──────
function useCountUp(end: number, duration = 1800) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return { ref, count };
}

// ── CountCard — stat card with animated number ────────────────────────────────
function CountCard({
  icon, end, suffix, label, sub, color, idx,
}: {
  icon: React.ReactNode;
  end: number;
  suffix: string;
  label: string;
  sub: string;
  color: string;
  idx: number;
}) {
  const { ref, count } = useCountUp(end);

  // Format with comma for thousands (e.g. 1200 → 1,200)
  const formatted = count >= 1000
    ? count.toLocaleString('en-US')
    : String(count);

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-scara-grey/20 bg-gradient-to-br ${color} bg-scara-card-dark p-6 md:p-8 space-y-4 overflow-hidden transition-all duration-300 hover:border-scara-green/50 hover:shadow-[0_0_30px_rgba(195,237,0,0.12)]`}
    >
      <div className="flex items-center justify-between">
        {icon}
        <span className="font-sub text-[10px] font-bold tracking-[0.2em] text-scara-grey/50 uppercase">
          0{idx}
        </span>
      </div>
      <div>
        <div className="font-heading text-4xl sm:text-5xl font-extrabold text-scara-green tracking-tight group-hover:scale-105 transition-transform origin-left tabular-nums">
          {formatted}{suffix}
        </div>
        <h4 className="font-heading text-sm sm:text-base font-bold uppercase text-scara-white mt-1">
          {label}
        </h4>
        <p className="font-body text-[11px] text-scara-grey mt-1 leading-relaxed">
          {sub}
        </p>
      </div>
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-scara-green/5 blur-xl group-hover:bg-scara-green/15 transition-all" />
    </div>
  );
}

export default function AboutSection() {
  const shardsRef = useRef<HTMLDivElement>(null);

  // Smoothly fade the shard background in when the section scrolls into view,
  // and back out when it leaves — so it never pops in abruptly.
  useEffect(() => {
    const el = shardsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.opacity = entry.isIntersecting ? '1' : '0';
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="relative w-full bg-scara-black text-scara-white">
      {/* Cinematic pinned narrative header (title + paragraph). */}
      {/*
       * Pinned cinematic narrative: title pops up + stroke/fill choreography,
       * then paragraph reveals — all while pinned centered. Content below stays
       * hidden until the whole sequence completes and the pin releases.
       */}
      {/* GradientWaves ambient background sits BEHIND the title + scroll-expand hero
          only. It fades in when the section enters view and out when it leaves. */}
      <div className="relative">
        <div ref={shardsRef} className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-1000 ease-out">
          {/* GradientWaves disabled — too heavy alongside hero WebGL */}
        </div>

        <div className="relative z-10">
          {/* AboutTitle paragraphs — structured segments allow inline bold without hardcoded JSX */}
          {(() => {
            const aboutParagraphs: ParagraphBlock[] = [
              {
                segments: [
                  { text: 'Scara is a ' },
                  { text: 'global culture and experiences company', bold: true },
                  { text: ' shaping what\'s next across gaming, sports, music and live experiences.' },
                ],
              },
              {
                segments: [
                  { text: 'We work with ' },
                  { text: 'brands, creators', bold: true },
                  { text: ', rights holders and communities to turn cultural insight into ideas, IPs and experiences people want to be part of.' },
                ],
              },
            ];
            return <AboutTitle paragraphs={aboutParagraphs} />;
          })()}

          {/* ScrollExpand lives OUTSIDE the max-width container so it can be full-width */}
          <ScrollExpand
              src="/community_hero.jpg"
              alt="Scara Community — Thousands United"
              scrollHint="Scroll"
              postTitle={`WE TURN AUDIENCES\nINTO COMMUNITIES.`}
              postSubtitle="// Sports · Gaming · Music · Live Experiences"
              postBody="We build experiences that turn audiences into communities and brands into part of the conversation."
              scrollMultiplier={3}
            />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-24 pt-24 md:pt-36">

        {/* ── 1. ARCHITECTURE CARDS ───────────────────────────────────── */}
        <div className="space-y-8">
          <div>
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
              // SCARA ARCHITECTURE
            </span>
            <h3 className="font-heading text-3xl font-bold uppercase text-scara-white mt-1">
              How Scara Is Structured
            </h3>
          </div>
          <ArchitectureCards />
        </div>

        {/* ── 2. STATS CARDS ──────────────────────────────────────────── */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
                // BY THE NUMBERS
              </span>
              <h3 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-scara-white mt-1">
                Built on <span className="text-scara-green">Real Relationships.</span>
              </h3>
            </div>
            <p className="max-w-sm font-body text-sm text-scara-grey leading-relaxed">
              Every number here is a story.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Coffee,    end: 1200, suffix: '+',  label: 'Cups of Coffee',      sub: 'Powering every campaign brief',        color: 'from-amber-900/20 to-transparent',   idx: 1 },
            { icon: Users,     end: 15,   suffix: '+',  label: 'Global Clients',      sub: 'Brands, publishers & rights holders',  color: 'from-scara-green/10 to-transparent', idx: 2 },
            { icon: Briefcase, end: 40,   suffix: '+',  label: 'Campaigns Delivered', sub: 'Across 8 countries',                   color: 'from-blue-900/20 to-transparent',    idx: 3 },
          ].map(({ icon: Icon, end, suffix, label, sub, color, idx }) => (
            <CountCard
              key={label}
              icon={<Icon className="h-5 w-5 text-scara-green" />}
              end={end}
              suffix={suffix}
              label={label}
              sub={sub}
              color={color}
              idx={idx}
            />
          ))}
        </div>
        </div>

        {/* ── 3. GLOBAL PARTNERS & CLIENTS ────────────────────────────── */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
                // GLOBAL PARTNERS & CLIENTS
              </span>
              <h3 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-scara-white mt-1 tracking-tight">
                Trusted by <span className="text-scara-green">Industry Giants.</span>
              </h3>
            </div>
            <span className="font-sub text-xs text-scara-grey uppercase">
              Working with the best in the game.
            </span>
          </div>

          {/* Logo grid — 8 top row, 7 bottom row */}
          <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 space-y-8">
            <div className="overflow-hidden py-2">
              <LogoLoop
                logos={SCARA_CLIENT_LOGOS.slice(0, 8)}
                speed={70}
                direction="left"
                logoHeight={48}
                gap={60}
                fadeOut
                fadeOutColor="#0a0a0a"
                scaleOnHover
                ariaLabel="Scara client brand partners row 1"
              />
            </div>
            <div className="overflow-hidden py-2 border-t border-scara-grey/10 pt-6">
              <LogoLoop
                logos={SCARA_CLIENT_LOGOS.slice(8)}
                speed={60}
                direction="right"
                logoHeight={44}
                gap={56}
                fadeOut
                fadeOutColor="#0a0a0a"
                scaleOnHover
                ariaLabel="Scara client brand partners row 2"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
