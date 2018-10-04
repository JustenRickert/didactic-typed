import * as React from 'react'
import { range, clone } from 'lodash'
import styled from 'styled-components'

import {
  Player,
  Square,
  Commodities,
  Commodity,
  Position,
  CommodityKind
} from '../types'
import { ReactElement } from 'react'

interface StyledGridProps {
  columns: number
}

const Wrapper = styled.div``

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  max-width: 12em;
  grid-template-columns: repeat(
    ${(props: StyledGridProps) => props.columns},
    1fr
  );
`

const squareLength = '6em'

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

const PlayerIconWrapper = styled.div`
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
  gridNode
}: {
  player: Player
  rowSize: number
  gridNode: HTMLDivElement
}) => {
  const { top: topOffset, left: leftOffset } = gridNode.getBoundingClientRect()
  const { top, left } = gridNode.children[
    x + rowSize * y
  ].getBoundingClientRect() as ClientRect
  return (
    <PlayerIconWrapper
      style={{
        transform: `translate(${left - leftOffset}px, ${top - topOffset}px)`,
        transition: 'all 300ms'
      }}
      children={<div children="ME" />} // TODO: replace me with a cool icon of some kind! :)
    />
  )
}

const colorMap = {
  [CommodityKind.Red]: 'red',
  [CommodityKind.Green]: 'green',
  [CommodityKind.Blue]: 'blue'
}

const randomPositionWithinSquare = (
  squareRef: React.RefObject<HTMLDivElement>
): Position => {
  const node = squareRef.current
  if (!node) {
    return { x: -Infinity, y: -Infinity }
  }
  const {
    top: squareTop,
    left: squareLeft,
    width,
    height
  } = node.getBoundingClientRect() as DOMRect
  window.scrollX
  const top = scrollY + squareTop
  const left = scrollX + squareLeft
  const center = { x: left + width / 2 - 10, y: top - height / 2 - 35 }
  const direction = () => (Math.random() < 1 / 2 ? 1 : -1)
  const length = width / 3
  const offset = {
    x: direction() * Math.random() * length,
    y: direction() * Math.random() * length
  }
  return { x: center.x + offset.x, y: center.y + offset.y }
}

const makeCommodityPositionMap = (
  commodities: Commodities[],
  squareRef: React.RefObject<HTMLDivElement>[]
) => {
  const commodityPositions = new Map<Commodity<any>, Position>()
  commodities.forEach((commies, i) =>
    Object.keys(commies).forEach(key => {
      commodityPositions.set(
        commies[key as CommodityKind],
        randomPositionWithinSquare(squareRef[i])
      )
    })
  )
  return commodityPositions
}

interface SpotProps {
  position: Position
  kind: CommodityKind
}

const Spot: React.StatelessComponent<SpotProps> = ({ position, kind }) => (
  <circle
    cx={position.x}
    cy={position.y}
    r="15"
    fill={colorMap[kind]}
    stroke="black"
    strokeWidth="1"
  />
)

interface SpotOverlayProps {
  commodities: Commodities[]
  wrapperRef: React.RefObject<HTMLDivElement>
  squareRefs: React.RefObject<HTMLDivElement>[]
}

const StyledSpotOverlay = styled.div`
  position: absolute;
`

class SpotOverlay extends React.Component<
  SpotOverlayProps,
  {
    commodityPositions: Map<Commodity<any>, Position>
  }
> {
  constructor(props: SpotOverlayProps) {
    super(props)
    this.state = {
      commodityPositions: makeCommodityPositionMap(
        props.commodities,
        props.squareRefs
      )
    }
  }

  static getDerivedStateFromProps({
    commodities,
    squareRefs
  }: SpotOverlayProps) {
    return {
      commodityPositions: makeCommodityPositionMap(commodities, squareRefs)
    }
  }

  render() {
    const { wrapperRef: { current: wrapperNode } } = this.props
    const { commodityPositions } = this.state
    const spots: React.ReactElement<SpotProps>[] = []
    let height = 0
    let width = 0
    if (wrapperNode) {
      const {
        x: left,
        y: top,
        height: wrapperHeight,
        width: wrapperWidth
      } = wrapperNode.getBoundingClientRect() as DOMRect
      height = wrapperHeight
      width = wrapperWidth
    }
    commodityPositions.forEach((position, commodity) => {
      if (commodity.evaluation.value.quantity)
        spots.push(<Spot kind={commodity.kind} position={position} />)
    })
    return (
      <StyledSpotOverlay>
        <svg height={height} width={width}>
          {spots}
        </svg>
      </StyledSpotOverlay>
    )
  }
}

interface Props {
  player: Player
  squares: Square[]
  commodities: Commodities[]
  dimensions: { xMax: number; yMax: number }
}

interface State {
  commodityPositions: Map<Commodity<any>, Position>
}

class Grid extends React.Component<Props, State> {
  ref = React.createRef<HTMLDivElement>()
  squareRefs: React.RefObject<HTMLDivElement>[] = []

  constructor(props: Props) {
    super(props)
    props.commodities.forEach(_ => {
      const ref = React.createRef<HTMLDivElement>()
      this.squareRefs.push(ref)
    })
  }

  render() {
    const {
      player,
      commodities,
      dimensions: { xMax, yMax },
      squares
    } = this.props
    const { current: gridNode } = this.ref
    return (
      <Wrapper innerRef={this.ref}>
        {gridNode && (
          <Player player={player} gridNode={gridNode} rowSize={xMax} />
        )}
        <SpotOverlay
          commodities={commodities}
          wrapperRef={this.ref}
          squareRefs={this.squareRefs}
        />
        <StyledGrid columns={xMax}>
          {range(xMax * yMax).map(i => (
            <div>
              <GridSquare innerRef={this.squareRefs[i]} key={i} children="" />
            </div>
          ))}
        </StyledGrid>
      </Wrapper>
    )
  }
}

export default Grid
