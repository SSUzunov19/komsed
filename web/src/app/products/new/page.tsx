'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createProduct, type FormState } from '../actions';
import { Card } from '@/components/ui';

const initial: FormState = {};

// Демо стойности, които турът попълва (само за показ — не записва)
const DEMO_FIELDS: { name: string; value: string; type: boolean }[] = [
  { name: 'name', value: 'Плюшено мече Комсе', type: true },
  { name: 'sku', value: 'KOMSE-TOUR', type: true },
  { name: 'price', value: '29.99', type: false },
  { name: 'promo_price', value: '24.99', type: false },
  { name: 'qty', value: '50', type: false },
  { name: 'brand', value: 'КОМСЕД', type: true },
];

export default function NewProductPage() {
  const [state, formAction, pending] = useActionState(createProduct, initial);
  const timers = useRef<number[]>([]);

  // Турът може да попълни формата автоматично на живо
  useEffect(() => {
    const fill = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      const form = document.querySelector('form');
      if (!form) return;
      const setVal = (el: HTMLInputElement | null, v: string) => {
        if (!el) return;
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      let delay = 200;
      for (const f of DEMO_FIELDS) {
        const el = form.querySelector<HTMLInputElement>(`[name="${f.name}"]`);
        if (!el) continue;
        const start = delay;
        timers.current.push(window.setTimeout(() => el.focus(), start));
        if (f.type) {
          for (let k = 1; k <= f.value.length; k++) {
            timers.current.push(window.setTimeout(() => setVal(el, f.value.slice(0, k)), start + k * 45));
          }
          delay = start + f.value.length * 45 + 300;
        } else {
          timers.current.push(window.setTimeout(() => setVal(el, f.value), start + 150));
          delay = start + 450;
        }
      }
    };
    window.addEventListener('komsed:fill-product', fill);
    const captured = timers.current;
    return () => {
      window.removeEventListener('komsed:fill-product', fill);
      captured.forEach(clearTimeout);
    };
  }, []);

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-brand-dark">+ Добави продукт</h1>
      <Card className="max-w-xl p-6">
        {state.error && (
          <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <Field label="Име" name="name" required />
          <Field label="SKU" name="sku" required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Цена (лв.)" name="price" type="number" step="0.01" required />
            <Field label="Промо цена (лв.)" name="promo_price" type="number" step="0.01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Наличност" name="qty" type="number" defaultValue="0" required />
            <Field label="Марка" name="brand" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" />
            Активен
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {pending ? 'Запазване…' : 'Запази'}
            </button>
            <Link
              href="/products"
              className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Отказ
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </label>
  );
}
