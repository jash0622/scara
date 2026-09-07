'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import './ScrollExpand.css';

interface ScrollExpandProps {
  src: string;
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
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollHeight = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / totalScrollHeight, 0), 1);
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eased = easeInOutCubic(progress);

  // Clip-path: small rounded box -> full bleed
  const hInset = Math.max(0, 32 - eased * 32);
  const vInset = Math.max(0, 18 - eased * 18);
  const borderRadius = Math.max(0, 20 - eased * 20);
  const clipPath = `inset(${vInset}% ${hInset}% round ${borderRadius}px)`;

  // Pre-content fades out as expand begins
  const preOpacity = Math.max(0, 1 - eased * 3);

  // Post-content fades in after image is ~80% expanded
  const postProgress = Math.max(0, (progress - 0.75) / 0.25);
  const postEased = easeInOutCubic(Math.min(postProgress, 1));
  const postOpacity = postEased;
  const postY = (1 - postEased) * 40;

  const hintVisible = progress < 0.08;

  return (
    <div
      ref={outerRef}
      className="scroll-expand-outer"
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      <div className="scroll-expand-sticky">
        {/* Expanding image */}
        <div
          className="scroll-expand-img-wrapper"
          style={{ clipPath, transition: 'clip-path 0.04s linear' }}
        >
          <img src={src} alt={alt} />
          {/* Gradient overlay — darkens bottom for text legibility */}
          <div className="scroll-expand-gradient" />
          {/* Overall dim overlay that lightens as image expands */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              opacity: 1 - eased * 0.6,
              pointerEvents: 'none',
              transition: 'none',
            }}
          />
        </div>

        {/* PRE-EXPAND: title visible at start, fades out */}
        <div
          className="scroll-expand-pre-content"
          style={{ opacity: preOpacity, transform: `translateY(${eased * -24}px)` }}
        >
          {preTitle && (
            <span className="scroll-expand-eyebrow">{preTitle}</span>
          )}
          {title && (
            <h2 className="scroll-expand-title">
              {title.split('\n').map((line, i) => (
                <span key={i} style={i > 0 ? { color: '#C3ED00', display: 'block' } : { display: 'block' }}>
                  {line}
                </span>
              ))}
            </h2>
          )}
          {subtitle && (
            <p className="scroll-expand-subtitle">{subtitle}</p>
          )}
        </div>

        {/* POST-EXPAND: appears after full expansion */}
        <div
          className="scroll-expand-post-content"
          style={{ opacity: postOpacity, transform: `translateX(-50%) translateY(${postY}px)` }}
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
          {postSubtitle && (
            <p className="scroll-expand-post-subtitle">{postSubtitle}</p>
          )}
          {postBody && (
            <p className="scroll-expand-post-body">{postBody}</p>
          )}
          {children}
        </div>

        {/* Scroll hint */}
        <div className={`scroll-expand-hint${hintVisible ? '' : ' hidden'}`}>
          <span>{scrollHint}</span>
          <div className="scroll-expand-hint-line" />
        </div>
      </div>
    </div>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}