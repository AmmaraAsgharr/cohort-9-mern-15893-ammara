import { renderHook, act } from '@testing-library/react'
import { useColorCycle } from '../src/hooks/useColorCycle'

describe('useColorCycle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('starts with the base color', () => {
    const { result } = renderHook(() => useColorCycle('#FF6B00'))
    expect(result.current.bg).toBe('#FF6B00')
  })

  it('changes color after start() and interval ticks', () => {
    const { result } = renderHook(() => useColorCycle('#FF6B00'))
    act(() => {
      result.current.start()
      jest.advanceTimersByTime(400)
    })
    expect(result.current.bg).not.toBe('#FF6B00')
  })

  it('resets to base color after stop()', () => {
    const { result } = renderHook(() => useColorCycle('#FF6B00'))
    act(() => {
      result.current.start()
      jest.advanceTimersByTime(400)
      result.current.stop()
    })
    expect(result.current.bg).toBe('#FF6B00')
  })
})