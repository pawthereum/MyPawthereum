import { ChainId, Currency, CurrencyAmount } from '@uniswap/sdk-core'
import React, { useContext } from 'react'
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
import Rank from '../../components/Rank'
import { PAWTH } from '../../constants'
import { useCurrencyBalance } from '../../state/wallet/hooks'

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
            Waiting For Confirmation
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
  const pawth = chainId ? PAWTH[chainId] : undefined
  const pawthBalance: CurrencyAmount | undefined = useCurrencyBalance(account ?? undefined, pawth)

  // url encode the text for a tweet
  const tweetTemplate = "I%20just%20contributed%20to%20helping%20animal%20shelters%20around%20the%20world%20by%20purchasing%20Pawthereum!%20%23followthepawth%20%F0%9F%90%BE%20%40Pawthereum"

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
            0.5% of your transaction will be used to help animal charities across the globe!
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
          <AutoColumn gap="12px" justify={'center'}>
            <Rank balance={pawthBalance} refresh={true} showHelp={false} />
          </AutoColumn>
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
            We are aware of an issue on PawSwap where some swaps fail because they cannot estimate gas. 
            We are looking into it. 
            These transactions normally succeed on Uniswap -- you can try there until we deploy a fix. 
            Any approval transactions you made will not need to be made again if you attempt to swap on Uniswap. 
            <hr/>
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
