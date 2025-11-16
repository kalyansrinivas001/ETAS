export type ViolationType = 'MultipleFaces' | 'TabSwitch' | 'ProhibitedApp'

export interface ViolationEntry {
  id: string
  type: ViolationType
  timestamp: string // ISO
  secondsRemaining: number
}

export interface TimerState {
  totalSeconds: number
  running: boolean
}
