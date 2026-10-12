import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import ProductManagerClient from './ProductManagerClient';

export const revalidate = 0; // Fresh admin data

async function getAllProducts(): Promise<Tables<'products'>[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (error || !data) {
    console.error('Lỗi truy vấn sản phẩm admin:', error);
    return [];
  }

  return data as Tables<'products'>[];
}

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return <ProductManagerClient initialProducts={products} />;
}
