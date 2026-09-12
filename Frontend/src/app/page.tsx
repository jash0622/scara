'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Preloader        from '@/components/hud/Preloader';
import HeroSection      from '@/components/sections/HeroSection';
import AboutSection     from '@/components/sections/AboutSection';
import ServicesSection  from '@/components/sections/ServicesSection';
import WorkSection      from '@/components/sections/WorkSection';
import InsightsSection  from '@/components/sections/InsightsSection';
import ContactSection   from '@/components/sections/ContactSection';
import CircularTeamGallery from '@/components/ui/CircularTeamGallery';

export default function Home() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  return (
    <>
      {!preloaderFinished && (
        <Preloader onComplete={() => setPreloaderFinished(true)} />
      )}

      <motion.main
        className="w-full origin-top"
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1.0, delay: preloaderFinished ? 0 : 5.75, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. About text + expand + Architecture + Stats + Clients */}
        <AboutSection />

        {/* 3. What We Do — Services */}
        <ServicesSection />

        {/* 4. Selected Work */}
        <WorkSection />

        {/* 5. Leadership & Visionaries */}
        <section id="team" className="relative w-full bg-scara-black py-16 md:py-24 text-scara-white">
          <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                  // LEADERSHIP & VISIONARIES
                </span>
                <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase text-scara-white mt-1">
                  Built By Industry Veterans.
                </h3>
              </div>
            </div>
            <CircularTeamGallery />
          </div>
        </section>

        {/* 6. Insights & Media */}
        <InsightsSection />

        {/* 7. Contact + Footer */}
        <ContactSection />
      </motion.main>
    </>
  );
}
