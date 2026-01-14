import { useState } from 'react'
import { useRouter } from 'next/router'
import { addClip, uploadVideo } from '@/services/supabase'

export default function Upload() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null)

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMedia(file)
      const url = URL.createObjectURL(file)
      setPreview(url)
      setMediaType(file.type.startsWith('video') ? 'video' : 'image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (author.trim() && content.trim() && media) {
      setLoading(true)
      try {
        const mediaUrl = await uploadVideo(media)
        await addClip(author, content, mediaUrl)
        if (preview) URL.revokeObjectURL(preview)
        router.push('/')
      } catch (error) {
        console.error('Error uploading:', error)
        alert('Upload failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const canPost = author.trim() && content.trim() && media

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={() => router.push('/')}
          className="text-white text-base font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <h1 className="text-white text-base font-semibold">New post</h1>
        <button
          type="submit"
          form="upload-form"
          disabled={!canPost || loading}
          className="text-pink-500 text-base font-semibold disabled:opacity-40"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Content */}
      <form id="upload-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          
          {/* Media Preview */}
          {preview && (
            <div className="relative aspect-[9/16] max-h-[60vh] rounded-xl overflow-hidden bg-gray-900">
              {mediaType === 'video' ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setMedia(null)
                  setPreview(null)
                  setMediaType(null)
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload Button */}
          {!preview && (
            <div>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/jpg"
                onChange={handleMediaChange}
                className="hidden"
                id="media-input"
                disabled={loading}
              />
              <label
                htmlFor="media-input"
                className="flex items-center justify-center aspect-[9/16] max-h-[60vh] rounded-xl border-2 border-dashed border-gray-700 cursor-pointer hover:border-gray-600 transition-colors"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-white text-base font-medium mb-1">Select photo or video</p>
                  <p className="text-gray-500 text-sm">Or drag and drop</p>
                </div>
              </label>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium block">Caption</label>
            <textarea
              placeholder="Describe your photo or video..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-base"
              disabled={loading}
              rows={4}
              required
            />
            <div className="text-right text-gray-500 text-xs">
              {content.length}/2200
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium block">Username</label>
            <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-pink-500">
              <span className="text-gray-400 text-base mr-2">@</span>
              <input
                type="text"
                placeholder="username"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                disabled={loading}
                required
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}