'use client';
/**
 * ParticleHandScene.tsx  (Cinematic Scroll v2)
 *
 * Camera: FOV 28 — LOCKED. Never changes.
 * Position [1.80, -0.06, 5.6], lookAt [2.38, -0.03, 0] — LOCKED.
 *
 * New in v2:
 *  - HandSceneState has additive offset fields (all default 0).
 *    First frame = pixel-identical to previous hero.
 *  - Stage 3+: cursor camera micro-nudge switches to orbital drift.
 *  - HudOverlay receives stateRef for hudOpacity fade in stage 5.
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

import HandParticles from './HandParticles';
import EnergyCore    from './EnergyCore';
import HudOverlay    from './HudOverlay';

const Effects = dynamic(() => import('./Effects'), { ssr: false });

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Shared state ─────────────────────────────────────────────────────────────
export interface HandSceneState {
  progress: number;

  // ── These fields are read by EnergyCore (unchanged) ────────────────────
  tipGlow:  number;
  energyX:  number;
  energyY:  number;
  energyZ:  number;

  // ── Camera (Cam component reads these) ─────────────────────────────────
  cameraZ:  number;
  cameraX:  number;         // base camera X; orbital drift added on top

  // ── NEW: additive hand offsets (default 0 → frame-0 pixel-identical) ──
  // Applied ON TOP of the locked HAND_CONFIG positions in HandParticles.
  upperOffsetX: number;  upperOffsetY: number;  upperOffsetZ: number;
  lowerOffsetX: number;  lowerOffsetY: number;  lowerOffsetZ: number;
  // Additive rotation Z delta (inward tilt in stage 4) — default 0
  upperRotZDelta: number;
  lowerRotZDelta: number;
  // Additive scale multiplier (default 1.0 = no change) — applied in HandParticles
  handScaleMult: number;

  // ── NEW: stage flags ────────────────────────────────────────────────────
  orbitalDrift:  boolean;  // stage 3+: replaces cursor camera nudge
  hudOpacity:    number;   // 1→0 in stage 5
  bgOpacity:     number;   // black background div: 1→0 in stage 3
  sparkBurst:    number;   // 0→1, drives EnergyCore uSize expansion in stage 4

  // ── NEW: hover magnetic offset (stage 1 only, additive on top of HAND_CONFIG) ─
  upperHoverX: number;  upperHoverY: number;
  lowerHoverX: number;  lowerHoverY: number;

  // ── NEW: handshake asset-swap crossfade ────────────────────────────────
  // handsOpacity: upper+lower hand planes opacity (1→0 during crossfade)
  // handshakeOpacity: handshake.png plane opacity (0→1 during crossfade)
  // handshakeScale: gentle breathing scale for the handshake image
  handsOpacity:      number;
  handshakeOpacity:  number;
  handshakeScale:    number;

  // ── NEW: dissolve for stage 5 (read by HandParticles if added) ─────────
  dissolve:   number;
  brightness: number;

  // ── Legacy fields (kept for back-compat with EnergyCore etc.) ──────────
  noiseAmp:      number;
  upperX:        number;  upperY:  number;  upperZ:  number;
  upperRotX:     number;  upperRotY: number; upperRotZ: number;
  upperScale:    number;
  lowerX:        number;  lowerY:  number;  lowerZ:  number;
  lowerRotX:     number;  lowerRotY: number; lowerRotZ: number;
  lowerScale:    number;
  pulseProgress: number;
  pulseOpacity:  number;
}

export function createHandSceneState(): HandSceneState {
  return {
    progress: 0,

    // EnergyCore
    tipGlow:  0.35,
    energyX:  2.38,  energyY: -0.03,  energyZ: 0.10,

    // Camera — exact locked values
    cameraZ:  5.6,
    cameraX:  1.80,

    // Additive offsets — ALL ZERO at init → pixel-identical first frame
    upperOffsetX: 0,  upperOffsetY: 0,  upperOffsetZ: 0,
    lowerOffsetX: 0,  lowerOffsetY: 0,  lowerOffsetZ: 0,
    upperRotZDelta: 0,
    lowerRotZDelta: 0,
    handScaleMult: 1.0,

    // Flags
    orbitalDrift: false,
    hudOpacity:   1.0,
    bgOpacity:    1.0,
    sparkBurst:   0.0,

    // Hover offsets — zero at init
    upperHoverX: 0,  upperHoverY: 0,
    lowerHoverX: 0,  lowerHoverY: 0,
    dissolve:     0.0,
    brightness:   0.88,

    // Legacy (not used by HandParticles v2, kept for EnergyCore)
    noiseAmp:   0.0038,
    upperX:     3.22,  upperY:   -0.20,  upperZ:    0.07,
    upperRotX: -0.04,  upperRotY: -0.08,  upperRotZ:  0.07,
    upperScale: 1.0,
    lowerX:     3.15,  lowerY:   -0.22,  lowerZ:   -0.02,
    lowerRotX:  0.01,  lowerRotY:  0.05,  lowerRotZ: -0.08,
    lowerScale: 1.0,
    pulseProgress: 0,
    pulseOpacity:  0,
  };
}

// ─── Floating particles ───────────────────────────────────────────────────────
const FP_VERT = /* glsl */`
attribute float aRandom;
attribute float aSize;
attribute vec3  aColor;
uniform   float uTime;
uniform   float uScale;
varying   float vAlpha;
varying   vec3  vCol;
void main() {
  float cycle  = mod(aRandom * 71.3 + uTime * (0.016 + aRandom * 0.018), 10.0);
  float t      = cycle / 10.0;
  float yDrift = t * 4.8 - 1.5;
  float wobble = sin(uTime * 0.22 + aRandom * 6.283) * 0.045;
  vec3 pos = position + vec3(wobble, yDrift, 0.0);
  vec4 mv  = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float ds     = 130.0 / max(-mv.z, 0.1);
  gl_PointSize = clamp(aSize * uScale * ds, 0.4, 2.2);
  float edgeFade = smoothstep(0.0, 0.10, t) * (1.0 - smoothstep(0.85, 1.0, t));
  vAlpha = 0.12 * edgeFade;
  vCol   = aColor;
}
`;
const FP_FRAG = /* glsl */`
varying float vAlpha;
varying vec3  vCol;
uniform float uOpacity;
void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv) * 2.0;
  if (d > 1.0) discard;
  float a  = (1.0 - smoothstep(0.0, 1.0, d)) * vAlpha * uOpacity;
  gl_FragColor = vec4(vCol, a);
}
`;

function FloatingParticles({ stateRef }: { stateRef: React.RefObject<HandSceneState> }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const N = 130;
    let seed = 0xbeef4321;
    const r = () => { seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5; return (seed >>> 0) / 0xffffffff; };
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const siz = new Float32Array(N);
    const rnd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i*3] = 0.6 + r() * 2.4; pos[i*3+1] = -1.0 + r() * 2.0; pos[i*3+2] = -0.8 + r() * 1.6;
      const isLime = r() < 0.30; const b = 0.50 + r() * 0.50;
      if (isLime) { col[i*3] = 0.843*b; col[i*3+1] = 1.0*b; col[i*3+2] = 0; }
      else { const w = 0.65 + r() * 0.35; col[i*3] = col[i*3+1] = col[i*3+2] = w; }
      siz[i] = 0.15 + r() * 0.30; rnd[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor',   new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize',    new THREE.BufferAttribute(siz, 1));
    g.setAttribute('aRandom',  new THREE.BufferAttribute(rnd, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: FP_VERT, fragmentShader: FP_FRAG,
      uniforms: { uTime: { value: 0 }, uScale: { value: 0.22 }, uOpacity: { value: 1 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return { geo: g, mat: m };
  }, []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame(({ clock, size }) => {
    if (!ref.current) return;
    mat.uniforms.uTime.value  = clock.getElapsedTime();
    mat.uniforms.uScale.value = Math.min(size.width, size.height) / 1800;
    // Fade the star field OUT as hands converge toward center (p 0.35→0.60).
    const p = stateRef.current?.progress ?? 0;
    const fade = 1 - Math.max(0, Math.min(1, (p - 0.35) / 0.25));
    mat.uniforms.uOpacity.value = fade;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Camera ───────────────────────────────────────────────────────────────────
// FOV 28, position [1.80, -0.06, 5.6], lookAt [2.38, -0.03, 0] — ALL LOCKED.
// Micro-nudge from cursor in stage 1–2 (< 0.02 WU — cosmetic only).
// Stage 3+ (orbitalDrift=true): cursor input suppressed, gentle sine orbit ≤ 0.8°.
function Cam({ stateRef }: { stateRef: React.RefObject<HandSceneState> }) {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Responsive fit ──────────────────────────────────────────────────────
  // At a fixed vertical FOV, a narrow (portrait / mobile) viewport has a very
  // narrow horizontal frustum, so the hands (x≈3.15–3.52) fall off-screen.
  // For narrow aspects we pull the camera BACK (extra Z) and widen the FOV so
  // the hands fit. Wide desktop aspects (>=1.4) get NO change — pixel-identical.
  useEffect(() => {
    const persCam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    // aspect >= 1.4 → desktop, untouched. Below that, scale up FOV smoothly.
    if (aspect >= 1.4) {
      persCam.fov = 28;
    } else {
      // Narrower → larger FOV. At aspect ~0.46 (mobile portrait) FOV ≈ 52.
      const tNarrow = Math.max(0, Math.min(1, (1.4 - aspect) / (1.4 - 0.45)));
      persCam.fov = 28 + tNarrow * 26;
    }
    persCam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame(({ clock }) => {
    const s = stateRef.current;
    if (!s) return;
    const t = clock.getElapsedTime();

    // Extra camera pull-back on narrow viewports so hands stay in frame.
    const aspect = size.width / Math.max(size.height, 1);
    const zBoost = aspect >= 1.4 ? 0 : Math.max(0, Math.min(1, (1.4 - aspect) / (1.4 - 0.45))) * 1.2;

    let targetX: number;
    let targetY: number;

    if (s.orbitalDrift) {
      // Stage 3+: sine orbital — radius ≈ 0.014 WU. No cursor input.
      targetX = s.cameraX + Math.sin(t * 0.524)         * 0.014;
      targetY = -0.06     + Math.cos(t * 0.524 * 0.618) * 0.009;
    } else {
      // Stage 1–2: cursor micro-nudge
      targetX = s.cameraX + mouse.current.x * 0.012;
      targetY = -0.06     + mouse.current.y * -0.012;
      targetY += Math.sin(t * 0.0628) * 0.004;
    }

    camera.position.x += (targetX  - camera.position.x) * 0.030;
    camera.position.y += (targetY  - camera.position.y) * 0.030;
    camera.position.z += ((s.cameraZ + zBoost) - camera.position.z) * 0.030;

    // lookAt tracks cameraX — so as camera shifts right, it looks at the
    // hands (which are centered at ~3.19 when fully scaled).
    // Blend from initial lookAt (2.38) toward hand center (3.19).
    const lx = lerp(2.38, 3.19, Math.max(0, (s.cameraX - 1.80) / (3.00 - 1.80)));
    camera.lookAt(lx, -0.03, 0);
  });

  return null;
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function ParticleHandScene({
  stateRef,
  className = '',
}: {
  stateRef: React.RefObject<HandSceneState>;
  className?: string;
}) {
  return (
    <div className={`relative w-full h-full ${className}`} style={{ pointerEvents: 'none' }}>
      {/* HudOverlay receives stateRef so it can fade in stage 5 */}
      <HudOverlay stateRef={stateRef} />

      <Canvas
        style={{ position: 'absolute', inset: 0, background: 'transparent', pointerEvents: 'none' }}
        dpr={[1, 1.6]}
        camera={{
          fov:      28,          // LOCKED — never changes
          near:     0.05,
          far:      120,
          position: [1.80, -0.06, 5.6],  // LOCKED
        }}
        gl={{
          antialias:       false,
          alpha:           true,
          powerPreference: 'high-performance',
          stencil:         false,
          depth:           true,
          toneMapping:     THREE.NoToneMapping,
        }}
      >
        <Cam stateRef={stateRef} />
        <FloatingParticles stateRef={stateRef} />
        <HandParticles which="upper" stateRef={stateRef} />
        <HandParticles which="lower" stateRef={stateRef} />
        <EnergyCore stateRef={stateRef} />
        <Effects bloomIntensity={1.0} />
      </Canvas>
    </div>
  );
}
