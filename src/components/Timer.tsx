import React, { useEffect, useState, useRef, useCallback } from 'react'
import useTimer from '../hooks/useTimer'

// Try to resolve packaged alert sound (placeholder file). Vite will replace this at build time.
const alertSoundUrl = (() => {
  try {
    return new URL('../assets/alert.mp3', import.meta.url).href
  } catch (e) {
    return null
  }
})()

function playAlertSound(url: string | null) {
  if (url) {
    try {
      const audio = new Audio(url)
      void audio.play().catch(() => {})
      return
    } catch (e) {
      // fallthrough to WebAudio
    }
  }

  // Safe WebAudio fallback: pick available constructor
  try {
    const AudioCtor: any = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AudioCtor) return
    const ctx = new AudioCtor()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    g.gain.value = 0.1
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      try {
        o.stop()
        ctx.close()
      } catch (err) {
        // ignore
      }
    }, 350)
  } catch (e) {
    // ignore audio errors
  }
}

type Props = {
  initialMinutes?: number
  onEnd?: () => void
  onThreshold?: (type: '5min' | '1min') => void
}

function formatMMSS(totalSeconds: number) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const ss = String(totalSeconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function Timer({ initialMinutes = 45, onEnd, onThreshold }: Props) {
  const initialSeconds = initialMinutes * 60
  const [soundOn, setSoundOn] = useState(false)
  const handleFiveMin = useCallback(() => {
    onThreshold && onThreshold('5min')
  }, [onThreshold])

  const handleOneMin = useCallback(() => {
    if (soundOn) {
      playAlertSound(alertSoundUrl)
    }
    onThreshold && onThreshold('1min')
  }, [soundOn, onThreshold])

    const audioCtxRef = useRef<AudioContext | null>(null)

    const ensureAudioContext = () => {
      if (audioCtxRef.current) return audioCtxRef.current
      const AudioCtor: any = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtor) return null
      try {
        audioCtxRef.current = new AudioCtor()
      } catch (e) {
        audioCtxRef.current = null
      }
      return audioCtxRef.current
    }
  const { seconds, running, start, pause, resume, reset } = useTimer(initialSeconds, {
    onFiveMin: handleFiveMin,
    onOneMin: handleOneMin,
    onEnd: () => onEnd && onEnd()
  })

  const secondsRef = useRef(seconds)

  // Dev-controls toggle:
  // Only enable dev controls when `VITE_ENABLE_DEV_CONTROLS=true` is set in `.env`.
  // This avoids showing dev-only UI simply because the app is running in Vite dev server.
  const env: any = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined
  const enableDevControls = Boolean(env && env.VITE_ENABLE_DEV_CONTROLS === 'true')

  useEffect(() => {
    secondsRef.current = seconds
  }, [seconds])


  // sound is now triggered from the timer's one-minute callback (handleOneMin)

  useEffect(() => {
    const defaultTitle = document.title

    const updateTitle = () => {
      if (document.hidden) {
        document.title = `Time Remaining: ${formatMMSS(secondsRef.current)}`
      } else {
        document.title = defaultTitle
      }
    }

    // Update title on visibility change
    const handleVisibilityChange = () => {
      updateTitle()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Update title every second while tab is inactive
    const interval = setInterval(() => {
      if (document.hidden) {
        updateTitle()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      document.title = defaultTitle
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Ensure title updates immediately when `seconds` changes while tab is hidden.
  useEffect(() => {
    if (document.hidden) {
      const prev = document.title
      document.title = `Time Remaining: ${formatMMSS(secondsRef.current)}`
      return () => {
        document.title = prev
      }
    }
    return undefined
  }, [seconds])

  const color = seconds <= 60 ? 'critical' : seconds <= 300 ? 'warning' : 'normal'

  return (
    <div className={`timer ${color}`}>
      <div className="time" aria-live="polite">{formatMMSS(seconds)}</div>
      <div className="controls">
        {!running ? (
          <button onClick={() => { ensureAudioContext(); start(); }}>Start</button>
        ) : (
          <button onClick={() => pause()}>Pause</button>
        )}
        {!running && seconds < initialSeconds ? <button onClick={() => { ensureAudioContext(); resume(); }}>Resume</button> : null}
        <button onClick={() => reset(initialSeconds)}>Reset</button>
      </div>
      {enableDevControls ? (
        <div className="dev-controls" style={{ marginTop: 12 }}>
          <strong>Dev Test:</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={() => { const wasRunning = running; reset(300); if (wasRunning) resume(); }}>Jump to 5m</button>
            <button onClick={() => { const wasRunning = running; reset(60); if (wasRunning) resume(); }}>Jump to 1m</button>
            <button onClick={() => { const wasRunning = running; reset(0); if (wasRunning) resume(); }}>Jump to End</button>
            <button onClick={() => { const wasRunning = running; reset(Math.max(0, seconds - 60)); if (wasRunning) resume(); }}>-1m</button>
          </div>
        </div>
      ) : null}
      <div className="extras">
        <label>
          <input type="checkbox" checked={soundOn} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSoundOn(e.target.checked)} />
          Sound at 1min
        </label>
      </div>
    </div>
  )
}
