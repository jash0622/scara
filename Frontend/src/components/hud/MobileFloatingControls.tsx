'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Mobile-only floating controls:
 *  1. "Work With Us" pill — bottom-center, always visible, scrolls to #contact
 *  2. Scroll-to-top arrow — bottom-right, appears only after scrolling past the hero
 *
 * Both are hidden on desktop (sm+). Rendered fixed above all content.
 */
export default function MobileFloatingControls() {
  const [showTop, setShowTop] = useState(false);
  const [pillExpanded, setPillExpanded] = useState(false);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      // Only show once user is past the hero AND actively scrolling
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      setShowTop(pastHero);

      // Hide the arrow shortly after scrolling stops
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setShowTop(false), 1400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sm:hidden">
      {/* ── Work With Us — collapsible vertical pill pinned to right edge ── */}
      <div
        className="fixed right-0 top-1/2 z-[90]"
        style={{
          transform: `translateY(-50%) translateX(${pillExpanded ? '0' : '100%'})`,
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* The pill itself — links to contact */}
        <button
          onClick={scrollToContact}
          aria-label="Work with us"
          className="font-heading text-[10px] font-extrabold uppercase tracking-[0.15em] text-scara-black transition-transform active:scale-95"
          style={{
            writingMode: 'vertical-rl',
            padding: '16px 6px',
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
            background: 'rgba(195, 237, 0, 0.9)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.3)',
          }}
        >
          Work With Us
        </button>

        {/* Slim handle notch — sits just outside the left edge of the pill */}
        <button
          onClick={() => setPillExpanded((v) => !v)}
          aria-label={pillExpanded ? 'Hide work with us' : 'Show work with us'}
          aria-expanded={pillExpanded}
          className="absolute top-1/2 -translate-y-1/2 flex h-9 w-4 items-center justify-center text-scara-black transition-transform active:scale-95"
          style={{
            right: '100%',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            background: 'rgba(195, 237, 0, 0.95)',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.25)',
          }}
        >
          {pillExpanded ? (
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </button>
      </div>

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
