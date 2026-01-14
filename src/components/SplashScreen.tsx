interface SplashScreenProps {
  isVisible: boolean
}

export default function SplashScreen({ isVisible }: SplashScreenProps) {
  if (!isVisible) return null

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black z-[100] flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-white text-7xl font-bold tracking-tight animate-pulse">MiniTok</h1>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
