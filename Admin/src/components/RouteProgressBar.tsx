"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A slim NProgress-style bar that animates across the top of the screen
 * whenever the route changes. Pure CSS + useEffect, no external lib needed.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Start
    setVisible(true);
    setProgress(20);

    // Quick jump to ~70% to feel fast
    timerRef.current = setTimeout(() => setProgress(70), 80);
    timerRef.current = setTimeout(() => setProgress(90), 250);

    // Complete
    timerRef.current = setTimeout(() => {
      setProgress(100);
      // Hide after bar reaches 100
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "var(--accent)",
          transition: progress === 100
            ? "width 200ms ease-out"
            : "width 300ms cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 0 8px var(--accent)",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}
