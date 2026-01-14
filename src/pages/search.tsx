import { useRouter } from 'next/router'
import BottomNav from '@/components/BottomNav'

export default function Search() {
  const router = useRouter()

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-white text-3xl font-bold mb-6">Search</h1>
          
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search clips..."
              className="w-full p-4 pl-12 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-20 h-20 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-white/40 text-lg">Search coming soon...</p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
