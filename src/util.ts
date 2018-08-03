import { isUndefined, range, last } from 'lodash'

export interface Point {
  x: number
  y: number
}

const diff = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) => ({
  x: x2 - x1,
  y: y2 - y1,
})
const plus = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) => ({
  x: x1 + x2,
  y: y1 + y2,
})
const divide = ({ x, y }: Point, divisor: number) => ({
  x: x / divisor,
  y: y / divisor,
})
const times = ({ x, y }: Point, scalar: number) => ({
  x: x * scalar,
  y: y * scalar,
})

export interface Action<S extends string, P> {
  type: string
  payload: P
}

export const createReducer = <T extends string, S, P>(type: T) => (
  payloadReducer: (s: S, p: P) => S,
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

export const chunkWithOverlap = <T>(ts: T[]) =>
  ts.reduce(
    (acc, t) => {
      if (!last(acc)) {
        acc.push([t])
      } else if (last(acc)!.length < 2) {
        last(acc)!.push(t)
      } else {
        last(acc)!.push(t)
        acc.push([t])
      }
      return acc
    },
    [] as T[][],
  )

export const getCubicPolyControlPoints = (p1: Point, p2: Point, p3: Point) => {
  const { x: dx1, y: dy1 } = diff(p2, p1)
  const { x: dx2, y: dy2 } = diff(p3, p2)

  // midponts
  const m1 = divide(plus(p1, p2), 2.0)
  const m2 = divide(plus(p2, p3), 2.0)

  // lengths
  const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
  const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

  // start/end parametric tangent
  const dm = diff(m2, m1)

  // sum of tangent (relative to line length) and midpoint2
  const k = l2 / (l1 + l2)
  const cm = plus(m2, times(dm, k))

  const t = diff(cm, p2)

  return {
    cp1: plus(m1, t),
    cp2: plus(m2, t),
  }
}
