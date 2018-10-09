import styled from 'styled-components'

interface StyledGridProps {
  columns: number
}

export const StyledGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  max-width: 12em;
  grid-template-columns: repeat(
    ${(props: StyledGridProps) => props.columns},
    1fr
  );
`

const squareLength = '6em'

export const GridSquare = styled.div`
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

export const PlayerIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: ${squareLength};
  height: ${squareLength};
`

export const GridWrapper = styled.div``

export const StyledSpotOverlay = styled.div`
  position: absolute;
`

export const StyledEvaluation = styled.div`
  display: flex;
  margin: 4px;
`

export const StyledCommodityView = styled.div`
  display: flex;
  align-items: center;
  margin: 4px;
`

export const StyledKind = styled.div`
  margin: 2px;
`

export const BuyWrapper = styled.div`
  display: flex;
`
