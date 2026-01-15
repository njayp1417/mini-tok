import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).userHasInteracted = false
    }
  }, [])

  return <Component {...pageProps} />
}