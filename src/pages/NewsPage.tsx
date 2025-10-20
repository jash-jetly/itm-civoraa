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
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">News</h1>
          <button
            onClick={() => onNavigate('news-submit')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-600" />
          </button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">News</h1>
            <button
              onClick={() => onNavigate('news-submit')}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              title="Submit News"
            >
              <Plus className="w-6 h-6 text-blue-600" />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadNews}
              className="mt-2 text-red-600 underline text-sm hover:text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {newsArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share some news!</p>
            <button
              onClick={() => onNavigate('news-submit')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit News
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {newsArticles.map((article) => {
              const isExpanded = expandedArticles.has(article.id!)
              const shouldShowReadMore = article.body.length > 300

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {article.headline}
                    </h2>

                    {/* Author and Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.created_at!)}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="prose prose-sm max-w-none">
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
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
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