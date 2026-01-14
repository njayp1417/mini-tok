import { useRouter } from 'next/router'

export default function UploadButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/upload')}
      className="bg-white text-black w-14 h-14 rounded-full shadow-lg text-2xl font-bold hover:scale-110 active:scale-95 transition-all duration-200"
    >
      +
    </button>
  )
}