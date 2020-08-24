import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'

// This is used by methods allowing subscription. It allows to a create a
// function that either subscribes directly and return a handler if a callback
// is present, or to return a function allowing to pass the callback afterwards
// (in other terms, a partial application).
export function subscription<T, U = SubscriptionCallback<T>>(
  callback: U | undefined,
  createSubscription: (callback: U) => SubscriptionHandler
): SubscriptionHandler | ((callback: U) => SubscriptionHandler) {
  return callback
    ? createSubscription(callback)
    : (callback: U) => createSubscription(callback)
}
