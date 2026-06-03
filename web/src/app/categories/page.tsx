import { sql } from '@/lib/db';
import { Card, PageHeader, ActiveBadge, EmptyState } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Row = {
  category_id: number;
  name: string;
  slug: string;
  is_active: number;
  parent_name: string | null;
  prod_count: number;
};

export default async function CategoriesPage() {
  const rows = (await sql`
    SELECT c.category_id, c.name, c.slug, c.is_active,
           p.name AS parent_name,
           (SELECT COUNT(*)::int FROM product_category pc WHERE pc.category_id = c.category_id) AS prod_count
    FROM category c
    LEFT JOIN category p ON c.parent_id = p.category_id
    ORDER BY c.category_id
  `) as Row[];

  return (
    <div>
      <PageHeader title="🗂️ Категории" />
      <Card className="overflow-hidden" tour="list">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Име</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Родителска категория</th>
                <th className="px-4 py-3 font-semibold">Продукти</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.category_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{c.category_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{c.slug}</code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.parent_name ?? '—'}</td>
                  <td className="px-4 py-3">{c.prod_count}</td>
                  <td className="px-4 py-3">
                    <ActiveBadge active={c.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <EmptyState>Няма категории.</EmptyState>}
      </Card>
    </div>
  );
}
