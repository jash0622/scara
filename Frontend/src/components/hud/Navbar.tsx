'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import Magnet from '@/components/ui/Magnet';
import StaggeredMenu, {
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from '@/components/ui/StaggeredMenu';

const MENU_ITEMS: StaggeredMenuItem[] = [
  { label: 'Home',     ariaLabel: 'Go to home',        link: '#hero' },
  { label: 'About',    ariaLabel: 'Learn about Scara',  link: '#about' },
  { label: 'Services', ariaLabel: 'View our services',  link: '#services' },
  { label: 'Work',     ariaLabel: 'See our work',       link: '#work' },
  { label: 'Impact',   ariaLabel: 'Our impact',         link: '#impact' },
  { label: 'Clients',  ariaLabel: 'Our clients',        link: '#clients' },
  { label: 'Insights', ariaLabel: 'Read our insights',  link: '#insights' },
];

const SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'LinkedIn',  link: 'https://linkedin.com' },
  { label: 'Twitter',   link: 'https://twitter.com' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-scara-black/85 backdrop-blur-md py-4 border-b border-scara-grey/10'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Brand Logo */}
          <a href="#hero" className="group relative flex items-center gap-3">
            <Image
              src="/logo-scara.png"
              alt="SCARA Logo"
              width={400}
              height={100}
              className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(195,237,0,0.15)]"
              priority
            />
            <span className="hidden sm:inline-block font-sub text-[9px] font-bold tracking-[0.25em] text-scara-grey uppercase border-l border-scara-grey/30 pl-3">
              CREATIVE AGENCY
            </span>
          </a>

          {/* CTA — the menu toggle is rendered by StaggeredMenu (fixed top-right).
              Reserve right-side space so the CTA doesn't sit under the toggle. */}
          <div className="flex items-center gap-5 pr-24 md:pr-28">
            <Magnet padding={60} magnetStrength={2.5}>
              <a
                href="#contact"
                className="group relative hidden sm:inline-flex items-center gap-2 rounded-full bg-scara-green px-6 py-2.5 font-heading text-xs font-extrabold uppercase tracking-wider text-scara-black transition-all duration-300 hover:bg-scara-white hover:shadow-[0_0_24px_rgba(195,237,0,0.6)]"
                data-cursor="LETS TALK"
              >
                <span>Work With Us</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnet>
          </div>
        </div>
      </header>

      {/* Staggered menu — fixed full-screen overlay + toggle button (top-right) */}
      <StaggeredMenu
        position="right"
        items={MENU_ITEMS}
        socialItems={SOCIAL_ITEMS}
        displaySocials
        displayItemNumbering
        isFixed
        accentColor="#C3ED00"
        colors={['#1a2e05', '#C3ED00']}
        menuButtonColor="#FFFFFF"
        openMenuButtonColor="#000000"
        changeMenuColorOnOpen
      />
    </>
  );
}
