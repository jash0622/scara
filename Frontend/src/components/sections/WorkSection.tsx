'use client';

import { useState, useEffect } from 'react';
import { fetchCaseStudies, CaseStudyDTO } from '@/lib/api';
import CaseStudyModal from '@/components/modals/CaseStudyModal';
import WorkCardStack from '@/components/ui/WorkCardStack';
import { type CaseStudy } from '@/lib/types';

// ── Map API DTO → frontend CaseStudy shape ────────────────────────────────────
// The frontend CaseStudy type uses pressOutlets: string[] (legacy mock data).
// API returns pressOutlets: { name, url }[]. We normalise here so the rest of
// the app (WorkCardStack, CaseStudyModal) keeps working without changes.
function mapDTO(dto: CaseStudyDTO): CaseStudy {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    client: dto.client,
    year: String(dto.year),
    market: dto.market,
    category: dto.category,
    shortDesc: dto.shortDesc,
    heroImage: dto.heroImage,
    bannerImage: dto.bannerImage ?? undefined,
    fullDesc: dto.fullDesc,
    talent: dto.talent,
    services: dto.services,
    gallery: dto.gallery,
    // Keep full press outlet objects (name + url) for clickable links in modal
    pressOutlets: dto.pressOutlets,
    isFeaturedIP: dto.isFeaturedIP,
  };
}

export default function WorkSection() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    fetchCaseStudies()
      .then((dtos) => {
        const mapped = dtos
          .map(mapDTO)
          .sort((a, b) => Number(b.year) - Number(a.year));
        setItems(mapped);
      })
      .catch((err) => {
        console.error('[WorkSection] Failed to fetch case studies:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section id="work" className="relative w-full bg-scara-black py-16 md:py-24 text-scara-white overflow-hidden">
        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          allCaseStudies={items}
          onClose={() => { setSelectedCaseStudy(null); window.history.pushState(null, '', '#work'); }}
          onSelectNext={(c) => setSelectedCaseStudy(c)}
        />

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {loading ? (
            // Skeleton loader — matches the card stack height
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-scara-green border-t-transparent animate-spin" />
                <span className="font-sub text-xs text-scara-grey uppercase tracking-widest">
                  Loading Campaigns...
                </span>
              </div>
            </div>
          ) : (
            <WorkCardStack
              items={items}
              onCardClick={(cs) => setSelectedCaseStudy(cs)}
            />
          )}
        </div>
      </section>
    </>
  );
}
