import * as React from 'react'
import { orderBy, take } from 'lodash'

import Player from './player'
import Square, { totalValue } from './square'

const squaresTopFive = (squares: Square[]) =>
  take(orderBy(squares, totalValue, 'desc'), 5)

const InfoScreen = ({
  squares,
  player
}: {
  player: Player
  squares: Square[]
}) => (
  <div>
    {squaresTopFive(squares).map(s => (
      <div>
        {`${s.position.x},${s.position.y} := `}
        {`{ value: ${totalValue(s).toFixed(6)} }`}
      </div>
    ))}
    {player.position.x},
    {player.position.y}
  </div>
)

export default InfoScreen
