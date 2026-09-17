import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SCARA — Global Creative Agency',
    short_name: 'SCARA',
    description:
      'Global culture-first creative agency across sports, gaming, music and live experiences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/logo-scara.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
