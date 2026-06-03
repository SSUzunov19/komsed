import Link from 'next/link';
import { sql } from '@/lib/db';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [products, categories, customers, orders] = await Promise.all([
    sql`SELECT COUNT(*)::int AS c FROM product`,
    sql`SELECT COUNT(*)::int AS c FROM category`,
    sql`SELECT COUNT(*)::int AS c FROM customer`,
    sql`SELECT COUNT(*)::int AS c FROM orders`,
  ]);
  return {
    products: products[0].c as number,
    categories: categories[0].c as number,
    customers: customers[0].c as number,
    orders: orders[0].c as number,
  };
}

const STATS = [
  { key: 'products', label: 'Продукти', href: '/products' },
  { key: 'categories', label: 'Категории', href: '/categories' },
  { key: 'customers', label: 'Клиенти', href: '/customers' },
  { key: 'orders', label: 'Поръчки', href: '/orders' },
] as const;

const TILES = [
  { icon: '📦', title: 'Продукти', text: 'Преглед и управление на продуктовия каталог', href: '/products' },
  { icon: '🛒', title: 'Поръчки', text: 'Преглед на поръчки и артикули', href: '/orders' },
  { icon: '🏷️', title: 'Промоции', text: 'Активни и изтекли промоции', href: '/promotions' },
  { icon: '💻', title: 'SQL Конзола', text: 'Изпълнение на реални SQL заявки', href: '/sql' },
];

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-dark">🧸 КОМСЕД</h1>
        <p className="mt-1 text-slate-500">
          Онлайн магазин за детски играчки и бебешки аксесоари
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.key} href={s.href}>
            <Card className="p-6 text-center transition-shadow hover:shadow-md">
              <div className="text-4xl font-bold text-brand">{stats[s.key]}</div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <Card key={t.href} className="flex flex-col p-5">
            <div className="text-2xl">{t.icon}</div>
            <h2 className="mt-2 font-semibold text-brand-dark">{t.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500">{t.text}</p>
            <Link href={t.href} className="mt-3 text-sm font-semibold text-brand hover:underline">
              Отвори →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
