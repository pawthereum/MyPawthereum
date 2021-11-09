import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { ExternalLink, TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { Link } from 'react-router-dom'
import { SnapshotProposalStatus } from './styled'
import { Button } from 'rebass/styled-components'
import { darken } from 'polished'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import {  SnapshotProposalData } from '../../state/governance/hooks'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../../components/Loader'
import Client from '../../plugins/snapshot-labs/snapshot.js/src/client';
const hubUrl: any = 'https://hub.snapshot.org';
const snapshot = new Client(hubUrl);

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const Proposal = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

const ProposalNumber = styled.span`
  opacity: 0.6;
`

const ProposalTitle = styled.span`
  font-weight: 600;
`

export const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  margin-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`

const DisclaimerText = styled.span`
  color: ${({ theme }) => theme.text2};
`

const EmptyProposals = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Vote() {
  const [proposals, setProposals] = useState([])

  async function initSnapshot() {
    const pawthSnapshotProposals = await snapshot.getProposals('pawthereum.eth')
    setProposals(pawthSnapshotProposals)
  }

  const { account } = useActiveWeb3React()

  useEffect(() => {
    initSnapshot()
  }, [account])

  return (
    <PageWrapper gap="lg" justify="center">
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
                  Pawthereum is a community-run project and as such, the community can raise proposals.
                  If you hold $PAWTH, you are welcomed and encouraged to vote on these proposals so that your voice can help shape the future of Pawthereum.
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      </TopSection>
      <TopSection gap="2px">
        <WrapSmall>
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>Proposals</TYPE.mediumHeader>
          {(!proposals || proposals.length === 0) ? ( <Loader /> ) : ''}
        </WrapSmall>
        {proposals?.length === 0 && (
          <EmptyProposals>
            <TYPE.body style={{ marginBottom: '8px' }}>No proposals found.</TYPE.body>
            <TYPE.subHeader>
              <i>Proposals submitted by community members will appear here.</i>
            </TYPE.subHeader>
          </EmptyProposals>
        )}
        {proposals?.map((p: SnapshotProposalData, i) => {
          return (
            <Proposal as={Link} to={'/vote/' + p.id} key={i}>
              <ProposalNumber>{proposals.length - i}</ProposalNumber>
              <ProposalTitle>{p.title}</ProposalTitle>
              <SnapshotProposalStatus state={p.state}>{p.state}</SnapshotProposalStatus>
            </Proposal>
          )
        })}
      </TopSection>
      <DisclaimerText>
        You must hold $PAWTH in order to participate in voting
      </DisclaimerText>
    </PageWrapper>
  )
}
