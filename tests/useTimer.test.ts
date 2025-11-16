import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTimer from '../src/hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    // use fake timers and set the mocked system time so Date.now() advances
    vi.useFakeTimers()
    vi.setSystemTime(Date.now())
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down and triggers thresholds', () => {
    const onFive = vi.fn()
    const onOne = vi.fn()
    const onEnd = vi.fn()

    const { result } = renderHook(() => useTimer(65, { onFiveMin: onFive, onOneMin: onOne, onEnd }))

    act(() => {
      result.current.start()
    })

    // advance 4s -> should NOT yet trigger the 1-minute threshold (still 61s remaining)
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(onOne).not.toHaveBeenCalled()

    // advance 2s more -> now 59s remaining, 1-minute threshold should trigger
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onOne).toHaveBeenCalled()
  })

  it('triggers five-minute threshold', () => {
    const onFive = vi.fn()
    const onOne = vi.fn()
    const onEnd = vi.fn()

    // 305 seconds == 5m5s; after 5s it should hit exactly 5:00 and call onFive
    const { result } = renderHook(() => useTimer(305, { onFiveMin: onFive, onOneMin: onOne, onEnd }))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(onFive).toHaveBeenCalled()
    expect(onOne).not.toHaveBeenCalled()
    expect(onEnd).not.toHaveBeenCalled()
  })

  it('calls onEnd at zero and supports pause/resume', () => {
    const onFive = vi.fn()
    const onOne = vi.fn()
    const onEnd = vi.fn()

    const { result } = renderHook(() => useTimer(3, { onFiveMin: onFive, onOneMin: onOne, onEnd }))

    act(() => {
      result.current.start()
    })

    // advance to end
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onEnd).toHaveBeenCalled()

    // Test pause/resume behavior
    const { result: r2 } = renderHook(() => useTimer(10))
    act(() => {
      r2.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    // pause
    act(() => {
      r2.current.pause()
    })
    const paused = r2.current.seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    // still paused
    expect(r2.current.seconds).toBe(paused)
    // resume and advance
    act(() => {
      r2.current.resume()
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(r2.current.seconds).toBeLessThan(paused)
  })
})
