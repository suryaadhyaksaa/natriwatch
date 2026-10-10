import type { Metadata, Viewport } from 'next';
import AppLayout from '../components/layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'NATRIWATCH - Monitoring Natrium & Hipertensi',
  description: 'Aplikasi pemantauan asupan natrium dan skrining risiko hipertensi berbasis AI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}