import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Paste {
  id: string;
  slug: string;
  title: string | null;
  content: string;
  language: string | null;
  privacy: 'public' | 'unlisted' | 'private';
  secret_token: string;
  created_at: string;
  expires_at: string | null;
  views: number;
}
