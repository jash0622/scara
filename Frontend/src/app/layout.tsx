import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from '@/components/smooth-scroll/LenisProvider';
import CustomCursor from '@/components/hud/CustomCursor';
import Navbar from '@/components/hud/Navbar';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SCARA — Global Creative Agency | Sports, Gaming & Culture',
  description:
    'Scara is a global culture-first creative agency operating across Mumbai, Istanbul, and UAE for brands like Konami, Samsung, Unilever, WPP, and Supercell.',
  keywords: [
    'Scara',
    'Creative Agency',
    'Gaming Agency',
    'Sports Marketing',
    'Live Events',
    'Mumbai',
    'Istanbul',
    'UAE',
    'Konami',
    'Supercell',
  ],
  authors: [{ name: 'Scara Creative Agency' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-scara-black text-scara-white antialiased selection:bg-scara-green selection:text-scara-black">
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main className="w-full">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
