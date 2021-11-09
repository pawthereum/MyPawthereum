import React, { useState, useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'

import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CustomLightSpinner } from '../../theme'
import { AlertTriangle, CheckCircle, X } from 'react-feather'
import { ButtonPrimary } from '../Button'
import Circle from '../../assets/images/blue-loader.svg'
import { useVoteCallback, useUserVotes } from '../../state/governance/hooks'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import { TokenAmount } from '@uniswap/sdk-core'
import Confetti from '../Confetti'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

interface VoteModalProps {
  isOpen: boolean
  onDismiss: () => void
  support: boolean // if user is for or against proposal
  proposal: Record<any, any> // the proposal that is being voted on
  proposalId: string | undefined // id for the proposal to vote on
  voteSelection: number // the choice that the user is making
  snapshot: Record<any, any> // instance of snapshot
}

export default function VoteModal({ isOpen, onDismiss, proposalId, support, proposal, voteSelection, snapshot }: VoteModalProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const {
    voteCallback,
  }: {
    voteCallback: (proposalId: string | undefined, support: boolean) => Promise<string> | undefined
  } = useVoteCallback()
  const availableVotes: TokenAmount | undefined = useUserVotes()
  const choiceLabel = proposal && proposal.choices ? proposal.choices[voteSelection] : ''

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [voteError, setVoteError] = useState({ error: false, error_description: undefined })

  // get theme for colors
  const theme = useContext(ThemeContext)

  // wrapper to reset state on modal close
  function wrappedOndismiss() {
    setHash(undefined)
    setVoteError({ error: false, error_description: undefined })
    setAttempting(false)
    onDismiss()
  }

  async function onVote() {
    setAttempting(true)

    // if callback not returned properly ignore
    if (!voteCallback) return

    const snapshotHash = await snapshot.vote(
      library,
      account,
      proposal.space.id,
      proposal.id,
      voteSelection + 1,
      {}
    )

    if (snapshotHash) {
      if (snapshotHash.error) {
        setVoteError(snapshotHash)
      } else {
        setHash(snapshotHash)
      }
    }
  }

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg" justify="center">
            <RowBetween>
              <TYPE.mediumHeader fontWeight={500}>
                {`Vote ${choiceLabel}`}
              </TYPE.mediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOndismiss} />
            </RowBetween>
            <TYPE.largeHeader>
              You can only vote once and you cannot change your vote once submitted
            </TYPE.largeHeader>
            <ButtonPrimary onClick={onVote}>
              <TYPE.mediumHeader color="white">
                {`Vote ${choiceLabel}`}
              </TYPE.mediumHeader>
            </ButtonPrimary>
            <TYPE.body style={{ textAlign: 'center' }}>
              <small>
                Voting does not cost gas but you will need to sign with your wallet to prove who you are
              </small>
            </TYPE.body>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && !voteError.error ? (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Submitting Vote</TYPE.largeHeader>
            </AutoColumn>
            <TYPE.subHeader>Confirm this transaction in your wallet</TYPE.subHeader>
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      ) : ''}
      {voteError?.error && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <AlertTriangle strokeWidth={0.5} size={90} color={theme.error} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Voting Problem</TYPE.largeHeader>
            </AutoColumn>
            {chainId && (
              <TYPE.subHeader>
                { capitalizeFirstLetter(voteError.error_description) }
              </TYPE.subHeader>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
      {hash && (
        <ConfirmOrLoadingWrapper>
          <Confetti start={Boolean(true)} />
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <CheckCircle strokeWidth={0.5} size={90} color={theme.primary1} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Vote Submitted</TYPE.largeHeader>
            </AutoColumn>
            {chainId && (
              <TYPE.subHeader>
                Thank you for making your voice heard! Roar!
              </TYPE.subHeader>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}
