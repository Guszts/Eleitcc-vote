import { createClient } from '@supabase/supabase-js';

// Suporta tanto VITE_ quanto NEXT_PUBLIC_ variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                    import.meta.env.SUPABASE_ANON_KEY ||
                    '';

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Supabase URL ou Key não configurados. Verifique as variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
