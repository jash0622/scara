'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CornerHUDProps {
  hidden?: boolean;
}

export default function CornerHUD({ hidden = false }: CornerHUDProps) {
  const [activeSection, setActiveSection] = useState('01 HERO');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'hero', name: '01 HERO' },
        { id: 'about', name: '02 ABOUT' },
        { id: 'services', name: '03 SERVICES' },
        { id: 'work', name: '04 OUR WORK' },
        { id: 'impact', name: '05 IMPACT' },
        { id: 'clients', name: '06 CLIENTS' },
        { id: 'insights', name: '07 INSIGHTS' },
        { id: 'contact', name: '08 CONTACT' },
      ];

      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed inset-0 z-[80] hidden lg:block"
        >
          {/* Bottom Left Corner HUD */}
          <div className="absolute bottom-6 left-8 flex items-center gap-3 font-sub text-[10px] font-medium tracking-[0.25em] text-scara-grey/60 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-scara-green animate-pulse" />
            <span>SCARA® // 2026 SEASON</span>
          </div>

          {/* Bottom Center Active Section Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sub text-[10px] font-bold tracking-[0.3em] text-scara-green uppercase bg-scara-black/60 px-4 py-1 rounded-full border border-scara-green/20 backdrop-blur-sm">
            {activeSection}
          </div>

          {/* Bottom Right Corner HUD */}
          <div className="absolute bottom-6 right-8 font-sub text-[10px] font-medium tracking-[0.25em] text-scara-grey/60 uppercase">
            IND [BOM] // TUR [IST] // UAE [DXB]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
