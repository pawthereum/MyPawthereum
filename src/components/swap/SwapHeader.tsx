import React from 'react'
import styled from 'styled-components'
import SettingsTab from '../Settings'
import { HelpCircle } from 'react-feather'

import { RowBetween, RowFixed } from '../Row'
import { ExternalLink, TYPE } from '../../theme'

const StyledSwapHeader = styled.div`
  padding: 1rem 1.25rem 0.5rem 1.25rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

const StyledMenuTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text2};
  
  :hover {
    opacity: 0.7;
    cursor: pointer;
  }
`

const StyledMenuTitle = styled.div`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontWeight={500} fontSize={16} style={{ marginRight: '8px' }}>
            Swap{' '}
          </TYPE.black>
        </RowFixed>
        <RowFixed>
          <ExternalLink href={'https://pawthereum.com/#howtobuy'} style={{ textDecoration: 'none' }}>
            <StyledMenuTitleWrapper>
              <HelpCircle /><StyledMenuTitle>How to Buy</StyledMenuTitle>
            </StyledMenuTitleWrapper>
          </ExternalLink>
          {/* <TradeInfo disabled={!trade} trade={trade} /> */}
          <div style={{ width: '8px' }}></div>
          <SettingsTab />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
