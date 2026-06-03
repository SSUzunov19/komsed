'use server';

import { sql } from '@/lib/db';

export type QueryResult = {
  query: string;
  columns?: string[];
  rows?: Record<string, unknown>[];
  count?: number;
  error?: string;
};

const FORBIDDEN = /\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|comment|merge)\b/i;

export async function runQuery(_prev: QueryResult, formData: FormData): Promise<QueryResult> {
  const raw = String(formData.get('query') ?? '').trim();
  if (!raw) return { query: '', error: 'Въведете заявка.' };

  // Само за четене: премахваме евентуална крайна точка и запетая
  const cleaned = raw.replace(/;\s*$/, '');

  if (cleaned.includes(';')) {
    return { query: raw, error: 'Разрешена е само една заявка (без знак „;" по средата).' };
  }
  const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase();
  if (firstWord !== 'select' && firstWord !== 'with') {
    return { query: raw, error: 'Разрешени са само заявки SELECT (или WITH ... SELECT).' };
  }
  if (FORBIDDEN.test(cleaned)) {
    return { query: raw, error: 'Заявката съдържа забранена операция. Конзолата е само за четене (SELECT).' };
  }

  try {
    const rows = (await sql.query(cleaned)) as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { query: raw, columns, rows, count: rows.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { query: raw, error: msg };
  }
}
