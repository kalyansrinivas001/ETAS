import React, { useState, useCallback } from 'react'
import Timer from './components/Timer'
import Violations from './components/Violations'
import Summary from './components/Summary'
import { ViolationEntry } from './types'

export default function App() {
  // read initial minutes from Vite env `VITE_INITIAL_MINUTES`, fallback to 45
  const initialMinutes = parseInt((import.meta as any).env?.VITE_INITIAL_MINUTES ?? '45', 10)
  const [violations, setViolations] = useState<ViolationEntry[]>([])
  const [sessionEnded, setSessionEnded] = useState(false)

  const addViolation = useCallback((v: ViolationEntry) => {
    setViolations((s) => [v, ...s])
  }, [])

  const handleEnd = () => {
    setSessionEnded(true)
  }

  const handleThreshold = (type: '5min' | '1min') => {
    // browser notification
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(type === '5min' ? '5 minutes remaining' : '1 minute remaining')
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification(type === '5min' ? '5 minutes remaining' : '1 minute remaining')
        }
      })
    }
  }

  const restart = () => {
    setViolations([])
    setSessionEnded(false)
    // reload page to restart timer (simple approach)
    window.location.reload()
  }

  return (
    <div className="app">
      <header>
        <h1>ETAS — Exam Timer & Alert System</h1>
      </header>
      <main>
        {!sessionEnded ? (
          <div className="grid">
            <Timer initialMinutes={initialMinutes} onEnd={handleEnd} onThreshold={handleThreshold} />
            <Violations addViolation={addViolation} secondsRemaining={0} violations={violations} />
          </div>
        ) : (
          <Summary totalInitialSeconds={initialMinutes * 60} violations={violations} onRestart={restart} />
        )}
      </main>
    </div>
  )
}
