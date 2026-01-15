import { useState } from 'react'
import { useRouter } from 'next/router'
import { addClip, uploadVideo } from '@/services/supabase'
import BottomNav from '@/components/BottomNav'

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
        const { data: { user } } = await supabase.auth.getUser()
        const mediaUrl = await uploadVideo(media)
        await addClip(author, content, mediaUrl, user?.id)
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
    <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black text-white flex flex-col overflow-hidden">
      {/* Premium Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl flex-shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors active:scale-95"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Back</span>
        </button>
        <h1 className="text-white text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Create Post</h1>
        <button
          type="submit"
          form="upload-form"
          disabled={!canPost || loading}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Posting</span>
            </div>
          ) : 'Post'}
        </button>
      </div>

      {/* Content */}
      <form id="upload-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-hide pb-16">
        <div className="p-4 space-y-4">
          
          {/* Media Preview */}
          {preview && (
            <div className="relative aspect-[9/16] max-h-[45vh] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl border border-white/10">
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
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-black/90 active:scale-90 transition-all shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
                className="flex items-center justify-center aspect-[9/16] max-h-[45vh] rounded-xl border-2 border-dashed border-purple-500/30 cursor-pointer hover:border-purple-500/50 transition-all bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm group active:scale-[0.98]"
              >
                <div className="text-center px-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-white text-base font-bold mb-1">Upload Content</p>
                  <p className="text-purple-300 text-xs font-medium">Video or Photo</p>
                  <p className="text-gray-500 text-[10px] mt-1">Tap to browse</p>
                </div>
              </label>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-white text-xs font-bold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Caption
            </label>
            <div className="relative">
              <textarea
                placeholder="What's happening? Add #hashtags..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-xl text-white placeholder-gray-500 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 resize-none text-sm leading-relaxed"
                disabled={loading}
                rows={4}
                maxLength={2200}
                required
              />
              <div className="absolute bottom-2 right-2 text-gray-500 text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                {content.length}/2200
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-white text-xs font-bold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Username
            </label>
            <div className="flex items-center bg-black/40 backdrop-blur-xl rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 border border-white/10">
              <span className="text-purple-400 text-sm font-bold mr-1.5">@</span>
              <input
                type="text"
                placeholder="your_username"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-medium"
                disabled={loading}
                maxLength={30}
                required
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-3 border border-purple-500/20">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-white text-[10px] font-bold mb-1">Tips for better reach:</p>
                <ul className="text-gray-400 text-[10px] space-y-0.5">
                  <li>• Use trending hashtags</li>
                  <li>• Keep videos under 60s</li>
                  <li>• Add engaging captions</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </form>

      <BottomNav />
    </div>
  )
}