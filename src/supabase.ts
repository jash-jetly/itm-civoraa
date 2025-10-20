import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// News article interface
export interface NewsArticle {
  id?: string
  headline: string
  body: string
  author_name: string
  author_email: string
  image_url?: string
  created_at?: string
  updated_at?: string
}