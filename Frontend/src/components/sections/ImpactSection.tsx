'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function ImpactSection() {
  const stats = [
    {
      number: '$3T+',
      label: 'Global Entertainment & Media Market',
      citation: 'Source: PwC Global E&M Outlook 2024–28',
    },
    {
      number: '$187.7B',
      label: 'Global Gaming Revenue (3.58B Players by 2025)',
      citation: 'Source: PwC & Newzoo Global Gaming Data',
    },
    {
      number: '$1.18T',
      label: 'Live Events Market Projected by 2032 ($652.6B current)',
      citation: 'Source: Market Research Future',
    },
    {
      number: '600M+',
      label: 'Gamers & Cultural Consumers Across India, MENA & Turkey',
      citation: 'Source: Scara Intelligence Loadout',
    },
    {
      number: '1B+',
      label: 'Internet Users in India (97% Mobile-First Youth)',
      citation: 'Source: TRAI & Ministry of Electronics',
    },
    {
      number: '80–90%+',
      label: 'Smartphone Penetration in UAE, Saudi & Kuwait',
      citation: 'Source: Reuters & Regional Telecoms',
    },
  ];

  return (
    <section id="impact" className="relative w-full bg-scara-olive-900/40 py-24 md:py-36 text-scara-white border-t border-b border-scara-green/20">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              <TrendingUp className="h-4 w-4" />
              <span>DATA & MARKET DYNAMICS</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-scara-white tracking-tight">
              Global <span className="text-scara-green">Headroom.</span>
            </h2>
          </div>
          <p className="max-w-md font-body text-sm text-scara-grey leading-relaxed">
            Grounding every strategy in empirical market math — positioning brands at the center of the fastest-growing entertainment funnels globally.
          </p>
        </div>

        {/* Big Number Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl border border-scara-green/20 bg-scara-black/80 p-8 space-y-4 transition-all duration-300 hover:border-scara-green hover:shadow-[0_0_30px_rgba(195,237,0,0.2)]"
            >
              <div className="font-heading text-5xl sm:text-6xl font-extrabold text-scara-green tracking-tight group-hover:scale-105 transition-transform origin-left">
                {stat.number}
              </div>
              <h3 className="font-heading text-lg font-bold uppercase text-scara-white leading-snug">
                {stat.label}
              </h3>
              <p className="font-sub text-[10px] uppercase tracking-wider text-scara-grey border-t border-scara-grey/10 pt-3">
                {stat.citation}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Market Growth SVG Trajectory Visualization */}
        <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                2024 – 2032 REVENUE TRAJECTORY
              </span>
              <h3 className="font-heading text-2xl font-bold uppercase text-scara-white">
                Live Events & Gaming Market Scale
              </h3>
            </div>
            <div className="flex items-center gap-4 font-sub text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5 text-scara-green">
                <span className="h-3 w-3 rounded-full bg-scara-green" /> Gaming ($187B+)
              </span>
              <span className="flex items-center gap-1.5 text-scara-white">
                <span className="h-3 w-3 rounded-full bg-scara-white" /> Live IPs ($1.18T)
              </span>
            </div>
          </div>

          {/* SVG Animated Path */}
          <div className="relative h-48 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 800 150" fill="none">
              {/* Grid Background Lines */}
              <line x1="0" y1="30" x2="800" y2="30" stroke="#1f1f1f" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#1f1f1f" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="800" y2="130" stroke="#1f1f1f" strokeDasharray="4 4" />

              {/* Gaming Growth Curve (Neon Green) */}
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                d="M0,120 Q200,90 400,60 T800,20"
                stroke="#C3ED00"
                strokeWidth="4"
                fill="none"
              />

              {/* Live Events Growth Curve (White) */}
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
                d="M0,140 Q200,110 400,70 T800,30"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
