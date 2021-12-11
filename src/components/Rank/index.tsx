import React, { useEffect, useState } from 'react'
import { HelpCircle } from 'react-feather'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { RowBetween, AutoRow } from '../../components/Row'
import { DataCard } from '../../components/earn/styled'
import { useActiveWeb3React } from '../../hooks'
import logo from '../../assets/images/pawth-logo-transparent.png'
// Ranks
import strayCat from '../../assets/images/strayCat.png'
import kitten from '../../assets/images/kitten.png'
import dwarfCat from '../../assets/images/dwarfCat.png'
import ragdoll from '../../assets/images/ragdoll.png'
import maineCoon from '../../assets/images/maineCoon.png'
import abbysinian from '../../assets/images/abbysinian.png'
import scottishFold from '../../assets/images/scottishFold.png'
import cornishRex from '../../assets/images/cornishRex.png'
import persian from '../../assets/images/persian.png'
import siamese from '../../assets/images/siamese.png'
import himalayan from '../../assets/images/himalayan.png'
import blackFooted from '../../assets/images/blackFooted.png'
import pallas from '../../assets/images/pallas.png'
import iriomote from '../../assets/images/iriomote.png'
import sandCat from '../../assets/images/sandCat.png'
import desertLynx from '../../assets/images/desertLynx.png'
import serval from '../../assets/images/serval.png'
import puma from '../../assets/images/puma.png'
import leopard from '../../assets/images/leopard.png'
import cloudedLeopard from '../../assets/images/cloudedLeopard.png'
import cheetah from '../../assets/images/cheetah.png'
import jaguar from '../../assets/images/jaguar.png'
import snowLeopard from '../../assets/images/snowLeopard.png'
import blackPanther from '../../assets/images/blackPanther.png'
import tiger from '../../assets/images/tiger.png'
import lion from '../../assets/images/lion.png'
import sabertooth from '../../assets/images/sabertooth.png'
import crown from '../../assets/images/crown.png'
import sadCat from '../../assets/images/sadCat.png'
import sphynx from '../../assets/images/sphynx.png'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const InfoCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  margin-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`

const MainContentWrapper = styled.main`
  background-color: ${({ theme }) => theme.bg0};
  padding: 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`
const PaddedAutoColumn = styled(AutoColumn)`
  padding: 12px;
`

export const StyledHelpButton = styled.button`
  position: relative;
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

const ethescanApiKey = 'SZYGYXBA7K6ECH7DHB3QX2MR7GJZQK2M8P'
const grumpyContractAddress = '0xaecc217a749c2405b5ebc9857a16d58bdc1c367f'

interface Refresh {
  refresh: boolean
}

export default function Rank(props:Refresh) {
  const { account } = useActiveWeb3React()

  // wallet state vars
  const [grumpyBalance, setGrumpyBalance] = useState(0)

  // rank state vars
  const [previousPawthRank, setPreviousPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [pawthRank, setPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [nextPawthRank, setNextPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [distanceToNextRank, setDistanceToNextRank] = useState('-')
  const [distanceToPreviousRank, setDistanceToPreviousRank] = useState('-')

  function openRankMenu () {
    const rankMenuLink = 'https://cdn.discordapp.com/attachments/843736156839346187/912043689822527568/donedone.png'
    window.open(rankMenuLink);
  }

  function formatPrice(price: number) {
    if (price > 0) {
      const priceString = (price / 1000000000).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })

      return priceString
    }

    return price.toString()
  }

  async function getWallet() {
    if (account) {
      const balance = await getGrumpyBalance(account)
      const ranks = await getPawthRanks(balance)
      
      setGrumpyBalance(balance)

      setPreviousPawthRank(ranks.previousRank)
      setPawthRank(ranks.rank)
      setNextPawthRank(ranks.nextRank)
      setDistanceToNextRank(ranks.distanceToNextRank)
      setDistanceToPreviousRank(ranks.distanceToPreviousRank)
    }
  }

  async function getGrumpyBalance(account: string) {
    const balance_api = new URL('https://api.etherscan.io/api')

    balance_api.searchParams.append('module', 'account')
    balance_api.searchParams.append('action', 'tokenbalance')
    balance_api.searchParams.append('contractaddress', grumpyContractAddress)
    balance_api.searchParams.append('address', account)
    balance_api.searchParams.append('tag', 'latest')
    balance_api.searchParams.append('apikey', ethescanApiKey)

    const balanceReq = await fetch(balance_api.href)
    const balanceRes = await balanceReq.json()
    const balance = parseFloat(balanceRes.result)

    return balance
  }

  async function getPawthRanks(balance: number) {
    balance /= 1000000000
    const ranks = [
      { name: 'You are the bottom rank', img: sadCat, threshold: 0 },
      { name: 'Stray Cat', img: strayCat, threshold: 50 },
      { name: 'Kitten', img: kitten, threshold: 100 },
      { name: 'Dwarf Cat', img: dwarfCat, threshold: 200 },
      { name: 'Ragdoll', img: ragdoll, threshold: 300 },
      { name: 'Maine Coon', img: maineCoon, threshold: 500 },
      { name: 'Abbysinian', img: abbysinian, threshold: 750 },
      { name: 'Scottish Fold', img: scottishFold, threshold: 1000 },
      { name: 'Cornish Rex', img: cornishRex, threshold: 2000 },
      { name: 'Persian', img: persian, threshold: 3000 },
      { name: 'Siamese', img: siamese, threshold: 5000 },
      { name: 'Sphynx', img: sphynx, threshold: 7500 },
      { name: 'Himalayan', img: himalayan, threshold: 10000 },
      { name: 'Black-footed', img: blackFooted, threshold: 20000 },
      { name: 'Pallas', img: pallas, threshold: 30000 },
      { name: 'Iriomote', img: iriomote, threshold: 50000 },
      { name: 'Sand Cat', img: sandCat, threshold: 75000 },
      { name: 'Desert Lynx', img: desertLynx, threshold: 100000 },
      { name: 'Serval', img: serval, threshold: 200000 },
      { name: 'Puma', img: puma, threshold: 300000 },
      { name: 'Leopard', img: leopard, threshold: 500000 },
      { name: 'Clouded Leopard', img: cloudedLeopard, threshold: 750000 },
      { name: 'Cheetah', img: cheetah, threshold: 1000000 },
      { name: 'Jaguar', img: jaguar, threshold: 2000000 },
      { name: 'Snow Leopard', img: snowLeopard, threshold: 3000000 },
      { name: 'Black Panther', img: blackPanther, threshold: 5000000 },
      { name: 'Tiger', img: tiger, threshold: 7500000 },
      { name: 'Lion', img: lion, threshold: 10000000 },
      { name: 'Sabertooth', img: sabertooth, threshold: 10000000 },
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

  useEffect(() => {
    getWallet()
  }, [account, props.refresh])

  return (
    <PageWrapper gap="lg" justify="center">
      {account ? (
        <TopSection gap="md">
          <TopSection gap="2px">
            <MainContentWrapper>
            { grumpyBalance ? (
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <AutoColumn gap="sm">
                    <TYPE.mediumHeader textAlign="center">
                      Your PAWTHER Rank 
                      {/* <StyledHelpButton onClick={() => openRankMenu()}>
                        <HelpCircle size={14} />
                      </StyledHelpButton> */}
                    </TYPE.mediumHeader>
                    <TYPE.body textAlign="center">
                      <img src={pawthRank.img} alt="Logo" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
                    </TYPE.body>
                    <TYPE.largeHeader textAlign="center">{pawthRank.name}</TYPE.largeHeader>
                  </AutoColumn>
                </AutoRow>
                <AutoRow justify="center">
                  <AutoColumn gap="md" style={{ width: '50%' }}>
                    { nextPawthRank.name == 'You achieved the top rank!' ? (
                      <TYPE.body textAlign="center">{distanceToNextRank}</TYPE.body>
                    ) : 
                      <TYPE.body textAlign="center">You are {distanceToNextRank} $PAWTH away from leveling up to: </TYPE.body>
                    }
                    <TYPE.body textAlign="center">
                      <img src={nextPawthRank.img} alt="Logo" style={{ width: 50, height: 50 }} />
                    </TYPE.body>
                    <TYPE.body textAlign="center">
                      <strong>{nextPawthRank.name}</strong>
                    </TYPE.body>
                    {/* <TYPE.body textAlign="center">{distanceToNextRank} $PAWTH</TYPE.body> */}
                  </AutoColumn>
                  {/* TODO: Uncomment this if we ever want to show the previous rank
                  <PaddedAutoColumn gap="sm" style={{ width: '50%' }}>
                    <TYPE.body textAlign="center"><small>Previous Rank</small></TYPE.body>
                    <TYPE.body textAlign="center">
                      <img src={previousPawthRank.img} alt="Logo" style={{ width: 50, height: 50 }} />
                    </TYPE.body>
                    <TYPE.body textAlign="center">
                      <small><strong>{previousPawthRank.name}</strong></small>
                    </TYPE.body>
                    <TYPE.body textAlign="center"><small>{distanceToPreviousRank}</small></TYPE.body>
                  </PaddedAutoColumn> */}
                </AutoRow>
              </AutoColumn>
              ) : (
                <AutoColumn gap="lg">
                  <AutoRow justify="center">
                    <AutoColumn gap="sm">
                      <TYPE.mediumHeader textAlign="center">Your PAWTHER Rank</TYPE.mediumHeader>
                      <TYPE.body textAlign="center">Hold $PAWTH in your wallet to earn a PAWTHER Rank!</TYPE.body>
                    </AutoColumn>
                  </AutoRow>
                </AutoColumn>
              )
            }
            </MainContentWrapper>
          </TopSection>
        </TopSection>
      ) : (
        <TopSection gap="2px">
          <WrapSmall>
            <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>Wallet</TYPE.mediumHeader>
          </WrapSmall>
          <MainContentWrapper>
            <AutoColumn gap="lg" justify="center">
              <img src={logo} alt="Logo" style={{ width: 100, height: 100, padding: 20 }} />
            </AutoColumn>
            <AutoColumn gap="sm">
              <TYPE.body textAlign="center">Connect your wallet to see your PAWTHER Rank</TYPE.body>
            </AutoColumn>
          </MainContentWrapper>
        </TopSection>
      )}
    </PageWrapper>
  )
}
