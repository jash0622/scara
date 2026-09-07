'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for custom cursor attributes
      const cursorLabel = target.getAttribute('data-cursor') || target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const isInteractive = target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button' || target.closest('button, a');

      if (cursorLabel) {
        setCursorText(cursorLabel);
        setIsHovered(true);
      } else if (isInteractive) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] hidden md:block">
      {/* Outer Ring / Capsule */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-scara-green bg-scara-green/10 backdrop-blur-[2px]"
        animate={{
          x: position.x - (cursorText ? 40 : isHovered ? 24 : 16),
          y: position.y - (cursorText ? 40 : isHovered ? 24 : 16),
          width: cursorText ? 80 : isHovered ? 48 : 32,
          height: cursorText ? 80 : isHovered ? 48 : 32,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
      >
        {cursorText && (
          <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-scara-black bg-scara-green px-2 py-0.5 rounded-full shadow-lg">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-scara-green shadow-[0_0_12px_#C3ED00]"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          width: 6,
          height: 6,
          opacity: cursorText ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
    </div>
  );
}
