import * as React from 'react'

import { Rect } from './svg'

export interface Props {
  bars: { color: 'red' | 'blue'; value: number }[]
}

const GraphRaw = ({ bars }: Props) => (
  <div style={{ display: 'flex' }}>
    {bars.map(({ value }) => (
      <Rect
        x="10"
        y={String(Math.floor(value / 2))}
        width="20"
        height={String(value)}
        color="blue"
      />
    ))}
  </div>
)

export const Graph = () => (
  <GraphRaw bars={[{ color: 'red', value: 5 }, { color: 'blue', value: 5 }]} />
)
