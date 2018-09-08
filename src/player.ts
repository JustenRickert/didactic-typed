import { Position } from './util'

export interface PlayerValue {
  position: Position
  rotation: number
}

interface Player {
  value: PlayerValue
  withPosition: (position: Position) => Player
}

export default Player

const withPosition = (core: PlayerValue) => (position: Position) =>
  withFunctions({ ...core, position })

export const withFunctions = (core: PlayerValue): Player => ({
  value: core,
  withPosition: withPosition(core)
})
