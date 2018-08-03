import * as React from 'react'
import { compose, lifecycle, withState, withReducer } from 'recompose'

import { Action, createReducer, Point, reduceReducers } from './util'
import { Canvas } from './Canvas'

enum Actions {
  Add = 'ADD',
  Toggle = 'TOGGLE'
}

type ContainerActions =
  | Action<Actions.Add, Point>
  | Action<Actions.Toggle, boolean>

type DrawContainer = typeof defaultState
const defaultState = {
  isDrawing: false as boolean,
  points: [] as Point[]
}

const addPointReducer = createReducer<Actions.Add, Point>(Actions.Add)(
  (s: DrawContainer, p) =>
    console.log('drawing', s) || {
      ...s,
      points: [...s.points, p]
    }
)

const isDrawingReducer = createReducer<Actions.Toggle, boolean>(Actions.Toggle)(
  (s: DrawContainer, shouldDraw: boolean) => ({
    ...s,
    isDrawing: shouldDraw
  })
)

const pointsReducer = reduceReducers(addPointReducer, isDrawingReducer)

const addPoint = (point: Point) => ({
  type: Actions.Add,
  payload: point
})
const shouldToggle = (yesOrNo: boolean) => ({
  type: Actions.Toggle,
  payload: yesOrNo
})

export class Container extends React.Component<{}, DrawContainer> {
  state = defaultState

  render() {
    const { isDrawing } = this.state

    return (
      <div style={{ backgroundColor: 'red' }}>
        <Canvas
          points={this.state.points}
          onMouseMove={e => {
            const { pageX: mouseX, pageY: mouseY } = e
            const {
              x: canvasLeft,
              y: canvasTop
            } = e.currentTarget.getBoundingClientRect() as DOMRect
            if (isDrawing) {
              this.dispatch(
                addPoint({ x: mouseX - canvasLeft, y: mouseY - canvasTop })
              )
            }
          }}
          onMouseDown={() => this.dispatch(shouldToggle(true))}
          onMouseUp={() => this.dispatch(shouldToggle(false))}
        />
      </div>
    )
  }

  dispatch = (action: ContainerActions) => this.setState(pointsReducer(action))
}
