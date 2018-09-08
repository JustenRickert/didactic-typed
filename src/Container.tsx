import * as React from 'react'

import Player, { withFunctions, PlayerValue } from './player'
import { createReducer, Position, plus } from './util'
import InfoScreen from './InfoScreen'

import { MOVE_STEP_SIZE } from './constant'

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
  state = { player: withFunctions(defaultPlayerValue) }

  componentDidMount() {
    const keyEventMovements = [
      {
        key: 'keyright',
        position: { x: MOVE_STEP_SIZE, y: 0 }
      },
      {
        key: 'keyleft',
        position: { x: -MOVE_STEP_SIZE, y: 0 }
      },
      {
        key: 'keyup',
        position: { x: 0, y: -MOVE_STEP_SIZE }
      },
      {
        key: 'keydown',
        position: { x: 0, y: MOVE_STEP_SIZE }
      }
    ]

    keyEventMovements.forEach(({ key, position }) =>
      document.addEventListener(key, this.updatePlayerPosition(position))
    )
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

  updatePlayerPosition = (position: Position) => () =>
    this.setState(
      state => ({ player: state.player.withPosition(position) }),
      () => console.log(this.state)
    )
}
