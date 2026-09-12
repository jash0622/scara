'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface LocationHub {
  id: string;
  name: string;
  leftPercent: number;
  topPercent: number;
  isHQ?: boolean;
  labelSide: 'right' | 'left' | 'top';
}

// Mercator formula:
// x% = (longitude + 180) / 360 * 100
// y% = (1 - ln(tan(lat*π/180) + 1/cos(lat*π/180)) / π) / 2 * 100
//
// Turkey  (Istanbul)  29°E  41°N  → x=58.1%  y=35.5%
// Dubai   (Dubai)     55°E  25°N  → x=65.3%  y=40.5%
// India   (Mumbai)    73°E  19°N  → x=70.3%  y=43.2%
// Africa  (Nairobi)   37°E  -1°S  → x=60.3%  y=50.2%

const LOCATION_HUBS: LocationHub[] = [
  {
    id: 'turkey',
    name: 'TURKEY',
    leftPercent: 58.1,
    topPercent: 37.2,
    labelSide: 'top',
  },
  {
    id: 'dubai',
    name: 'DUBAI & MENA',
    leftPercent: 65.4,
    topPercent: 48.0,
    labelSide: 'left',
  },
  {
    id: 'india',
    name: 'INDIA',
    leftPercent: 70.2,
    topPercent: 52.8,
    labelSide: 'right',
  },
  {
    id: 'africa',
    name: 'AFRICA',
    leftPercent: 52.5,
    topPercent: 62.0,
    labelSide: 'left',
  },
];

export default function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActivePin(null); }}
      className="relative w-full select-none cursor-default"
    >
      {/* 1. Base Dark Map — w-full h-auto so coordinates stay accurate */}
      <div className="relative w-full">
        <Image
          src="/map2.png"
          alt="SCARA World Map"
          width={1920}
          height={960}
          className="w-full h-auto object-contain opacity-30 filter grayscale contrast-125"
          priority
        />

        {/* 2. Torchlight spotlight — only on hover, tight radius */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            WebkitMaskImage: `radial-gradient(circle 90px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
            maskImage: `radial-gradient(circle 90px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
          }}
        >
          <Image
            src="/map2.png"
            alt=""
            width={1920}
            height={960}
            className="w-full h-auto object-contain filter brightness-125"
            aria-hidden
          />
        </div>

        {/* 3. Flight arc lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <defs>
            <linearGradient id="scaraLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C3ED00" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#898988" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Turkey → Dubai */}
          <path d="M 58.1% 37.2% Q 61.5% 41.0% 65.4% 48.0%" fill="none" stroke="url(#scaraLineGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
          {/* Dubai → India */}
          <path d="M 65.4% 48.0% Q 67.8% 49.5% 70.2% 52.8%" fill="none" stroke="url(#scaraLineGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
          {/* Turkey → Africa */}
          <path d="M 58.1% 37.2% Q 55.5% 48.0% 52.5% 62.0%" fill="none" stroke="url(#scaraLineGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
          {/* Dubai → Africa */}
          <path d="M 65.4% 48.0% Q 59.0% 54.0% 52.5% 62.0%" fill="none" stroke="url(#scaraLineGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
        </svg>

        {/* 4. Location pins */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {LOCATION_HUBS.map((hub) => {
            const isSelected = activePin === hub.id;
            return (
              <div
                key={hub.id}
                style={{ left: `${hub.leftPercent}%`, top: `${hub.topPercent}%` }}
                onMouseEnter={() => setActivePin(hub.id)}
                onMouseLeave={() => setActivePin(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
              >
                {/* Radar rings */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-7 w-7 rounded-full border border-scara-green/70 bg-scara-green/20 animate-ping opacity-75" />
                  <span className="absolute h-10 w-10 rounded-full border border-scara-green/30 animate-pulse" />
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-scara-green shadow-[0_0_12px_#C3ED00] border-2 border-scara-black transition-transform duration-300 group-hover/pin:scale-125">
                    <span className="h-1 w-1 rounded-full bg-scara-black" />
                  </span>
                </div>

                {/* Label — box stays, only border color changes on hover */}
                <div className={`absolute transition-all duration-300 flex items-center pointer-events-none whitespace-nowrap z-30 ${
                  hub.labelSide === 'right' ? 'left-full ml-3 top-1/2 -translate-y-1/2'
                  : hub.labelSide === 'left' ? 'right-full mr-3 top-1/2 -translate-y-1/2'
                  : 'left-1/2 -translate-x-1/2 -top-9'
                }`}>
                  <div className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 backdrop-blur-md transition-all duration-300 ${
                    isSelected
                      ? 'border-transparent bg-scara-black/95 text-scara-green'
                      : 'border-transparent bg-scara-card-dark/90 text-scara-white'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-scara-green animate-pulse flex-shrink-0" />
                    <span className="font-sub text-[10px] font-extrabold uppercase tracking-widest">
                      {hub.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
