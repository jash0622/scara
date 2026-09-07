'use client';
/**
 * HandParticles.tsx  (Cinematic Scroll v2)
 *
 * The HAND_CONFIG locked values are NEVER modified.
 * The scroll controller writes ADDITIVE offsets into stateRef:
 *   upperOffsetX/Y/Z, lowerOffsetX/Y/Z  — world-unit deltas
 *   upperRotZDelta, lowerRotZDelta       — radian deltas
 *   handScaleMult                         — scale multiplier (1.0 = no change)
 *   dissolve                              — 0→1 UV alpha scatter in stage 5
 *
 * At init every offset is 0 and handScaleMult is 1.0.
 * Therefore the very first rendered frame is PIXEL-IDENTICAL to the current hero.
 *
 * PNG: 669×373px → aspect 1.794:1
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HandSceneState } from './ParticleHandScene';

const PNG_ASPECT = 669 / 373; // 1.7936…

// ─── Vertex shader ────────────────────────────────────────────────────────────
const VERT = /* glsl */`
uniform float uTime;
uniform float uBreath;
varying vec2  vUv;

void main() {
  vUv = uv;
  float s      = 1.0 + uBreath * 0.012;
  vec3  scaled = position * vec3(s, s, 1.0);
  gl_Position  = projectionMatrix * modelViewMatrix * vec4(scaled, 1.0);
}
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
const FRAG = /* glsl */`
uniform sampler2D uTex;
uniform float     uTime;
uniform vec2      uWristCorner;
uniform float     uFadeStart;
uniform float     uFadeEnd;
uniform float     uDissolve;    // 0=solid, 1=scattered (stage 5)
uniform float     uEdgeGlow;    // 0→1 rim light (stages 3–4)

varying vec2  vUv;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec4 texel = texture2D(uTex, vUv);

  // Wrist fade
  float u    = (uWristCorner.x > 0.5) ? vUv.x : (1.0 - vUv.x);
  float v    = (uWristCorner.y > 0.5) ? vUv.y : (1.0 - vUv.y);
  float diag = max(u, v);
  float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, diag);

  // Shimmer — ±0.4% amplitude (same as before, no change to visual baseline)
  float n1      = hash21(vUv * 33.7 + vec2(uTime * 0.38));
  float n2      = hash21(vUv * 19.1 + vec2(uTime * 0.27 + 1.7));
  float shimmer = 1.0 + (n1 * n2 - 0.25) * 0.008;

  vec3 col = texel.rgb * shimmer;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = col * (0.80 + lum * 0.42);

  // Edge rim glow — lime accent on silhouette edge (stages 3–4, default 0)
  float edgeBand = smoothstep(0.05, 0.25, texel.a) * (1.0 - smoothstep(0.25, 0.55, texel.a));
  col += vec3(0.765, 0.929, 0.0) * edgeBand * uEdgeGlow * 0.55;

  // Stage 5 dissolve — hash-based UV alpha scatter
  float dissHash     = hash21(vUv * 7.3 + vec2(uTime * 0.12));
  float dissolveKeep = (uDissolve < 0.005)
    ? 1.0
    : 1.0 - smoothstep(uDissolve - 0.22, uDissolve + 0.22, dissHash) * uDissolve;

  float a = texel.a * fade * dissolveKeep;
  if (a < 0.004) discard;

  gl_FragColor = vec4(col, a);
}
`;

// ─── LOCKED hand config — NEVER modified ─────────────────────────────────────
const HAND_CONFIG = {
  upper: {
    src:          '/hero/upper-hand.png',
    position:     new THREE.Vector3(3.42, -0.20, 0.07),
    rotation:     new THREE.Euler(-0.04, -0.08, 0.07),
    scale:        new THREE.Vector3(3.30, 2.24, 1),   // was (2.55, 1.72) — enlarged ~30%
    wristCorner:  new THREE.Vector2(1, 1),
    fadeStart:    1.0,
    fadeEnd:      1.0,
    parallaxPos:  0.039,
    parallaxRot:  0.0436,
    parallaxSign: 1 as const,
  },
  lower: {
    src:          '/hero/lower-hand.png',
    position:     new THREE.Vector3(3.15, -0.22, -0.02),
    rotation:     new THREE.Euler(0.01, 0.05, -0.08),
    scale:        new THREE.Vector3(3.85, 2.50, 1),   // was (2.95, 1.92) — enlarged ~30%
    wristCorner:  new THREE.Vector2(0, 0),
    fadeStart:    1.0,
    fadeEnd:      1.0,
    parallaxPos:  0.029,
    parallaxRot:  0.0436,
    parallaxSign: -1 as const,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  which:    'upper' | 'lower';
  stateRef: React.RefObject<HandSceneState>;
}

export default function HandParticles({ which, stateRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cfg     = HAND_CONFIG[which];

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const t = loader.load(cfg.src);
    t.colorSpace      = THREE.SRGBColorSpace;
    t.minFilter       = THREE.LinearMipmapLinearFilter;
    t.magFilter       = THREE.LinearFilter;
    t.generateMipmaps = true;
    return t;
  }, [cfg.src]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTex:         { value: texture },
      uTime:        { value: 0 },
      uBreath:      { value: 0 },
      uWristCorner: { value: cfg.wristCorner },
      uFadeStart:   { value: cfg.fadeStart },
      uFadeEnd:     { value: cfg.fadeEnd },
      uDissolve:    { value: 0 },   // driven by stateRef.dissolve
      uEdgeGlow:    { value: 0 },   // driven by stateRef (set 0 until stage 3)
    },
    transparent: true,
    depthWrite:  false,
    depthTest:   true,
    blending:    THREE.AdditiveBlending,
    toneMapped:  false,
    side:        THREE.DoubleSide,
  }), [texture, cfg]);

  const geo = useMemo(
    () => new THREE.PlaneGeometry(PNG_ASPECT, 1.0, 1, 1),
    [],
  );

  useEffect(() => () => {
    geo.dispose(); mat.dispose(); texture.dispose();
  }, [geo, mat, texture]);

  const mouse  = useRef({ x: 0, y: 0 });
  const smooth = useRef({ px: 0, py: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const s = stateRef.current;
    if (!s) return;

    const t    = clock.getElapsedTime();
    const sign = cfg.parallaxSign;

    // Breathing — 4s sine, unchanged
    const breath = Math.sin(t * (Math.PI * 2 / 4)) * 0.5 + 0.5;
    mat.uniforms.uTime.value   = t;
    mat.uniforms.uBreath.value = breath;

    // Scroll-driven material uniforms
    mat.uniforms.uDissolve.value = s.dissolve;
    // uEdgeGlow stays 0 — edgeBand detection on PNG plane creates a
    // rectangular border artifact, not a silhouette glow. Disabled.
    mat.uniforms.uEdgeGlow.value = 0;

    // Cursor parallax — decay to zero when orbitalDrift is active (stage 3+)
    const sm = smooth.current;
    if (!s.orbitalDrift) {
      const tx = mouse.current.x * cfg.parallaxPos * sign;
      const ty = mouse.current.y * cfg.parallaxPos * sign;
      const rx = mouse.current.y * cfg.parallaxRot * sign * -0.5;
      const ry = mouse.current.x * cfg.parallaxRot * sign *  0.5;
      sm.px += (tx - sm.px) * 0.055;
      sm.py += (ty - sm.py) * 0.055;
      sm.rx += (rx - sm.rx) * 0.055;
      sm.ry += (ry - sm.ry) * 0.055;
    } else {
      // Smooth decay — parallax offsets drift back to zero
      sm.px *= 0.94;
      sm.py *= 0.94;
      sm.rx *= 0.94;
      sm.ry *= 0.94;
    }

    // ── Read additive offsets from stateRef ───────────────────────────────
    // HAND_CONFIG values are the locked baseline.
    // Scroll offsets (from controller) + hover offsets both additive on top.
    const ox  = (which === 'upper' ? s.upperOffsetX : s.lowerOffsetX)
              + (which === 'upper' ? (s.upperHoverX ?? 0) : (s.lowerHoverX ?? 0));
    const oy  = (which === 'upper' ? s.upperOffsetY : s.lowerOffsetY)
              + (which === 'upper' ? (s.upperHoverY ?? 0) : (s.lowerHoverY ?? 0));
    const oz  = which === 'upper' ? s.upperOffsetZ : s.lowerOffsetZ;
    const rz  = which === 'upper' ? s.upperRotZDelta : s.lowerRotZDelta;

    mesh.position.set(
      cfg.position.x + ox + sm.px,
      cfg.position.y + oy + sm.py,
      cfg.position.z + oz,
    );
    mesh.rotation.set(
      cfg.rotation.x + sm.rx,
      cfg.rotation.y + sm.ry,
      cfg.rotation.z + rz,   // inward tilt added here
    );

    const bs = 1.0 + breath * 0.012;
    // handScaleMult is 1.0 at init → identical scale. Grows in stage 3–4.
    const scaleMult = s.handScaleMult ?? 1.0;
    mesh.scale.set(
      (cfg.scale.x / PNG_ASPECT) * bs * scaleMult,
      cfg.scale.y * bs * scaleMult,
      cfg.scale.z,
    );
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} />;
}
