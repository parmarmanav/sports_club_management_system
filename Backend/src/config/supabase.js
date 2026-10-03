import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️  Supabase environment variables are missing.');
}

// Use service role key to bypass RLS as requested in the schema
export const supabase = createClient(supabaseUrl || '', supabaseServiceRoleKey || '');
