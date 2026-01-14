import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ClipItem from './ClipItem'
import BottomNav from './BottomNav'
import SplashScreen from './SplashScreen'
import { fetchClips, Clip } from '@/services/supabase'

export default function Feed() {
  const router = useRouter()
  const [clips, setClips] = useState<Clip[]>([])
  const [showSplash, setShowSplash] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [firstVideoReady, setFirstVideoReady] = useState(false)

  const shuffleArray = (array: Clip[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const loadClips = async (shuffle = false) => {
    try {
      const data = await fetchClips()
      console.log('Loaded clips from Supabase:', data)
      const finalClips = shuffle ? shuffleArray(data) : data
      setClips(finalClips)
      setContentReady(true)
    } catch (error) {
      console.error('Error loading clips:', error)
      setClips([])
      setContentReady(true)
    }
  }

  useEffect(() => {
    loadClips(true)
  }, [])

  useEffect(() => {
    if (contentReady && (firstVideoReady || clips.length === 0)) {
      const timer = setTimeout(() => setShowSplash(false), 500)
      return () => clearTimeout(timer)
    }
  }, [contentReady, firstVideoReady, clips.length])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/') {
        loadClips(true)
      } else {
        loadClips()
      }
    }
    router.events?.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      <SplashScreen isVisible={showSplash} />
      
      <div 
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide transition-opacity duration-1000"
        style={{ opacity: showSplash ? 0 : 1 }}
      >
        {clips.map((clip, index) => (
          <ClipItem 
            key={clip.id} 
            clip={clip}
            onVideoReady={index === 0 ? () => setFirstVideoReady(true) : undefined}
          />
        ))}
      </div>
      
      <BottomNav />
    </div>
  )
}