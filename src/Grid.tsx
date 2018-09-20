import * as React from 'react'
import { range } from 'lodash'
import styled from 'styled-components'

import { PlayerValue } from './player'

const GridStyle = styled.div`
  display: grid;
  grid-gap: 1em;
  max-width: 8em;
  grid-template-columns: repeat(5, 1fr);
`

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  border: 1px black solid;
`

const Grid = ({
  player,
  dimensions: { xMax, yMax }
}: {
  player: PlayerValue
  dimensions: { xMax: number; yMax: number }
}) => (
  <GridStyle>
    {range(xMax).map(i =>
      range(yMax).map(
        j =>
          player.position.x === j && player.position.y === i ? (
            <Square children="me" />
          ) : (
            <Square children="." />
          )
      )
    )}
  </GridStyle>
)

export default Grid
