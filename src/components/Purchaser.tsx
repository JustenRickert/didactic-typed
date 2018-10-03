import * as React from 'react'
import { take, orderBy } from 'lodash'
import styled from 'styled-components'

import {
  Commodity,
  CommodityKind,
  Commodities,
  Evaluation3,
  Position
} from '../types'
import { totalValue, totalRate } from '../util'

const StyledEvaluation = styled.div`
  display: flex;
  margin: 4px;
`

const StyledCommodityView = styled.div`
  display: flex;
  align-items: center;
  margin: 4px;
`

const StyledKind = styled.div`
  margin: 2px;
`

const BuyWrapper = styled.div`
  display: flex;
`

const topFive = (commodities: Commodities[]) =>
  take(
    orderBy(
      commodities,
      commies =>
        Math.max(
          ...Object.keys(commies).map(key =>
            totalValue(commies[key as CommodityKind].evaluation)
          )
        ),
      'desc'
    ),
    5
  )

const CommodityEvaluation: React.StatelessComponent<{
  evaluation: Evaluation3
}> = ({ evaluation }) => (
  <StyledEvaluation>
    value: {totalValue(evaluation)}, rate: {totalRate(evaluation)}
  </StyledEvaluation>
)

const PositionView: React.StatelessComponent<{ position: Position }> = ({
  position
}) => (
  <div>
    position: {position.x},{position.y}
  </div>
)

const CommodityView = ({ commodity }: { commodity: Commodity<any> }) => (
  <StyledCommodityView>
    <StyledKind children={`(${commodity.kind})`} />
    <PositionView position={commodity.position} />
    <CommodityEvaluation evaluation={commodity.evaluation} />
  </StyledCommodityView>
)

interface Props {
  commodities: Commodities[]
  purchaseCommodity: (
    kind: CommodityKind,
    payload: { quantity: number; position: Position }
  ) => void
}

class Purchaser extends React.Component<Props> {
  render() {
    const { commodities, purchaseCommodity } = this.props
    return (
      <div>
        {topFive(commodities).map(commies => (
          <div>
            {Object.keys(commies).map(key => (
              <BuyWrapper>
                <button
                  onClick={() =>
                    purchaseCommodity(key as CommodityKind, {
                      quantity: 1,
                      position: commies[key as CommodityKind].position
                    })
                  }
                  children="Purchase!"
                />
                <CommodityView commodity={commies[key as CommodityKind]} />
              </BuyWrapper>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Purchaser
