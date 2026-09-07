'use client';
/**
 * EnergyCore.tsx — fingertip touch effect
 *
 * Reference analysis of the touch effect:
 *  - Bright neon lime/white hot point exactly at fingertip contact
 *  - Soft radial glow spreading ~40-50px outward
 *  - ~8-12 tiny star particles scattered around the glow (not orbiting, scattered)
 *  - Breathing pulse on the whole effect
 *  - Strongest brightness in the scene
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HandSceneState } from './ParticleHandScene';

// ── Core glow sprite ──────────────────────────────────────────────────────────
const CORE_VERT = /* glsl */`
uniform float uSize;
void main() {
  vec4 mv      = modelViewMatrix * vec4(position, 1.0);
  gl_Position  = projectionMatrix * mv;
  gl_PointSize = clamp(uSize / -mv.z, 2.0, 180.0);
}
`;

const CORE_FRAG = /* glsl */`
uniform float uIntensity;
uniform float uTime;
void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv) * 2.0;
  if (d > 1.0) discard;

  float breathe = 0.85 + 0.15 * sin(uTime * 1.8);
  float flicker = 0.97 + 0.03 * sin(uTime * 11.0 + 0.7);

  // Hot white core → neon lime halo — matches reference exactly
  float core   = exp(-d * d * 280.0) * 6.0;   // white-hot pin point
  float inner  = exp(-d * d *  40.0) * 2.8;   // tight lime inner
  float mid    = exp(-d * d *  10.0) * 1.20;  // mid glow
  float outer  = exp(-d * d *   3.2) * 0.45;  // wide soft halo

  float brightness = (core + inner + mid + outer) * uIntensity * breathe * flicker;

  vec3 lime  = vec3(0.843, 1.000, 0.0);
  vec3 white = vec3(1.000, 1.000, 0.95);
  // White at very centre, lime spreading outward
  float whiteBlend = clamp((core + inner) * 0.28, 0.0, 1.0);
  vec3 col = mix(lime, white, whiteBlend);

  gl_FragColor = vec4(col, clamp(brightness, 0.0, 1.0));
}
`;

// ── Scattered star particles around the glow ─────────────────────────────────
// These are fixed relative to the glow, not orbiting — small scattered glints
// exactly like the reference image shows tiny bright dots near the fingertips
const STAR_VERT = /* glsl */`
attribute float aRandom;
attribute float aSize;
attribute vec3  aOffset;
uniform   float uTime;
uniform   float uIntensity;
uniform   float uBurstScale;  // 1→6 during spark burst — scatters stars outward
varying   float vAlpha;
varying   float vLime;

void main() {
  float drift  = sin(uTime * 0.4 + aRandom * 6.283) * 0.018;
  float driftY = cos(uTime * 0.3 + aRandom * 4.712) * 0.012;
  // During burst, stars fly outward proportional to their offset direction
  vec3  scaledOffset = aOffset * uBurstScale;
  vec3  pos    = position + scaledOffset + vec3(drift, driftY, 0.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position  = projectionMatrix * mv;
  // Stars also grow during burst
  gl_PointSize = clamp((aSize * uBurstScale) / -mv.z, 0.8, 12.0);

  float twinkle = 0.5 + 0.5 * sin(uTime * (1.5 + aRandom * 2.0) + aRandom * 6.283);
  vAlpha = uIntensity * twinkle * (0.4 + 0.6 * aRandom);
  vLime  = step(0.65, aRandom);
}
`;

const STAR_FRAG = /* glsl */`
varying float vAlpha;
varying float vLime;
void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv) * 2.0;
  if (d > 1.0) discard;
  float a  = exp(-d * d * 5.0) * vAlpha;
  vec3 col = mix(vec3(1.0, 1.0, 0.95), vec3(0.843, 1.0, 0.0), vLime);
  gl_FragColor = vec4(col, a);
}
`;

// ── Small electric arc between fingertips ────────────────────────────────────
// Uses the Lightning WebGL shader in a tiny rotated div overlay.
// Positioned at the fingertip gap, diagonal (thumb → index finger direction).
// Rendered as a DOM overlay in ParticleHandScene — this component just
// exports the visibility signal via stateRef.tipGlow.
// NOTE: actual DOM rendering is in ParticleHandScene.tsx overlay div.

interface Props {
  stateRef: React.RefObject<HandSceneState>;
}

export default function EnergyCore({ stateRef }: Props) {
  const coreRef = useRef<THREE.Points>(null);
  const starRef = useRef<THREE.Points>(null);

  // ── Core glow ─────────────────────────────────────────────────────────────
  const { coreGeo, coreMat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    const m = new THREE.ShaderMaterial({
      vertexShader:   CORE_VERT,
      fragmentShader: CORE_FRAG,
      uniforms: {
        uIntensity: { value: 0 },
        uTime:      { value: 0 },
        // uSize 88 → at z=5.6, FOV28, ~1024px wide gives ≈50px radius glow
        uSize:      { value: 88 },
      },
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { coreGeo: g, coreMat: m };
  }, []);

  // ── Scattered star glints ─────────────────────────────────────────────────
  const { starGeo, starMat } = useMemo(() => {
    const N = 14;  // ~12-14 scattered stars like in reference

    // Deterministic scatter offsets — pre-baked, not random each frame
    let seed = 0xf00dcafe;
    const rng = () => {
      seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
      return (seed >>> 0) / 0xffffffff;
    };

    const pos     = new Float32Array(N * 3);  // all at origin — group moves
    const offsets = new Float32Array(N * 3);
    const rnd     = new Float32Array(N);
    const siz     = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const angle  = rng() * Math.PI * 2;
      const radius = 0.06 + rng() * 0.22;   // 0.06–0.28 WU from centre
      offsets[i*3]   = Math.cos(angle) * radius;
      offsets[i*3+1] = Math.sin(angle) * radius * 0.7;
      offsets[i*3+2] = (rng() - 0.5) * 0.08;

      rnd[i] = rng();
      siz[i] = 10 + rng() * 18;   // varied sizes
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos,     3));
    g.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 3));
    g.setAttribute('aRandom',  new THREE.BufferAttribute(rnd,     1));
    g.setAttribute('aSize',    new THREE.BufferAttribute(siz,     1));

    const m = new THREE.ShaderMaterial({
      vertexShader:   STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uIntensity:  { value: 0 },
        uBurstScale: { value: 1 },  // 1=normal, up to 6 at full burst
      },
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { starGeo: g, starMat: m };
  }, []);

  useEffect(() => () => {
    coreGeo.dispose(); coreMat.dispose();
    starGeo.dispose(); starMat.dispose();
  }, [coreGeo, coreMat, starGeo, starMat]);

  useFrame(({ clock }) => {
    const s    = stateRef.current;
    const cor  = coreRef.current;
    const star = starRef.current;
    if (!s || !cor || !star) return;

    const t         = clock.getElapsedTime();
    const breathe   = 0.85 + 0.15 * Math.sin(t * 1.8);
    const intensity = s.tipGlow * breathe;

    cor.position.set(s.energyX, s.energyY, s.energyZ);
    star.position.set(s.energyX, s.energyY, s.energyZ);

    coreMat.uniforms.uIntensity.value  = intensity;
    coreMat.uniforms.uTime.value       = t;

    // sparkBurst (0→1) expands the core radius: 88 → 600 at full burst.
    // At z=5.6 that's ~50px → ~340px radius — fills screen center.
    const burst = s.sparkBurst ?? 0;
    coreMat.uniforms.uSize.value = 88 + burst * 512;

    starMat.uniforms.uTime.value       = t;
    starMat.uniforms.uIntensity.value  = Math.min(intensity * (1.3 + burst * 2.0), 1.0);
    starMat.uniforms.uBurstScale.value = 1.0 + burst * 5.0;  // 1→6 scatter radius

    const visible = s.tipGlow > 0.01;
    cor.visible  = visible;
    star.visible = visible;
  });

  return (
    <>
      <points ref={coreRef} geometry={coreGeo} material={coreMat} />
      <points ref={starRef} geometry={starGeo} material={starMat} />
    </>
  );
}
