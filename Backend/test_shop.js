import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testShop() {
  const { data: products } = await supabase.from('shop_products').select('*').limit(1);
  if (!products || products.length === 0) return console.log('No products found');
  const product = products[0];
  
  const res = await fetch('https://sportsclubmanagementsystem-production.up.railway.app/api/v1/shop/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-dev-role': 'guest',
      'x-dev-staff-id': '00000000-0000-0000-0000-000000000000'
    },
    body: JSON.stringify({
      items: [{ product_id: product.id, quantity: 1 }],
      payment_method: 'card',
      channel: 'in_store',
      fulfilment_type: 'immediate',
      guest_name: 'Test Guest'
    })
  });
  
  const text = await res.text();
  console.log('Shop order result:', res.status, text);
}
testShop();
