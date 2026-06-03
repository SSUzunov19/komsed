/** Помощни функции за форматиране и преводи на стойности от базата. */

export function bgn(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return `${n.toFixed(2)} лв.`;
}

export function dateBG(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Изчакваща', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Потвърдена', color: 'bg-sky-100 text-sky-800' },
  shipped: { label: 'Изпратена', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Доставена', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Отменена', color: 'bg-rose-100 text-rose-800' },
};

export const PAYMENT_METHOD: Record<string, string> = {
  cod: 'Наложен платеж',
  card: 'Карта',
  bank_transfer: 'Банков превод',
};

export const DELIVERY_METHOD: Record<string, string> = {
  courier: 'Куриер',
  store_pickup: 'Взимане от магазин',
  econt: 'Еконт',
  speedy: 'Спиди',
};
