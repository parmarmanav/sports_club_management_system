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

// Curated list of verified working Unsplash URLs
const IMAGES = {
  racket: 'https://images.unsplash.com/photo-1617141636403-f511e2d5dc17?q=80&w=800',
  tennis_ball: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800',
  cricket_ball: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800',
  cricket_gear: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=800',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
  apparel_shirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
  cap: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800',
  shorts: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800',
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
  water_bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800',
  default: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800'
};

function getImageUrl(name) {
  const n = name.toLowerCase();
  if (n.includes('racket') || n.includes('pro staff') || n.includes('pure aero') || n.includes('clash') || n.includes('ezone') || n.includes('head speed') || n.includes('tf-x1')) {
    return IMAGES.racket;
  }
  if (n.includes('cricket ball')) return IMAGES.cricket_ball;
  if (n.includes('ball') || n.includes('hopper') || n.includes('penn') || n.includes('dunlop')) return IMAGES.tennis_ball;
  if (n.includes('cricket') || n.includes('pad') || n.includes('glove')) return IMAGES.cricket_gear;
  if (n.includes('shoe') || n.includes('zoom') || n.includes('resolution') || n.includes('barricade') || n.includes('rush pro') || n.includes('spike')) return IMAGES.shoes;
  if (n.includes('shirt') || n.includes('polo') || n.includes('hoodie')) return IMAGES.apparel_shirt;
  if (n.includes('cap') || n.includes('hat')) return IMAGES.cap;
  if (n.includes('short') || n.includes('skirt')) return IMAGES.shorts;
  if (n.includes('bag')) return IMAGES.bag;
  if (n.includes('bottle')) return IMAGES.water_bottle;
  
  return IMAGES.default;
}

async function run() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, name');
  
  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} products. Updating images smartly...`);
  
  for (const product of products) {
    const imageUrl = getImageUrl(product.name);
    
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
  
  console.log('Done mapping smart images to all products!');
}

run();
