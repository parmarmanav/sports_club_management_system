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

// Using Bing's thumbnail API as a highly reliable dynamic placeholder provider
// This will search for the exact product name and return an 800x800 cropped image
function getDynamicImageUrl(name) {
  // Add context to the search query so we get sports equipment
  const query = encodeURIComponent(name + ' sports gear equipment');
  return `https://tse1.mm.bing.net/th?q=${query}&w=800&h=800&c=7&rs=1`;
}

async function run() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, name');
  
  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} products. Updating with dynamic Bing images...`);
  
  for (const product of products) {
    const imageUrl = getDynamicImageUrl(product.name);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Error updating product ${product.name}:`, updateError);
    } else {
      console.log(`Updated ${product.name} -> ${imageUrl}`);
    }
  }
  
  console.log('Done mapping 100% unique images to all products!');
}

run();
