'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createCustomer, type FormState } from '../actions';
import { Card } from '@/components/ui';

const initial: FormState = {};

export default function NewCustomerPage() {
  const [state, formAction, pending] = useActionState(createCustomer, initial);

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-brand-dark">+ Добави клиент</h1>
      <Card className="max-w-xl p-6">
        {state.error && (
          <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Име" name="first_name" required />
            <Field label="Фамилия" name="last_name" required />
          </div>
          <Field label="Имейл" name="email" type="email" required />
          <Field label="Телефон" name="phone" />
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {pending ? 'Запазване…' : 'Запази'}
            </button>
            <Link
              href="/customers"
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </label>
  );
}
