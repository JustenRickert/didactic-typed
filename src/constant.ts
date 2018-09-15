import { Position } from './util'

export const MOVE_STEP_SIZE = 1

export const ARROW_KEY_TO_POSITION_MAP: Record<string, Position> = {
  ArrowRight: { x: MOVE_STEP_SIZE, y: 0 },
  ArrowLeft: { x: -MOVE_STEP_SIZE, y: 0 },
  ArrowUp: { x: 0, y: -MOVE_STEP_SIZE },
  ArrowDown: { x: 0, y: MOVE_STEP_SIZE }
}
