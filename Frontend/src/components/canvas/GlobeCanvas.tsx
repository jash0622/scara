'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface LocationHub {
  id: string;
  name: string;
  code: string;
  country: string;
  type: string;
  leftPercent: number; // Mercator Longitude %
  topPercent: number;  // Mercator Latitude %
  isHQ?: boolean;
  labelSide: 'right' | 'left' | 'top';
}

// Exact Mercator coordinates aligned to map2.png
const LOCATION_HUBS: LocationHub[] = [
  {
    id: 'turkey',
    name: 'TURKEY HUB',
    code: 'IST',
    country: 'TURKEY',
    type: 'EUROPE & TURKEY HUB',
    leftPercent: 58.1,
    topPercent: 37.2,
    labelSide: 'top',
  },
  {
    id: 'dubai',
    name: 'DUBAI & MENA',
    code: 'DXB',
    country: 'UAE',
    type: 'MIDDLE EAST HUB',
    leftPercent: 65.4,
    topPercent: 48.0,
    labelSide: 'left',
  },
  {
    id: 'india',
    name: 'INDIA',
    code: 'BOM',
    country: 'INDIA',
    type: 'GLOBAL HEADQUARTERS',
    leftPercent: 70.2,
    topPercent: 52.8,
    isHQ: false,
    labelSide: 'right',
  },
  {
    id: 'africa',
    name: 'AFRICA HUB',
    code: 'AFR',
    country: 'AFRICA',
    type: 'AFRICA HUB',
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
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActivePin(null);
      }}
      className="relative w-full max-w-5xl flex items-center justify-center overflow-hidden rounded-2xl border border-scara-grey/15 bg-scara-black/90 p-3 sm:p-6 select-none shadow-2xl group/map cursor-default"
    >
      {/* Background Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#191919_1px,transparent_1px),linear-gradient(to_bottom,#191919_1px,transparent_1px)] bg-[size:28px_28px] opacity-30 pointer-events-none" />

      {/* 1. Base Dark Map Layer */}
      <div className="relative w-full h-auto overflow-hidden rounded-xl">
        <Image
          src="/map2.png"
          alt="SCARA World Map"
          width={1920}
          height={960}
          className="w-full h-auto object-contain opacity-30 filter grayscale contrast-125 transition-opacity duration-500"
          priority
        />

        {/* 2. Torchlight Cursor Spotlight Layer (Only Torch Glow, No Cursor Circle) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0.4,
            WebkitMaskImage: isHovered
              ? `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.6) 55%, transparent 100%)`
              : `radial-gradient(circle 170px at 65% 48%, black 0%, transparent 80%)`,
            maskImage: isHovered
              ? `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.6) 55%, transparent 100%)`
              : `radial-gradient(circle 170px at 65% 48%, black 0%, transparent 80%)`,
          }}
        >
          <Image
            src="/map2.png"
            alt="SCARA Map Spotlight"
            width={1920}
            height={960}
            className="w-full h-auto object-contain opacity-100 filter brightness-125 drop-shadow-[0_0_35px_rgba(195,237,0,0.45)]"
          />
        </div>

        {/* 3. Subtle Tactical Flight Curves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <defs>
            <linearGradient id="scaraLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C3ED00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#898988" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Arc 1: Turkey -> Dubai */}
          <path
            d="M 58.1% 37.2% Q 61.5% 41.0% 65.4% 48.0%"
            fill="none"
            stroke="url(#scaraLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-dash"
          />

          {/* Arc 2: Dubai -> India */}
          <path
            d="M 65.4% 48.0% Q 67.8% 49.5% 70.2% 52.8%"
            fill="none"
            stroke="url(#scaraLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-dash"
          />

          {/* Arc 3: Turkey -> Africa */}
          <path
            d="M 58.1% 37.2% Q 55.5% 48.0% 52.5% 62.0%"
            fill="none"
            stroke="url(#scaraLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-dash"
          />

          {/* Arc 4: Dubai -> Africa */}
          <path
            d="M 65.4% 48.0% Q 59.0% 54.0% 52.5% 62.0%"
            fill="none"
            stroke="url(#scaraLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-dash"
          />
        </svg>

        {/* 4. Precision Animated Radar Markers */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {LOCATION_HUBS.map((hub) => {
            const isSelected = activePin === hub.id;
            return (
              <div
                key={hub.id}
                style={{
                  left: `${hub.leftPercent}%`,
                  top: `${hub.topPercent}%`,
                }}
                onMouseEnter={() => setActivePin(hub.id)}
                onMouseLeave={() => setActivePin(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
              >
                {/* Concentric Pulsing Radar Rings */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-7 w-7 rounded-full border border-scara-green/70 bg-scara-green/20 animate-ping duration-1000 opacity-75" />
                  <span className="absolute h-10 w-10 rounded-full border border-scara-green/30 animate-pulse duration-1500" />

                  {/* Core Glowing Dot */}
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-scara-green shadow-[0_0_12px_#C3ED00] border-2 border-scara-black transition-transform duration-300 group-hover/pin:scale-125">
                    <span className="h-1 w-1 rounded-full bg-scara-black" />
                  </span>
                </div>

                {/* Sleek Label Positioned Beside Marker (Does Not Obscure Coastline) */}
                <div
                  className={`absolute transition-all duration-300 flex items-center gap-2 pointer-events-none whitespace-nowrap z-30 ${
                    hub.labelSide === 'right'
                      ? 'left-full ml-3 top-1/2 -translate-y-1/2'
                      : hub.labelSide === 'left'
                      ? 'right-full mr-3 top-1/2 -translate-y-1/2'
                      : 'left-1/2 -translate-x-1/2 -top-9'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 backdrop-blur-md transition-all duration-300 ${
                      isSelected
                        ? 'border-scara-green bg-scara-black/95 text-scara-green shadow-[0_0_20px_rgba(195,237,0,0.4)] scale-105'
                        : 'border-scara-grey/30 bg-scara-card-dark/90 text-scara-white'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-scara-green animate-pulse" />
                    <span className="font-sub text-[10px] font-extrabold uppercase tracking-widest">
                      {hub.name}
                    </span>
                    {hub.isHQ && (
                      <span className="ml-1 rounded bg-scara-green px-1 py-0.2 font-mono text-[8px] font-black text-scara-black">
                        HQ
                      </span>
                    )}
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
