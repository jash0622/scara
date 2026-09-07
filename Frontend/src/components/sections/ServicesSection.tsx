'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { SCARA_SERVICES, ServiceItem } from '@/data/scaraData';
import ArchitectureCards from '@/components/ui/ArchitectureCards';

// Extended service detail specifications for rich dropdown drawers
const SERVICE_DETAILS: Record<string, { category: string; loadouts: string[]; highlight: string }> = {
  '01': {
    category: 'STRATEGY & AUDIENCE INTELLIGENCE',
    loadouts: [
      'Cultural Positioning & Narrative Architecture',
      'Audience Intelligence & Fandom Mapping',
      'Campaign Loadout Blueprinting',
      'Gen-Z & Millennial Cross-Market Strategy'
    ],
    highlight: 'Combat-ready brand systems built for global scale and local cultural relevance.'
  },
  '02': {
    category: 'CREATOR NETWORK & INFLUENCER ENGINE',
    loadouts: [
      'Multi-Tier Creator Sourcing & Whitelisting',
      'UGC Campaign & Challenge Frameworks',
      'Hyper-Local Regional Language Adaptation',
      'Creator Campaign Performance Analytics'
    ],
    highlight: 'Always-on network spanning top gaming, lifestyle & sports creators across India, Turkey & MENA.'
  },
  '03': {
    category: 'GAMING & PUBLISHER GROWTH',
    loadouts: [
      'AAA & Mobile Publisher Growth Strategies',
      'Ultra-Efficient CPI Performance Marketing',
      'Discord Fandom Hub Architecture & Moderation',
      'Viral In-Game & Out-of-Game Event Drops'
    ],
    highlight: 'Proven playbook powering millions of downloads for global gaming giants like KONAMI & Supercell.'
  },
  '04': {
    category: 'SPORTS & ATHLETE ENDORSEMENTS',
    loadouts: [
      'Star Athlete Strategic Endorsements',
      'Destination & Tourism Sports Campaigns',
      'League & Franchise IP Conceptualization',
      'Grassroots to Elite Fan Engagement'
    ],
    highlight: 'Uniting world-class athletes (KL Rahul, Gurpreet Sandhu) with global destination brands.'
  },
  '05': {
    category: 'ARENA STAGE & PHYSICAL ACTIVATIONS',
    loadouts: [
      'Arena & Stadium Physical Production',
      'Turnkey Ticketed Youth Culture Festivals',
      'Multi-Cam Broadcast Stage Design',
      'Experiential Brand Booths & Pop-ups'
    ],
    highlight: 'Transforming passive spectators into unshakeable real-world brand advocates.'
  },
  '06': {
    category: 'GLOBAL MEDIA & PR AMPLIFICATION',
    loadouts: [
      'Tier-1 Global & Regional Media Distribution',
      'Executive Thought Leadership & Keynotes',
      'Cultural Event PR & Red Carpet Activations',
      'Real-Time Crisis & Brand Reputation Management'
    ],
    highlight: 'Featured across CNBC TV18, Times of India, IGN, ET BrandEquity & Outlook.'
  },
  '07': {
    category: 'ESPORTS & COMPETITIVE BROADCAST',
    loadouts: [
      'Turnkey Esports League & Circuit Operations',
      'High-Definition Multi-Cam Stream Production',
      'Custom In-Stream HUD & Broadcast Graphics',
      'Prize Pool & Player Operations Management'
    ],
    highlight: 'Broadcast-grade live event engines engineered for maximum Twitch, YouTube & TV viewership.'
  },
  '08': {
    category: 'VIRTUAL ASSETS & IN-GAME IP',
    loadouts: [
      '3D Digital Wearable & Kit Fabrication',
      'Artist x Game IP Collaboration Curation',
      'Cultural Festive In-Game Drops (Holi, Ramadan, etc.)',
      'In-Engine Asset Integration & Optimization'
    ],
    highlight: 'Designing iconic virtual jerseys and digital assets worn by millions of players worldwide.'
  }
};

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<ServiceItem | null>(null);
  const [expandedNumber, setExpandedNumber] = useState<string | null>('01'); // Default open 01 for great first impression
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const toggleExpand = (number: string) => {
    setExpandedNumber(prev => (prev === number ? null : number));
  };

  return (
    <section
      id="services"
      onMouseMove={handleMouseMove}
      className="relative w-full bg-scara-black py-24 md:py-36 text-scara-white overflow-hidden"
    >
      {/* Floating Awwwards-style Hover Preview Panel (Only active when NOT hovering over open dropdown drawer) */}
      <AnimatePresence>
        {hoveredService && expandedNumber !== hoveredService.number && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            style={{
              left: mousePos.x + 24,
              top: mousePos.y - 120,
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            className="pointer-events-none absolute z-40 hidden lg:block h-56 w-80 overflow-hidden rounded-2xl border border-scara-green/60 shadow-[0_0_35px_rgba(195,237,0,0.35)] bg-scara-card-dark"
          >
            <img
              src={hoveredService.bgImage}
              alt={hoveredService.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scara-black via-scara-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="font-heading text-lg font-black text-scara-green uppercase tracking-wide">
                {hoveredService.number} // {hoveredService.title}
              </span>
              <span className="font-sub text-[10px] text-scara-grey uppercase font-bold border border-scara-green/40 px-2 py-0.5 rounded-full bg-scara-black/60">
                CLICK TO EXPAND
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              <Sparkles className="h-4 w-4" />
              // WHAT WE DO
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-scara-white tracking-tight">
              Capabilities & <br />
              <span className="text-scara-green">Loadouts.</span>
            </h2>
          </div>
          <p className="max-w-md font-body text-sm text-scara-grey leading-relaxed">
            Content is engineered like loadouts — built for speed, global reach, and real-world impact across physical and digital fronts. Click any loadout to inspect specifications.
          </p>
        </div>

        {/* Index-Style Accordion Row List */}
        <div className="divide-y divide-scara-grey/15 border-t border-b border-scara-grey/15">
          {SCARA_SERVICES.map((service) => {
            const isExpanded = expandedNumber === service.number;
            const details = SERVICE_DETAILS[service.number] || {
              category: 'LOADOUT SPECIFICATION',
              loadouts: [
                'Full-Funnel Campaign Blueprinting',
                'Creator Network Execution',
                'Performance ROI Tracking',
                'Cross-Platform Content Amplification'
              ],
              highlight: 'Engineered for high-impact brand activation across target territories.'
            };

            return (
              <div
                key={service.number}
                className={`group transition-all duration-300 rounded-2xl my-1 border ${
                  isExpanded
                    ? 'bg-scara-card-dark/80 border-scara-green/40 shadow-[0_0_25px_rgba(195,237,0,0.1)]'
                    : 'border-transparent hover:bg-scara-card-dark/40'
                }`}
              >
                {/* Main Interactive Service Row Header */}
                <div
                  onClick={() => toggleExpand(service.number)}
                  onMouseEnter={() => setHoveredService(service)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 px-4 md:px-6 cursor-pointer select-none"
                  data-cursor="CLICK TO VIEW"
                >
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className={`font-heading text-xl md:text-2xl font-bold transition-colors ${
                      isExpanded ? 'text-scara-green' : 'text-scara-grey group-hover:text-scara-green'
                    }`}>
                      {service.number}
                    </span>
                    <h3 className={`font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase transition-colors ${
                      isExpanded ? 'text-scara-green' : 'text-scara-white group-hover:text-scara-green'
                    }`}>
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:max-w-md">
                    <p className={`font-body text-xs md:text-sm line-clamp-1 transition-colors ${
                      isExpanded ? 'text-scara-white' : 'text-scara-grey group-hover:text-scara-white'
                    }`}>
                      {service.description}
                    </p>
                    
                    {/* Action Icon Toggle */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isExpanded
                        ? 'border-scara-green bg-scara-green text-scara-black rotate-180 shadow-[0_0_12px_rgba(195,237,0,0.4)]'
                        : 'border-scara-grey/30 text-scara-grey group-hover:border-scara-green group-hover:bg-scara-green group-hover:text-scara-black'
                    }`}>
                      <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Seamless Inline Dropdown Content (No separate inner box, compact height) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`drawer-${service.number}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.08 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.28, ease: [0.7, 0, 0.84, 0] },
                          opacity: { duration: 0.15 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-6 pb-6 pt-2 border-t border-scara-grey/15">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          
                          {/* LEFT COLUMN: Compact Preview Image */}
                          <motion.div 
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="md:col-span-4 relative h-48 sm:h-52 md:h-56 rounded-xl overflow-hidden border border-scara-green/30 shadow-[0_0_20px_rgba(195,237,0,0.12)] group/img"
                          >
                            <img
                              src={service.bgImage}
                              alt={service.title}
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-scara-black/80 via-transparent to-transparent" />
                            
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <span className="font-sub text-[10px] text-scara-green font-bold uppercase tracking-wider bg-scara-black/80 px-2 py-0.5 rounded border border-scara-green/30">
                                {service.number} // PREVIEW
                              </span>
                            </div>
                          </motion.div>

                          {/* RIGHT COLUMN: Compact Content & Deliverables */}
                          <motion.div 
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.12 }}
                            className="md:col-span-8 flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Category Tag */}
                              <div className="inline-flex items-center gap-1.5 font-sub text-[10px] font-bold text-scara-green uppercase tracking-wider">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                // {details.category}
                              </div>

                              {/* Highlight Text */}
                              <p className="font-body text-xs md:text-sm text-scara-white/90 leading-relaxed font-medium">
                                {details.highlight}
                              </p>

                              {/* Loadout Deliverables Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {details.loadouts.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center gap-2 rounded-lg border border-scara-grey/15 bg-scara-black/30 px-3 py-2 transition-colors hover:border-scara-green/30"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-scara-green" />
                                    <span className="font-body text-[11px] font-medium text-scara-white/80 line-clamp-1">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="pt-2 flex items-center justify-between gap-4">
                              <a
                                href="#contact"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-scara-green px-4 py-2 font-sub text-[11px] font-black uppercase text-scara-black transition-all hover:bg-scara-white hover:scale-[1.02] shadow-[0_0_12px_rgba(195,237,0,0.25)]"
                              >
                                REQUEST LOADOUT BRIEF
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedNumber(null);
                                }}
                                className="font-sub text-[10px] text-scara-grey hover:text-scara-green uppercase tracking-wider transition-colors"
                              >
                                [ CLOSE ]
                              </button>
                            </div>

                          </motion.div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Reuters Pull-Quote Banner */}
        <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-scara-green/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl space-y-4">
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
              REUTERS MARKET INSIGHT
            </span>
            <blockquote className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-scara-white leading-snug">
              "Digital campaigns now represent 72% of total ad revenue worldwide — and effective creative integration across channels is critical to capturing this growth."
            </blockquote>
            <p className="font-sub text-xs text-scara-grey uppercase">
              SOURCE: REUTERS GLOBAL MEDIA REPORT
            </p>
          </div>
        </div>

        {/* How Scara Is Structured Sub-Block */}
        <div className="space-y-8">
          <div>
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
              // SCARA ARCHITECTURE
            </span>
            <h3 className="font-heading text-3xl font-bold uppercase text-scara-white mt-1">
              How Scara Is Structured
            </h3>
          </div>

          {/* Cards fan out from behind the center card on scroll */}
          <ArchitectureCards />
        </div>

      </div>
    </section>
  );
}

