import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'Липсва DATABASE_URL. Добавете connection string от Neon в .env.local (виж .env.example).',
      );
    }
    client = neon(url);
  }
  return client;
}

/**
 * Neon serverless клиент с lazy инициализация (за да не чупи `next build`,
 * ако променливата още не е зададена).
 *
 * Употреба:
 *   const rows = await sql`SELECT * FROM product WHERE product_id = ${id}`;
 *   const rows = await sql.query('SELECT * FROM product');
 *
 * Параметрите в tagged template се вмъкват като placeholder-и ($1, $2...) —
 * защита срещу SQL injection.
 */
export const sql = new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args: Parameters<NeonQueryFunction<false, false>>) {
    return getClient()(...(args as Parameters<NeonQueryFunction<false, false>>));
  },
  get(_target, prop: string | symbol) {
    const value = getClient()[prop as keyof NeonQueryFunction<false, false>];
    return typeof value === 'function' ? value.bind(getClient()) : value;
  },
});
