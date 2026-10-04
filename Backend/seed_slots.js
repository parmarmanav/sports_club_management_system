import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedSlots() {
  console.log('Fetching courts...');
  const { data: courts, error: courtsErr } = await supabase.from('courts').select('*');
  if (courtsErr) return console.error('Courts err:', courtsErr);
  
  if (!courts || courts.length === 0) return console.log('No courts found!');

  const slotsToInsert = [];
  
  for (let d = 0; d < 14; d++) {
    const date = new Date('2026-10-04T00:00:00Z');
    date.setUTCDate(date.getUTCDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const court of courts) {
      // 1-hour slots
      for (let hour = 8; hour <= 21; hour++) {
        const startTimeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00+05:30`;
        const startTime = new Date(startTimeStr);
        const endTime = new Date(startTime.getTime() + 60 * 60000); // 60 mins
        
        slotsToInsert.push({
          court_id: court.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          is_social: Math.random() > 0.8
        });
      }
    }
  }

  console.log(`Ready to insert ${slotsToInsert.length} slots...`);
  
  const batchSize = 100;
  for (let i = 0; i < slotsToInsert.length; i += batchSize) {
    const batch = slotsToInsert.slice(i, i + batchSize);
    const { error } = await supabase.from('court_slots').insert(batch);
    if (error) {
      console.error('Insert error:', error);
    }
  }
  console.log('Seeding complete!');
}

seedSlots();
