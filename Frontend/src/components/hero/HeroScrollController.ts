/**
 * HeroScrollController — 5 cinematic stages
 *
 * Pin: 400vh. scrub: 1.4.
 *
 * The hero pin ends at PURE BLACK SCREEN.
 * Spark explodes → flash holds → flash collapses → black.
 * Hands are fully dissolved before flash collapses.
 * Hero sticky div is hidden after pin completes.
 *
 * The about section reveal is handled by a SEPARATE ScrollTrigger
 * set up in setupRevealScroll() below. It is triggered after the hero
 * pin releases and the user continues scrolling.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HandSceneState } from './ParticleHandScene';

gsap.registerPlugin(ScrollTrigger);

const sub  = (p: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (p - a) / (b - a)));
const sm   = (t: number) => t * t * (3 - 2 * t);
const smQ  = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function setDom(e: HTMLElement | null, op: number, tx = 0, ty = 0) {
  if (!e) return;
  e.style.opacity    = String(Math.max(0, Math.min(1, op)));
  e.style.transform  = `translate3d(${tx}px,${ty}px,0)`;
  e.style.willChange = 'opacity,transform';
}

const CAM_X_INIT   = 1.80;
const CAM_X_CENTER = 3.00;
const CAM_Z_INIT   = 5.60;
const CAM_Z_CENTER = 4.80;

// Hands close during scroll and STOP exactly at the touch frame:
// upper hand's index finger just reaching the lower hand's thumb.
// These totals are tuned so the hands do NOT overlap/cross past each other.
const S3_UPPER_X = -0.26;   // upper drifts left toward center
const S3_UPPER_Y = -0.46;   // upper drops down
const S3_LOWER_X =  0.24;   // lower drifts right toward center
const S3_LOWER_Y =  0.42;   // lower rises up

// Stage 4 — small final nudge so fingertips just touch (no overlap)
const S4_UPPER_X = -0.06;
const S4_UPPER_Y = -0.12;
const S4_LOWER_X =  0.05;
const S4_LOWER_Y =  0.10;
const CONTACT_ROT_Z = 0.03;

// ─────────────────────────────────────────────────────────────────────────────
// HERO SCROLL — pins for 400vh, ends at pure black screen
// ─────────────────────────────────────────────────────────────────────────────
export function setupHeroScroll(
  triggerEl: HTMLElement,
  stateRef: React.MutableRefObject<HandSceneState>,
): () => void {

  const el = {
    eyebrow:  document.getElementById('hero-eyebrow'),
    headline: document.getElementById('hero-headline'),
    subline:  document.getElementById('hero-subline'),
    cta:      document.getElementById('hero-cta'),
  };

  function apply(p: number) {
    const s = stateRef.current;
    s.progress = p;

    // ── STAGE 1: 0–20% locked ────────────────────────────────────────
    if (p <= 0.20) {
      s.upperOffsetX = 0; s.upperOffsetY = 0; s.upperOffsetZ = 0;
      s.lowerOffsetX = 0; s.lowerOffsetY = 0; s.lowerOffsetZ = 0;
      s.upperRotZDelta = 0; s.lowerRotZDelta = 0;
      s.handScaleMult = 1.0;
      s.dissolve      = 0;
      s.orbitalDrift  = false;
      s.hudOpacity    = 1.0;
      s.bgOpacity     = 1.0;
      s.sparkBurst    = 0;
      s.cameraX       = CAM_X_INIT;
      s.cameraZ       = CAM_Z_INIT;
    }

    // ── STAGE 2: 20–45% content exits, hands locked ──────────────────
    if (p > 0.20 && p <= 0.45) {
      s.upperOffsetX = 0; s.upperOffsetY = 0; s.upperOffsetZ = 0;
      s.lowerOffsetX = 0; s.lowerOffsetY = 0; s.lowerOffsetZ = 0;
      s.upperRotZDelta = 0; s.lowerRotZDelta = 0;
      s.handScaleMult = 1.0;
      s.dissolve      = 0;
      s.orbitalDrift  = false;
      s.hudOpacity    = 1.0;
      s.bgOpacity     = 1.0;
      s.sparkBurst    = 0;
      s.tipGlow       = 0.35;
      s.cameraX       = CAM_X_INIT;
      s.cameraZ       = CAM_Z_INIT;
      s.energyX       = 2.38; s.energyY = -0.03; s.energyZ = 0.10;
    }

    // ── STAGE 3: 45–65% hands grow + center + bg fades ───────────────
    if (p > 0.45 && p <= 0.65) {
      const t  = sm(sub(p, 0.45, 0.65));
      const tQ = smQ(sub(p, 0.45, 0.65));

      s.handScaleMult  = lerp(1.0, 1.55, tQ);
      s.upperOffsetX   = lerp(0, S3_UPPER_X, tQ);
      s.upperOffsetY   = lerp(0, S3_UPPER_Y, tQ);
      s.upperOffsetZ   = 0;
      s.lowerOffsetX   = lerp(0, S3_LOWER_X, tQ);
      s.lowerOffsetY   = lerp(0, S3_LOWER_Y, tQ);
      s.lowerOffsetZ   = 0;
      s.upperRotZDelta = 0;
      s.lowerRotZDelta = 0;
      s.cameraX        = lerp(CAM_X_INIT, CAM_X_CENTER, t);
      s.cameraZ        = lerp(CAM_Z_INIT, CAM_Z_CENTER, t);
      s.bgOpacity      = lerp(1.0, 0.0, t);
      s.hudOpacity     = lerp(1.0, 0.4, t);
      s.orbitalDrift   = true;
      s.dissolve       = 0;
      s.sparkBurst     = 0;
      s.tipGlow        = lerp(0.35, 0.60, t);
      s.energyX        = lerp(2.38, 3.19, t);
      s.energyY        = lerp(-0.03, -0.05, t);
      s.energyZ        = 0.10;
    }

    // ── STAGE 4: 65–100% fingertips MEET, then FREEZE at touch frame ──
    // Full contact (index finger → thumb) is reached by p=0.80.
    // From 0.80→1.0 the hands HOLD completely still — no further closing,
    // no overlap, no dissolve, no spark. The scroll ends here.
    if (p > 0.65) {
      const t = sm(sub(p, 0.65, 0.80));  // full contact by p=0.80, frozen after

      s.upperOffsetX   = S3_UPPER_X + lerp(0, S4_UPPER_X, t);
      s.upperOffsetY   = S3_UPPER_Y + lerp(0, S4_UPPER_Y, t);
      s.upperOffsetZ   = 0;
      s.lowerOffsetX   = S3_LOWER_X + lerp(0, S4_LOWER_X, t);
      s.lowerOffsetY   = S3_LOWER_Y + lerp(0, S4_LOWER_Y, t);
      s.lowerOffsetZ   = 0;
      s.upperRotZDelta = lerp(0, -CONTACT_ROT_Z, t);
      s.lowerRotZDelta = lerp(0,  CONTACT_ROT_Z, t);
      s.handScaleMult  = lerp(1.55, 1.58, t);
      s.cameraX        = CAM_X_CENTER;
      s.cameraZ        = CAM_Z_CENTER;
      s.bgOpacity      = 0;
      s.hudOpacity     = lerp(0.4, 0.0, t);
      s.sparkBurst     = 0;
      s.dissolve       = 0;
      s.tipGlow        = lerp(0.60, 0.90, t);  // gentle glow at the touch point
      s.energyX        = 3.19;
      s.energyY        = lerp(-0.05, -0.10, t);
      s.energyZ        = lerp(0.10, 0.13, t);
      s.orbitalDrift   = true;
    }

    // ── DOM content fades (stage 2) ───────────────────────────────────
    if (p <= 0.20) {
      setDom(el.eyebrow,  1, 0, 0);
      setDom(el.headline, 1, 0, 0);
      setDom(el.subline,  1, 0, 0);
      setDom(el.cta,      1, 0, 0);
    } else {
      setDom(el.eyebrow,  1 - sm(sub(p, 0.20, 0.36)), sm(sub(p, 0.20, 0.36)) * -80,  sm(sub(p, 0.20, 0.36)) * -6);
      setDom(el.headline, 1 - sm(sub(p, 0.22, 0.40)), sm(sub(p, 0.22, 0.40)) * -120, 0);
      setDom(el.subline,  1 - sm(sub(p, 0.24, 0.42)), sm(sub(p, 0.24, 0.42)) * -90,  0);
      setDom(el.cta,      1 - sm(sub(p, 0.26, 0.44)), sm(sub(p, 0.26, 0.44)) * -60,  sm(sub(p, 0.26, 0.44)) * 8);
    }
  }

  const st = ScrollTrigger.create({
    trigger: triggerEl,
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.4,
    onUpdate: (self) => apply(self.progress),
    // Scroll ends at the hands-touching contact frame — hero stays visible.
    // No hiding, no black transition, no about-section reveal.
    onLeaveBack: () => {
      const s = stateRef.current;
      s.tipGlow        = 0.35;
      s.dissolve       = 0;
      s.hudOpacity     = 1.0;
      s.bgOpacity      = 1.0;
      s.sparkBurst     = 0;
      s.orbitalDrift   = false;
      s.upperOffsetX   = 0; s.upperOffsetY = 0; s.upperOffsetZ = 0;
      s.lowerOffsetX   = 0; s.lowerOffsetY = 0; s.lowerOffsetZ = 0;
      s.upperRotZDelta = 0; s.lowerRotZDelta = 0;
      s.handScaleMult  = 1.0;
      s.cameraX        = CAM_X_INIT;
      s.cameraZ        = CAM_Z_INIT;
      setDom(el.eyebrow,  1, 0, 0);
      setDom(el.headline, 1, 0, 0);
      setDom(el.subline,  1, 0, 0);
      setDom(el.cta,      1, 0, 0);
    },
  });

  return () => {
    st.kill();
    [el.eyebrow, el.headline, el.subline, el.cta].forEach((e) => {
      if (!e) return;
      e.style.opacity   = '';
      e.style.transform = '';
    });
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL SCROLL — portal animation on scroll past hero.
//
// Watches scroll position via window scroll event.
// When scroll reaches the reveal-trigger element, plays a one-shot tween.
// No ScrollTrigger scrub/pin — immune to Lenis overshoot.
// ─────────────────────────────────────────────────────────────────────────────
export function setupRevealScroll(
  revealTriggerEl: HTMLElement,
  nextSectionEl: HTMLElement,
): () => void {

  // Init: portal hidden
  nextSectionEl.style.position        = 'fixed';
  nextSectionEl.style.inset           = '0';
  nextSectionEl.style.zIndex          = '60';
  nextSectionEl.style.transformOrigin = 'center center';
  nextSectionEl.style.transform       = 'scale(0.05)';
  nextSectionEl.style.opacity         = '0';
  nextSectionEl.style.overflow        = 'hidden';
  nextSectionEl.style.clipPath        = 'circle(2% at 50% 50%)';

  let played = false;
  let tween: gsap.core.Tween | null = null;
  const proxy = { v: 0 };

  function playReveal() {
    if (played) return;
    played = true;

    tween = gsap.to(proxy, {
      v:        1,
      duration: 1.2,
      ease:     'power3.inOut',
      onUpdate: () => {
        const p  = proxy.v;
        const tR = smQ(p);
        nextSectionEl.style.transform = `scale(${lerp(0.05, 1.0, tR)})`;
        nextSectionEl.style.opacity   = String(sm(sub(p, 0, 0.3)));
        nextSectionEl.style.clipPath  = `circle(${lerp(2, 150, tR)}% at 50% 50%)`;
      },
      onComplete: () => {
        // Snap to normal document flow — scroll continues naturally
        nextSectionEl.style.position        = 'relative';
        nextSectionEl.style.inset           = '';
        nextSectionEl.style.zIndex          = '10';
        nextSectionEl.style.transformOrigin = '';
        nextSectionEl.style.transform       = 'none';
        nextSectionEl.style.opacity         = '1';
        nextSectionEl.style.clipPath        = 'none';
        nextSectionEl.style.overflow        = '';
        // Hide the black trigger permanently — removes it from layout
        revealTriggerEl.style.display = 'none';
        // Tell GSAP+Lenis the page layout changed
        ScrollTrigger.refresh();
      },
    });
  }

  function onScroll() {
    if (played) return;
    const rect = revealTriggerEl.getBoundingClientRect();
    // Fire when top of reveal-trigger is at or above 60% from viewport top
    if (rect.top <= window.innerHeight * 0.6) {
      playReveal();
    }
  }

  // Use both scroll event and a RAF loop — covers Lenis virtual scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // RAF loop as fallback for Lenis (which may not fire native scroll events)
  let rafId = 0;
  function rafCheck() {
    onScroll();
    if (!played) rafId = requestAnimationFrame(rafCheck);
  }
  rafId = requestAnimationFrame(rafCheck);

  // Also check immediately
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(rafId);
    tween?.kill();
  };
}
