import { supabase, NewsArticle } from '../supabase'

export const newsService = {
  // Upload image to Supabase storage
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `news-images/${fileName}`

    const { data, error } = await supabase.storage
      .from('news')
      .upload(filePath, file)

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('news')
      .getPublicUrl(filePath)

    return publicUrl
  },

  // Create a new news article
  async createNews(newsData: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticle> {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([{
        ...newsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create news article: ${error.message}`)
    }

    return data
  },

  // Get all news articles
  async getAllNews(): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch news articles: ${error.message}`)
    }

    return data || []
  },

  // Get a single news article by ID
  async getNewsById(id: string): Promise<NewsArticle | null> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No rows found
      }
      throw new Error(`Failed to fetch news article: ${error.message}`)
    }

    return data
  },

  // Update a news article
  async updateNews(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    const { data, error } = await supabase
      .from('news_articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update news article: ${error.message}`)
    }

    return data
  },

  // Delete a news article
  async deleteNews(id: string): Promise<void> {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete news article: ${error.message}`)
    }
  }
}