import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase, Clip } from '@/services/supabase'
import ClipItem from '@/components/ClipItem'
import BottomNav from '@/components/BottomNav'

export default function LikedVideos() {
  const router = useRouter()
  const [clips, setClips] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLikedVideos()
  }, [])

  const loadLikedVideos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/profile')
      return
    }

    const { data: likes, error } = await supabase
      .from('user_likes')
      .select('clip_id')
      .eq('user_id', user.id)

    if (!error && likes && likes.length > 0) {
      const clipIds = likes.map(like => like.clip_id)
      
      const { data: clipsData } = await supabase
        .from('clips')
        .select('*')
        .in('id', clipIds)
        .order('created_at', { ascending: false })

      if (clipsData) {
        setClips(clipsData)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (clips.length === 0) {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black text-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl flex-shrink-0">
          <button onClick={() => router.back()} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Liked Videos</h1>
          <div className="w-6" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-black mb-2">No liked videos yet</h2>
          <p className="text-gray-400 text-sm text-center mb-8 max-w-xs">
            Videos you like will appear here
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg active:scale-95 transition-all"
          >
            Explore Videos
          </button>
        </div>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-black flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl flex-shrink-0 absolute top-0 left-0 right-0 z-50">
        <button onClick={() => router.back()} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Liked Videos</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide pt-14 pb-14">
        {clips.map((clip) => (
          <ClipItem key={clip.id} clip={clip} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
