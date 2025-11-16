import React from 'react'
import { ViolationType, ViolationEntry } from '../types'

type Props = {
  addViolation: (v: ViolationEntry) => void
  secondsRemaining: number
  violations: ViolationEntry[]
}

export default function Violations({ addViolation, secondsRemaining, violations }: Props) {
  const make = (type: ViolationType) => {
    const entry: ViolationEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      timestamp: new Date().toISOString(),
      secondsRemaining
    }
    addViolation(entry)
  }

  return (
    <div className="violations">
      <div className="header">
        <h3>Proctoring Violations <span className="badge">{violations.length}</span></h3>
      </div>
      <div className="buttons">
        <button onClick={() => make('MultipleFaces')}>Multiple Faces Detected</button>
        <button onClick={() => make('TabSwitch')}>Tab Switch Detected</button>
        <button onClick={() => make('ProhibitedApp')}>Prohibited Application Detected</button>
      </div>
      <div className="log">
        <h4>Violation Log</h4>
        <ul>
          {violations.map((v) => (
            <li key={v.id}>{new Date(v.timestamp).toLocaleTimeString()} — {v.type} — {v.secondsRemaining}s left</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
