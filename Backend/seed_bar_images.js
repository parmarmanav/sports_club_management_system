import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getDynamicImageUrl(name) {
  const query = encodeURIComponent(name + ' food drink delicious');
  return `https://tse1.mm.bing.net/th?q=${query}&w=800&h=800&c=7&rs=1`;
}

async function run() {
  console.log('Altering bar_menu_items table to add image_url if not exists...');
  const { error: alterError } = await supabase.rpc('execute_sql', { 
    sql_query: "ALTER TABLE bar_menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;" 
  });
  
  if (alterError) {
    console.error('Warning: could not alter table via RPC (execute_sql might not exist).', alterError.message);
    console.log('Will attempt to use postgrest direct query if possible, or assume column exists.');
  }

  console.log('Fetching bar_menu_items...');
  const { data: items, error } = await supabase.from('bar_menu_items').select('id, name');
  
  if (error) {
    console.error('Error fetching items:', error);
    process.exit(1);
  }
  
  console.log(`Found ${items.length} bar items. Updating with dynamic Bing images...`);
  
  for (const item of items) {
    const imageUrl = getDynamicImageUrl(item.name);
    
    const { error: updateError } = await supabase
      .from('bar_menu_items')
      .update({ image_url: imageUrl })
      .eq('id', item.id);
      
    if (updateError) {
      console.error(`Error updating item ${item.name}:`, updateError);
    } else {
      console.log(`Updated ${item.name} -> ${imageUrl}`);
    }
  }
  
  console.log('Done mapping unique images to bar menu items!');
}

run();
