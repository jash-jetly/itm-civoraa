import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihmlopfgrvfvltqvxexh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobWxvcGZncnZmdmx0cXZ4ZXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjU3MjcsImV4cCI6MjA3NTgwMTcyN30.-Mt_v2r3AccEQhqGs5Sc_JsoxxeJumXqIP7sq0WRxno'

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