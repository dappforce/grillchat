import { useRef } from 'react'

/**
 * This function just wraps anything into a ref, so that it can be used in useEffect dependencies
 * while using the latest version of the data.
 *
 * One example of this is when you want to use a callback in useEffect,
 * but the function itself is using a state variable, and you want to use the latest version of the state variable.
 *
 * @example
 * const [state, setState] = useState(0)
 * const callback = () => {
 *   console.log(state)
 * }
 * const ref = useWrapInRef(callback)
 * useEffect(() => {
 *   ref.current() // if you do not wrap it, you can remove the callback from the dependencies, but then it will use the old state and there will be a warning
 * }, [ref])
 * @param data {T}
 * @returns wrappedData {React.MutableRefObject<T>}
 */
export default function useWrapInRef<T>(data: T) {
  const ref = useRef<T>(data)
  ref.current = data
  return ref
}
