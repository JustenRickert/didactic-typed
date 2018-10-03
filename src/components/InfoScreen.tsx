import * as React from 'react'
import { orderBy, take } from 'lodash'

import { Player, Square } from '../types'
import { totalRate, totalValue } from '../util'

const topFive = (squares: Square[]) =>
  take(orderBy(squares, totalValue, 'desc'), 5)

const InfoScreen = ({
  squares,
  player,
  updateLocally
}: {
  player: Player
  squares: Square[]
  updateLocally: () => void
}) => (
  <div>
    <button onClick={updateLocally} children="save" />
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
