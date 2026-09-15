'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Linkedin, Instagram, ArrowUp, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Magnet from '@/components/ui/Magnet';
import { submitEnquiry, type EnquiryPayload } from '@/lib/api';

const EMPTY_FORM = {
  name: '',
  email: '',
  company: '',
  budget: '$50k - $100k' as EnquiryPayload['budget'],
  message: '',
};

// ── Torch-light cursor effect on the SCARA logo ───────────────────────────────
function TorchLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="w-full flex items-center justify-center select-none mt-2 mb-0">
      {/* containerRef is on the SAME element that mouse coords are relative to */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMouse(null); }}
        className="relative w-full max-w-[240px] sm:max-w-lg md:max-w-4xl cursor-none overflow-hidden"
      >
        {/* Dark base logo */}
        <Image
          src="/logo-scara.png"
          alt="SCARA Logo"
          width={1080}
          height={1080}
          className="w-full h-auto object-contain opacity-20"
          draggable={false}
        />

        {/* Torch layer — absolute on top, masked to cursor position */}
        {isHovered && mouse && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              WebkitMaskImage: `radial-gradient(circle 110px at ${mouse.x}px ${mouse.y}px, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)`,
              maskImage: `radial-gradient(circle 110px at ${mouse.x}px ${mouse.y}px, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)`,
            }}
          >
            <Image
              src="/logo-scara.png"
              alt=""
              width={1080}
              height={1080}
              className="w-full h-auto object-contain opacity-95 drop-shadow-[0_0_24px_rgba(195,237,0,0.7)]"
              draggable={false}
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        budget: formData.budget,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setFormData(EMPTY_FORM); // reset to blank
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="relative w-full bg-scara-black pt-24 pb-0 text-scara-white overflow-hidden">
      <div className="mx-auto max-w-7xl 2xl:max-w-8xl px-6 md:px-12 2xl:px-16 space-y-12">

        {/* Main Contact Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              // WORK WITH US
            </div>

            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase text-scara-white tracking-tight leading-none">
              Got Something <br />
              Worth <span className="text-scara-green drop-shadow-[0_0_25px_rgba(195,237,0,0.5)]">Making<br />
              Noise</span> About?
            </h2>

            {/* Updated subtitle */}
            <p className="font-body text-base text-scara-white/80 leading-relaxed">
              Ready to create combat-ready content across sports, gaming, music and physical fandom? Reach out to our team.
            </p>

            {/* Contact Links */}
            <div className="space-y-4 pt-4 font-sub text-xs uppercase tracking-wider text-scara-white">
              <a
                href="mailto:contact@scara.gg"
                className="flex items-center gap-3 text-scara-grey hover:text-scara-green transition-colors"
              >
                <Mail className="h-4 w-4 text-scara-green" />
                <span>contact@scara.gg</span>
              </a>
              <div className="flex items-center gap-4 text-scara-grey pt-2">
                <a
                  href="https://in.linkedin.com/company/druidscara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-scara-green transition-colors"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/scara_social?stkn=MzFkY254ZHdianpv&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-scara-green transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>

            {/* Mumbai Office */}
            <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-6 space-y-3">
              <div className="flex items-center gap-2 font-sub text-xs font-bold text-scara-green uppercase">
                <MapPin className="h-4 w-4" />
                <span>// MUMBAI OFFICE</span>
              </div>
              <p className="font-body text-xs text-scara-grey leading-relaxed">
                <strong>SCARA GAMING PRIVATE LIMITED</strong> <br />
                Office Number HD-648, C-20, WeWork Enam Sambhav, G-Block Road, Bandra East, Mumbai, Mumbai Suburban, Maharashtra-400051.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 shadow-2xl relative">
              {isSubmitted ? (
                // ── Success state — full card size, professional ──
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-6"
                >
                  {/* Animated green ring + icon */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-20 w-20 items-center justify-center"
                  >
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full border-2 border-scara-green/40 animate-ping" style={{ animationDuration: '1.5s' }} />
                    {/* Solid circle */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-scara-green text-scara-black shadow-[0_0_40px_rgba(195,237,0,0.5)]">
                      <Send className="h-8 w-8" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    <h3 className="font-heading text-3xl font-black uppercase text-scara-white">
                      MESSAGE TRANSMITTED // LOADOUT READY
                    </h3>
                    <p className="max-w-md font-body text-sm text-scara-grey mx-auto">
                      Thank you for reaching out. Our team will review your brief and contact you soon.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    onClick={handleSendAnother}
                    className="rounded-full border border-scara-green px-6 py-2.5 font-sub text-xs font-bold text-scara-green hover:bg-scara-green hover:text-scara-black transition-all uppercase"
                  >
                    Send Another Brief
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <span className="font-sub text-xs font-bold tracking-[0.2em] text-scara-green uppercase">
                      START A CONVERSATION
                    </span>
                    <h3 className="font-heading text-2xl font-black uppercase text-scara-white">
                      Project Brief
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">YOUR NAME *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@brand.com"
                        className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">COMPANY / ORGANISATION</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Global Rights Holder / Publisher"
                        className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">BUDGET RANGE</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value as EnquiryPayload['budget'] })}
                        className="w-full bg-scara-card-dark border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      >
                        <option value="< $50k">&lt; $50k USD</option>
                        <option value="$50k - $100k">$50k – $100k USD</option>
                        <option value="$100k - $250k">$100k – $250k USD</option>
                        <option value="$250k+">$250k+ USD (Full Ecosystem)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-sub text-xs font-bold uppercase text-scara-grey">PROJECT BRIEF / GOALS *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your upcoming gaming, sports, or live experience mandate..."
                      className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    {submitError && (
                      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                        <p className="font-body text-sm text-red-400">{submitError}</p>
                      </div>
                    )}
                    <Magnet padding={80} magnetStrength={3} wrapperClassName="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-scara-green py-4 font-heading text-sm font-black uppercase text-scara-black transition-all hover:bg-scara-white hover:shadow-[0_0_30px_#C3ED00] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Transmit Brief</span>
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </Magnet>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-scara-grey/15 pt-4 overflow-hidden">

          {/* Ticker */}
          <div className="relative w-full overflow-hidden border-b border-scara-green/15 py-3 mt-4">
            <div
              className="flex gap-0 whitespace-nowrap"
              style={{ animation: 'ticker-scroll 32s linear infinite', width: 'max-content' }}
            >
              {[
                { stat: '$3T+',    label: 'Global Entertainment & Media Market' },
                { stat: '$187.7B', label: 'Global Gaming Revenue' },
                { stat: '3.58B',   label: 'Gamers Worldwide by 2025' },
                { stat: '$1.18T',  label: 'Live Events Market by 2032' },
                { stat: '600M+',   label: 'Gamers Across India, MENA & Turkey' },
                { stat: '1B+',     label: 'Internet Users in India' },
                { stat: '97%',     label: 'Mobile-First Youth in India' },
                { stat: '80–90%+', label: 'Smartphone Penetration in Gulf Markets' },
                { stat: '$3T+',    label: 'Global Entertainment & Media Market' },
                { stat: '$187.7B', label: 'Global Gaming Revenue' },
                { stat: '3.58B',   label: 'Gamers Worldwide by 2025' },
                { stat: '$1.18T',  label: 'Live Events Market by 2032' },
                { stat: '600M+',   label: 'Gamers Across India, MENA & Turkey' },
                { stat: '1B+',     label: 'Internet Users in India' },
                { stat: '97%',     label: 'Mobile-First Youth in India' },
                { stat: '80–90%+', label: 'Smartphone Penetration in Gulf Markets' },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="inline-flex items-center gap-3 px-8">
                    <span className="font-heading text-xl font-extrabold text-scara-green tracking-tight">{item.stat}</span>
                    <span className="font-sub text-xs font-semibold uppercase tracking-widest text-scara-white/60">{item.label}</span>
                  </span>
                  <span className="inline-flex items-center text-scara-green/40 text-base select-none">◆</span>
                </span>
              ))}
            </div>
            <style jsx>{`
              @keyframes ticker-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>

          {/* Copyright + Privacy + TOP — tighter gap */}
          <div className="relative z-10 font-sub text-xs text-scara-grey uppercase pt-3 pb-2 space-y-2">
            <div className="text-center text-scara-grey/60">
              © 2026 SCARA GAMING PRIVATE LIMITED. ALL RIGHTS RESERVED.
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-8 relative">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <a href="/privacy" className="hover:text-scara-green transition-colors">PRIVACY POLICY</a>
                <span className="text-scara-grey/20">|</span>
                <a href="/terms" className="hover:text-scara-green transition-colors">TERMS OF SERVICE</a>
              </div>
              <button
                onClick={scrollToTop}
                className="sm:absolute sm:right-0 self-center flex items-center gap-1 text-scara-green hover:underline uppercase font-bold"
              >
                <span>TOP</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* SCARA Logo — torch effect, moved slightly down, gap reduced */}
          <TorchLogo />

          {/* GG Space credit — brighter */}
          <div className="border-t border-scara-grey/10 pt-2 pb-2 text-center">
            <p className="font-sub text-[10px] text-scara-grey/60 uppercase tracking-widest">
              Design and Created by GG Space
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
