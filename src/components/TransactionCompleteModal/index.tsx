import { ChainId, Currency } from '@uniswap/sdk-core'
import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../Modal'
import { ExternalLink } from '../../theme'
import { Text } from 'rebass'
import { CloseIcon, CustomLightSpinner } from '../../theme/components'
import { RowBetween, RowFixed } from '../Row'
import { AlertTriangle, ArrowUpCircle, CheckCircle, Twitter } from 'react-feather'
import { ButtonPrimary, ButtonLight } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Circle from '../../assets/images/blue-loader.svg'
import MetaMaskLogo from '../../assets/images/metamask.png'
import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask'
import Confetti from '../Confetti'

// Ranks
import strayCat from '../../assets/images/strayCat.png'
import kitten from '../../assets/images/kitten.png'
import dwarfCat from '../../assets/images/dwarfCat.png'
import maineCoon from '../../assets/images/maineCoon.png'
import abbysinian from '../../assets/images/abbysinian.png'
import siamese from '../../assets/images/siamese.png'
import sandCat from '../../assets/images/sandCat.png'
import serval from '../../assets/images/serval.png'
import puma from '../../assets/images/puma.png'
import jaguar from '../../assets/images/jaguar.png'
import blackPanther from '../../assets/images/blackPanther.png'
import tiger from '../../assets/images/tiger.png'
import lion from '../../assets/images/lion.png'
import crown from '../../assets/images/crown.png'
import sadCat from '../../assets/images/sadCat.png'

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
`
const Section = styled(AutoColumn)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '0' : '0')};
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '60px 0;')};
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`
const StyledHorizontalRule = styled.div`
  display: inline;
  width: 100%;
`

function formatPrice(price: number) {
  if (price > 0) {
    const priceString = (price / 1000000000).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })

    return priceString
  }

  return price.toString()
}

const pawthContractAddress = '0xaecc217a749c2405b5ebc9857a16d58bdc1c367f'
const ethescanApiKey = 'SZYGYXBA7K6ECH7DHB3QX2MR7GJZQK2M8P'

async function getPawthRanks(balance: number) {
  //TODO: GET RID OF THIS FAKE BALANCE STUFF WHEN GOING LIVE
  // balance = (balance + 1000000000000001) / 1000000000
  balance /= 1000000000

  const ranks = [
    { name: 'You are the bottom rank', img: sadCat, threshold: 0 },
    { name: 'Stray Cat', img: strayCat, threshold: 1000 },
    { name: 'Kitten', img: kitten, threshold: 5000 },
    { name: 'Dwarf Cat', img: dwarfCat, threshold: 10000 },
    { name: 'Maine Coon', img: maineCoon, threshold: 25000 },
    { name: 'Abbysinian', img: abbysinian, threshold: 50000 },
    { name: 'Siamese', img: siamese, threshold: 100000 },
    { name: 'Sand Cat', img: sandCat, threshold: 250000 },
    { name: 'Serval', img: serval, threshold: 500000 },
    { name: 'Puma', img: puma, threshold: 1000000 },
    { name: 'Jaguar', img: jaguar, threshold: 2500000 },
    { name: 'Black Panther', img: blackPanther, threshold: 5000000 },
    { name: 'Tiger', img: tiger, threshold: 10000000 },
    { name: 'Lion', img: lion, threshold: 10000000 },
    { name: 'You achieved the top rank!', img: crown, threshold: 10000000 }
  ]

  let rankIndex = ranks.findIndex((r: any) => {
    return balance <= r.threshold
  })

  let distanceToNextRank, distanceToPreviousRank

  if (rankIndex === -1) {
    rankIndex = ranks.length - 2
    distanceToNextRank = 'The animals thank you'
  }

  if (rankIndex === 0) {
    distanceToPreviousRank = 'You are the lowest rank'
  }

  const previousRank = ranks[rankIndex - 1]
  const rank = ranks[rankIndex]
  const nextRank = ranks[rankIndex + 1]

  if (!distanceToNextRank) {
    distanceToNextRank = '+' + formatPrice((rank.threshold - balance) * 1000000000)
  }

  if (!distanceToPreviousRank) {
    const d = '-' + formatPrice((balance - previousRank.threshold + 1) * 1000000000)
    distanceToPreviousRank = d === '-1' ? 'Go get some $PAWTH!' : d
  }

  return { previousRank, rank, nextRank, distanceToPreviousRank, distanceToNextRank }
}

async function getTokenBalance(account: string, tokenAddr: string, tokenDecimals: number) {
  const balance_api = new URL('https://api.etherscan.io/api')

  balance_api.searchParams.append('module', 'account')
  balance_api.searchParams.append('action', 'tokenbalance')
  balance_api.searchParams.append('contractaddress', tokenAddr)
  balance_api.searchParams.append('address', account)
  balance_api.searchParams.append('tag', 'latest')
  balance_api.searchParams.append('apikey', ethescanApiKey)

  const balanceReq = await fetch(balance_api.href)
  const balanceRes = await balanceReq.json()
  const balance = parseFloat(balanceRes.result)

  const formattedBalance = balance / 10**tokenDecimals
  return { balance, formattedBalance }
}

export function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  pendingText: string
  inline?: boolean // not in modal
}) {
  return (
    <Wrapper>
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} textAlign="center">
            Waiting For Confirmation - Hello there!
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={600} fontSize={14} color="" textAlign="center">
              {pendingText}
            </Text>
          </AutoColumn>
          <Text fontSize={12} color="#565A69" textAlign="center" marginBottom={12}>
            Confirm this transaction in your wallet
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}) {
  const theme = useContext(ThemeContext)

  const { library } = useActiveWeb3React()

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd)

  const { account } = useActiveWeb3React()

  useEffect(() => {
    getWallet()
  }, [account])
  
  const [pawthRank, setPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [distanceToNextRank, setDistanceToNextRank] = useState('-')
  const [nextPawthRank, setNextPawthRank] = useState({ name: '', img: '', threshold: 0 })
  
  // url encode the text for a tweet
  const tweetTemplate = "I%20just%20contributed%20to%20helping%20animal%20shelters%20around%20the%20world%20by%20purchasing%20Pawthereum!%20%23followthepawth%20%F0%9F%90%BE%20%40Pawthereum"

  async function getWallet() {
    console.log('getting acct')
    if (account) {
      console.log('got account', account)
      const pawthBalance = await getTokenBalance(account, pawthContractAddress, 9)
      const ranks = await getPawthRanks(pawthBalance.balance)
      console.log('ranks', ranks)
      setPawthRank(ranks.rank)
      setNextPawthRank(ranks.nextRank)
      setDistanceToNextRank(ranks.distanceToNextRank)
    }
  }
  return (
    <Wrapper>
      <Section inline={inline}>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <AutoColumn gap="12px" justify={'center'}>
          <Confetti start={Boolean(true)} />
          <Text fontWeight={500} fontSize={20} textAlign="center">
            You just saved animals!
          </Text>
          <Text fontWeight={500} fontSize={16} textAlign="center">
            2% of your transaction will be used to help animal charities across the globe!
          </Text>
          <ExternalLink href={'https://twitter.com/intent/tweet?text=' + tweetTemplate}>
            <Text fontWeight={500} fontSize={14} color={theme.primary1} style={{ display: 'flex', alignContent: 'center' }}>
              <Twitter size={14} style={{ marginRight: '5px' }}/> Tweet about it and tell the world!
            </Text>
          </ExternalLink>
          {/* <ExternalLink href={'https://twitter.com/intent/tweet?text=' + tweetTemplate} style={{ textDecoration: 'none' }}>
            <Text fontWeight={500} fontSize={14} color={theme.primary1} style={{ display: 'flex', alignContent: 'center' }}>
              <Twitter size={14} style={{ marginRight: '5px' }}/> Tweet about it and tell the world!
            </Text>
          </ExternalLink> */}
          <StyledHorizontalRule>
            <hr/>
          </StyledHorizontalRule>
          { pawthRank ? (
            <AutoColumn gap="12px" justify={'center'}>
              <Text fontWeight={500} fontSize={18} textAlign="center">
                Your PAWTHER Rank is now: { pawthRank ? pawthRank.name : '...'}
              </Text>
              <img src={pawthRank.img} alt="Logo" style={{ width: '100%', maxWidth: '150px', height: 'auto' }} />
              <Text fontWeight={500} fontSize={16} textAlign="center">
                You are {distanceToNextRank} PAWTH away from becoming a {nextPawthRank.name}!
              </Text>
            </AutoColumn>
          ) : '' }
          {chainId && hash && (
            <AutoColumn gap="12px" justify={'center'}>
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
                <Text fontWeight={500} fontSize={14} textAlign="center">
                  View your transaction on Etherscan
                </Text>
              </ExternalLink>
            </AutoColumn>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" onClick={addToken}>
              {!success ? (
                <RowFixed>
                  Add {currencyToAdd.symbol} to Metamask <StyledLogo src={MetaMaskLogo} />
                </RowFixed>
              ) : (
                <RowFixed>
                  Added {currencyToAdd.symbol}{' '}
                  <CheckCircle size={'16px'} stroke={theme.green1} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
            <Text fontWeight={500} fontSize={20}>
              {inline ? 'Return' : 'Close'}
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent?: () => React.ReactNode | undefined
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      {bottomContent && <BottomSection gap="12px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useContext(ThemeContext)
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            Error
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}
