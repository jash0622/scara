import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — SCARA',
  description: 'Terms and Conditions for SCARA Gaming Private Limited.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-scara-black text-scara-white">

      <div className="mx-auto max-w-4xl px-6 md:px-12 py-16 md:py-24 space-y-12">

        {/* Back link — sits below the global navbar */}
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 font-sub text-xs font-bold uppercase tracking-widest text-scara-grey hover:text-scara-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-scara-grey/15 pb-12">
          <div className="font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
            // LEGAL
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl font-extrabold uppercase text-scara-white tracking-tight leading-none">
            Terms &amp;<br /><span className="text-scara-green">Conditions.</span>
          </h1>
          <p className="font-sub text-xs text-scara-grey uppercase tracking-widest pt-2">
            Last Updated: September 2026
          </p>
        </div>

        {/* Intro */}
        <p className="font-body text-base text-scara-white/80 leading-relaxed">
          Welcome to the website of SCARA Gaming Private Limited ("SCARA", "we", "us" or "our").
          By using this website, you agree to the following terms.
        </p>

        {/* Sections */}
        <PolicySection title="Using Our Website">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            You may use the SCARA website for personal and lawful purposes. Please do not misuse the website,
            attempt to interfere with its functionality, gain unauthorised access to our systems, or use the
            website in any way that violates applicable laws.
          </p>
        </PolicySection>

        <PolicySection title="Our Content">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-3">
            All content on this website, including SCARA's name, logo, branding, designs, text, graphics,
            videos and other creative material, belongs to SCARA Gaming Private Limited or is used with
            permission from its respective owners.
          </p>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-3">
            You may not copy, reproduce, modify or commercially use our content without prior written permission.
          </p>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            Any third-party brands, logos, games or trademarks featured on the website belong to their respective owners.
          </p>
        </PolicySection>

        <PolicySection title="Information on This Website">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-3">
            We do our best to keep the information on our website accurate and up to date. However,
            information about our services, projects, partnerships and initiatives may change from time to time.
          </p>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We may update, change or remove content from the website without notice.
          </p>
        </PolicySection>

        <PolicySection title="Contacting Us">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-3">
            If you contact us through our website, we will use the information you provide to respond to your enquiry.
          </p>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-3">
            Sending us a message does not automatically create a business relationship, partnership,
            employment relationship or contract with SCARA.
          </p>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            Please avoid sending confidential or highly sensitive information through the contact form unless requested by us.
          </p>
        </PolicySection>

        <PolicySection title="Third-Party Links">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            Our website may include links to other websites or platforms. SCARA is not responsible for
            the content, availability or privacy practices of third-party websites.
          </p>
        </PolicySection>

        <PolicySection title="Disclaimer">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We aim to keep our website available and functioning properly, but we cannot guarantee that it
            will always be uninterrupted, error-free or completely secure. You use the website at your own discretion.
          </p>
        </PolicySection>

        <PolicySection title="Changes to These Terms">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We may update these Terms &amp; Conditions from time to time. Any updates will be posted on this page.
          </p>
        </PolicySection>

        <PolicySection title="Contact Us">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            If you have any questions about these Terms &amp; Conditions, please contact us at:
          </p>
          <div className="mt-4 rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-6 space-y-1">
            <p className="font-sub text-xs font-bold text-scara-white uppercase tracking-wider">
              SCARA Gaming Private Limited
            </p>
            <a
              href="mailto:contact@scara.gg"
              className="font-body text-sm text-scara-green hover:underline"
            >
              contact@scara.gg
            </a>
          </div>
        </PolicySection>

      </div>

      {/* Footer */}
      <div className="border-t border-scara-grey/10 py-6">
        <div className="mx-auto max-w-4xl px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-sub text-xs text-scara-grey/50 uppercase">
          <span>© 2026 SCARA GAMING PRIVATE LIMITED. ALL RIGHTS RESERVED.</span>
          <Link href="/privacy" className="hover:text-scara-green transition-colors">
            PRIVACY POLICY
          </Link>
        </div>
      </div>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl sm:text-2xl font-extrabold uppercase text-scara-white tracking-tight">
        {title}
      </h2>
      <div className="border-l-2 border-scara-green/30 pl-5">
        {children}
      </div>
    </div>
  );
}
