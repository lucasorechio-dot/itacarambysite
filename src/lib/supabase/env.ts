export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** O banco só é usado quando as variáveis estão configuradas. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
