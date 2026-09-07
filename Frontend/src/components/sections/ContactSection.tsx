'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import Magnet from '@/components/ui/Magnet';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$50k - $100k',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#C3ED00', '#FFFFFF', '#898988'],
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="relative w-full bg-scara-black pt-24 pb-12 text-scara-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-24">
        
        {/* Main Contact Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Headline & Address */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 font-sub text-xs font-bold tracking-[0.25em] text-scara-green uppercase">
              // WORK WITH US
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase text-scara-white tracking-tight leading-none">
              Let's Build <br />
              <span className="text-scara-green drop-shadow-[0_0_25px_rgba(195,237,0,0.5)]">
                Something Culture
              </span> <br />
              Moves For.
            </h2>

            <p className="font-body text-base text-scara-white/80 leading-relaxed">
              Ready to create combat-ready content across sports, gaming, and physical fandom? Reach out to our teams in Mumbai, Istanbul, or Dubai.
            </p>

            {/* Direct Contact Links */}
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
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-scara-green transition-colors"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-scara-green transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>

            {/* Verbatim Mumbai HQ Address Block */}
            <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-6 space-y-3">
              <div className="flex items-center gap-2 font-sub text-xs font-bold text-scara-green uppercase">
                <MapPin className="h-4 w-4" />
                <span>GLOBAL HQ // MUMBAI OFFICE</span>
              </div>
              <p className="font-body text-xs text-scara-grey leading-relaxed">
                <strong>SCARA GAMING PRIVATE LIMITED</strong> <br />
                Office Number HD-648, C-20, WeWork Enam Sambhav, G-Block Road, Bandra East, Mumbai, Mumbai Suburban, Maharashtra-400051.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Underline Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-scara-grey/20 bg-scara-card-dark p-8 md:p-12 shadow-2xl relative">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-6"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-scara-green text-scara-black shadow-[0_0_30px_#C3ED00]">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-3xl font-black uppercase text-scara-white">
                    MESSAGE TRANSMITTED // LOADOUT READY
                  </h3>
                  <p className="max-w-md font-body text-sm text-scara-grey">
                    Thank you for reaching out. Our strategic team in Mumbai / Istanbul will review your brief and contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full border border-scara-green px-6 py-2.5 font-sub text-xs font-bold text-scara-green hover:bg-scara-green hover:text-scara-black transition-all uppercase"
                  >
                    Send Another Brief
                  </button>
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
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">
                        EMAIL ADDRESS *
                      </label>
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
                    {/* Company */}
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">
                        COMPANY / ORGANISATION
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Global Rights Holder / Publisher"
                        className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-2">
                      <label className="font-sub text-xs font-bold uppercase text-scara-grey">
                        BUDGET RANGE
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-scara-card-dark border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors"
                      >
                        <option value="< $50k">&lt; $50k USD</option>
                        <option value="$50k - $100k">$50k - $100k USD</option>
                        <option value="$100k - $250k">$100k - $250k USD</option>
                        <option value="$250k+">$250k+ USD (Full Ecosystem)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="font-sub text-xs font-bold uppercase text-scara-grey">
                      PROJECT BRIEF / GOALS *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your upcoming gaming, sports, or live experience mandate..."
                      className="w-full bg-transparent border-b border-scara-grey/30 py-3 font-body text-sm text-scara-white focus:border-scara-green focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Magnet padding={80} magnetStrength={3} wrapperClassName="w-full">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-scara-green py-4 font-heading text-sm font-black uppercase text-scara-black transition-all hover:bg-scara-white hover:shadow-[0_0_30px_#C3ED00] flex items-center justify-center gap-2"
                    >
                      <span>Transmit Brief</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </Magnet>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Footer Display Section with Motion.so style Cropped Massive Logo */}
        <div className="relative border-t border-scara-grey/15 pt-16 overflow-hidden">
          
          {/* Motion.so style Footer Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-2 font-sub text-xs uppercase">
            <div className="space-y-3">
              <span className="font-bold text-scara-green tracking-wider">// SOLUTIONS</span>
              <ul className="space-y-2 text-scara-grey font-medium">
                <li><a href="#services" className="hover:text-scara-white transition-colors">Digital Discovery</a></li>
                <li><a href="#services" className="hover:text-scara-white transition-colors">Gaming Integration</a></li>
                <li><a href="#services" className="hover:text-scara-white transition-colors">Physical Fandom</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-scara-green tracking-wider">// LOCATIONS</span>
              <ul className="space-y-2 text-scara-grey font-medium">
                <li><a href="#about" className="hover:text-scara-white transition-colors">Mumbai HQ (India)</a></li>
                <li><a href="#about" className="hover:text-scara-white transition-colors">Istanbul (Türkiye)</a></li>
                <li><a href="#about" className="hover:text-scara-white transition-colors">Dubai & MENA (UAE)</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-scara-green tracking-wider">// ENGINES</span>
              <ul className="space-y-2 text-scara-grey font-medium">
                <li><a href="#work" className="hover:text-scara-white transition-colors">Scara Gaming</a></li>
                <li><a href="#work" className="hover:text-scara-white transition-colors">Scara Live</a></li>
                <li><a href="#work" className="hover:text-scara-white transition-colors">Scara Tech</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-scara-green tracking-wider">// COMPANY</span>
              <ul className="space-y-2 text-scara-grey font-medium">
                <li><a href="#about" className="hover:text-scara-white transition-colors">About Us</a></li>
                <li><a href="#impact" className="hover:text-scara-white transition-colors">Impact & Stats</a></li>
                <li><a href="#clients" className="hover:text-scara-white transition-colors">Clients</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-scara-green tracking-wider">// CONNECT</span>
              <ul className="space-y-2 text-scara-grey font-medium">
                <li><a href="mailto:contact@scara.gg" className="hover:text-scara-white transition-colors">contact@scara.gg</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-scara-white transition-colors">LinkedIn</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-scara-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>

          {/* Massive Display SCARA Logo — fully visible, no crop, no vertical gaps */}
          <div className="relative w-full flex items-center justify-center select-none py-4">
            <Image
              src="/logo-scara.png"
              alt="SCARA Logo"
              width={1080}
              height={1080}
              className="w-full max-w-[260px] sm:max-w-xl md:max-w-5xl h-auto object-contain opacity-50 sm:opacity-40 md:opacity-30 hover:opacity-95 transition-all duration-700 ease-out cursor-pointer drop-shadow-[0_0_20px_rgba(195,237,0,0.3)] hover:drop-shadow-[0_0_35px_rgba(195,237,0,0.6)]"
            />
          </div>

          {/* Footer Bottom Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sub text-xs text-scara-grey uppercase border-t border-scara-grey/10 pt-6 bg-scara-black/90 backdrop-blur-md">
            <div>
              © 2026 SCARA GAMING PRIVATE LIMITED. ALL RIGHTS RESERVED.
            </div>

            <div className="flex items-center gap-6">
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-scara-green hover:underline uppercase font-bold"
              >
                <span>TOP</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
