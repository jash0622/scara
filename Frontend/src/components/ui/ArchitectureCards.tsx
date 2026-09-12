'use client';

import { useRef } from 'react';
import { Gamepad2, Tv, Cpu } from 'lucide-react';

// ── 3D tilt-on-hover card wrapper ─────────────────────────────────────────────
function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y - height / 2) / height) * 18;
    const rotateY = ((x - width / 2) / width) * -18;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    card.style.transition = 'transform 0.06s linear';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  };

  return (
    <div style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{
          ...style,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          // Remove overflow:hidden so children can pop forward in Z
          overflow: 'visible',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── ArchitectureCards ─────────────────────────────────────────────────────────

export default function ArchitectureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Scara Gaming */}
      <TiltCard className="relative rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 space-y-6 group hover:border-scara-green transition-colors cursor-default">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black" style={{ transform: 'translateZ(60px)', transition: 'transform 0.3s ease' }}>
          <Gamepad2 className="h-6 w-6" />
        </div>
        <div style={{ transform: 'translateZ(45px)', transition: 'transform 0.3s ease' }}>
          <span className="inline-block rounded-full bg-scara-green/20 px-3 py-1 font-sub text-[10px] font-bold text-scara-green uppercase mb-3">
            PHYGITAL FANDOM
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Gaming
          </h4>
        </div>
        <p className="font-body text-xs text-scara-grey leading-relaxed" style={{ transform: 'translateZ(30px)', transition: 'transform 0.3s ease' }}>
          Creators, communities, gaming platforms, always-on fandom building, publisher drops, and native in-game brand integrations.
        </p>
      </TiltCard>

      {/* Scara Live */}
      <TiltCard className="relative rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 space-y-6 group hover:border-scara-green transition-colors cursor-default z-[2]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black" style={{ transform: 'translateZ(60px)', transition: 'transform 0.3s ease' }}>
          <Tv className="h-6 w-6" />
        </div>
        <div style={{ transform: 'translateZ(45px)', transition: 'transform 0.3s ease' }}>
          <span className="inline-block rounded-full bg-scara-green/20 px-3 py-1 font-sub text-[10px] font-bold text-scara-green uppercase mb-3">
            PHYSICAL-FIRST FANDOM
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Live
          </h4>
        </div>
        <p className="font-body text-xs text-scara-grey leading-relaxed" style={{ transform: 'translateZ(30px)', transition: 'transform 0.3s ease' }}>
          End-to-end league management, execution, production, broadcast &amp; operations for sports. Creating arena IPs, music &amp; culture festivals, ticketed physical experiences at scale.
        </p>
      </TiltCard>

      {/* Scara Tech */}
      <TiltCard className="relative rounded-2xl border border-scara-green/40 bg-scara-olive-900/60 p-8 space-y-6 group hover:border-scara-green transition-colors cursor-default">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scara-green text-scara-black" style={{ transform: 'translateZ(60px)', transition: 'transform 0.3s ease' }}>
          <Cpu className="h-6 w-6" />
        </div>
        <div style={{ transform: 'translateZ(45px)', transition: 'transform 0.3s ease' }}>
          <span className="inline-block rounded-full bg-scara-green px-3 py-1 font-sub text-[10px] font-bold text-scara-black uppercase mb-3">
            SHARED INFRASTRUCTURE
          </span>
          <h4 className="font-heading text-2xl font-bold uppercase text-scara-white">
            Scara Tech
          </h4>
        </div>
        <p className="font-body text-xs text-scara-white/90 leading-relaxed" style={{ transform: 'translateZ(30px)', transition: 'transform 0.3s ease' }}>
          Unified campaign planning, audience performance analytics, creator &amp; vendor logistics engine delivering measurable ROI.
        </p>
      </TiltCard>

    </div>
  );
}
