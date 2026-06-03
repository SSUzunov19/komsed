'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

export type FormState = { error?: string };

export async function createCustomer(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = String(formData.get('first_name') ?? '').trim();
  const lastName = String(formData.get('last_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim() || null;

  if (!firstName || !lastName) return { error: 'Името и фамилията са задължителни.' };
  if (!email) return { error: 'Имейлът е задължителен.' };

  try {
    await sql`
      INSERT INTO customer (first_name, last_name, email, phone)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone})
    `;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('uq_customer_email')) return { error: `Клиент с имейл "${email}" вече съществува.` };
    return { error: `Грешка при запис: ${msg}` };
  }

  revalidatePath('/customers');
  revalidatePath('/');
  redirect('/customers');
}
