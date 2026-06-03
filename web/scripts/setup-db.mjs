/**
 * Инициализира Neon Postgres базата: създава схемата и зарежда примерните данни.
 *
 * Стартиране:
 *   node --env-file=.env.local scripts/setup-db.mjs
 *
 * Изисква зададена променлива DATABASE_URL (connection string от Neon).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { neon } from '@neondatabase/serverless';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '..', 'db');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ Липсва DATABASE_URL. Стартирайте с: node --env-file=.env.local scripts/setup-db.mjs');
  process.exit(1);
}

const sql = neon(url);

/** Разделя .sql файл на отделни заявки (премахва коментари и празни редове). */
function statements(file) {
  const raw = readFileSync(join(dbDir, file), 'utf8');
  return raw
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function run(file) {
  const stmts = statements(file);
  console.log(`▶ ${file}: ${stmts.length} заявки`);
  for (const stmt of stmts) {
    await sql.query(stmt);
  }
}

try {
  await run('schema.sql');
  await run('seed.sql');
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM product`;
  console.log(`✅ Готово. Продукти в базата: ${count}`);
} catch (err) {
  console.error('❌ Грешка при инициализация:', err.message);
  process.exit(1);
}
