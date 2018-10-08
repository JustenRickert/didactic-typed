export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object ? RecursivePartial<T[P]> : T[P]
}

export type Position = {
  x: number
  y: number
  t?: number
}

export type Evaluation = {
  quantity: number
  valuePerQuantity: number
}

export type AnyPlusableType = Evaluation | Position

export type Evaluation2 = {
  value: Evaluation
  rate: Evaluation
}

export type Evaluation3 = {
  value: Evaluation
  rate: Evaluation
  acceleration: Evaluation
}

export type Player = {
  position: Position
  rotation: number
  squareEvaluation: Evaluation
}

export type Square = Evaluation2 & {position: Position}

export enum CommodityKind {
  Red = 'RED',
  Blue = 'BLUE',
  Green = 'GREEN'
}

export type Commodity<K extends CommodityKind> = {
  kind: K
  evaluation: Evaluation3
  position: Position
}

export type Commodities = {
  [CommodityKind.Red]: Commodity<CommodityKind.Red>
  [CommodityKind.Blue]: Commodity<CommodityKind.Blue>
  [CommodityKind.Green]: Commodity<CommodityKind.Green>
}
