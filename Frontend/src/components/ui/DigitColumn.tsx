'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DigitColumnProps {
  digit: number;
}

// Strip: [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
// digit d is at index d+1 in the strip
// To show digit d in the CENTER of a 3-row window:
//   window top = index (d+1 - 1) = d  → translateY = -d * CELL_H
// Container height = CELL_H * 3 (shows prev, current, next)
// overflow:hidden clips everything outside

const STRIP  = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // wrapped strip
const CELL_H = 20;  // px per digit row — compact height
const COL_W  = 45;  // px column width

export default function DigitColumn({ digit }: DigitColumnProps) {
  const [current, setCurrent] = useState(digit);
  const [prev,    setPrev]    = useState(digit);
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (digit === current) return;
    setPrev(current);
    setRolling(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrent(digit);
      setRolling(false);
    }, 520);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit]);

  // During roll: animate toward new digit position
  // After roll: sit at new digit position
  const activeDigit = rolling ? digit : current;
  // digit d is at index d+1 in STRIP, center it in 3-row window
  const translateY = -(activeDigit) * CELL_H; // row 0 of window = strip index [d]

  return (
    <div
      style={{
        width: COL_W,
        height: CELL_H * 3,   // shows 3 rows: prev, center, next
        borderRadius: 12,
        background: '#0e0e0e',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* ── Scrolling strip ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${translateY}px)`,
          transition: rolling
            ? 'transform 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none',
          willChange: 'transform',
        }}
      >
        {STRIP.map((d, i) => {
          const isActive = d === activeDigit && i === activeDigit + 1;
          return (
            <div
              key={i}
              style={{
                height: CELL_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.20)',
                userSelect: 'none',
              }}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* ── Top elliptical fade — prev digit fades into background ── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: CELL_H * 1.2,
          background: 'radial-gradient(ellipse 140% 100% at 50% -5%, #0e0e0e 25%, rgba(14,14,14,0.9) 55%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      {/* ── Bottom elliptical fade — next digit fades into background ── */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: CELL_H * 1.2,
          background: 'radial-gradient(ellipse 140% 100% at 50% 105%, #0e0e0e 25%, rgba(14,14,14,0.9) 55%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      {/* ── Center divider lines ── */}
      <div style={{
        position: 'absolute', top: CELL_H - 1,
        left: 6, right: 6, height: 1,
        background: 'rgba(255,255,255,0.09)',
        zIndex: 3, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: CELL_H * 2,
        left: 6, right: 6, height: 1,
        background: 'rgba(255,255,255,0.09)',
        zIndex: 3, pointerEvents: 'none',
      }} />
    </div>
  );
}
