'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Preloader        from '@/components/hud/Preloader';
import HeroSection      from '@/components/sections/HeroSection';
import AboutSection     from '@/components/sections/AboutSection';
import ServicesSection  from '@/components/sections/ServicesSection';
import WorkSection      from '@/components/sections/WorkSection';
import ImpactSection    from '@/components/sections/ImpactSection';
import InsightsSection  from '@/components/sections/InsightsSection';
import ContactSection   from '@/components/sections/ContactSection';

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
        transition={{ duration: 1.0, delay: preloaderFinished ? 0 : 7.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hero section — 400vh pin, ends at the hands-touching contact frame */}
        <HeroSection />

        {/* All sections follow in normal scroll flow after the hero pin */}
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <InsightsSection />
        <ImpactSection />
        <ContactSection />
      </motion.main>
    </>
  );
}
