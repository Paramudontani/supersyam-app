import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  applicationName: 'Supersyam',
  title: {
    default: 'Supersyam',
    template: '%s | Supersyam',
  },
  description: 'ออกไปค้นพบความสุขที่ใช่ จองโรงแรม กิจกรรม และประสบการณ์ทั่วประเทศไทย',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  icons: {
    icon: '/supersyam.png',
    apple: '/supersyam.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Supersyam',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}