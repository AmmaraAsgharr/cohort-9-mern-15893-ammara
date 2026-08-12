import { useRef, useState, useEffect } from 'react'

const COLORS = ['#FF6B00', '#FFB830', '#FF4444', '#FF6B00']

export function useColorCycle(baseColor = '#FF6B00') {
  const [bg, setBg] = useState(baseColor)
  const intervalRef = useRef(null)
  const indexRef = useRef(0)

  const start = () => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % COLORS.length
      setBg(COLORS[indexRef.current])
    }, 400)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    indexRef.current = 0
    setBg(baseColor)
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  return { bg, start, stop }
}