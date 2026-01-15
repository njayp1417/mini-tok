import { useRouter } from 'next/router'

export default function BottomNav() {
  const router = useRouter()
  const currentPath = router.pathname

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-4 z-50 safe-area-inset-bottom">
      <button
        onClick={() => {
          if (currentPath === '/') {
            window.location.reload()
          } else {
            router.push('/')
          }
        }}
        className="flex flex-col items-center transition-all duration-200 active:scale-90 py-1.5"
      >
        <svg
          className={`w-6 h-6 ${currentPath === '/' ? 'text-white' : 'text-white/50'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className={`text-[10px] mt-0.5 font-semibold ${currentPath === '/' ? 'text-white' : 'text-white/50'}`}>Home</span>
      </button>

      <button
        onClick={() => router.push('/upload')}
        className="transition-all duration-200 active:scale-90 -mt-1"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      <button
        onClick={() => router.push('/profile')}
        className="flex flex-col items-center transition-all duration-200 active:scale-90 py-1.5"
      >
        <svg
          className={`w-6 h-6 ${currentPath === '/profile' ? 'text-white' : 'text-white/50'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span className={`text-[10px] mt-0.5 font-semibold ${currentPath === '/profile' ? 'text-white' : 'text-white/50'}`}>Profile</span>
      </button>
    </div>
  )
}
