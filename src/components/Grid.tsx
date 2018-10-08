import * as React from 'react'
import {range, clone} from 'lodash'

import {
  Player,
  Square,
  Commodities,
  Commodity,
  Position,
  CommodityKind
} from '../types'
import {ReactElement} from 'react'

import {
  StyledSpotOverlay,
  StyledGrid,
  GridSquare,
  PlayerIconWrapper,
  GridWrapper
} from './primitives'

const Player = ({
  player: {position: {x, y}},
  rowSize,
  gridNode
}: {
  player: Player
  rowSize: number
  gridNode: HTMLDivElement
}) => {
  const {top: topOffset, left: leftOffset} = gridNode.getBoundingClientRect()
  const {top, left} = gridNode.children[
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
    return {x: -Infinity, y: -Infinity}
  }
  const {
    top: squareTop,
    left: squareLeft,
    width,
    height
  } = node.getBoundingClientRect() as DOMRect
  const top = scrollY + squareTop
  const left = scrollX + squareLeft
  const center = {x: left + width / 2 - 10, y: top - height / 2 - 35}
  const direction = () => (Math.random() < 1 / 2 ? 1 : -1)
  const length = width / 3
  const offset = {
    x: direction() * Math.random() * length,
    y: direction() * Math.random() * length
  }
  return {x: center.x + offset.x, y: center.y + offset.y}
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

const Spot: React.StatelessComponent<SpotProps> = ({position, kind}) => (
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

interface SpotOverlayState {
  commodityPositions: Map<Commodity<any>, Position>
}

class SpotOverlay extends React.Component<SpotOverlayProps, SpotOverlayState> {
  public readonly state = {commodityPositions: new Map()}

  static getDerivedStateFromProps({commodities, squareRefs}: SpotOverlayProps) {
    return {
      commodityPositions: makeCommodityPositionMap(commodities, squareRefs)
    }
  }

  render() {
    const {wrapperRef: {current: wrapperNode}} = this.props
    const {commodityPositions} = this.state
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
  dimensions: {xMax: number; yMax: number}
}

interface State {
  commodityPositions: Map<Commodity<any>, Position>
}

class Grid extends React.Component<Props, State> {
  gridRef = React.createRef<HTMLDivElement>()
  wrapperRef = React.createRef<HTMLDivElement>()
  squareRefs: React.RefObject<HTMLDivElement>[] = []

  constructor(props: Props) {
    super(props)
    props.commodities.forEach(_ => {
      const ref = React.createRef<HTMLDivElement>()
      this.squareRefs.push(ref)
    })
  }

  render() {
    const {player, commodities, dimensions: {xMax, yMax}, squares} = this.props
    const {current: gridNode} = this.gridRef
    return (
      <GridWrapper innerRef={this.wrapperRef}>
        {gridNode && (
          <Player player={player} gridNode={gridNode} rowSize={xMax} />
        )}
        <SpotOverlay
          commodities={commodities}
          wrapperRef={this.wrapperRef}
          squareRefs={this.squareRefs}
        />
        <StyledGrid innerRef={this.gridRef} columns={xMax}>
          {range(xMax * yMax).map(i => (
            <div>
              <GridSquare innerRef={this.squareRefs[i]} key={i} children="" />
            </div>
          ))}
        </StyledGrid>
      </GridWrapper>
    )
  }
}

export default Grid
