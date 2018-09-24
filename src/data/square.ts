import { Evaluation, Position } from './util'

export type Square = {
  position: Position
  value: Evaluation
  rate: Evaluation
}

export const totalValue = ({ value: { quantity, valuePerQuantity } }: Square) =>
  quantity * valuePerQuantity

export const totalRate = ({ rate: { quantity, valuePerQuantity } }: Square) =>
  quantity * valuePerQuantity

export const updateValue = (square: Square): Square => {
  const { value, rate } = square
  const delta = rate.valuePerQuantity * rate.quantity
  return {
    ...square,
    value: { ...value, quantity: value.quantity + delta }
  }
}

export const withRate = (square: Square, rate: Evaluation): Square => ({
  ...square,
  rate
})

export default Square
