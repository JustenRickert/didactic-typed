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

export type Player = {
  position: Position
  rotation: number
  squareEvaluation: Evaluation
}

export type Square = Evaluation2 & { position: Position }
