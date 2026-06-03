import { sql } from '@/lib/db';
import { Card, PageHeader, EmptyState } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Row = {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  order_count: number;
};

export default async function CustomersPage() {
  const rows = (await sql`
    SELECT cu.customer_id, cu.first_name, cu.last_name, cu.email, cu.phone,
           (SELECT COUNT(*)::int FROM orders o WHERE o.customer_id = cu.customer_id) AS order_count
    FROM customer cu
    ORDER BY cu.customer_id
  `) as Row[];

  return (
    <div>
      <PageHeader title="👤 Клиенти" action={{ href: '/customers/new', label: '+ Добави клиент' }} />
      <Card className="overflow-hidden">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Име</th>
                <th className="px-4 py-3 font-semibold">Имейл</th>
                <th className="px-4 py-3 font-semibold">Телефон</th>
                <th className="px-4 py-3 font-semibold">Поръчки</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.customer_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{c.customer_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3">{c.order_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <EmptyState>Няма клиенти.</EmptyState>}
      </Card>
    </div>
  );
}
