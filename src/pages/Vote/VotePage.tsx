import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { ExternalLink, StyledInternalLink, TYPE } from '../../theme'
import { RowBetween, RowFixed } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
import { ArrowLeft } from 'react-feather'
import { ButtonPrimary } from '../../components/Button'
import { ProposalStatus } from './styled'
import {
  ProposalData,
  ProposalState,
  useProposalData,
  useUserDelegatee,
  useUserVotesAsOfBlock,
} from '../../state/governance/hooks'
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import VoteModal from '../../components/vote/VoteModal'
import { TokenAmount } from '@uniswap/sdk-core'
import { JSBI } from '@uniswap/v2-sdk'
import { useActiveWeb3React } from '../../hooks'
import { AVERAGE_BLOCK_TIME_IN_SECS, COMMON_CONTRACT_NAMES, UNI, ZERO_ADDRESS } from '../../constants'
import { getEtherscanLink, isAddress } from '../../utils'
import { ApplicationModal } from '../../state/application/actions'
import { useBlockNumber, useModalOpen, useToggleDelegateModal, useToggleVoteModal } from '../../state/application/hooks'
import DelegateModal from '../../components/vote/DelegateModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { BigNumber } from 'ethers'
import { GreyCard } from '../../components/Card'
import Client from '../../plugins/snapshot-labs/snapshot.js/src/client';
const hubUrl: any = 'https://hub.snapshot.org';
const snapshot = new Client(hubUrl);

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const ProposalInfo = styled(AutoColumn)`
  border: 1px solid ${({ theme }) => theme.bg4};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 640px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1}
`
const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
  }
`
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

const StyledDataCard = styled(DataCard)`
  width: 100%;
  background: none;
  background-color: ${({ theme }) => theme.bg1};
  height: fit-content;
  z-index: 2;
  border: 1px solid ${({ theme }) => theme.bg4};
`

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
`

const Progress = styled.div<{ status: 'for' | 'against'; percentageString?: string }>`
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme, status }) => (status === 'for' ? theme.green1 : theme.red1)};
  width: ${({ percentageString }) => percentageString};
`

const MarkDownWrapper = styled.div`
  max-width: 640px;
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    align-items: flex-start;
    flex-direction: column;
  `};
`

const ProposerAddressLink = styled(ExternalLink)`
  word-break: break-all;
`

export default function VotePage({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) {
  const [snapshotProposalData, setSnapshotProposalData] = useState({
    title: '',
    body: '',
    end: 0,
    author: ''
  })
  const [snapshotProposalVotes, setSnapshotProposalVotes] = useState([{
    id: '',
    voter: '',
    proposal: { id: '' },
    choice: 0,
    space: { id: '' }
  }])

  const [snapshotProposalProgress, setSnaspshotProposalProgress] = useState({})
  const [snapshotProposalProgressArray, setSnaspshotProposalProgressArray] = useState([{ choice: '', votes: 0 }])


  const { chainId, account } = useActiveWeb3React()

  async function initPage () {
    console.log('id', id)
    const proposalData = await snapshot.getProposal(id)
    setSnapshotProposalData(proposalData)
    console.log('proposalData', proposalData)

    const proposalVotes = await snapshot.getProposalVotes(id)
    setSnapshotProposalVotes(proposalVotes)

    const proposalProgress: Record<string, number> = { choice: 0 }
    delete proposalProgress.choice
    for (const choice in proposalData.choices) {
      proposalProgress[proposalData.choices[choice]] = 0
    }
    console.log('proposal votes', proposalVotes)
    for (const vote of proposalVotes) {
      const choice = proposalData.choices[vote?.choice - 1]
      proposalProgress[choice] += 1
    }
    let proposalProgressArray = []
    for (const [choice, votes] of Object.entries(proposalProgress)) {
      proposalProgressArray.push({ choice, votes })
    }
    proposalProgressArray = proposalProgressArray.map((p: any) => {
      p.percentage = (p.votes / proposalVotes.length * 100).toFixed(2) + '%'
      return p
    })
    console.log(proposalProgressArray)
    setSnaspshotProposalProgress(proposalProgress)
    setSnaspshotProposalProgressArray(proposalProgressArray)
    console.log('proposalProgress', proposalProgress)
  }

  // get data for this specific proposal
  const proposalData: ProposalData | undefined = useProposalData(id)

  // update support based on button interactions
  const [support, setSupport] = useState<boolean>(true)

  // modal for casting votes
  const showVoteModal = useModalOpen(ApplicationModal.VOTE)
  const toggleVoteModal = useToggleVoteModal()

  // toggle for showing delegation modal
  const showDelegateModal = useModalOpen(ApplicationModal.DELEGATE)
  const toggleDelegateModal = useToggleDelegateModal()

  // get and format date from data
  // const endDate: DateTime | undefined = DateTime.fromSeconds(1646221701)
  const endDate: DateTime | undefined = DateTime.fromSeconds(snapshotProposalData?.end)
  const now: DateTime = DateTime.local()

  // get total votes and format percentages for UI
  const totalVotes: number | undefined = proposalData ? proposalData.forCount + proposalData.againstCount : undefined
  const forPercentage: string =
    proposalData && totalVotes ? ((proposalData.forCount * 100) / totalVotes).toFixed(0) + '%' : '0%'
  const againstPercentage: string =
    proposalData && totalVotes ? ((proposalData.againstCount * 100) / totalVotes).toFixed(0) + '%' : '0%'

  // only count available votes as of the proposal start block
  const availableVotes: TokenAmount | undefined = useUserVotesAsOfBlock(proposalData?.startBlock ?? undefined)

  // only show voting if user has > 0 votes at proposal start block and proposal is active,
  const showVotingButtons =
    availableVotes &&
    JSBI.greaterThan(availableVotes.raw, JSBI.BigInt(0)) &&
    proposalData &&
    proposalData.status === ProposalState.Active

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, chainId ? UNI[chainId] : undefined)
  const userDelegatee: string | undefined = useUserDelegatee()

  // in blurb link to home page if they are able to unlock
  const showLinkForUnlock = Boolean(
    uniBalance && JSBI.notEqual(uniBalance.raw, JSBI.BigInt(0)) && userDelegatee === ZERO_ADDRESS
  )

  // show links in propsoal details if content is an address
  // if content is contract with common name, replace address with common name
  const linkIfAddress = (content: string) => {
    if (isAddress(content) && chainId) {
      const commonName = COMMON_CONTRACT_NAMES[content] ?? content
      return <ExternalLink href={getEtherscanLink(chainId, content, 'address')}>{commonName}</ExternalLink>
    }
    return <span>{content}</span>
  }

  useEffect(() => {
    initPage()
  }, [account])

  return (
    <PageWrapper gap="lg" justify="center">
      <VoteModal isOpen={showVoteModal} onDismiss={toggleVoteModal} proposalId={proposalData?.id} support={support} />
      <DelegateModal isOpen={showDelegateModal} onDismiss={toggleDelegateModal} title="Unlock Votes" />
      <ProposalInfo gap="lg" justify="start">
        <RowBetween style={{ width: '100%' }}>
          <ArrowWrapper to="/vote">
            <ArrowLeft size={20} /> All Proposals
          </ArrowWrapper>
          {proposalData && (
            <ProposalStatus status={proposalData.status}>{ProposalState[proposalData.status]}</ProposalStatus>
          )}
        </RowBetween>
        <AutoColumn gap="10px" style={{ width: '100%' }}>
          <TYPE.largeHeader style={{ marginBottom: '.5rem' }}>{snapshotProposalData?.title}</TYPE.largeHeader>
          <RowBetween>
            <TYPE.main>
              {endDate && endDate < now
                ? 'Voting ended ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
                : snapshotProposalData
                ? 'Voting ends approximately ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
                : ''}
            </TYPE.main>
          </RowBetween>
          {proposalData && proposalData.status === ProposalState.Active && !showVotingButtons && (
            <GreyCard>
              <TYPE.black>
                Only UNI votes that were self delegated or delegated to another address before block{' '}
                {proposalData.startBlock} are eligible for voting.{' '}
                {showLinkForUnlock && (
                  <span>
                    <StyledInternalLink to="/vote">Unlock voting</StyledInternalLink> to prepare for the next proposal.
                  </span>
                )}
              </TYPE.black>
            </GreyCard>
          )}
        </AutoColumn>
        <CardWrapper>
          {snapshotProposalProgressArray?.map((p: any, i) => {
            return (
              <AutoColumn key={i}>
              {showVotingButtons || true ? (
                <RowFixed style={{ width: '100%', paddingBottom: '12px' }}>
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    onClick={() => {
                      setSupport(true)
                      toggleVoteModal()
                    }}
                  >
                    Vote {p.choice}
                  </ButtonPrimary>
                </RowFixed>
              ) : (
                ''
              )}
                <StyledDataCard>
                  <CardSection>
                    <AutoColumn gap="md">
                      <WrapSmall>
                        <TYPE.black fontWeight={600}>{p.choice}</TYPE.black>
                        <TYPE.black fontWeight={600}>
                          {' '}
                          {p?.votes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </TYPE.black>
                      </WrapSmall>
                    </AutoColumn>
                    <ProgressWrapper>
                      <Progress status={'for'} percentageString={p.percentage} />
                    </ProgressWrapper>
                  </CardSection>
                </StyledDataCard>
              </AutoColumn>
            )
          })}
        </CardWrapper>
        <AutoColumn gap="md">
          <TYPE.mediumHeader fontWeight={600}>Description</TYPE.mediumHeader>
          <MarkDownWrapper>
            <ReactMarkdown source={snapshotProposalData?.body} />
          </MarkDownWrapper>
        </AutoColumn>
        <AutoColumn gap="md">
          <TYPE.mediumHeader fontWeight={600}>Proposer</TYPE.mediumHeader>
          <ProposerAddressLink
            href={snapshotProposalData?.author && chainId ? getEtherscanLink(chainId, snapshotProposalData?.author, 'address') : ''}
          >
            <ReactMarkdown source={snapshotProposalData?.author} />
          </ProposerAddressLink>
        </AutoColumn>
      </ProposalInfo>
    </PageWrapper>
  )
}
