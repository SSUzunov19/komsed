import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import { Card, Badge, EmptyState } from '@/components/ui';
import { bgn, dateBG, ORDER_STATUS, PAYMENT_METHOD, DELIVERY_METHOD } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Order = {
  order_id: number;
  status: string;
  total: string;
  payment_method: string;
  delivery_method: string;
  created_at: string;
  customer_name: string;
  email: string;
};

type Item = {
  order_item_id: number;
  quantity: number;
  unit_price: string;
  promo_price: string | null;
  product_name: string;
  sku: string;
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (!orderId) notFound();

  const orders = (await sql`
    SELECT o.order_id, o.status, o.total, o.payment_method, o.delivery_method, o.created_at,
           cu.first_name || ' ' || cu.last_name AS customer_name, cu.email
    FROM orders o
    JOIN customer cu ON o.customer_id = cu.customer_id
    WHERE o.order_id = ${orderId}
  `) as Order[];

  if (orders.length === 0) notFound();
  const order = orders[0];

  const items = (await sql`
    SELECT oi.order_item_id, oi.quantity, oi.unit_price, oi.promo_price,
           p.name AS product_name, p.sku
    FROM order_item oi
    JOIN product p ON oi.product_id = p.product_id
    WHERE oi.order_id = ${orderId}
    ORDER BY oi.order_item_id
  `) as Item[];

  const st = ORDER_STATUS[order.status] ?? { label: order.status, color: 'bg-slate-100 text-slate-700' };

  return (
    <div>
      <Link href="/orders" className="text-sm text-brand hover:underline">
        ← Назад към поръчките
      </Link>

      <div className="mb-5 mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-brand-dark">Поръчка #{order.order_id}</h1>
        <Badge className={st.color}>{st.label}</Badge>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-semibold text-slate-700">Клиент</h2>
          <dl className="space-y-1 text-sm">
            <Info label="Име" value={order.customer_name} />
            <Info label="Имейл" value={order.email} />
          </dl>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-semibold text-slate-700">Детайли</h2>
          <dl className="space-y-1 text-sm">
            <Info label="Плащане" value={PAYMENT_METHOD[order.payment_method] ?? order.payment_method} />
            <Info label="Доставка" value={DELIVERY_METHOD[order.delivery_method] ?? order.delivery_method} />
            <Info label="Дата" value={dateBG(order.created_at)} />
            <Info label="Обща сума" value={bgn(order.total)} />
          </dl>
        </Card>
      </div>

      <h2 className="mb-3 font-semibold text-slate-700">Артикули</h2>
      <Card className="overflow-hidden">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Продукт</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Бр.</th>
                <th className="px-4 py-3 font-semibold">Ед. цена</th>
                <th className="px-4 py-3 font-semibold">Промо</th>
                <th className="px-4 py-3 font-semibold">Сума</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => {
                const effective = it.promo_price ?? it.unit_price;
                const lineTotal = parseFloat(effective) * it.quantity;
                return (
                  <tr key={it.order_item_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{it.product_name}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{it.sku}</code>
                    </td>
                    <td className="px-4 py-3">{it.quantity}</td>
                    <td className="px-4 py-3">{bgn(it.unit_price)}</td>
                    <td className="px-4 py-3">{it.promo_price ? bgn(it.promo_price) : '—'}</td>
                    <td className="px-4 py-3 font-semibold">{bgn(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <EmptyState>Няма артикули.</EmptyState>}
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
