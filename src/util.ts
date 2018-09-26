import { isUndefined, range, last } from 'lodash'

export type Evaluation = {
  quantity: number
  valuePerQuantity: number
}

export interface Position {
  x: number
  y: number
  t?: number
}

type AnyPlusableType = Evaluation | Position

const isEvaluation = (a: AnyPlusableType): a is Evaluation =>
  ['quantity', 'valuePerQuantity'].every(key => key in a)

const isPosition = (a: AnyPlusableType): a is Position =>
  ['x', 'y'].every(key => key in a)

export const equals = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position
) => x1 === x2 && y1 === y2

const diff = ({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) => ({
  x: x2 - x1,
  y: y2 - y1
})

const positionPlus = (p1: Position, p2: Position): Position => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
})

const evaluationPlus = (e1: Evaluation, e2: Evaluation): Evaluation => ({
  ...e1,
  quantity: e2.quantity * e2.valuePerQuantity + e1.quantity
})

export const plus = <T extends AnyPlusableType>(a: T, b: T): T => {
  if (isPosition(a)) {
    return positionPlus(a, b as Position) as T
  } else if (isEvaluation(a)) {
    return evaluationPlus(a, b as Evaluation) as T
  }
  throw new Error('CANNOT PLUS')
}

export const clamp = (
  [bottomX, topX]: [number, number],
  [bottomY, topY]: [number, number]
) => (position: Position) => {
  const x =
    position.x > topX - 1
      ? topX - 1
      : position.x < bottomX ? bottomX : position.x
  const y =
    position.y > topY - 1
      ? topY - 1
      : position.y < bottomY ? bottomY : position.y
  return { ...position, x, y }
}

const divide = ({ x, y }: Position, divisor: number) => ({
  x: x / divisor,
  y: y / divisor
})

const times = ({ x, y }: Position, scalar: number) => ({
  x: x * scalar,
  y: y * scalar
})

const normalize = (p: Position) => Math.sqrt(p.x * p.x + p.y * p.y)

const distance = (p1: Position, p2: Position) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))

const relativeVelocity = (p1: Required<Position>, p2: Required<Position>) =>
  distance(p1, p2) / (p2.t - p1.t)

export interface Action<S extends string, P> {
  type: string
  payload: P
}

export const createReducer = <T extends string, S, P>(
  type: T,
  payloadReducer: (s: S, p: P) => S
) => {
  return (state: S, action: Action<T, P>) =>
    action.type === type ? payloadReducer(state, action.payload) : state
}

export const reduceReducers = <S, A extends Action<string, any>>(
  ...reducers: ((state: S, a: Action<string, any>) => S)[]
) => {
  return (state: S, action: A) =>
    reducers.reduce((acc, r) => r(acc, action), state)
}
