'use client';

import { useState } from 'react';
import { CaseStudy, SCARA_CASE_STUDIES } from '@/data/scaraData';
import CaseStudyModal from '@/components/modals/CaseStudyModal';
import WorkCardStack from '@/components/ui/WorkCardStack';

const SORTED = [...SCARA_CASE_STUDIES].sort((a, b) => Number(b.year) - Number(a.year));

export default function WorkSection() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  return (
    <>
      <section id="work" className="relative w-full bg-scara-black py-16 md:py-24 text-scara-white overflow-hidden">
        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          onClose={() => { setSelectedCaseStudy(null); window.history.pushState(null, '', '#work'); }}
          onSelectNext={(c) => setSelectedCaseStudy(c)}
        />

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <WorkCardStack
            items={SORTED}
            onCardClick={(cs) => setSelectedCaseStudy(cs)}
          />
        </div>
      </section>
    </>
  );
}
