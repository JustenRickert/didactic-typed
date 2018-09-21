import { Evaluation, Position } from './util'

interface Player {
  position: Position
  rotation: number
  squareRate: Evaluation
}

export const withPosition = (player: Player, position: Position) => ({
  ...player,
  position
})

export default Player
