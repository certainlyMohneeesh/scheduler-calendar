'use client'
import { useEffect } from 'react'

export default function ErrorBoundary({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      console.log('Client Error:', { message, source, lineno, colno, error })
    }
  }, [])

  return <>{children}</>
}
