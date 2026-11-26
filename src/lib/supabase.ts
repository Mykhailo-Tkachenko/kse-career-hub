import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Задайте VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY у файлі .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
