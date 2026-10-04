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

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800', // Tennis balls
  'https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?auto=format&fit=crop&q=80&w=800', // Tennis racket
  'https://images.unsplash.com/photo-1540324155970-1c8bf9260170?auto=format&fit=crop&q=80&w=800', // Sports bag
  'https://images.unsplash.com/photo-1610912264906-c6c70dc0ad53?auto=format&fit=crop&q=80&w=800', // Sports shoes
  'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&q=80&w=800', // Tennis apparel
  'https://images.unsplash.com/photo-1601646291632-4d2be7dd96d7?auto=format&fit=crop&q=80&w=800', // Cricket
  'https://images.unsplash.com/photo-1613685044678-0a9eaefa0eef?auto=format&fit=crop&q=80&w=800', // Badminton
];

async function run() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, name');
  
  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} products. Updating images...`);
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // Assign a pseudo-random image from the list based on the name length or index
    const imageIndex = (product.name.length + i) % DEFAULT_IMAGES.length;
    const imageUrl = DEFAULT_IMAGES[imageIndex];
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Error updating product ${product.id}:`, updateError);
    } else {
      console.log(`Updated product: ${product.name}`);
    }
  }
  
  console.log('Done mapping images to all products!');
}

run();
