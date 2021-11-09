import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { ExternalLink, StyledInternalLink, TYPE } from '../../theme'
import { RowBetween, RowFixed } from '../../components/Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { VoteCard } from '../Vote'
import { ArrowLeft, ExternalLink as ExternalLinkIcon } from 'react-feather'
import { ButtonPrimary } from '../../components/Button'
import { SnapshotProposalStatus } from './styled'
import {
  ProposalData,
  ProposalState,
  SnapshotProposalState,
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
import { PAWTH, COMMON_CONTRACT_NAMES, UNI, ZERO_ADDRESS } from '../../constants'
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
const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`
const ProposalInfo = styled(AutoColumn)`
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

const SnapshotLink = styled(ExternalLink)`
  word-break: break-all;
  display: flex;
  justify-content: end;
  width: 100%;
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
    author: '',
    state: '',
    link: '',
    strategies: [{ name: '' }],
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
  const [canVoteOnProposal, setCanVoteOnProposal] = useState(false)
  const [usersSubmittedVote, setUsersSubmittedVote] = useState('-')

  const { chainId, account } = useActiveWeb3React()

  const pawth = PAWTH
  const pawthBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, pawth)

  async function initPage () {
    const proposalData = await snapshot.getProposal(id)
    setSnapshotProposalData(proposalData)

    const proposalVotes = await snapshot.getProposalVotes(id)
    setSnapshotProposalVotes(proposalVotes)

    const voterAddresses = proposalVotes.map((v: any) => v.voter)

    const proposalVoteScores = await snapshot.getProposalVoteScores(
      proposalData.space.id,
      proposalData.strategies,
      proposalData.network,
      voterAddresses,
      parseInt(proposalData.snapshot),
    )

    // sum all of the vote scores (which is essentially balances at voting time)
    let totalTokensInVote = 0
    for (const balance in proposalVoteScores) {
      totalTokensInVote += proposalVoteScores[balance]
    }

    const proposalProgress: Record<string, number> = { choice: 0 }
    delete proposalProgress.choice
    for (const choice in proposalData.choices) {
      proposalProgress[proposalData.choices[choice]] = 0
    }
    for (const vote of proposalVotes) {
      const choice = proposalData.choices[vote?.choice - 1]
      proposalProgress[choice] += proposalVoteScores[vote.voter]
    }
    let proposalProgressArray = []
    for (const [choice, votes] of Object.entries(proposalProgress)) {
      proposalProgressArray.push({ choice, votes })
    }

    const proposalStrategy = proposalData?.strategies[0]?.name
    proposalProgressArray = proposalProgressArray.map((p: any) => {
      const votingPowerType = proposalStrategy === 'erc20-balance-of' ? totalTokensInVote : p.votes.length
      if (p.votes === 0) {
        p.percentage = '0%'
        return p
      }
      p.percentage = (p.votes / votingPowerType * 100).toFixed(2) + '%'
      return p
    })
    setSnaspshotProposalProgress(proposalProgress)
    setSnaspshotProposalProgressArray(proposalProgressArray)

    const hasVoted = proposalVotes.find((v: any) => v.voter === account) ? true : false

    if (hasVoted) {
      const usersVote = proposalVotes.find((v: any) => v.voter === account)
      setUsersSubmittedVote(proposalData.choices[usersVote.choice - 1])
    }
    setCanVoteOnProposal(pawthBalance !== undefined && pawthBalance?.toFixed(2) !== '0.00' && proposalData.state === 'active' && !hasVoted)
  }

  // get data for this specific proposal
  const proposalData: ProposalData | undefined = useProposalData(id)

  // update support based on button interactions
  const [support, setSupport] = useState<boolean>(true)
  const [voteSelection, setVoteSelection] = useState<number>(0)

  // modal for casting votes
  const showVoteModal = useModalOpen(ApplicationModal.VOTE)
  const toggleVoteModal = useToggleVoteModal()
  const toggleVoteModalWithReload = () => {
    initPage()
    toggleVoteModal()
  }

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

  // only show voting if user can vote on the proposal
  const showVotingButtons = canVoteOnProposal

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
  
  console.log('proposal', snapshotProposalData)

  return (
    <PageWrapper gap="lg" justify="center">
      <VoteModal 
        isOpen={showVoteModal} 
        onDismiss={toggleVoteModalWithReload}
        proposalId={proposalData?.id}
        voteSelection={voteSelection}
        proposal={snapshotProposalData}
        support={support}
        snapshot={snapshot}
      />
      <DelegateModal isOpen={showDelegateModal} onDismiss={toggleDelegateModal} title="Unlock Votes" />
      <TopSection gap="md">
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Pawthereum Voting</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Pawthereum uses Snapshot for voting. 
                  Snapshot is an official off chain voting protocol used for both fun and serious community votes. 
                  Voting here will never cost gas. You will need to sign with your wallet to confirm your vote. 
                  { snapshotProposalData?.strategies[0]?.name === 'erc20-balance-of'
                    ? 
                      ' Your total $pawth equals your total amount of votes.' 
                    : ''
                  }
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      </TopSection>
      <ProposalInfo gap="lg" justify="start">
        <RowBetween style={{ width: '100%' }}>
          <ArrowWrapper to="/vote">
            <ArrowLeft size={20} /> All Proposals
          </ArrowWrapper>
          {snapshotProposalData && (
            <SnapshotProposalStatus state={snapshotProposalData.state}>{snapshotProposalData.state}</SnapshotProposalStatus>
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
              {showVotingButtons ? (
                <RowFixed style={{ width: '100%', paddingBottom: '12px' }}>
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    onClick={() => {
                      setSupport(true)
                      setVoteSelection(i)
                      toggleVoteModal()
                    }}
                  >
                    Vote {p.choice}
                  </ButtonPrimary>
                </RowFixed>
              ) : (
                ''
              )}
                <StyledDataCard style={ usersSubmittedVote == p.choice ? { 'border': '1px solid #ff65b3' } : {} }>
                  <CardSection>
                    <AutoColumn gap="md">
                      <WrapSmall>
                        <TYPE.black fontWeight={600}>{p.choice}</TYPE.black>
                        <TYPE.black fontWeight={600}>
                          {' '}
                          {p?.percentage}
                          {/* ?.toLocaleString(undefined, { maximumFractionDigits: 0 })} */}
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
        { snapshotProposalData ? (
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <SnapshotLink
              href={snapshotProposalData?.link ? snapshotProposalData.link : ''}
            >
              <div style={{ marginRight: '5px' }}><small>View on Snapshot.org</small></div>
              <div style={{ display: 'flex', alignContent: 'center'}}>
                <ExternalLinkIcon size={14} />
              </div>
            </SnapshotLink>
          </AutoColumn>
        ) : ''}
      </ProposalInfo>
    </PageWrapper>
  )
}
