'use client';

import React from 'react';
import DigitColumn from './DigitColumn';

interface YearOdometerProps {
  year: number;
}

export default function YearOdometer({ year }: YearOdometerProps) {
  const digits = String(year).padStart(4, '0').split('').map(Number);

  return (
    <div className="flex flex-col items-end gap-3 select-none">
      <span style={{
        fontFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", sans-serif',
        fontSize: 9, fontWeight: 700, letterSpacing: '0.28em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)',
      }}>
        ACTIVE YEAR
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {digits.map((digit, i) => (
          <DigitColumn key={i} digit={digit} />
        ))}
      </div>
    </div>
  );
}
