'use client';

import { useRef } from 'react';
import { Gamepad2, Tv, Cpu } from 'lucide-react';

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    // Use currentTarget bounds — cached by browser, no forced reflow
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 18;
    const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * -18;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    el.style.transition = 'transform 0.08s linear';
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
}

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {CARDS.map(({ img, badge, badgeStyle, title, body, border, Icon }) => (
        <TiltCard
          key={title}
          className={`group relative rounded-2xl border ${border} p-8 space-y-6 cursor-default hover:border-scara-green transition-colors overflow-hidden`}
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
  );
}
