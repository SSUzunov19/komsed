import Link from 'next/link';
import { sql } from '@/lib/db';
import { Card, PageHeader, Badge, EmptyState } from '@/components/ui';
import { bgn, dateBG, ORDER_STATUS, PAYMENT_METHOD, DELIVERY_METHOD } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Row = {
  order_id: number;
  status: string;
  total: string;
  payment_method: string;
  delivery_method: string;
  created_at: string;
  customer_name: string;
  item_count: number;
};

export default async function OrdersPage() {
  const rows = (await sql`
    SELECT o.order_id, o.status, o.total, o.payment_method, o.delivery_method, o.created_at,
           cu.first_name || ' ' || cu.last_name AS customer_name,
           (SELECT COUNT(*)::int FROM order_item oi WHERE oi.order_id = o.order_id) AS item_count
    FROM orders o
    JOIN customer cu ON o.customer_id = cu.customer_id
    ORDER BY o.created_at DESC
  `) as Row[];

  return (
    <div>
      <PageHeader title="🛒 Поръчки" />
      <Card className="overflow-hidden" tour="list">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Клиент</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold">Сума</th>
                <th className="px-4 py-3 font-semibold">Плащане</th>
                <th className="px-4 py-3 font-semibold">Доставка</th>
                <th className="px-4 py-3 font-semibold">Артикули</th>
                <th className="px-4 py-3 font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((o) => {
                const st = ORDER_STATUS[o.status] ?? { label: o.status, color: 'bg-slate-100 text-slate-700' };
                return (
                  <tr key={o.order_id} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/orders/${o.order_id}`} className="font-semibold text-brand hover:underline">
                        #{o.order_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{o.customer_name}</td>
                    <td className="px-4 py-3">
                      <Badge className={st.color}>{st.label}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">{bgn(o.total)}</td>
                    <td className="px-4 py-3 text-slate-600">{PAYMENT_METHOD[o.payment_method] ?? o.payment_method}</td>
                    <td className="px-4 py-3 text-slate-600">{DELIVERY_METHOD[o.delivery_method] ?? o.delivery_method}</td>
                    <td className="px-4 py-3">{o.item_count}</td>
                    <td className="px-4 py-3 text-slate-500">{dateBG(o.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <EmptyState>Няма поръчки.</EmptyState>}
      </Card>
    </div>
  );
}
