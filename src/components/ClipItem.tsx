import { useState, useEffect, useRef } from 'react'
import { likeClip, Clip } from '@/services/supabase'

interface ClipItemProps {
  clip: Clip
}

export default function ClipItem({ clip }: ClipItemProps) {
  const [likes, setLikes] = useState(clip.likes)
  const [liked, setLiked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
        setPlaying(false)
      } else {
        videoRef.current.play()
        setPlaying(true)
      }
    }
  }

  const handleLike = async () => {
    if (liked) return
    
    const newLikes = likes + 1
    setLikes(newLikes)
    setLiked(true)
    
    try {
      await likeClip(clip.id, likes)
    } catch (error) {
      console.error('Error liking clip:', error)
      setLikes(likes)
      setLiked(false)
    }
  }

  const handleDownload = async () => {
    if (clip.video_url) {
      try {
        const response = await fetch(clip.video_url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `minitok-${clip.id}.mp4`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Download failed:', error)
      }
    }
  }

  useEffect(() => {
    if (clip.video_url && videoRef.current) {
      const video = videoRef.current
      video.play().catch(() => {})
      setPlaying(true)
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {})
              setPlaying(true)
            } else {
              video.pause()
              setPlaying(false)
            }
          })
        },
        { threshold: 0.5 }
      )

      observer.observe(video)
      return () => observer.disconnect()
    }
  }, [clip.video_url])

  return (
    <div className="h-screen w-full snap-start bg-black relative overflow-hidden">
      {clip.video_url ? (
        <>
          <video
            ref={videoRef}
            src={clip.video_url}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
            onClick={handleVideoClick}
          />
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white ml-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <p className="text-white text-4xl font-black text-center max-w-2xl leading-tight tracking-tight drop-shadow-2xl">
            {clip.content}
          </p>
        </div>
      )}
      
      {/* Premium Multi-Layer Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
      
      {/* Ultra Premium Left Side - User Info & Caption */}
      <div className="absolute bottom-20 left-5 right-24 z-50">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-4">
          {/* Premium Avatar with Multiple Effects */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-0.5 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-inner">
                {clip.author.charAt(0).toUpperCase()}
              </div>
            </div>
            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 opacity-30 animate-ping" />
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 blur-md opacity-40" />
          </div>
          
          {/* Username with Premium Styling */}
          <div className="flex flex-col">
            <span className="text-white font-black text-lg tracking-tight drop-shadow-2xl">
              @{clip.author}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500" />
              <span className="text-white/80 text-xs font-semibold tracking-wide">CREATOR</span>
            </div>
          </div>
          
          {/* Follow Button */}
          <button className="ml-auto px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border border-white/20">
            Follow
          </button>
        </div>
        
        {/* Premium Caption */}
        {clip.content && (
          <div className="space-y-2">
            <p className="text-white text-base font-semibold leading-relaxed drop-shadow-2xl tracking-wide">
              {clip.content}
            </p>
            {/* Trending Hashtags */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-blue-400 text-sm font-bold">#trending</span>
              <span className="text-pink-400 text-sm font-bold">#viral</span>
              <span className="text-purple-400 text-sm font-bold">#minitok</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Ultra Premium Right Side - Action Buttons */}
      <div className="absolute bottom-20 right-4 z-50 flex flex-col gap-6">
        {/* Mute/Unmute Button */}
        {clip.video_url && (
          <button 
            onClick={() => setMuted(!muted)}
            className="group flex flex-col items-center gap-2 active:scale-90 transition-all duration-200"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-black/40 transition-all duration-200">
              {muted ? (
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            </div>
          </button>
        )}
        
        {/* Premium Like Button */}
        <button 
          onClick={handleLike}
          className="group flex flex-col items-center gap-2 active:scale-90 transition-all duration-200"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-black/40 transition-all duration-200">
            <svg className={`w-8 h-8 transition-all duration-200 ${liked ? 'text-red-500 scale-110' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={liked ? 0 : 2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            {liked && <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-pulse" />}
          </div>
          <span className="text-white text-sm font-black drop-shadow-lg tracking-wide">{likes.toLocaleString()}</span>
        </button>
        
        {/* Premium Share Button */}
        <button className="group flex flex-col items-center gap-2 active:scale-90 transition-all duration-200">
          <div className="relative w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-black/40 transition-all duration-200">
            <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          </div>
        </button>
        
        {/* Premium Download Button */}
        {clip.video_url && (
          <button 
            onClick={handleDownload}
            className="group flex flex-col items-center gap-2 active:scale-90 transition-all duration-200"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-black/40 transition-all duration-200">
              <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            </div>
          </button>
        )}
        
        {/* Premium Profile Music Button */}
        <button className="group flex flex-col items-center gap-2 active:scale-90 transition-all duration-200">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-0.5 shadow-2xl animate-spin-slow">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}