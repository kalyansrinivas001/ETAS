import React from 'react'
import { ViolationEntry } from '../types'

type Props = {
  totalInitialSeconds: number
  violations: ViolationEntry[]
  onRestart: () => void
}

export default function Summary({ totalInitialSeconds, violations, onRestart }: Props) {
  const counts = violations.reduce<Record<string, number>>((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="summary">
      <h2>Session Summary</h2>
      <p>Total time: {Math.floor(totalInitialSeconds / 60)} minutes</p>
      <div>
        <h3>Violations by type</h3>
        <ul>
          {Object.entries(counts).map(([k, c]) => (
            <li key={k}>{k}: {c}</li>
          ))}
          {violations.length === 0 && <li>None</li>}
        </ul>
      </div>
      <div>
        <h3>Violation timeline</h3>
        <ol>
          {violations.map(v => (
            <li key={v.id}>{new Date(v.timestamp).toLocaleString()} — {v.type} — {v.secondsRemaining}s left</li>
          ))}
        </ol>
      </div>
      <button onClick={onRestart}>Restart Session</button>
    </div>
  )
}
