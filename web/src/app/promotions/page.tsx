import { sql } from '@/lib/db';
import { Card, PageHeader, ActiveBadge, EmptyState } from '@/components/ui';
import { dateBG } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Row = {
  promotion_id: number;
  name: string;
  discount_pct: string | null;
  start_date: string;
  end_date: string;
  is_active: number;
  prod_count: number;
};

function dateOnly(d: string) {
  return dateBG(d).split(',')[0].trim();
}

export default async function PromotionsPage() {
  const rows = (await sql`
    SELECT pr.promotion_id, pr.name, pr.discount_pct, pr.start_date, pr.end_date, pr.is_active,
           (SELECT COUNT(*)::int FROM product_promotion pp WHERE pp.promotion_id = pr.promotion_id) AS prod_count
    FROM promotion pr
    ORDER BY pr.is_active DESC, pr.end_date DESC
  `) as Row[];

  return (
    <div>
      <PageHeader title="🏷️ Промоции" />
      <Card className="overflow-hidden" tour="list">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Име</th>
                <th className="px-4 py-3 font-semibold">Отстъпка</th>
                <th className="px-4 py-3 font-semibold">От</th>
                <th className="px-4 py-3 font-semibold">До</th>
                <th className="px-4 py-3 font-semibold">Продукти</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => (
                <tr key={p.promotion_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{p.promotion_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 font-semibold text-brand">
                    {p.discount_pct ? `${parseFloat(p.discount_pct)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{dateOnly(p.start_date)}</td>
                  <td className="px-4 py-3 text-slate-600">{dateOnly(p.end_date)}</td>
                  <td className="px-4 py-3">{p.prod_count}</td>
                  <td className="px-4 py-3">
                    <ActiveBadge active={p.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <EmptyState>Няма промоции.</EmptyState>}
      </Card>
    </div>
  );
}
