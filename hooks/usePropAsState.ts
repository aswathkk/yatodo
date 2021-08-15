import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function usePropAsState<T>(
  initialStateFromProps: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialStateFromProps)

  useEffect(() => {
    setState(initialStateFromProps)
  }, [initialStateFromProps])

  return [state, setState]
}
