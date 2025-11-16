import { useEffect, useRef, useState, useCallback } from 'react'

type Callbacks = {
  onFiveMin?: () => void
  onOneMin?: () => void
  onEnd?: () => void
}

export default function useTimer(initialSeconds: number, callbacks: Callbacks = {}) {
  const { onFiveMin, onOneMin, onEnd } = callbacks
  const [seconds, setSeconds] = useState<number>(initialSeconds)
  const [running, setRunning] = useState(false)
  const endTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const notifiedFiveRef = useRef(false)
  const notifiedOneRef = useRef(false)

  const start = useCallback(() => {
    if (running) return
    endTimeRef.current = Date.now() + seconds * 1000
    setRunning(true)
  }, [running, seconds])

  const pause = useCallback(() => {
    if (!running) return
    // compute remaining
    if (endTimeRef.current) {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
      setSeconds(remaining)
    }
    setRunning(false)
  }, [running])

  const resume = useCallback(() => {
    if (running) return
    endTimeRef.current = Date.now() + seconds * 1000
    setRunning(true)
  }, [running, seconds])

  const reset = useCallback((newSeconds: number = initialSeconds) => {
    setSeconds(newSeconds)
    setRunning(false)
    endTimeRef.current = null
    notifiedFiveRef.current = false
    notifiedOneRef.current = false
  }, [initialSeconds])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // tick using endTime to avoid drift
    intervalRef.current = window.setInterval(() => {
      if (!endTimeRef.current) return
      const rem = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
      setSeconds(rem)

      if (rem <= 300 && !notifiedFiveRef.current) {
        notifiedFiveRef.current = true
        onFiveMin && onFiveMin()
      }
      if (rem <= 60 && !notifiedOneRef.current) {
        notifiedOneRef.current = true
        onOneMin && onOneMin()
      }
      if (rem <= 0) {
        setRunning(false)
        onEnd && onEnd()
      }
    }, 250)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running, onFiveMin, onOneMin, onEnd])

  // update document title while running
  useEffect(() => {
    const original = document.title

    let intervalId: number | null = null

    const setupInterval = () => {
      if (intervalId) {
        window.clearInterval(intervalId)
        intervalId = null
      }

      // only update the page title when the document is visible
      if (!running || document.hidden) return

      intervalId = window.setInterval(() => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
        const ss = String(seconds % 60).padStart(2, '0')
        document.title = `(${mm}:${ss}) ETAS`
      }, 1000)
    }

    // start/stop based on visibility changes
    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalId) {
          window.clearInterval(intervalId)
          intervalId = null
        }
        document.title = original
      } else {
        setupInterval()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    setupInterval()

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      document.title = original
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [running, seconds])

  return {
    seconds,
    running,
    start,
    pause,
    resume,
    reset
  }
}
