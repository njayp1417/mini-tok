import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/services/supabase'
import BottomNav from '@/components/BottomNav'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl flex-shrink-0">
          <h1 className="text-white text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Profile</h1>
        </div>

        {/* Guest View */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-black mb-2">Welcome to MiniTok</h2>
          <p className="text-gray-400 text-sm text-center mb-8 max-w-xs">
            Sign in to personalize your experience, follow creators, and save your favorite content
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg active:scale-95 transition-all"
          >
            Sign In / Sign Up
          </button>
          <p className="text-gray-500 text-xs mt-6">Continue browsing as guest</p>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={checkUser} />
        )}

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-black via-purple-950/20 to-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl flex-shrink-0">
        <h1 className="text-white text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Profile</h1>
        <button
          onClick={handleSignOut}
          className="text-red-400 text-xs font-bold active:scale-95 transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-16">
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-1 shadow-2xl mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-3xl shadow-inner">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="text-white text-xl font-black mb-1">@{user.email?.split('@')[0]}</h2>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/10 text-center">
              <p className="text-white text-lg font-black">0</p>
              <p className="text-gray-400 text-xs">Following</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/10 text-center">
              <p className="text-white text-lg font-black">0</p>
              <p className="text-gray-400 text-xs">Followers</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/10 text-center">
              <p className="text-white text-lg font-black">0</p>
              <p className="text-gray-400 text-xs">Likes</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <button className="w-full bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-semibold">My Videos</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-semibold">Liked Videos</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-semibold">Settings</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onSuccess()
        onClose()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-black">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-white text-xs font-bold block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 backdrop-blur-xl text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 text-sm"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="text-white text-xs font-bold block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 backdrop-blur-xl text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 text-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-purple-400 text-xs font-semibold"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}
