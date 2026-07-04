import type { Metadata } from 'next';
import { Outfit, Caveat, Playfair_Display, Kalam } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const kalam = Kalam({
  weight: ['400', '700'],
  variable: '--font-kalam',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tele-Booth',
  description: 'Your personal digital photobooth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${caveat.variable} ${playfair.variable} ${kalam.variable} antialiased font-sans bg-rose-50/30`}>
        {children}
      </body>
    </html>
  );
}
