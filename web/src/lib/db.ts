import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Pool as PgPool } from 'pg';

type Rows = Record<string, unknown>[];

/**
 * Унифициран SQL клиент.
 *
 *   const rows = await sql`SELECT * FROM product WHERE product_id = ${id}`;
 *   const rows = await sql.query('SELECT * FROM product');
 *
 * Параметрите в tagged template се вмъкват като placeholder-и ($1, $2…) —
 * защита срещу SQL injection.
 *
 * В production (Neon) използва serverless HTTP драйвера; локално срещу
 * обикновен PostgreSQL използва node-postgres. Изборът е по connection string-а.
 */
type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Rows>;
  query: (text: string, params?: unknown[]) => Promise<Rows>;
};

let neonClient: NeonQueryFunction<false, false> | null = null;
let pgPool: PgPool | null = null;

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'Липсва DATABASE_URL. Добавете connection string в .env.local (виж .env.example).',
    );
  }
  return url;
}

function isNeon(url: string): boolean {
  return url.includes('neon.tech') || url.includes('neon.build');
}

function getNeon(url: string): NeonQueryFunction<false, false> {
  if (!neonClient) neonClient = neon(url);
  return neonClient;
}

async function getPgPool(url: string): Promise<PgPool> {
  if (!pgPool) {
    const { Pool } = await import('pg');
    pgPool = new Pool({ connectionString: url });
  }
  return pgPool;
}

function templateToText(strings: TemplateStringsArray, values: unknown[]): string {
  return strings.reduce(
    (acc, part, i) => acc + part + (i < values.length ? `$${i + 1}` : ''),
    '',
  );
}

export const sql: Sql = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
  const url = databaseUrl();
  if (isNeon(url)) {
    return (await getNeon(url)(strings, ...values)) as Rows;
  }
  const pool = await getPgPool(url);
  const result = await pool.query(templateToText(strings, values), values);
  return result.rows as Rows;
}) as Sql;

sql.query = async (text: string, params: unknown[] = []) => {
  const url = databaseUrl();
  if (isNeon(url)) {
    return (await getNeon(url).query(text, params)) as Rows;
  }
  const pool = await getPgPool(url);
  const result = await pool.query(text, params);
  return result.rows as Rows;
};
