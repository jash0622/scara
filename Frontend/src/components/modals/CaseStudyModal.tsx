'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { CaseStudy, SCARA_CASE_STUDIES } from '@/data/scaraData';
import DepthCarousel from '@/components/ui/DepthCarousel';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onSelectNext: (nextCase: CaseStudy) => void;
}

export default function CaseStudyModal({ caseStudy, onClose, onSelectNext }: CaseStudyModalProps) {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Focus trap, lock scroll, and escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedLightboxImage) {
          setSelectedLightboxImage(null);
        } else {
          onClose();
        }
      }
    };

    if (caseStudy) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [caseStudy, onClose, selectedLightboxImage]);

  // Find next/prev case study
  const currentIndex = caseStudy
    ? SCARA_CASE_STUDIES.findIndex((c) => c.id === caseStudy.id)
    : 0;
  const nextCaseStudy = SCARA_CASE_STUDIES[(currentIndex + 1) % SCARA_CASE_STUDIES.length];
  const prevCaseStudy = SCARA_CASE_STUDIES[(currentIndex - 1 + SCARA_CASE_STUDIES.length) % SCARA_CASE_STUDIES.length];

  // Combine hero image + gallery images for DepthCarousel
  const galleryImages = caseStudy
    ? [caseStudy.heroImage, ...(caseStudy.gallery || [])]
    : [];

  return (
    <AnimatePresence mode="wait">
      {caseStudy && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6 pt-20 sm:pt-24 select-none">
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-scara-black/85 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            key={`modal-dialog-${caseStudy.id}`}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="relative z-10 flex max-h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-scara-green/40 bg-scara-card-dark text-scara-white shadow-[0_0_60px_rgba(0,0,0,0.95)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-scara-black/80 text-scara-white border border-scara-grey/30 backdrop-blur-md transition-all hover:bg-scara-green hover:text-scara-black hover:scale-110 shadow-lg"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable content */}
            <div
              ref={modalContentRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-8 scrollbar-thin overscroll-contain"
            >
              {/* 1. Hero Header */}
              <div className="relative h-52 sm:h-64 md:h-72 w-full overflow-hidden rounded-xl bg-scara-black border border-scara-grey/20">
                <img
                  src={caseStudy.heroImage}
                  alt={caseStudy.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scara-card-dark via-scara-card-dark/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 font-sub text-[10px] sm:text-xs font-bold uppercase tracking-wider text-scara-green">
                    <span className="rounded-full bg-scara-green px-3 py-0.5 text-scara-black font-black">
                      {caseStudy.year} / MARKET: {caseStudy.market}
                    </span>
                    <span className="rounded-full border border-scara-green/40 px-3 py-0.5 text-scara-white bg-scara-black/60">
                      {caseStudy.category}
                    </span>
                    {caseStudy.isFeaturedIP && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-scara-green/20 border border-scara-green px-3 py-0.5 text-scara-green font-bold">
                        <Sparkles className="h-3 w-3" /> PROPRIETARY IP
                      </span>
                    )}
                  </div>

                  <h2 id="modal-title" className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-scara-white leading-snug">
                    {caseStudy.title}
                  </h2>
                </div>
              </div>

              {/* 2. Overview & Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-scara-grey/15 pb-8">
                {/* Left: Services */}
                <div className="md:col-span-4 space-y-3">
                  <h3 className="font-sub text-[11px] font-bold tracking-[0.2em] text-scara-green uppercase">
                    // CAPABILITIES & SERVICES
                  </h3>
                  <ul className="space-y-1.5 font-body text-xs text-scara-grey">
                    {caseStudy.services.map((svc, i) => (
                      <li key={i} className="flex items-center gap-2 text-scara-white/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-scara-green shrink-0" />
                        <span className="font-medium">{svc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Campaign narrative */}
                <div className="md:col-span-8 space-y-3">
                  <h3 className="font-sub text-[11px] font-bold tracking-[0.2em] text-scara-green uppercase">
                    // CAMPAIGN OVERVIEW
                  </h3>
                  <div className="space-y-3 font-body text-xs sm:text-sm text-scara-white/90 leading-relaxed">
                    {caseStudy.fullDesc.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Press & Media Coverage (moved up, replaces Key Measurable Impact) */}
              {caseStudy.pressOutlets && caseStudy.pressOutlets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-sub text-[11px] font-bold tracking-[0.2em] text-scara-green uppercase">
                    // PRESS & MEDIA COVERAGE
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.pressOutlets.map((outlet, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 rounded-full border border-scara-grey/30 bg-scara-black px-4 py-1.5 font-sub text-[11px] font-semibold text-scara-white/90 transition-colors hover:border-scara-green/50 hover:text-scara-white"
                      >
                        <span>{outlet}</span>
                        <ExternalLink className="h-3 w-3 text-scara-green" />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Campaign Assets Gallery */}
              <div className="space-y-4 border-t border-scara-grey/15 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-sub text-[11px] font-bold tracking-[0.2em] text-scara-green uppercase">
                    // CAMPAIGN ASSETS GALLERY
                  </h3>
                  <span className="font-sub text-[10px] text-scara-grey uppercase font-mono">
                    SWIPE / CLICK CARDS TO EXPLORE
                  </span>
                </div>

                <div className="relative h-[340px] sm:h-[380px] w-full overflow-hidden rounded-xl border border-scara-grey/20 bg-scara-black/60 p-2">
                  <DepthCarousel
                    items={galleryImages}
                    cardWidth={240}
                    cardHeight={300}
                    radius={14}
                    depth={160}
                    spread={70}
                    tilt={16}
                    perspective={1100}
                    visibleCards={3}
                    autoplay={true}
                    autoplayDelay={3500}
                    loop={true}
                    showControls={true}
                    showIndicators={true}
                    onImageClick={(imgUrl) => setSelectedLightboxImage(imgUrl)}
                  />
                </div>
              </div>

              {/* 5. Next / Prev Navigation */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-scara-grey/20 pt-6">
                <button
                  onClick={() => onSelectNext(prevCaseStudy)}
                  className="flex items-center justify-center gap-2 font-sub text-xs font-bold text-scara-grey hover:text-scara-green uppercase transition-colors py-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="line-clamp-1">PREV: {prevCaseStudy.title}</span>
                </button>

                <button
                  onClick={() => onSelectNext(nextCaseStudy)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-scara-green px-6 py-3 font-sub text-xs font-black text-scara-black uppercase transition-all hover:bg-scara-white shadow-[0_0_20px_rgba(195,237,0,0.3)]"
                >
                  <span>NEXT CASE STUDY</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLightboxImage(null)}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-scara-black/95 p-4"
          >
            <img
              src={selectedLightboxImage}
              alt="Enlarged visual"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute top-6 right-6 rounded-full bg-scara-white/10 p-3 text-scara-white hover:bg-scara-green hover:text-scara-black"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
