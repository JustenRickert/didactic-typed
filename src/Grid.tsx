import * as React from 'react'
import { range } from 'lodash'
import styled from 'styled-components'

import Player from './player'
import Square from './square'

interface StyledGridProps {
  columns: number
}

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  max-width: 8em;
  grid-template-columns: repeat(
    ${(props: StyledGridProps) => props.columns},
    1fr
  );
`

const GridSquare = styled.div`
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
  player: Player
  squares: Square[]
  dimensions: { xMax: number; yMax: number }
}) => (
  <StyledGrid columns={xMax}>
    {range(xMax).map(i =>
      range(yMax).map(
        j =>
          player.position.x === j && player.position.y === i ? (
            <GridSquare children="me" />
          ) : (
            <GridSquare children="" />
          )
      )
    )}
  </StyledGrid>
)

export default Grid
