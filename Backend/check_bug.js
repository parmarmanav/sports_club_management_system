import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkBug() {
  const { data: bookings } = await supabase.from('bookings').select('*').limit(1);
  if (!bookings || bookings.length === 0) return console.log('No bookings');
  const b = bookings[0];
  console.log('Found booking:', b);
  
  const { data: slot } = await supabase.from('court_slots').select('*').eq('id', b.slot_id).single();
  console.log('Slot date/time:', slot.start_time);
  
  // Extract date
  const date = slot.start_time.split('T')[0];
  const res = await fetch(`https://sportsclubmanagementsystem-production.up.railway.app/api/v1/slots?date=${date}`);
  const data = await res.json();
  
  let foundSlot = null;
  data.data.courts.forEach(c => {
    c.slots.forEach(s => {
      if (s.slot_id === slot.id) foundSlot = s;
    });
  });
  console.log('API returned slot availability:', foundSlot.available || foundSlot.is_available);
}
checkBug();
