'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AboutTitle — two-column About hero.
//
// LEFT  : 4-line Anton heading animated with SplitText (GSAP char-by-char).
//         Lines 1-2 → stroke/outline style.
//         Lines 3-4 → solid #C3ED00 fill.
//         Last word "PHYSICALLY" ends with a blinking _ cursor.
// RIGHT : 3 structured body paragraphs, each fades up on scroll via CSS.
// BG    : subtle green radial glow behind the left column.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import dynamic from 'next/dynamic';

// SplitText uses GSAP which must be client-only
const SplitText = dynamic(() => import('./SplitText'), { ssr: false });

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TextSegment {
  text: string;
  bold?: boolean;
}

export interface ParagraphBlock {
  segments: TextSegment[];
  dim?: boolean;
}

export interface AboutTitleProps {
  paragraphs: ParagraphBlock[];
}

// ── Paragraph renderer ────────────────────────────────────────────────────────

function RichParagraph({ block, animClass }: { block: ParagraphBlock; animClass: string }) {
  const baseColor = block.dim ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.62)';
  return (
    <p
      className={animClass}
      style={{
        fontFamily: 'var(--font-poppins), Poppins, sans-serif',
        fontSize: 'clamp(13px, 1.15vw, 15px)',
        lineHeight: '1.75',
        color: baseColor,
        margin: 0,
      }}
    >
      {block.segments.map((seg, i) =>
        seg.bold ? (
          <strong key={i} style={{ color: '#ffffff', fontWeight: 700 }}>
            {seg.text}
          </strong>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AboutTitle({ paragraphs }: AboutTitleProps) {
  // Shared inline style props passed to SplitText for the heading lines
  const headingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-anton), Anton, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: '0.96',
    display: 'block',
    width: '100%',
    textAlign: 'left',
  };

  // GSAP from/to for the char animation
  const fromStroke = { opacity: 0, y: 36, skewX: 6 };
  const toStroke   = { opacity: 1, y: 0,  skewX: 0 };
  const fromFill   = { opacity: 0, y: 28, skewX: 4 };
  const toFill     = { opacity: 1, y: 0,  skewX: 0 };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Ambient green glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 60% at 18% 55%, rgba(195,237,0,0.09) 0%, rgba(195,237,0,0.03) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '80px clamp(24px, 5vw, 88px)',
        }}
      >
        <div
          className="about-grid"
          style={{ display: 'grid', width: '100%', gap: 'clamp(32px, 4vw, 56px)', alignItems: 'center' }}
        >

          {/* ── LEFT: heading ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Line 1 — stroke */}
            <SplitText
              tag="span"
              text="CULTURE TODAY IS"
              splitType="chars"
              delay={22}
              duration={0.7}
              ease="power3.out"
              from={fromStroke}
              to={toStroke}
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
              className="about-heading about-stroke text-stroke-lime-fallback"
              style={headingStyle}
            />

            {/* Line 2 — stroke */}
            <SplitText
              tag="span"
              text="EXPERIENCED DIGITALLY"
              splitType="chars"
              delay={18}
              duration={0.7}
              ease="power3.out"
              from={fromStroke}
              to={toStroke}
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
              className="about-heading about-stroke text-stroke-lime-fallback"
              style={headingStyle}
            />

            {/* Line 3 — fill */}
            <SplitText
              tag="span"
              text="BUT REMEMBERED"
              splitType="chars"
              delay={20}
              duration={0.65}
              ease="power4.out"
              from={fromFill}
              to={toFill}
              threshold={0.1}
              rootMargin="0px"
              textAlign="left"
              className="about-heading about-fill"
              style={headingStyle}
            />

            {/* Line 4 — fill + blinking cursor */}
            <span style={{ display: 'block', lineHeight: '0.96' }}>
              <SplitText
                tag="span"
                text="PHYSICALLY"
                splitType="chars"
                delay={20}
                duration={0.65}
                ease="power4.out"
                from={fromFill}
                to={toFill}
                threshold={0.1}
                rootMargin="0px"
                textAlign="left"
                className="about-heading about-fill"
                style={{ ...headingStyle, display: 'inline' }}
              />
              {/* Blinking terminal cursor — replaces the full stop */}
              <span className="about-cursor" aria-hidden="true">_</span>
            </span>
          </div>

          {/* ── RIGHT: paragraphs ─────────────────────────────────────── */}
          <div
            className="about-right-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              paddingLeft: 'clamp(24px, 3vw, 48px)',
            }}
          >
            {paragraphs[0] && <RichParagraph block={paragraphs[0]} animClass="about-para about-para-1" />}
            {paragraphs[1] && <RichParagraph block={paragraphs[1]} animClass="about-para about-para-2" />}
            {paragraphs[2] && <RichParagraph block={paragraphs[2]} animClass="about-para about-para-3" />}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 4vw, 40px)',
          right: 'clamp(24px, 5vw, 88px)',
          zIndex: 2,
        }}
      >
        <span
          className="animate-scroll-blink"
          style={{
            fontFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            userSelect: 'none',
          }}
        >
          [ SCROLL TO CONTINUE ]
        </span>
      </div>

      <style>{`
        /* Heading size */
        .about-heading {
          font-size: clamp(44px, 6.4vw, 104px) !important;
        }

        /* Stroke lines — transparent + lime outline */
        .about-stroke {
          color: transparent !important;
          -webkit-text-stroke: 1.5px #C3ED00 !important;
        }

        /* Fill lines — solid lime */
        .about-fill {
          color: #C3ED00 !important;
          -webkit-text-stroke: 0px transparent !important;
        }

        /* Blinking terminal cursor */
        .about-cursor {
          display: inline-block;
          font-family: var(--font-anton), Anton, sans-serif;
          font-size: clamp(44px, 6.4vw, 104px);
          line-height: 0.96;
          color: #C3ED00;
          letter-spacing: -0.02em;
          animation: aboutCursorBlink 0.9s step-start infinite;
          margin-left: 1px;
          vertical-align: baseline;
        }
        @keyframes aboutCursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Paragraph scroll-fade-up via CSS animation + IntersectionObserver-friendly
           approach: use @keyframes triggered by the .in-view class added by GSAP
           ScrollTrigger scroll position. We simply use CSS animation-delay stagger. */
        .about-para {
          opacity: 0;
          transform: translateY(22px);
          animation: aboutParaReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
          animation-play-state: paused;
        }
        .about-para.is-visible {
          animation-play-state: running;
        }
        .about-para-1 { animation-delay: 0s;    }
        .about-para-2 { animation-delay: 0.12s; }
        .about-para-3 { animation-delay: 0.24s; }
        @keyframes aboutParaReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Desktop two-column */
        @media (min-width: 1024px) {
          .about-grid { grid-template-columns: 55fr 45fr; }
          .about-right-col { border-left: 1px solid rgba(255,255,255,0.09); }
        }

        /* Mobile */
        @media (max-width: 1023px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-right-col { padding-left: 0 !important; border-left: none; }
          .about-heading { font-size: clamp(44px, 10vw, 72px) !important; }
          .about-cursor  { font-size: clamp(44px, 10vw, 72px) !important; }
        }

        /* Firefox fallback for -webkit-text-stroke */
        @supports not (-webkit-text-stroke: 1px) {
          .text-stroke-lime-fallback {
            color: transparent !important;
            text-shadow:
               1px  0   0 #C3ED00, -1px  0   0 #C3ED00,
               0    1px 0 #C3ED00,  0   -1px 0 #C3ED00,
               1px  1px 0 #C3ED00, -1px -1px 0 #C3ED00,
               1px -1px 0 #C3ED00, -1px  1px 0 #C3ED00;
          }
        }
      `}</style>

      {/* Paragraph visibility trigger — uses IntersectionObserver to add .is-visible */}
      <ParagraphReveal />
    </section>
  );
}

// ── Small client component: triggers CSS paragraph animation via IO ────────────

function ParagraphReveal() {
  React.useEffect(() => {
    const paras = document.querySelectorAll<HTMLElement>('.about-para');
    if (!paras.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-40px' }
    );

    paras.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
