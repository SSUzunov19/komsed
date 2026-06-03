'use client';

import { useActionState, useState } from 'react';
import { runQuery, type QueryResult } from './actions';
import { Card } from '@/components/ui';

const initial: QueryResult = { query: '' };

const EXAMPLES: { label: string; sql: string }[] = [
  {
    label: 'Промо продукти по % намаление',
    sql: `SELECT p.product_id, p.name, p.price AS original_price, p.promo_price,
       ROUND((1 - p.promo_price / p.price) * 100, 1) AS discount_pct
FROM product p
WHERE p.is_active = 1 AND p.promo_price IS NOT NULL
ORDER BY discount_pct DESC`,
  },
  {
    label: 'Брой продукти по категория (мин. 2)',
    sql: `SELECT c.name AS category, pc2.name AS parent_category,
       COUNT(pc.product_id) AS product_count
FROM category c
JOIN product_category pc ON c.category_id = pc.category_id
LEFT JOIN category pc2 ON c.parent_id = pc2.category_id
GROUP BY c.name, pc2.name
HAVING COUNT(pc.product_id) >= 2
ORDER BY product_count DESC`,
  },
  {
    label: 'Топ 3 клиенти по доставени поръчки',
    sql: `SELECT cu.first_name || ' ' || cu.last_name AS customer_name, cu.email,
       COUNT(o.order_id) AS total_orders, SUM(o.total) AS total_spent
FROM customer cu
JOIN orders o ON cu.customer_id = o.customer_id
WHERE o.status = 'delivered'
GROUP BY cu.first_name, cu.last_name, cu.email
ORDER BY total_spent DESC
FETCH FIRST 3 ROWS ONLY`,
  },
  {
    label: 'Детайли на поръчки с брой артикули',
    sql: `SELECT o.order_id, cu.first_name || ' ' || cu.last_name AS customer_name,
       o.status, o.total, COUNT(oi.order_item_id) AS item_count, o.created_at
FROM orders o
JOIN customer cu ON o.customer_id = cu.customer_id
LEFT JOIN order_item oi ON o.order_id = oi.order_id
GROUP BY o.order_id, cu.first_name, cu.last_name, o.status, o.total, o.created_at
ORDER BY o.created_at DESC`,
  },
  {
    label: 'Продукти в активна промоция',
    sql: `SELECT p.name AS product_name, p.price, pr.name AS promotion_name,
       pr.discount_pct,
       ROUND(p.price * (1 - pr.discount_pct / 100), 2) AS discounted_price
FROM product p
JOIN product_promotion pp ON p.product_id = pp.product_id
JOIN promotion pr ON pp.promotion_id = pr.promotion_id
WHERE pr.is_active = 1
ORDER BY pr.discount_pct DESC, p.name`,
  },
  {
    label: 'Непоръчвани продукти',
    sql: `SELECT p.product_id, p.name, p.sku, p.price, p.qty_in_stock
FROM product p
WHERE p.product_id NOT IN (SELECT DISTINCT oi.product_id FROM order_item oi)
ORDER BY p.qty_in_stock DESC`,
  },
];

export default function SqlConsolePage() {
  const [state, formAction, pending] = useActionState(runQuery, initial);
  const [query, setQuery] = useState('');

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-brand-dark">💻 SQL Конзола</h1>
      <p className="mb-5 text-sm text-slate-500">
        Изпълнение на реални <code className="rounded bg-slate-100 px-1">SELECT</code> заявки срещу
        Postgres базата. Заявки за промяна (INSERT/UPDATE/DELETE) са блокирани.
      </p>

      <div className="mb-4 flex flex-wrap gap-2" data-tour="sql-examples">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => setQuery(ex.sql)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-brand hover:text-brand"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <Card className="p-4" tour="sql-editor">
        <form action={formAction}>
          <textarea
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={7}
            spellCheck={false}
            placeholder="SELECT * FROM product"
            className="thin-scroll w-full resize-y rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? 'Изпълнение…' : '▶ Изпълни'}
          </button>
        </form>
      </Card>

      {state.error && (
        <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 font-mono text-sm text-rose-700">
          {state.error}
        </div>
      )}

      {state.rows && !state.error && (
        <Card className="mt-4 overflow-hidden">
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  {state.columns?.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {state.columns?.map((c) => (
                      <td key={c} className="whitespace-nowrap px-3 py-2">
                        {row[c] === null ? <span className="text-slate-300">NULL</span> : String(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400">
            Резултати: {state.count} реда
          </p>
        </Card>
      )}
    </div>
  );
}
