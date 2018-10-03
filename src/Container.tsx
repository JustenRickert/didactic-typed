import * as React from 'react'
import { range } from 'lodash'
import { timer } from 'rxjs'

import InfoScreen from './components/InfoScreen'
import Grid from './components/Grid'
import Purchaser from './components/Purchaser'

import {
  createReducer,
  plus,
  clamp,
  equals,
  defaultingMapCommodities,
  update2,
  update3
} from './util'
import {
  Evaluation,
  Position,
  Player,
  Square,
  CommodityKind,
  Commodity,
  Commodities,
  Evaluation2,
  Evaluation3
} from './types'
import { ARROW_KEY_TO_POSITION_MAP, BOARD_DIMENSIONS } from './constant'

const clampBoard = clamp([0, BOARD_DIMENSIONS[0]], [0, BOARD_DIMENSIONS[1]])

const stubEvaluation: (
  or: 'rate' | 'value' | 'acceleration'
) => Evaluation = rateOrValue => {
  switch (rateOrValue) {
    case 'rate':
      return { quantity: 1, valuePerQuantity: 0.01 }
    case 'value':
      return { quantity: 0, valuePerQuantity: 1 }
    case 'acceleration':
      return { quantity: 0.1, valuePerQuantity: 0.001 }
  }
}

const stubEvaluation2 = () =>
  ({
    value: stubEvaluation('value'),
    rate: stubEvaluation('rate')
  } as Evaluation2)

const stubEvaluation3 = () =>
  ({
    value: stubEvaluation('value'),
    rate: stubEvaluation('rate'),
    acceleration: stubEvaluation('acceleration')
  } as Evaluation3)

const defaultPlayerState: Player = {
  position: { x: 0, y: 0 },
  rotation: 0,
  squareEvaluation: { quantity: 1, valuePerQuantity: 0.1 }
}

const stubCommodity = <K extends CommodityKind>(kind: K, position: Position) =>
  ({
    kind,
    position,
    quantity: 0,
    evaluation: stubEvaluation3()
  } as Commodity<K>)

const defaultCommoditiesState = range(BOARD_DIMENSIONS[0]).reduce<
  Commodities[]
>(
  (commodities, i) => [
    ...commodities,
    ...range(BOARD_DIMENSIONS[1]).map(j => ({
      [CommodityKind.Red]: stubCommodity(CommodityKind.Red, { x: i, y: j }),
      [CommodityKind.Blue]: stubCommodity(CommodityKind.Blue, { x: i, y: j }),
      [CommodityKind.Green]: stubCommodity(CommodityKind.Green, { x: i, y: j })
    }))
  ],
  []
)

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

export interface Props {
  storedData: State | undefined
  localStorageName: string
}

export interface State {
  player: Player
  squares: Square[]
  commodities: Commodities[]
}

export class Container extends React.Component<Props, State> {
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
            player: defaultPlayerState,
            squares: defaultSquaresState,
            commodities: defaultCommoditiesState
          }
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyEvent)

    timeSource.subscribe(i => {
      this.updatePlayerSquareRate()
      this.updateSquaresValue()
      i % 60 === 59 &&
        localStorage.setItem(
          this.props.localStorageName,
          JSON.stringify(this.state)
        )
    })
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyEvent)
  }

  render() {
    const { commodities, squares, player } = this.state
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
        <Purchaser
          commodities={commodities}
          purchaseCommodity={this.purchaseCommodity}
        />
      </>
    )
  }

  storeStateLocally = () =>
    localStorage.setItem(
      this.props.localStorageName,
      JSON.stringify(this.state)
    )

  purchaseCommodity = (
    kind: CommodityKind,
    payload: { quantity: number; position: Position }
  ) =>
    this.setState(({ commodities }) => ({
      commodities: commodities.map(
        commies =>
          equals(commies[kind].position, payload.position)
            ? defaultingMapCommodities(commies, {
                kind,
                payload: {
                  evaluation: {
                    value: {
                      quantity:
                        commies[kind].evaluation.value.quantity +
                        payload.quantity
                    }
                  }
                }
              })
            : commies
      )
    }))

  updatePlayerSquareRate() {
    this.setState(({ squares, player }) => ({
      squares: squares.map(
        s =>
          equals(s.position, player.position)
            ? { ...s, rate: plus(s.rate, player.squareEvaluation) }
            : s
      )
    }))
  }

  updateSquaresValue() {
    this.setState(({ squares }) => ({ squares: squares.map(update2) }))
  }

  updatePlayerPosition(position: Position) {
    this.setState(({ player }) => ({
      player: { ...player, position }
    }))
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    const { player } = this.state
    const position = ARROW_KEY_TO_POSITION_MAP[e.key]
    if (position) {
      this.updatePlayerPosition(clampBoard(plus(player.position, position)))
    }
  }
}
