import { useRouter } from 'next/router'

export default function BottomNav() {
  const router = useRouter()
  const currentPath = router.pathname

  return (
    <div className="h-12 bg-black flex items-center justify-around px-2">
      <button
        onClick={() => {
          if (currentPath === '/') {
            window.location.reload()
          } else {
            router.push('/')
          }
        }}
        className="flex flex-col items-center transition-all duration-200 active:scale-90 py-1"
      >
        <svg
          className={`w-[26px] h-[26px] ${currentPath === '/' ? 'text-white' : 'text-white/50'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </button>

      <button
        onClick={() => router.push('/upload')}
        className="transition-all duration-200 active:scale-90 -mt-1"
      >
        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      <button
        onClick={() => router.push('/search')}
        className="flex flex-col items-center transition-all duration-200 active:scale-90 py-1"
      >
        <svg
          className={`w-[26px] h-[26px] ${currentPath === '/search' ? 'text-white' : 'text-white/50'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}
