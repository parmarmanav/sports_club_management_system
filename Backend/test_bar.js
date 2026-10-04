import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testBar() {
  const { data: menuItems } = await supabase.from('bar_menu_items').select('*').limit(1);
  if (!menuItems || menuItems.length === 0) return console.log('No menu items found');
  
  // 1. Open Tab
  const openRes = await fetch('https://sportsclubmanagementsystem-production.up.railway.app/api/v1/bar/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-dev-role': 'guest', 'x-dev-staff-id': '00000000-0000-0000-0000-000000000000' },
    body: JSON.stringify({ table_id: '36f1092e-6e64-48b5-b22f-6ab5b9a898d9' })
  });
  const openText = await openRes.text();
  console.log('Open tab:', openRes.status, openText);
  if (openRes.status !== 201) return;
  
  const orderId = JSON.parse(openText).data.order_id;
  
  // 2. Add Item
  const addRes = await fetch(`https://sportsclubmanagementsystem-production.up.railway.app/api/v1/bar/orders/${orderId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-dev-role': 'guest', 'x-dev-staff-id': '00000000-0000-0000-0000-000000000000' },
    body: JSON.stringify({ menu_item_id: menuItems[0].id, quantity: 1 })
  });
  const addText = await addRes.text();
  console.log('Add item:', addRes.status, addText);
  
  // 3. Close Tab
  const closeRes = await fetch(`https://sportsclubmanagementsystem-production.up.railway.app/api/v1/bar/orders/${orderId}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-dev-role': 'guest', 'x-dev-staff-id': '00000000-0000-0000-0000-000000000000' },
    body: JSON.stringify({ payment_method: 'card' })
  });
  const closeText = await closeRes.text();
  console.log('Close tab:', closeRes.status, closeText);
}
testBar();
