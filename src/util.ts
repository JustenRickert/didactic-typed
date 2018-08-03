import { isUndefined } from 'lodash'

export interface Point {
  x: number
  y: number
}

export interface Action<S extends string, P> {
  type: string
  payload: P
}

export const createReducer = <T extends string, P>(type: T) => <S>(
  payloadReducer: (s: S, p: P) => S
) => (action: Action<T, P>) => (state: S) => {
  if (action.type === type) {
    return payloadReducer(state, action.payload)
  }

  return state
}

export const reduceReducers = <S, P>(
  ...reducers: ((a: Action<string, any>) => (s: S) => S)[]
) => (action: Action<string, P>) => (state: S) =>
  reducers.reduce((acc, r) => r(action)(acc), state)
