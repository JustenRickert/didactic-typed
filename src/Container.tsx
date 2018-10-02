import * as React from 'react'
import { range } from 'lodash'
import { timer } from 'rxjs'

import InfoScreen from './components/InfoScreen'
import Grid from './components/Grid'

import {
  createReducer,
  plus,
  clamp,
  equals,
  update2,
  withPosition,
  withRate
} from './util'
import { Evaluation, Position, Player, Square } from './types'
import { ARROW_KEY_TO_POSITION_MAP, BOARD_DIMENSIONS } from './constant'

const clampBoard = clamp([0, BOARD_DIMENSIONS[0]], [0, BOARD_DIMENSIONS[1]])

const stubEvaluation: (or: 'rate' | 'value') => Evaluation = rateOrValue => ({
  quantity: rateOrValue === 'rate' ? 1 : 0,
  valuePerQuantity: rateOrValue === 'value' ? 1 : 0.01
})

const defaultPlayerValue: Player = {
  position: { x: 0, y: 0 },
  rotation: 0,
  squareEvaluation: { quantity: 1, valuePerQuantity: 0.1 }
}

const defaultSquaresState = range(BOARD_DIMENSIONS[0]).reduce(
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

const timeSource = timer(1000, 1000)

export interface State {
  player: Player
  squares: Square[]
}

export class Container extends React.Component<
  {
    storedData: State | undefined
    localStorageName: string
  },
  State
> {
  constructor(props: {
    storedData: State | undefined
    localStorageName: string
  }) {
    super(props)

    const stored = localStorage.getItem(this.props.localStorageName)

    this.state =
      stored !== null
        ? JSON.parse(stored)
        : undefined || {
            player: defaultPlayerValue,
            squares: defaultSquaresState
          }
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyEvent)

    timeSource.subscribe(i => {
      this.updatePlayerSquareRate()
      this.updateSquaresValue()
      i % 60 === 0 &&
        (console.log('saved', new Date()) ||
          localStorage.setItem(
            this.props.localStorageName,
            JSON.stringify(this.state)
          ))
    })
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyEvent)
  }

  render() {
    const { squares, player } = this.state
    return (
      <>
        <InfoScreen
          updateLocally={this.storeStateLocally}
          player={player}
          squares={squares}
        />
        <Grid
          player={player}
          squares={squares}
          dimensions={{ xMax: BOARD_DIMENSIONS[0], yMax: BOARD_DIMENSIONS[1] }}
        />
      </>
    )
  }

  storeStateLocally = () =>
    localStorage.setItem(
      this.props.localStorageName,
      JSON.stringify(this.state)
    )

  updatePlayerSquareRate() {
    this.setState(({ squares, player }) => ({
      squares: squares.map(
        s =>
          equals(s.position, player.position)
            ? withRate(s, plus(s.rate, player.squareEvaluation))
            : s
      )
    }))
  }

  updateSquaresValue() {
    this.setState(({ squares }) => ({ squares: squares.map(update2) }))
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
