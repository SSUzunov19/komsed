'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/products', label: 'Продукти' },
  { href: '/categories', label: 'Категории' },
  { href: '/customers', label: 'Клиенти' },
  { href: '/orders', label: 'Поръчки' },
  { href: '/promotions', label: 'Промоции' },
  { href: '/sql', label: 'SQL Конзола' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-brand-dark to-brand text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-3">
        <Link href="/" className="mr-auto flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🧸</span> КОМСЕД
        </Link>
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
