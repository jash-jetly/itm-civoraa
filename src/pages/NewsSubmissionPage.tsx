import React, { useState } from 'react'
import { ArrowLeft, Camera, X, Send } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import { newsService } from '../services/newsService'
import { getUserData } from '../services/authService'

interface NewsSubmissionPageProps {
  onNavigate: (page: 'news') => void;
}

const NewsSubmissionPage: React.FC<NewsSubmissionPageProps> = ({ onNavigate }) => {
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!headline.trim()) {
      setError('Headline is required')
      return
    }
    
    if (!body.trim()) {
      setError('News body is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Get current user data
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) {
        throw new Error('User not authenticated')
      }

      const userData = await getUserData(userEmail)
      const authorName = userData?.name || userEmail.split('@')[0]

      // Upload image if selected
      let imageUrl = ''
      if (selectedImage) {
        imageUrl = await newsService.uploadImage(selectedImage)
      }

      // Create news article
      await newsService.createNews({
        headline: headline.trim(),
        body: body.trim(),
        author_name: authorName,
        author_email: userEmail,
        image_url: imageUrl || undefined
      })

      // Navigate to news page
      onNavigate('news')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit news article')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('news')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Submit News</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Featured Image (Optional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600">
                    Click to upload an image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Headline */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Headline *
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter news headline..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {headline.length}/200 characters
            </div>
          </div>

          {/* Body - Markdown Editor */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              News Body *
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={body}
                onChange={(val) => setBody(val || '')}
                preview="edit"
                height={300}
                visibleDragbar={false}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !headline.trim() || !body.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit News
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsSubmissionPage