import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Log the URL being used (without the key for security)
console.log('Supabase URL being used:', supabaseUrl);

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
); 