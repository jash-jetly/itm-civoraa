import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, ThumbsUp, Send, BarChart3, FileText, User } from 'lucide-react';
import { Poll, Comment, getPostComments, addComment, upvoteComment } from '../services/pollService';
import { getUserData } from '../services/authService';

interface PostDetailPageProps {
  post: Poll;
  onBack: () => void;
  onNavigateToUserProfile: (userEmail: string) => void;
}

export default function PostDetailPage({ post, onBack, onNavigateToUserProfile }: PostDetailPageProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get current user email from auth context or localStorage
        const currentUserEmail = localStorage.getItem('userEmail') || '';
        if (currentUserEmail) {
          setUserEmail(currentUserEmail);
        }
        
        if (post.id) {
          const commentsResult = await getPostComments(post.id);
          if (commentsResult.success && commentsResult.comments) {
            setComments(commentsResult.comments);
          }
        }
      } catch (error) {
        console.error('Error initializing post detail:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post.id || !userEmail) return;

    setSubmitting(true);
    try {
      const result = await addComment({
        postId: post.id,
        postType: post.type,
        content: newComment,
        authorEmail: userEmail,
        isAnonymous: post.isAnonymous
      });

      if (result.success) {
        setNewComment('');
        // Refresh comments
        const commentsResult = await getPostComments(post.id);
        if (commentsResult.success && commentsResult.comments) {
          setComments(commentsResult.comments);
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteComment = async (commentId: string) => {
    if (!commentId || !userEmail) return;

    try {
      const result = await upvoteComment(commentId, userEmail);
      if (result.success && post.id) {
        // Refresh comments to show updated upvote count
        const commentsResult = await getPostComments(post.id);
        if (commentsResult.success && commentsResult.comments) {
          setComments(commentsResult.comments);
        }
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const postTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const parseUsername = (email: string): string => {
    return email.split('@')[0];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Post</h1>
        <div className="w-10"></div>
      </div>

      {/* Post Content */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F97171] to-[#FF6B6B] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {post.isAnonymous ? post.authorTag : parseUsername(post.authorEmail).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => !post.isAnonymous && onNavigateToUserProfile(post.authorEmail)}
                className={`font-medium ${!post.isAnonymous ? 'text-[#F97171] hover:underline' : 'text-white'}`}
              >
                {post.isAnonymous ? post.authorTag : parseUsername(post.authorEmail)}
              </button>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {post.type === 'poll' && <BarChart3 className="w-4 h-4 text-[#F97171]" />}
                {post.type === 'discussion' && <MessageCircle className="w-4 h-4 text-[#F97171]" />}
                {post.type === 'news' && <FileText className="w-4 h-4 text-[#F97171]" />}
                <span className="text-[#F97171] text-sm font-medium capitalize">{post.type}</span>
              </div>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">{post.visibility}</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-3">{post.title}</h2>
        {post.description && (
          <p className="text-gray-300 mb-4">{post.description}</p>
        )}

        {/* Discussion Images */}
        {post.type === 'discussion' && post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              {post.imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Discussion image ${index + 1}`}
                    className="w-full max-h-96 object-cover rounded-lg border border-gray-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Poll Options */}
        {post.type === 'poll' && post.options && (
          <div className="space-y-3 mb-4">
            {post.options.map((option) => (
              <div key={option.id} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">{option.text}</span>
                  <span className="text-[#F97171] font-medium">{option.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} comments</span>
          </div>
          {post.type === 'poll' && (
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{post.totalVotes} votes</span>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 pb-20">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          
          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F97171] to-[#FF6B6B] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#F97171]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-[#F97171] text-white rounded-lg hover:bg-[#FF6B6B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97171] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No comments yet</p>
              <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#F97171] to-[#FF6B6B] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {comment.isAnonymous ? comment.authorTag : (comment.authorName || parseUsername(comment.authorEmail)).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => !comment.isAnonymous && onNavigateToUserProfile(comment.authorEmail)}
                          className={`font-medium text-sm ${!comment.isAnonymous ? 'text-[#F97171] hover:underline' : 'text-white'}`}
                        >
                          {comment.isAnonymous ? comment.authorTag : (comment.authorName || parseUsername(comment.authorEmail))}
                        </button>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => comment.id && handleUpvoteComment(comment.id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            comment.upvotedUsers?.includes(userEmail)
                              ? 'text-[#F97171]'
                              : 'text-gray-400 hover:text-[#F97171]'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.upvotes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}