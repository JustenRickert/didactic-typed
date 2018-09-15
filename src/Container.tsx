import * as React from 'react'

import Player, { withFunctions, PlayerValue } from './player'
import { createReducer, Position, plus, clamp } from './util'
import InfoScreen from './InfoScreen'

import { ARROW_KEY_TO_POSITION_MAP } from './constant'

const clamp5 = clamp([0, 5], [0, 5])

const defaultPlayerValue: PlayerValue = {
  position: { x: 0, y: 0 },
  rotation: 0
}

export const { Provider, Consumer } = React.createContext(
  withFunctions(defaultPlayerValue)
)

interface State {
  player: Player
}

export class Container extends React.Component<{}, State> {
  readonly state: State = { player: withFunctions(defaultPlayerValue) }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyEvent)
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyEvent)
  }

  render() {
    const { player } = this.state
    return (
      <Provider value={player}>
        <div>hello</div>
        <Consumer children={player => <InfoScreen value={player.value} />} />
      </Provider>
    )
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    const { value: player } = this.state.player
    const position: Position | undefined = ARROW_KEY_TO_POSITION_MAP[e.key]
    if (position) {
      this.updatePlayerPosition(clamp5(plus(player.position, position)))
    }
  }

  updatePlayerPosition = (position: Position) =>
    this.setState(state => ({ player: state.player.withPosition(position) }))
}
