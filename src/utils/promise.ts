/**
 * This function generates a promise that can be resolved manually.
 * This is useful when you want to wait for a resolve process but doesn't want all the code inside a promise.
 * @returns
 * - getPromise: function that returns the promise
 * - getResolver: function that returns the resolver function
 * - generateNewPromise: generates a new promise and resolver
 */
export function generateManuallyTriggeredPromise() {
  let resolve: VoidFunction = () => undefined
  let promise = new Promise<void>((_resolve) => {
    resolve = _resolve
  })

  const getPromise = () => {
    return promise
  }
  const getResolver = () => {
    return resolve
  }

  const generateNewPromise = () => {
    promise = new Promise<void>((_resolve) => {
      resolve = _resolve
    })
  }

  return {
    getPromise,
    getResolver,
    generateNewPromise,
  }
}

/**
 * This function generates a queue for promises
 * which will be useful for waiting things that are in other function calls in queue order.
 * @returns
 * - addQueue: function that adds a new promise to the queue and returns the last promise in the queue
 * - resolveQueue: function that resolves the first promise in the queue
 */
export function generatePromiseQueue() {
  const queue: { promise: Promise<void>; resolve: VoidFunction }[] = []

  const addQueue = () => {
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    const lastPromise = queue[queue.length - 1]?.promise || Promise.resolve()
    queue.push({ promise: getPromise(), resolve: getResolver() })
    return lastPromise
  }

  return {
    addQueue,
    resolveQueue: () => {
      const { resolve } = queue.shift() ?? {}
      resolve?.()
    },
  }
}
