'use client';

import { useRef, useEffect, ReactNode } from 'react';
import './ScrollExpand.css';

interface ScrollExpandProps {
  src: string;
  videoSrc?: string;
  alt?: string;
  preTitle?: string;
  title?: string;
  subtitle?: string;
  postTitle?: string;
  postSubtitle?: string;
  postBody?: string;
  scrollHint?: string;
  children?: ReactNode;
  scrollMultiplier?: number;
}

export default function ScrollExpand({
  src,
  videoSrc,
  alt = '',
  preTitle,
  title,
  subtitle,
  postTitle,
  postSubtitle,
  postBody,
  scrollHint = 'Scroll',
  children,
  scrollMultiplier = 3,
}: ScrollExpandProps) {
  const outerRef    = useRef<HTMLDivElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null); // clip-path target
  const preRef      = useRef<HTMLDivElement>(null);
  const postRef     = useRef<HTMLDivElement>(null);
  const postSubRef  = useRef<HTMLParagraphElement>(null);
  const postBodyRef = useRef<HTMLParagraphElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);
  const dimRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    // Cache outer top offset once — avoids getBoundingClientRect on every scroll frame
    let outerTop = outer.getBoundingClientRect().top + window.scrollY;
    const onResize = () => {
      outerTop = outer.getBoundingClientRect().top + window.scrollY;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const handleScroll = () => {
      const totalScrollHeight = outer.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - outerTop;
      const rawP = Math.min(Math.max(scrolled / totalScrollHeight, 0), 1);

      // easeInOutCubic
      const eased = rawP < 0.5
        ? 4 * rawP * rawP * rawP
        : 1 - Math.pow(-2 * rawP + 2, 3) / 2;

      // ── Clip-path ─────────────────────────────────────────────────────────
      if (wrapperRef.current) {
        const hI = Math.max(0, 32 - eased * 32);
        const vI = Math.max(0, 18 - eased * 18);
        const br = Math.max(0, 20 - eased * 20);
        wrapperRef.current.style.clipPath = `inset(${vI}% ${hI}% round ${br}px)`;
      }

      // ── Dim overlay ───────────────────────────────────────────────────────
      if (dimRef.current) {
        dimRef.current.style.opacity = String(1 - eased * 0.6);
      }

      // ── Pre-content ───────────────────────────────────────────────────────
      if (preRef.current) {
        const preOp = Math.max(0, 1 - eased * 3);
        preRef.current.style.opacity   = String(preOp);
        preRef.current.style.transform = `translateY(${eased * -24}px)`;
      }

      // ── Post-content fades in after 75% expand ────────────────────────────
      const postProgress = Math.max(0, (rawP - 0.75) / 0.25);
      const postEased    = postProgress < 0.5
        ? 4 * postProgress * postProgress * postProgress
        : 1 - Math.pow(-2 * postProgress + 2, 3) / 2;
      const clampedPost  = Math.min(postEased, 1);

      if (postSubRef.current)  postSubRef.current.style.opacity  = String(clampedPost);
      if (postBodyRef.current) {
        postBodyRef.current.style.opacity   = String(clampedPost);
        postBodyRef.current.style.transform = `translateY(${(1 - clampedPost) * 40}px)`;
      }

      // ── Scroll hint ───────────────────────────────────────────────────────
      if (hintRef.current) {
        if (rawP < 0.08) {
          hintRef.current.classList.remove('hidden');
        } else {
          hintRef.current.classList.add('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial paint
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="scroll-expand-outer"
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      <div className="scroll-expand-sticky">

        {/* Expanding media */}
        <div
          ref={wrapperRef}
          className="scroll-expand-img-wrapper"
          style={{ clipPath: 'inset(18% 32% round 20px)' }}
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <img src={src} alt={alt} />
          )}
          <div className="scroll-expand-gradient" />
          <div
            ref={dimRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              opacity: 1,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* PRE-EXPAND */}
        <div
          ref={preRef}
          className="scroll-expand-pre-content"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          {preTitle && <span className="scroll-expand-eyebrow">{preTitle}</span>}
          {title && (
            <h2 className="scroll-expand-title">
              {title.split('\n').map((line, i) => (
                <span key={i} style={i > 0 ? { color: '#C3ED00', display: 'block' } : { display: 'block' }}>
                  {line}
                </span>
              ))}
            </h2>
          )}
          {subtitle && <p className="scroll-expand-subtitle">{subtitle}</p>}
        </div>

        {/* POST-EXPAND */}
        <div
          ref={postRef}
          className="scroll-expand-post-content"
          style={{ opacity: 1, transform: 'translateX(-50%) translateY(0px)' }}
        >
          {postTitle && (
            <h2 className="scroll-expand-post-title">
              {postTitle.split('\n').map((line, i) => (
                <span key={i} style={i > 0 ? { color: '#C3ED00', display: 'block' } : { display: 'block' }}>
                  {line}
                </span>
              ))}
            </h2>
          )}
          {postSubtitle && postSubtitle.length > 0 && (
            <p
              ref={postSubRef}
              className="scroll-expand-post-subtitle"
              style={{ opacity: 0, color: '#C3ED00', fontWeight: 700, letterSpacing: '0.18em', fontSize: 'clamp(11px, 1.1vw, 13px)', textTransform: 'uppercase' }}
            >
              {postSubtitle}
            </p>
          )}
          {postBody && (
            <p
              ref={postBodyRef}
              className="scroll-expand-post-body"
              style={{ opacity: 0, transform: 'translateY(40px)', transition: 'none' }}
            >
              {postBody}
            </p>
          )}
          {children}
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="scroll-expand-hint">
          <span>{scrollHint}</span>
          <div className="scroll-expand-hint-line" />
        </div>

      </div>
    </div>
  );
}
