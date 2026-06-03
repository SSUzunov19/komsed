import Link from 'next/link';
import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-brand-dark">{title}</h1>
      {action && (
        <Link
          href={action.href}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean | number }) {
  const isActive = active === true || active === 1;
  return (
    <Badge className={isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
      {isActive ? 'Активен' : 'Неактивен'}
    </Badge>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="p-8 text-center text-slate-400">{children}</div>;
}
