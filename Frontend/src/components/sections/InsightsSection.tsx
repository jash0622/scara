'use client';

import { useState } from 'react';
import { ExternalLink, Newspaper, ChevronDown, ChevronUp } from 'lucide-react';
import { SCARA_INSIGHTS } from '@/data/scaraData';

const ROW_SIZE = 3; // cards shown in first row

export default function InsightsSection() {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? SCARA_INSIGHTS : SCARA_INSIGHTS.slice(0, ROW_SIZE);

  return (
    <section id="insights" className="relative w-full bg-scara-black py-24 md:py-36 text-scara-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              <Newspaper className="h-4 w-4" />
              <span>THOUGHT LEADERSHIP & PRESS</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase text-scara-white tracking-tight">
              Insights & <span className="text-scara-green">Media.</span>
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm text-scara-grey leading-relaxed">
            Interviews and stories by Scara for the world of culture.
          </p>
        </div>

        {/* Single section — Interviews & Stories */}
        <div className="space-y-5">
          <h3 className="font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase border-b border-scara-grey/20 pb-3">
            // INTERVIEWS &amp; STORIES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visible.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-6 transition-all duration-300 hover:border-scara-green hover:shadow-[0_0_30px_rgba(195,237,0,0.12)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-bold text-scara-green uppercase truncate">
                      {article.outlet}
                    </span>
                    <span className="font-sub text-[10px] text-scara-grey shrink-0">
                      {article.date}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-extrabold uppercase text-scara-white group-hover:text-scara-green transition-colors leading-snug line-clamp-3">
                    {article.title}
                  </h4>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-scara-grey/10 pt-4">
                  <span className="font-sub text-[10px] font-bold text-scara-grey uppercase tracking-wider">
                    READ ARTICLE
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-scara-black text-scara-grey transition-all group-hover:bg-scara-green group-hover:text-scara-black group-hover:translate-x-0.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* View More / View Less */}
          {SCARA_INSIGHTS.length > ROW_SIZE && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-scara-green/40 bg-scara-black px-6 py-2.5 font-sub text-xs font-bold uppercase tracking-widest text-scara-green transition-all hover:bg-scara-green hover:text-scara-black"
              >
                {expanded ? (
                  <>View Less <ChevronUp className="h-3.5 w-3.5" /></>
                ) : (
                  <>View More ({SCARA_INSIGHTS.length - ROW_SIZE} more) <ChevronDown className="h-3.5 w-3.5" /></>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
