'use client';

/**
 * MenuAurora — animated flowing "sand-dune" light waves for the menu background.
 * Pure SVG + CSS, GPU-friendly. Soft chartreuse curved ridges that drift
 * horizontally, layered for depth. Sits behind the menu links.
 */
export default function MenuAurora() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Soft ambient wash — diagonal from top-left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 60% at 15% 20%, rgba(198,240,0,0.10) 0%, transparent 62%)',
        }}
      />

      {/* Flowing dune curves — rotated to run diagonally (top-left → bottom-right) */}
      <svg
        width="140%"
        height="140%"
        viewBox="0 0 500 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          transform: 'rotate(-32deg)',
          transformOrigin: 'center',
        }}
      >
        <defs>
          <linearGradient id="duneFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C6F000" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#C6F000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C6F000" stopOpacity="0" />
          </linearGradient>
          <filter id="duneBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Multiple stacked dune ridges — each animates its path subtly */}
        <g filter="url(#duneBlur)" stroke="url(#duneFade)" fill="none" strokeLinecap="round">
          <path strokeWidth="1.4" opacity="0.9">
            <animate
              attributeName="d"
              dur="11s"
              repeatCount="indefinite"
              values="
                M -50 180 C 120 120, 240 260, 560 160;
                M -50 200 C 130 260, 250 120, 560 220;
                M -50 180 C 120 120, 240 260, 560 160"
            />
          </path>
          <path strokeWidth="1.2" opacity="0.7">
            <animate
              attributeName="d"
              dur="13s"
              repeatCount="indefinite"
              values="
                M -50 320 C 140 260, 260 400, 560 300;
                M -50 340 C 150 420, 270 260, 560 360;
                M -50 320 C 140 260, 260 400, 560 300"
            />
          </path>
          <path strokeWidth="1.6" opacity="0.85">
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
                M -50 460 C 130 400, 250 560, 560 440;
                M -50 480 C 140 560, 260 400, 560 500;
                M -50 460 C 130 400, 250 560, 560 440"
            />
          </path>
          <path strokeWidth="1.1" opacity="0.55">
            <animate
              attributeName="d"
              dur="17s"
              repeatCount="indefinite"
              values="
                M -50 600 C 150 540, 270 700, 560 580;
                M -50 620 C 160 700, 280 540, 560 640;
                M -50 600 C 150 540, 270 700, 560 580"
            />
          </path>
          <path strokeWidth="1.3" opacity="0.5">
            <animate
              attributeName="d"
              dur="19s"
              repeatCount="indefinite"
              values="
                M -50 740 C 140 680, 260 840, 560 720;
                M -50 760 C 150 840, 270 680, 560 780;
                M -50 740 C 140 680, 260 840, 560 720"
            />
          </path>
        </g>
      </svg>

      {/* Fine film grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          mixBlendMode: 'screen',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
