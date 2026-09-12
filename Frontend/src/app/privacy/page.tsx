import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — SCARA',
  description: 'Privacy Policy for SCARA Gaming Private Limited.',
};

export default function PrivacyPage() {
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
            Privacy<br /><span className="text-scara-green">Policy.</span>
          </h1>
          <p className="font-sub text-xs text-scara-grey uppercase tracking-widest pt-2">
            Last Updated: September 2026
          </p>
        </div>

        {/* Intro */}
        <p className="font-body text-base text-scara-white/80 leading-relaxed">
          At SCARA Gaming Private Limited ("SCARA", "we", "us" or "our"), we respect your privacy.
          This Privacy Policy explains what information we collect when you use our website and how we use it.
        </p>

        {/* Sections */}
        <PolicySection title="Information We Collect">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mb-4">
            When you contact us through our website, we may collect information such as:
          </p>
          <ul className="space-y-2">
            {[
              'Your name',
              'Email address',
              'Phone number, if provided',
              'Company or organisation name, if provided',
              'Any information you include in your message',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm text-scara-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-scara-green shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-scara-white/70 leading-relaxed mt-4">
            We only collect information that you choose to share with us through our contact form.
          </p>
        </PolicySection>

        <PolicySection title="How We Use Your Information">
          <ul className="space-y-2">
            {[
              'Respond to your enquiry',
              'Communicate with you about your request',
              'Explore potential business or partnership opportunities',
              'Maintain records of our communications',
              'Improve and protect our website and services',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm text-scara-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-scara-green shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection title="Sharing Your Information">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We do not sell your personal information. We may share information with trusted service providers
            who help us operate our website or business, or where required by law.
          </p>
        </PolicySection>

        <PolicySection title="Keeping Your Information Safe">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We take reasonable steps to protect your information from unauthorised access, misuse or loss.
            However, no online system can be completely secure, so we cannot guarantee absolute security.
          </p>
        </PolicySection>

        <PolicySection title="How Long We Keep Your Information">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We keep your information only for as long as necessary to respond to your enquiry,
            maintain appropriate business records or meet legal requirements.
          </p>
        </PolicySection>

        <PolicySection title="Your Choices">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            You can contact us if you would like to ask about, update or request the deletion of your
            personal information, subject to applicable law.
          </p>
        </PolicySection>

        <PolicySection title="Third-Party Websites">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            Our website may contain links to third-party websites. SCARA is not responsible for the
            privacy practices of those websites, and we encourage you to review their privacy policies.
          </p>
        </PolicySection>

        <PolicySection title="Changes to This Policy">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page.
          </p>
        </PolicySection>

        <PolicySection title="Contact Us">
          <p className="font-body text-sm text-scara-white/70 leading-relaxed">
            If you have any questions about this Privacy Policy or how we handle your information,
            please contact us at:
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
          <Link href="/terms" className="hover:text-scara-green transition-colors">
            TERMS OF SERVICE
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
      <div className="pl-0 border-l-2 border-scara-green/30 pl-5">
        {children}
      </div>
    </div>
  );
}
