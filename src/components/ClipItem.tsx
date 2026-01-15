import { useState, useEffect, useRef } from 'react'
import { likeClip, unlikeClip, hasUserLiked, followUser, unfollowUser, isFollowing, supabase, Clip } from '@/services/supabase'

interface ClipItemProps {
  clip: Clip
}

export default function ClipItem({ clip }: ClipItemProps) {
  const [likes, setLikes] = useState(clip.likes)
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const [isLiked, isFollowingUser] = await Promise.all([
          hasUserLiked(clip.id, user.id),
          clip.user_id ? isFollowing(user.id, clip.user_id) : Promise.resolve(false)
        ])
        setLiked(isLiked)
        setFollowing(isFollowingUser)
      }
    }
    checkAuth()
  }, [clip.id, clip.user_id])

  const handleLike = async () => {
    if (!userId) {
      alert('Please sign in to like videos')
      return
    }

    if (liked) return
    
    const newLikes = likes + 1
    setLikes(newLikes)
    setLiked(true)
    
    try {
      await likeClip(clip.id, userId)
    } catch (error) {
      console.error('Error liking clip:', error)
      setLikes(likes)
      setLiked(false)
    }
  }

  const handleFollow = async () => {
    if (!userId) {
      alert('Please sign in to follow users')
      return
    }

    if (!clip.user_id) return

    setFollowing(!following)

    try {
      if (following) {
        await unfollowUser(userId, clip.user_id)
      } else {
        await followUser(userId, clip.user_id)
      }
    } catch (error) {
      console.error('Error following user:', error)
      setFollowing(following)
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
    if (!clip.video_url || !videoRef.current) return

    const video = videoRef.current
    video.playsInline = true

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          try {
            // 🔑 Check interaction flag RIGHT BEFORE playing
            const hasInteracted = (window as any).userHasInteracted
            video.muted = !hasInteracted
            await video.play()
            setPlaying(true)
          } catch (err) {
            console.log('Play failed:', err)
          }
        } else {
          video.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.6 }
    )

    const timeout = setTimeout(() => {
      observer.observe(video)
    }, 300)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [clip.video_url])

  const handleTogglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      await video.play()
      video.muted = false
      ;(window as any).userHasInteracted = true
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="h-[100dvh] w-full snap-start bg-black relative overflow-hidden flex items-center justify-center">
      {clip.video_url ? (
        <>
          <video
            ref={videoRef}
            src={clip.video_url}
            loop
            playsInline
            className="w-full h-full object-cover absolute inset-0"
            onClick={handleTogglePlay}
          />
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-white ml-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 absolute inset-0">
          <p className="text-white text-3xl font-black text-center max-w-xl leading-tight tracking-tight drop-shadow-2xl">
            {clip.content}
          </p>
        </div>
      )}
      
      {/* Premium Multi-Layer Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Ultra Premium Left Side - User Info & Caption */}
      <div className="absolute bottom-20 left-3 right-16 z-50 max-h-[30vh] overflow-hidden">
        {/* User Profile Section */}
        <div className="flex items-start gap-2 mb-2">
          {/* Premium Avatar with Plus Button */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-sm shadow-inner">
                {clip.author.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 opacity-30 animate-ping" />
            {/* Plus Button */}
            <button 
              onClick={handleFollow}
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${following ? 'bg-gray-600' : 'bg-gradient-to-r from-pink-500 to-red-500'} border-2 border-black flex items-center justify-center shadow-lg active:scale-90 transition-all`}
            >
              {following ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Username */}
          <span className="text-white font-bold text-sm tracking-tight drop-shadow-2xl flex-shrink-0 mt-0.5">
            @{clip.author}
          </span>
        </div>
        
        {/* Caption */}
        {clip.content && (
          <div className="space-y-1">
            <p className="text-white text-xs font-medium leading-snug drop-shadow-2xl line-clamp-3">
              {clip.content}
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="text-blue-400 text-[10px] font-bold">#trending</span>
              <span className="text-pink-400 text-[10px] font-bold">#viral</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Ultra Premium Right Side - Action Buttons */}
      <div className="absolute bottom-20 right-2 z-50 flex flex-col gap-3 max-h-[50vh] justify-end">
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className="group flex flex-col items-center gap-0.5 active:scale-90 transition-all duration-200"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-xl">
            <svg className={`w-6 h-6 transition-all duration-200 ${liked ? 'text-red-500 scale-110' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={liked ? 0 : 2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {liked && <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-pulse" />}
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-lg">{likes > 999 ? `${(likes/1000).toFixed(1)}K` : likes}</span>
        </button>
        
        {/* Share Button */}
        <button className="group flex flex-col items-center gap-0.5 active:scale-90 transition-all duration-200">
          <div className="relative w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-xl">
            <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
        </button>
        
        {/* Download Button */}
        {clip.video_url && (
          <button 
            onClick={handleDownload}
            className="group flex flex-col items-center gap-0.5 active:scale-90 transition-all duration-200"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-xl">
              <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </button>
        )}
        
        {/* Music Button */}
        <button className="group flex flex-col items-center gap-0.5 active:scale-90 transition-all duration-200">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-0.5 shadow-xl animate-spin-slow">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}