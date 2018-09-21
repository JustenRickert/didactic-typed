import { Position } from './util'

export const MOVE_STEP_SIZE = 1

export const BOARD_DIMENSIONS: [number, number] = [4, 4]

const keymap = {
  ArrowRight: { x: MOVE_STEP_SIZE, y: 0 },
  ArrowLeft: { x: -MOVE_STEP_SIZE, y: 0 },
  ArrowUp: { x: 0, y: -MOVE_STEP_SIZE },
  ArrowDown: { x: 0, y: MOVE_STEP_SIZE }
}

export const ARROW_TYPED_KEY_TO_POSITION_MAP: Record<
  'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown',
  Position
> = keymap

export const ARROW_KEY_TO_POSITION_MAP: Record<
  string,
  Position | undefined
> = keymap
