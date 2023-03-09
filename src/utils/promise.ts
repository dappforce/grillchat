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
