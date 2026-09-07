'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CaseStudy, SCARA_CASE_STUDIES } from '@/data/scaraData';
import CaseStudyModal from '@/components/modals/CaseStudyModal';

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  const filterOptions = ['All', 'Gaming', 'Live', 'India', 'Global'];

  const filteredCaseStudies = SCARA_CASE_STUDIES.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'India') return item.market === 'India';
    if (activeFilter === 'Global') return item.market !== 'India';  // Turkey + Global both show
    return item.category === activeFilter;
  });

  return (
    <section id="work" className="relative w-full bg-scara-black py-24 md:py-36 text-scara-white">
      {/* Case Study Full Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => {
          setSelectedCaseStudy(null);
          window.history.pushState(null, '', '#work');
        }}
        onSelectNext={(nextCase) => setSelectedCaseStudy(nextCase)}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-12">

        {/* Section Header & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              // FLAGSHIP CAMPAIGNS & PROPRIETARY IPS
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-scara-white tracking-tight">
              Selected <span className="text-scara-green">Work.</span>
            </h2>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-scara-grey/20 bg-scara-card-dark p-1.5 backdrop-blur-md">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 font-sub text-xs font-bold uppercase transition-all ${
                  activeFilter === filter
                    ? 'bg-scara-green text-scara-black shadow-[0_0_16px_rgba(195,237,0,0.5)]'
                    : 'text-scara-grey hover:text-scara-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Work Grid Gallery */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCaseStudies.map((caseStudy) => (
              <motion.div
                layout
                key={caseStudy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedCaseStudy(caseStudy)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-scara-grey/20 bg-scara-card-dark cursor-pointer transition-all duration-500 hover:border-scara-green hover:shadow-[0_0_35px_rgba(195,237,0,0.25)]"
                data-cursor="VIEW"
              >
                {/* Hero Visual Container */}
                <div className="relative h-64 w-full overflow-hidden bg-scara-black">
                  <img
                    src={caseStudy.heroImage}
                    alt={caseStudy.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scara-card-dark via-transparent to-transparent opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-scara-black/80 px-3 py-1 font-sub text-[10px] font-bold text-scara-green border border-scara-green/30 backdrop-blur-sm uppercase">
                      {caseStudy.year} / {caseStudy.market}
                    </span>
                    {caseStudy.isFeaturedIP && (
                      <span className="flex items-center gap-1 rounded-full bg-scara-green px-3 py-1 font-sub text-[10px] font-bold text-scara-black uppercase shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        PROPRIETARY IP
                      </span>
                    )}
                  </div>

                  {/* Talent Used — bottom-left of image */}
                  {caseStudy.talent && caseStudy.talent.length > 0 && (
                    <div className="absolute bottom-4 left-4 space-y-1.5">
                      <span className="block font-sub text-[11px] font-bold uppercase tracking-wider text-scara-green">
                        Talent Used
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {caseStudy.talent.map((name, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-scara-green/40 bg-scara-black/70 px-2.5 py-0.5 font-sub text-[10px] font-semibold text-scara-white backdrop-blur-sm"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-extrabold uppercase text-scara-white group-hover:text-scara-green transition-colors leading-tight">
                      {caseStudy.title}
                    </h3>
                    <p className="font-body text-xs text-scara-grey line-clamp-2">
                      {caseStudy.shortDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-scara-grey/10 pt-4">
                    <span className="font-sub text-[10px] font-bold uppercase tracking-wider text-scara-grey">
                      {caseStudy.category}
                    </span>
                    <div className="flex items-center gap-1 font-sub text-xs font-bold text-scara-green uppercase group-hover:translate-x-1 transition-transform">
                      <span>View Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
