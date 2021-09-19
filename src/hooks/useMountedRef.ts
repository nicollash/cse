import { useRef, useEffect } from 'react'

export const useMountedRef = () => {
  // State and setters for debounced value
  const isMountedRef = useRef(null)

  useEffect(() => {
    isMountedRef.current = true

    return () => (isMountedRef.current = false)
  }, [])

  return isMountedRef.current
}
