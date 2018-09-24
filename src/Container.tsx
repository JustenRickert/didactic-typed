import * as React from 'react'
import { cloneDeep, range } from 'lodash'
import { timer } from 'rxjs'

import Player, { withPosition } from './data/player'
import Square, { updateValue, withRate } from './data/square'
import {
  createReducer,
  plus,
  clamp,
  equals,
  Evaluation,
  Position
} from './util'
import InfoScreen from './components/InfoScreen'
import Grid from './components/Grid'

import { ARROW_KEY_TO_POSITION_MAP, BOARD_DIMENSIONS } from './constant'

const clampBoard = clamp([0, BOARD_DIMENSIONS[0]], [0, BOARD_DIMENSIONS[1]])

const stubEvaluation: (or: 'rate' | 'value') => Evaluation = rateOrValue =>
  cloneDeep({
    quantity: rateOrValue === 'rate' ? 1 : 0,
    valuePerQuantity: rateOrValue === 'value' ? 1 : 0.01
  })

const defaultPlayerValue: Player = {
  position: { x: 0, y: 0 },
  rotation: 0,
  squareRate: { quantity: 1, valuePerQuantity: 0.1 }
}

const timeSource = timer(1000, 1000)

interface State {
  player: Player
  squares: Square[]
}

export class Container extends React.Component<{}, State> {
  readonly state: State = {
    player: defaultPlayerValue,
    squares: range(BOARD_DIMENSIONS[0]).reduce(
      (squareSquares, i) => {
        const squares: Square[] = []
        range(BOARD_DIMENSIONS[1]).forEach(j =>
          squares.push({
            position: { x: i, y: j },
            value: stubEvaluation('value'),
            rate: stubEvaluation('rate')
          })
        )
        return [...squareSquares, ...squares]
      },
      [] as Square[]
    )
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyEvent)

    const timeSubscriber = timeSource.subscribe(_ => {
      this.updatePlayerSquareRate()
      this.updateSquaresValue()
    })
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyEvent)
  }

  render() {
    const { squares, player } = this.state
    return (
      <>
        <InfoScreen player={player} squares={squares} />
        <Grid
          player={player}
          squares={squares}
          dimensions={{ xMax: BOARD_DIMENSIONS[0], yMax: BOARD_DIMENSIONS[1] }}
        />
      </>
    )
  }

  updatePlayerSquareRate() {
    this.setState(({ squares, player }) => ({
      squares: squares.map(
        s =>
          equals(s.position, player.position)
            ? withRate(s, plus(s.rate, player.squareRate))
            : s
      )
    }))
  }

  updateSquaresValue() {
    this.setState(({ squares }) => ({ squares: squares.map(updateValue) }))
  }

  updatePlayerPosition(position: Position) {
    this.setState(state => ({ player: withPosition(state.player, position) }))
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    const { player } = this.state
    const position = ARROW_KEY_TO_POSITION_MAP[e.key]
    if (position) {
      this.updatePlayerPosition(clampBoard(plus(player.position, position)))
    }
  }
}
