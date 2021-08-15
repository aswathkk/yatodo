import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export default function useEffectAfterMount(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      const cleanupFn = effect()
      return () => {
        if (cleanupFn) cleanupFn()
      }
    } else {
      didMountRef.current = true
    }
  }, deps)

  useEffect(() => {
    return () => {
      didMountRef.current = false
    }
  }, [])
}
