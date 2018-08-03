import * as React from 'react'
// import { chunk } from 'lodash'

import { Point, chunkWithOverlap, getCubicPolyControlPoints } from './util'

interface MouseEventProps {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
}

export class Canvas extends React.Component<MouseEventProps & { points: Point[] }> {
  ref = React.createRef<HTMLCanvasElement>()

  componentDidMount() {
    this.handleResize()
    addEventListener('resize', () => this.handleResize)
  }

  handleResize = () => {
    const parent = this.ref.current!.parentElement!
    const { width, height } = parent.getBoundingClientRect() as DOMRect
    const canvas = this.ref.current!
    canvas.height = height || canvas.height
    canvas.width = width || canvas.width
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  draw = () => {
    const { points } = this.props
    const canvas = this.ref.current!
    const parent = canvas.parentElement!
    const ctx = canvas.getContext('2d')!
    const { x, y, width, height } = parent.getBoundingClientRect() as DOMRect

    ctx.clearRect(x, y, width, height)

    for (const gram of chunkWithOverlap(points)) {
      const [first, second = undefined, third = undefined] = gram

      if (!second) {
        return
      } else if (!third) {
        this.drawLine(ctx)(first, second)
      } else {
        this.drawBezier(ctx)(first, second, third)
      }
    }
  }

  drawLine = (ctx: CanvasRenderingContext2D) => (p1: Point, p2: Point) => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
    ctx.closePath()
  }

  drawBezier = (ctx: CanvasRenderingContext2D) => (p1: Point, p2: Point, p3: Point) => {
    const { cp1, cp2 } = getCubicPolyControlPoints(p1, p2, p3)

    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.moveTo(p1.x, p1.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p3.x, p3.y)
    ctx.stroke()
    ctx.closePath()
  }

  render() {
    const { onMouseDown, onMouseUp, onMouseMove, points } = this.props
    return (
      <canvas
        ref={this.ref}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
      />
    )
  }
}
