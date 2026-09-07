'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Pure lerp-based smoothing → buttery, frame-rate-independent glide.
    // A low lerp (0.06) gives long, silky inertia; the eased duration model
    // is dropped because mixing duration + lerp fights itself.
    const lenis = new Lenis({
      lerp: 0.06,                 // lower = smoother, longer glide
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,            // smooth touch inertia too
      syncTouchLerp: 0.075,
    });

    // Sync ScrollTrigger to Lenis on every scroll frame
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from the GSAP ticker for a single, perfectly-synced RAF.
    // This removes micro-jitter between Lenis scroll and ScrollTrigger updates.
    const tick = (time: number) => {
      lenis.raf(time * 1000);   // gsap ticker time is in seconds
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor links via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -70,
            duration: 1.8,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
