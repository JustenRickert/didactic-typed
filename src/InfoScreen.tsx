import * as React from 'react'

import { PlayerValue } from './player'

const InfoScreen = ({ value: player }: { value: PlayerValue }) => (
  <div>
    {player.position.x},
    {player.position.y}
  </div>
)

export default InfoScreen
