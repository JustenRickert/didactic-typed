import { isUndefined, range, last } from 'lodash'

export interface Position {
  x: number
  y: number
  t?: number
}

const diff = ({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) => ({
  x: x2 - x1,
  y: y2 - y1
})

export const plus = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position
) => ({
  x: x1 + x2,
  y: y1 + y2
})

const divide = ({ x, y }: Position, divisor: number) => ({
  x: x / divisor,
  y: y / divisor
})

const times = ({ x, y }: Position, scalar: number) => ({
  x: x * scalar,
  y: y * scalar
})

const normalize = (p1: Position) => Math.sqrt(p1.x * p1.x + p1.y * p1.y)

const distance = (p1: Position, p2: Position) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))

const relativeVelocity = (p1: Required<Position>, p2: Required<Position>) =>
  distance(p1, p2) / (p2.t - p1.t)

export interface Action<S extends string, P> {
  type: string
  payload: P
}

export const createReducer = <T extends string, S, P>(type: T) => (
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
