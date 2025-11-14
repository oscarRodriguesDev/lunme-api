import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables not set");
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};
