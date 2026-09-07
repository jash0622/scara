'use client';
/**
 * Effects.tsx (Phase 2 final)
 *
 * Bloom dialled in to hug fingertips only.
 * Higher threshold (0.30) means only the neon-bright fingertip pixels bloom.
 * Tighter radius (0.38) keeps the halo small.
 * Lower strength (0.82) removes the green fog over the whole hand.
 */

import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';

interface Props {
  bloomIntensity?: number;
}

export default function Effects({ bloomIntensity = 1.0 }: Props) {
  return (
    <EffectComposer
      multisampling={0}
      enableNormalPass={false}
      stencilBuffer={false}
    >
      <Bloom
        intensity={0.82 * bloomIntensity}
        luminanceThreshold={0.30}
        luminanceSmoothing={0.55}
        mipmapBlur
        radius={0.38}
        levels={4}
      />
      <SMAA />
    </EffectComposer>
  );
}
