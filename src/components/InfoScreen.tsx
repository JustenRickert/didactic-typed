import * as React from 'react'
import { orderBy, take } from 'lodash'

import Player from '../data/player'
import Square, { totalRate, totalValue } from '../data/square'

const topFive = (squares: Square[]) =>
  take(orderBy(squares, totalValue, 'desc'), 5)

const InfoScreen = ({
  squares,
  player
}: {
  player: Player
  squares: Square[]
}) => (
  <div>
    {topFive(squares).map(s => (
      <div>
        {`${s.position.x},${s.position.y} is `}
        {`{value: ${totalValue(s).toFixed(3)}, `}
        {`rate: ${totalRate(s).toFixed(3)}}`}
      </div>
    ))}
    {player.position.x},
    {player.position.y}
  </div>
)

export default InfoScreen
