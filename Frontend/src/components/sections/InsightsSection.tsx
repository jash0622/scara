'use client';

import { ExternalLink, Newspaper } from 'lucide-react';
import { SCARA_INSIGHTS } from '@/data/scaraData';

export default function InsightsSection() {
  const categories = ['Interview', 'Authored Article', 'Campaign Coverage'] as const;

  return (
    <section id="insights" className="relative w-full bg-scara-black py-24 md:py-36 text-scara-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-16">
        
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
          <p className="max-w-md font-body text-sm text-scara-grey leading-relaxed">
            Interviews, authored pieces, and editorial press coverage detailing how Scara is redefining global youth culture.
          </p>
        </div>

        {/* Grouped Editorial Articles */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const articles = SCARA_INSIGHTS.filter((a) => a.category === cat);
            if (articles.length === 0) return null;

            return (
              <div key={cat} className="space-y-6">
                <h3 className="font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase border-b border-scara-grey/20 pb-3">
                  // {cat.toUpperCase()}S
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article, i) => (
                    <a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col justify-between rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 transition-all duration-300 hover:border-scara-green hover:shadow-[0_0_30px_rgba(195,237,0,0.15)]"
                      data-cursor="READ"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-sm font-bold text-scara-green uppercase">
                            {article.outlet}
                          </span>
                          <span className="font-sub text-xs text-scara-grey">
                            {article.date}
                          </span>
                        </div>
                        <h4 className="font-heading text-xl font-extrabold uppercase text-scara-white group-hover:text-scara-green transition-colors leading-snug">
                          {article.title}
                        </h4>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-scara-grey/10 pt-4">
                        <span className="font-sub text-[10px] font-bold text-scara-grey uppercase">
                          READ ARTICLE
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-scara-black text-scara-grey transition-all group-hover:bg-scara-green group-hover:text-scara-black group-hover:translate-x-1">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
