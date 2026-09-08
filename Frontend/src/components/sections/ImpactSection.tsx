'use client';

import React from 'react';

const TICKER_ITEMS = [
  { stat: '$3T+',    label: 'Global Entertainment & Media Market' },
  { stat: '$187.7B', label: 'Global Gaming Revenue' },
  { stat: '3.58B',   label: 'Gamers Worldwide by 2025' },
  { stat: '$1.18T',  label: 'Live Events Market by 2032' },
  { stat: '600M+',   label: 'Gamers Across India, MENA & Turkey' },
  { stat: '1B+',     label: 'Internet Users in India' },
  { stat: '97%',     label: 'Mobile-First Youth in India' },
  { stat: '80–90%+', label: 'Smartphone Penetration in Gulf Markets' },
];

// Duplicate for seamless infinite loop
const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function ImpactSection() {
  return (
    <section id="impact" className="relative w-full overflow-hidden bg-scara-black border-t border-b border-scara-green/15 py-5 mb-16 md:mb-24">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: 'ticker-scroll 32s linear infinite',
          width: 'max-content',
        }}
      >
        {ITEMS.map((item, i) => (
          <React.Fragment key={i}>
            <span className="inline-flex items-center gap-3 px-8">
              <span className="font-heading text-2xl font-extrabold text-scara-green tracking-tight">
                {item.stat}
              </span>
              <span className="font-sub text-xs font-semibold uppercase tracking-widest text-scara-white/60">
                {item.label}
              </span>
            </span>
            {/* Divider dot */}
            <span className="inline-flex items-center text-scara-green/40 text-lg select-none">
              ◆
            </span>
          </React.Fragment>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
