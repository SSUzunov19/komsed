import { sql } from '@/lib/db';
import { Card, PageHeader, ActiveBadge, EmptyState } from '@/components/ui';
import { bgn } from '@/lib/format';
import { deleteProduct } from './actions';

export const dynamic = 'force-dynamic';

type Product = {
  product_id: number;
  name: string;
  sku: string;
  price: string;
  promo_price: string | null;
  qty_in_stock: number;
  brand_id: string | null;
  is_active: number;
};

function StockCell({ qty }: { qty: number }) {
  const cls = qty > 5 ? 'text-emerald-600' : qty > 0 ? 'text-amber-600' : 'text-rose-600';
  return <span className={`font-semibold ${cls}`}>{qty}</span>;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const products = (await sql`
    SELECT product_id, name, sku, price, promo_price, qty_in_stock, brand_id, is_active
    FROM product ORDER BY product_id
  `) as Product[];

  return (
    <div>
      <PageHeader title="📦 Продукти" action={{ href: '/products/new', label: '+ Добави продукт', tour: 'add' }} />

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <Card className="overflow-hidden" tour="list">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Име</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Цена</th>
                <th className="px-4 py-3 font-semibold">Промо</th>
                <th className="px-4 py-3 font-semibold">Наличност</th>
                <th className="px-4 py-3 font-semibold">Марка</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.product_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{p.product_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{p.sku}</code>
                  </td>
                  <td className="px-4 py-3">{bgn(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.promo_price ? (
                      <span className="font-semibold text-rose-600">{bgn(p.promo_price)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockCell qty={p.qty_in_stock} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.brand_id ?? '—'}</td>
                  <td className="px-4 py-3">
                    <ActiveBadge active={p.is_active} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.product_id} />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                        title="Изтрий"
                      >
                        🗑 Изтрий
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <EmptyState>Няма продукти.</EmptyState>}
      </Card>
    </div>
  );
}
