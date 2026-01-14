interface SplashScreenProps {
  isVisible: boolean
}

export default function SplashScreen({ isVisible }: SplashScreenProps) {
  if (!isVisible) return null

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black via-purple-950 to-black z-[100] flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <h1 className="text-white text-8xl font-black tracking-tighter animate-pulse bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
            MiniTok
          </h1>
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-30 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
