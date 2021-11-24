import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import SettingsTab from '../Settings'
import { HelpCircle } from 'react-feather'
import ReactGA from 'react-ga'
// import Toggle from '../Toggle'
import DexToggle from 'components/DexToggle'
import { RowBetween, RowFixed } from '../Row'
import { ExternalLink, TYPE } from '../../theme'
import { useUserDexSwapSelection } from 'state/user/hooks'

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
  const [userDexSwapSelection, setUserDexSwapSelection] = useUserDexSwapSelection()
  let isUniswap = userDexSwapSelection == 'Uniswap V2'

  const handleDexChange = useCallback(() => {
    console.log('isUniswap', isUniswap)
    console.log('handlign')
    setUserDexSwapSelection(!isUniswap ? 'Uniswap V2' : 'ShibaSwap')
  }, [isUniswap])

  useEffect(() => {
    console.log('new value', userDexSwapSelection)
    isUniswap = userDexSwapSelection == 'Uniswap V2'
  }, [userDexSwapSelection])
  console.log('is Uniswap', isUniswap)
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontWeight={500} fontSize={16} style={{ marginRight: '8px' }}>
            Swap{' '}
          </TYPE.black>
        </RowFixed>
        <RowFixed>
          <DexToggle
            dexA={'Uniswap V2'}
            dexB={'ShibaSwap'}
            handleDexToggle={handleDexChange}
          />
          {/* <Toggle
            id="toggle-dex-selection"
            isActive={isUniswap}
            toggle={() => {
              ReactGA.event({
                category: 'DexSelection',
                action: isUniswap ? 'Uniswap V2' : 'ShibaSwap',
              })
              setUserDexSwapSelection(!isUniswap ? 'Uniswap V2' : 'ShibaSwap')
            }}
          /> */}
          {/* <TradeInfo disabled={!trade} trade={trade} /> */}
          <div style={{ width: '8px' }}></div>
          <SettingsTab />
          {/* <ExternalLink href={'https://pawthereum.com/#howtobuy'} style={{ textDecoration: 'none', marginLeft: '8px' }}>
            <StyledMenuTitleWrapper>
              <HelpCircle /><StyledMenuTitle>Help</StyledMenuTitle>
            </StyledMenuTitleWrapper>
          </ExternalLink> */}
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
