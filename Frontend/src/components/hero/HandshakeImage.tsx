'use client';
/**
 * HandshakeImage.tsx
 *
 * A single centered plane showing public/hero/handshake.png.
 * Hidden by default (opacity 0). During the scroll crossfade (~70%) it fades
 * in as the two separate hand planes fade out — an asset swap that reads as
 * the hands completing a handshake. No finger bones, no mesh deform.
 *
 * Driven by stateRef:
 *   handshakeOpacity — 0→1 crossfade in, 1→0 fade out (stage 5)
 *   handshakeScale   — gentle breathing scale
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HandSceneState } from './ParticleHandScene';

// handshake.png aspect — measured from the asset. Adjust if needed.
// Using a wide landscape ratio typical of a two-hands handshake composition.
const HS_ASPECT = 1.6;

const VERT = /* glsl */`
uniform float uTime;
uniform float uBreath;
varying vec2  vUv;
void main() {
  vUv = uv;
  float s     = 1.0 + uBreath * 0.010;   // subtle breathing
  vec3 scaled = position * vec3(s, s, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(scaled, 1.0);
}
`;

const FRAG = /* glsl */`
uniform sampler2D uTex;
uniform float     uTime;
uniform float     uOpacity;
varying vec2      vUv;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec4 texel = texture2D(uTex, vUv);

  // Micro shimmer for that particle-sculpture feel
  float n1 = hash21(vUv * 31.0 + vec2(uTime * 0.35));
  float n2 = hash21(vUv * 17.0 + vec2(uTime * 0.25 + 1.3));
  float shimmer = 1.0 + (n1 * n2 - 0.25) * 0.008;

  vec3 col = texel.rgb * shimmer;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = col * (0.82 + lum * 0.40);

  float a = texel.a * uOpacity;
  if (a < 0.004) discard;

  gl_FragColor = vec4(col, a);
}
`;

interface Props {
  stateRef: React.RefObject<HandSceneState>;
}

export default function HandshakeImage({ stateRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const t = loader.load('/hero/handshake.png');
    t.colorSpace      = THREE.SRGBColorSpace;
    t.minFilter       = THREE.LinearMipmapLinearFilter;
    t.magFilter       = THREE.LinearFilter;
    t.generateMipmaps = true;
    return t;
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTex:     { value: texture },
      uTime:    { value: 0 },
      uBreath:  { value: 0 },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite:  false,
    depthTest:   true,
    blending:    THREE.AdditiveBlending,
    toneMapped:  false,
    side:        THREE.DoubleSide,
  }), [texture]);

  const geo = useMemo(
    () => new THREE.PlaneGeometry(HS_ASPECT, 1.0, 1, 1),
    [],
  );

  useEffect(() => () => {
    geo.dispose(); mat.dispose(); texture.dispose();
  }, [geo, mat, texture]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const s = stateRef.current;
    if (!s) return;

    const t = clock.getElapsedTime();
    const breath = Math.sin(t * (Math.PI * 2 / 4)) * 0.5 + 0.5;

    mat.uniforms.uTime.value    = t;
    mat.uniforms.uBreath.value  = breath;
    mat.uniforms.uOpacity.value = s.handshakeOpacity ?? 0;

    // Position at the fingertip-meeting point (energy core location).
    mesh.position.set(s.energyX ?? 3.19, s.energyY ?? -0.06, 0.05);

    // Scale — sized to fill the contact area, with gentle breathing.
    // Base world width ≈ 3.4 WU so it reads as a large centered handshake.
    const baseW = 3.4;
    const scaleMult = (s.handshakeScale ?? 1.0) * (1.0 + breath * 0.010);
    mesh.scale.set(
      (baseW / HS_ASPECT) * scaleMult,
      baseW / HS_ASPECT * scaleMult,
      1,
    );

    // Only render when it has any opacity — avoids invisible overdraw
    mesh.visible = (s.handshakeOpacity ?? 0) > 0.002;
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} visible={false} />;
}
