'use client';

import { useRef, forwardRef } from 'react';
import { Gamepad2, Tv, Cpu } from 'lucide-react';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(function TiltCard(
  { children, className, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Cache bounds once on enter — no getBoundingClientRect per mousemove
    rectRef.current = e.currentTarget.getBoundingClientRect();
    const el = ref.current;
    if (el) el.style.transition = 'transform 0.12s linear';
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    const rect = rectRef.current;
    if (!el || !rect) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    // Throttle DOM writes to one per animation frame
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rx = ((clientY - rect.top - rect.height / 2) / rect.height) * 14;
      const ry = ((clientX - rect.left - rect.width / 2) / rect.width) * -14;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ touchAction: 'pan-y', willChange: 'transform' }}
      {...rest}
    >
      {children}
    </div>
  );
});

const CARDS = [
  {
    img: '/Scara Structured/Scara Gaming.jpg',
    badge: 'PHYGITAL FANDOM',
    badgeStyle: 'bg-scara-green/20 text-scara-green',
    title: 'Scara Gaming',
    body: 'Creators, communities, gaming platforms, always-on fandom building, publisher drops, and native in-game brand integrations.',
    border: 'border-scara-grey/20',
    Icon: Gamepad2,
  },
  {
    img: '/Scara Structured/Scara Live.jpg',
    badge: 'PHYSICAL-FIRST FANDOM',
    badgeStyle: 'bg-scara-green/20 text-scara-green',
    title: 'Scara Live',
    body: 'End-to-end league management, execution, production, broadcast & operations for sports. Creating arena IPs, music & culture festivals, ticketed physical experiences at scale.',
    border: 'border-scara-grey/20',
    Icon: Tv,
  },
  {
    img: '/Scara Structured/Scara Tech.jpg',
    badge: 'SHARED INFRASTRUCTURE',
    badgeStyle: 'bg-scara-green text-scara-black',
    title: 'Scara Tech',
    body: 'Unified campaign planning, audience performance analytics, creator & vendor logistics engine delivering measurable ROI.',
    border: 'border-transparent',
    Icon: Cpu,
  },
];

export default function ArchitectureCards() {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {CARDS.map(({ img, badge, badgeStyle, title, body, border, Icon }, i) => (
        <TiltCard
          key={title}
          data-arch-dir={i % 2 === 0 ? 'left' : 'right'}
          className={`arch-card group relative rounded-2xl border ${border} p-8 space-y-6 cursor-default hover:border-scara-green transition-colors overflow-hidden`}
        >
          {/*
            Single background layer using CSS multi-background:
            1st layer: rgba black overlay (always on top of image)
            2nd layer: the actual photo
            This is guaranteed to work — no absolute positioning needed.
          */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)),
                url('${img}') center/cover no-repeat
              `,
              backfaceVisibility: 'hidden',
            }}
          />

          {/* Icon */}
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black">
            <Icon className="h-6 w-6" />
          </div>

          {/* Badge + Title */}
          <div className="relative z-10">
            <span className={`inline-block rounded-full px-3 py-1 font-sub text-[10px] font-bold uppercase mb-3 ${badgeStyle}`}>
              {badge}
            </span>
            <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">{title}</h4>
          </div>

          {/* Body */}
          <p className="relative z-10 font-body text-xs text-scara-grey leading-relaxed">{body}</p>

          {/* Hover green tint */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(195,237,0,0.10) 0%, transparent 60%)' }} />
        </TiltCard>
      ))}
    </div>

    {/*
      Mobile-only reveal. Uses native CSS scroll-driven animation
      (animation-timeline: view()) — runs on the compositor, perfectly smooth,
      no JS, no observer, no flash. Guarded by @supports so unsupported browsers
      simply show the cards normally (no hiding, no jank). Desktop untouched.
    */}
    <style jsx global>{`
      @media (max-width: 767px) {
        @supports (animation-timeline: view()) {
          .arch-card {
            opacity: 0;
            animation: arch-enter-left linear both;
            animation-timeline: view();
            /* Play the reveal while the card travels through the lower portion
               of the viewport, finishing before it reaches the middle. */
            animation-range: entry 0% cover 40%;
          }
          .arch-card[data-arch-dir='right'] {
            animation-name: arch-enter-right;
          }
        }
      }

      @keyframes arch-enter-left {
        from { opacity: 0; transform: translate3d(-56px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      @keyframes arch-enter-right {
        from { opacity: 0; transform: translate3d(56px, 0, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
      }
    `}</style>
    </>
  );
}
