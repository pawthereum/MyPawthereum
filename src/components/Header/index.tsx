import { ChainId, TokenAmount } from '@uniswap/sdk-core'
import React, { useEffect, useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { Moon, Sun } from 'react-feather'
import styled, { keyframes } from 'styled-components'

import Logo from '../../assets/images/myPawthLogo.png'
import LogoDark from '../../assets/images/myPawthLogo.png'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { TYPE, ExternalLink } from '../../theme'

import { YellowCard } from '../Card'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { PAWTH } from '../../constants'
import UniBalanceContent from './UniBalanceContent'
import Client from '../../plugins/snapshot-labs/snapshot.js/src/client';
const hubUrl: any = 'https://hub.snapshot.org';
const snapshot = new Client(hubUrl);

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  /* border-bottom: 1px solid ${({ theme }) => theme.bg2}; */
  padding: 1rem;
  z-index: 21;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 40px 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg2)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 8px 12px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName,
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg2};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuVotingOpportunity = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const pulseBoxShadow = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(255, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 7px rgba(255, 0, 0, 0);
  }
`

const StyledMenuVotingDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 3px;
  box-shadow: 0px 0px 1px 1px #0000001a;
  background: ${({ theme }) => theme.primary1};
  animation: ${pulseBoxShadow} 2s infinite;
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const pawth = chainId ? PAWTH[chainId] : undefined
  const pawthBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, pawth)

  const [showVotingOpportunityDot, setShowVotingOpportunityDot] = useState(false)

  async function checkForVotingOpportunities () {
    // dont bother loading snapshot without an account or balance
    if (!account || !pawthBalance || pawthBalance?.toFixed(2) === '0.00') {
      return setShowVotingOpportunityDot(false)
    }
    const pawthSnapshotProposals = await snapshot.getProposals('pawthereum.eth')
    const activeProposals = pawthSnapshotProposals.filter((p: any) => p.state === 'active')
    for (const p of activeProposals) {
      const votes = await snapshot.getProposalVotes(p.id)
      const userVoted = votes.find((v: any) => v.voter.toLowerCase() === account?.toLowerCase())
      if (!userVoted) {
        return setShowVotingOpportunityDot(true)
      } else {
        return setShowVotingOpportunityDot(false)
      }
    }
    return false // be careful if this return causes a race condition with the forEach
  }

  useEffect(() => {
    checkForVotingOpportunities()
  }, [pawthBalance, account])

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href="https://pawthereum.com">
          <UniIcon>
            <img width={'32px'} src={darkMode ? LogoDark : Logo} alt="logo" />
          </UniIcon>
        </Title>
        {/* <TYPE.label>
          BETA
        </TYPE.label> */}
      </HeaderRow>
      <HeaderLinks>
        <StyledNavLink 
          id={`stats-nav-link`} 
          to={'/stats'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.endsWith('/')
          }
        >
          {t('MyPawth')}
        </StyledNavLink>
        <StyledNavLink 
          id={`swap-nav-link`} 
          to={`/swap?use=V2&inputCurrency=ETH&outputCurrency=${pawth?.address || '0xaecc217a749c2405b5ebc9857a16d58bdc1c367f'}`}
        >
          {t('PawSwap')}
        </StyledNavLink>
        {/* <StyledNavLink
          id={`pool-nav-link`}
          to={'/pool/v2'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/increase') ||
            pathname.startsWith('/find')
          }
        >
          {t('pool')}
        </StyledNavLink> */}
        <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
          <StyledMenuVotingOpportunity>
            {showVotingOpportunityDot ? (
              <StyledMenuVotingDot></StyledMenuVotingDot>
            ) : ''}
            <div>Vote</div>
          </StyledMenuVotingOpportunity>
        </StyledNavLink>
        {/* 
        <StyledExternalLink id={`stake-nav-link`} href={'https://info.uniswap.org'}>
          Charts <span style={{ fontSize: '11px', textDecoration: 'none !important' }}>↗</span>
        </StyledExternalLink> */}
        {/* <StyledNavLink 
          id={`feedback-nav-link`} 
          to={'/feedback'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/feedback')
          }
        >
          {t('Feedback')}
        </StyledNavLink> */}
      </HeaderLinks>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} ETH
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
