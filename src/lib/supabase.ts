import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Environment variables
// Set these in a .env file at project root:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
// ---------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. ' +
      'Create a .env file in the project root with both values.',
  );
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
