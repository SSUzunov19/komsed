import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { TourProvider } from '@/components/tour/TourContext';
import { TourOverlay } from '@/components/tour/TourOverlay';

export const metadata: Metadata = {
  title: 'КОМСЕД — Онлайн магазин за детски играчки',
  description:
    'Уеб приложение за управление на онлайн магазин за детски играчки: продукти, категории, клиенти, поръчки, промоции и SQL конзола.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="h-full">
      <body className="flex min-h-full flex-col font-sans">
        <TourProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
            КОМСЕД © 2026 · Стас Узунов, 2MI0700362 · СУ „Св. Климент Охридски", ФМИ
          </footer>
          <TourOverlay />
        </TourProvider>
      </body>
    </html>
  );
}
