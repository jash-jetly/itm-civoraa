import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Calendar, User, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { newsService } from '../services/newsService'
import { NewsArticle } from '../supabase'

interface NewsPageProps {
  onNavigate: (page: 'home' | 'news-submit') => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const articles = await newsService.getAllNews()
      setNewsArticles(articles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news articles')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (articleId: string) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId)
    } else {
      newExpanded.add(articleId)
    }
    setExpandedArticles(newExpanded)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="px-4 pt-5 pb-4 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">News</h1>
            <button
              onClick={() => onNavigate('news-submit')}
              className="p-2 hover:bg-[#F97171]/10 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6 text-[#F97171]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#F97171] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#9DA3AF] text-sm">Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">News</h1>
          <button
            onClick={() => onNavigate('news-submit')}
            className="p-2 hover:bg-[#F97171]/10 rounded-lg transition-colors"
            title="Submit News"
          >
            <Plus className="w-6 h-6 text-[#F97171]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {error && (
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={loadNews}
              className="mt-2 text-red-400 underline text-sm hover:text-red-300 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {newsArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-[#F97171]" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No news articles yet</h3>
            <p className="text-[#9DA3AF] text-sm mb-4 max-w-sm text-center">Be the first to share some news!</p>
            <button
              onClick={() => onNavigate('news-submit')}
              className="px-6 py-2 bg-[#F97171] text-black rounded-lg font-medium hover:bg-[#FF6B6B] transition-colors"
            >
              Submit News
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {newsArticles.map((article) => {
              const isExpanded = expandedArticles.has(article.id!)
              const shouldShowReadMore = article.body.length > 300

              return (
                <article
                  key={article.id}
                  className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl overflow-hidden transition-all"
                >
                  {/* Featured Image */}
                  {article.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Headline */}
                    <h2 className="text-xl font-bold text-white mb-3">
                      {article.headline}
                    </h2>

                    {/* Author and Date */}
                    <div className="flex items-center gap-4 text-sm text-[#9DA3AF] mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="text-[#F97171] font-medium">{article.author_name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.created_at!)}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="prose prose-sm max-w-none text-[#9DA3AF] prose-headings:text-white prose-strong:text-white prose-a:text-[#F97171]">
                      <ReactMarkdown>
                        {isExpanded || !shouldShowReadMore
                          ? article.body
                          : truncateText(article.body, 300)
                        }
                      </ReactMarkdown>
                    </div>

                    {/* Read More/Less Button */}
                    {shouldShowReadMore && (
                      <button
                        onClick={() => toggleExpanded(article.id!)}
                        className="mt-3 text-[#F97171] hover:text-[#FF6B6B] text-sm font-medium transition-colors"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsPage