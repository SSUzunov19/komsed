'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

export type FormState = { error?: string };

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim();
  const sku = String(formData.get('sku') ?? '').trim();
  const price = parseFloat(String(formData.get('price') ?? ''));
  const promoRaw = String(formData.get('promo_price') ?? '').trim();
  const promo = promoRaw ? parseFloat(promoRaw) : null;
  const qty = parseInt(String(formData.get('qty') ?? '0'), 10) || 0;
  const brand = String(formData.get('brand') ?? '').trim() || null;
  const isActive = formData.get('is_active') ? 1 : 0;

  if (!name || !sku) return { error: 'Името и SKU са задължителни.' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'Цената трябва да е положително число.' };
  if (promo !== null && (promo <= 0 || promo >= price))
    return { error: 'Промо цената трябва да е положителна и по-малка от обикновената цена.' };

  try {
    await sql`
      INSERT INTO product (name, sku, price, promo_price, qty_in_stock, brand_id, is_active)
      VALUES (${name}, ${sku}, ${price}, ${promo}, ${qty}, ${brand}, ${isActive})
    `;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('uq_product_sku')) return { error: `Продукт със SKU "${sku}" вече съществува.` };
    return { error: `Грешка при запис: ${msg}` };
  }

  revalidatePath('/products');
  revalidatePath('/');
  redirect('/products');
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!id) return;
  try {
    await sql`DELETE FROM product WHERE product_id = ${id}`;
  } catch {
    redirect('/products?error=' + encodeURIComponent('Продуктът не може да бъде изтрит — има поръчки с него.'));
  }
  revalidatePath('/products');
  revalidatePath('/');
  redirect('/products');
}
