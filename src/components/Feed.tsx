import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import ClipItem from './ClipItem'
import BottomNav from './BottomNav'
import SplashScreen from './SplashScreen'
import { fetchClips, Clip, supabase } from '@/services/supabase'

export default function Feed() {
  const router = useRouter()
  const [clips, setClips] = useState<Clip[]>([])
  const [showSplash, setShowSplash] = useState(true)
  const [supabaseReady, setSupabaseReady] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const shuffleArray = (array: Clip[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const loadClips = useCallback(async (shuffle = false) => {
    try {
      const data = await fetchClips()
      const finalClips = shuffle ? shuffleArray(data) : data
      setClips(finalClips)
    } catch (error) {
      console.error('Error loading clips:', error)
      setClips([])
    }
  }, [])

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { data, error } = await supabase.from('clips').select('count')
        if (!error) setSupabaseReady(true)
      } catch {
        setSupabaseReady(true)
      }
    }
    initSupabase()
  }, [])

  useEffect(() => {
    if (supabaseReady) {
      loadClips(true).then(() => {
        setTimeout(() => setShowSplash(false), 800)
      })
    }
  }, [supabaseReady, loadClips])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/') loadClips(true)
      else loadClips()
    }
    router.events?.on('routeChangeComplete', handleRouteChange)
    return () => router.events?.off('routeChangeComplete', handleRouteChange)
  }, [router, loadClips])

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current
      if (!container) return
      
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 100) {
        loadClips()
      }
    }

    const container = scrollRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [loadClips])

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      <SplashScreen isVisible={showSplash} />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide transition-opacity duration-1000 pb-16"
        style={{ opacity: showSplash ? 0 : 1 }}
      >
        {clips.map((clip) => (
          <ClipItem key={clip.id} clip={clip} />
        ))}
      </div>
      
      <BottomNav />
    </div>
  )
}