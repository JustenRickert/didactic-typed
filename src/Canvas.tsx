import * as React from 'react'

import { Point } from './util'

interface MouseEventProps {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
}

export class Canvas extends React.Component<
  MouseEventProps & { points: Point[] }
> {
  render() {
    const { onMouseDown, onMouseUp, onMouseMove, points } = this.props
    return (
      <canvas
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
      />
    )
  }
}
