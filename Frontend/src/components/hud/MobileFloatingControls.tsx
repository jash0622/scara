'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Mobile-only floating controls:
 *  1. "Work With Us" pill — bottom-center, always visible, scrolls to #contact
 *  2. Scroll-to-top arrow — bottom-right, appears only after scrolling past the hero
 *
 * Both are hidden on desktop (sm+). Rendered fixed above all content.
 */
export default function MobileFloatingControls() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show the top-arrow once user scrolls past ~80% of the viewport (past hero)
      setShowTop(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sm:hidden">
      {/* ── Work With Us — vertical pill pinned to right edge, center ── */}
      <button
        onClick={scrollToContact}
        aria-label="Work with us"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] font-heading text-[10px] font-extrabold uppercase tracking-[0.15em] text-scara-black transition-transform active:scale-95"
        style={{
          writingMode: 'vertical-rl',
          padding: '16px 6px',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          background: 'rgba(195, 237, 0, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '-4px 0 18px rgba(195, 237, 0, 0.25), -1px 0 6px rgba(0,0,0,0.35)',
        }}
      >
        Work With Us
      </button>

      {/* ── Scroll-to-top arrow — bottom right, only after hero ── */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full text-scara-green transition-all duration-300 active:scale-90"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          background: 'rgba(10, 10, 10, 0.55)',
          border: '1px solid rgba(195, 237, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: showTop ? 'auto' : 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
