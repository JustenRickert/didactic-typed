import * as React from 'react'

import { Commodity, CommodityKind, Commodities } from './types'
import { totalValue } from './util'

const topFive = (squares: Commodity[]) =>
  take(orderBy(squares, totalValue, 'desc'), 5)

interface Props {
  commodities: Commodities[]
  purchaseCommodity: (
    kind: CommodityKind,
    payload: { quantity: number; position: Position }
  ) => void
}

class Purchaser extends React.Component<Props> {
  render() {
    const { commodities } = this.props
    return null
  }
}

export default Purchaser
