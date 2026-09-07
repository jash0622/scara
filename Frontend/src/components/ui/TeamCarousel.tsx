'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SCARA_TEAM } from '@/data/scaraData';

export default function TeamCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Controls Bar */}
      <div className="flex items-center justify-between font-sub text-xs text-scara-grey uppercase">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-scara-green animate-ping" />
          <span>DRAG OR SWIPE TO EXPLORE LEADERSHIP ({SCARA_TEAM.length} MEMBERS)</span>
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-scara-grey/30 bg-scara-black text-scara-white hover:border-scara-green hover:text-scara-green transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-scara-grey/30 bg-scara-black text-scara-white hover:border-scara-green hover:text-scara-green transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Touch & Drag Scrollable Card Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SCARA_TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex-none w-[280px] sm:w-[320px] snap-start rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-4 transition-all duration-300 hover:border-scara-green/60 hover:shadow-[0_0_24px_rgba(195,237,0,0.15)] flex flex-col justify-between"
          >
            {/* Full-Color Photo Container */}
            <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-scara-black mb-4">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-scara-card-dark via-transparent to-transparent opacity-60" />
            </div>

            {/* Member Details directly underneath the photo card */}
            <div className="space-y-2 pt-1 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-black uppercase text-scara-white group-hover:text-scara-green transition-colors">
                  {member.name}
                </h4>
                <div className="inline-block font-sub text-[11px] font-bold uppercase tracking-wider text-scara-green bg-scara-green/10 border border-scara-green/20 rounded-md px-2.5 py-0.5">
                  {member.role}
                </div>
              </div>

              {member.bio && (
                <p className="font-body text-xs text-scara-grey leading-relaxed line-clamp-3 pt-2 border-t border-scara-grey/15 mt-3">
                  {member.bio}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
