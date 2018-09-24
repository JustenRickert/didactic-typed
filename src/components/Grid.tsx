import * as React from 'react'
import { range } from 'lodash'
import styled from 'styled-components'

import Player from '../data/player'
import Square from '../data/square'

interface StyledGridProps {
  columns: number
}

const Wrapper = styled.div``

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  max-width: 8em;
  grid-template-columns: repeat(
    ${(props: StyledGridProps) => props.columns},
    1fr
  );
`

const squareLength = '3em'

const GridSquare = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${squareLength};
  height: ${squareLength};
  box-sizing: border-box;
  border: 1px black solid;
  transition: all 2s;
`

interface PlayerSquareProps {
  leftOffset: number
  topOffset: number
}

const PlayerSquare = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: ${squareLength};
  height: ${squareLength};
`

const Player = ({
  player: { position: { x, y } },
  rowSize,
  gridRef
}: {
  player: Player
  rowSize: number
  gridRef: HTMLDivElement
}) => {
  const { top: topOffset, left: leftOffset } = gridRef.getBoundingClientRect()
  const { top, left } = gridRef.children[
    x + rowSize * y
  ].getBoundingClientRect() as ClientRect
  return (
    <PlayerSquare
      style={{
        transform: `translate(${left - leftOffset}px, ${top - topOffset}px)`,
        transition: 'all 300ms'
      }}
      children={<div children="ME" />}
    />
  )
}

class Grid extends React.Component<{
  player: Player
  squares: Square[]
  dimensions: { xMax: number; yMax: number }
}> {
  ref = React.createRef<HTMLDivElement>()

  render() {
    const { player, dimensions: { xMax, yMax } } = this.props
    const { current: gridNode } = this.ref
    return (
      <Wrapper>
        {gridNode && (
          <Player player={player} gridRef={gridNode} rowSize={xMax} />
        )}
        <StyledGrid innerRef={this.ref} columns={xMax}>
          {range(xMax * yMax).map(i => <GridSquare key={i} children="" />)}
        </StyledGrid>
      </Wrapper>
    )
  }
}

export default Grid
