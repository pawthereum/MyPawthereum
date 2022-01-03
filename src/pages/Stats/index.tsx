import React, { useEffect, useState, useContext } from 'react'
import { 
  PAWTH,
  SHIBLP,
  PAWTHLP,
  ORIGINAL_SWAPPERS, 
  BUG_SQUISHERS, 
  TESTERS, 
  CAT_DAY_VISITORS, 
  EDINBURGH_VISITORS,
  RED_CANDLE_SURVIVORS,
  PAWS_ORG_VISITORS,
  BRIDGE_TESTERS,
} from './../../constants/index'
import useUSDCPrice from 'hooks/useUSDCPrice'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { CurrencyAmount, TokenAmount } from '@uniswap/sdk-core'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { RowBetween, AutoRow } from '../../components/Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { useActiveWeb3React } from '../../hooks'
import Rank from '../../components/Rank'
import Reflections from '../../components/Reflections'
import logo from '../../assets/images/pawth-logo-transparent.png'
import { getFirestore, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'

// Badges
import swap from '../../assets/images/swap.png'
import vote from '../../assets/images/vote.png'
import diamondPaws from '../../assets/images/diamondPaws.png'
import fist from '../../assets/images/fist.png'
import wildcat from '../../assets/images/wildcat.png'
import bug from '../../assets/images/bug.png'
import catDay from '../../assets/images/catDay.png'
import shibaInuLp from '../../assets/images/shibaInuLp.png'
import uniLp from '../../assets/images/uniLp.png'
import heartSparkle from '../../assets/images/heartSparkle.png'
import edinburgh from '../../assets/images/edinburgh.png'
import redCandle from '../../assets/images/redCandle.png'
import slurp from '../../assets/images/slurp.png'
import paws from '../../assets/images/paws.png'
import cart from '../../assets/images/cart.png'
import givingTuesday from '../../assets/images/givingTuesday.png'
import twelveDaysOfGiving from '../../assets/images/twelveDaysOfGiving.png'
import newtown from '../../assets/images/newtown.png'
import koreanK9Rescue from '../../assets/images/koreanK9Rescue.png'
import catTown from '../../assets/images/catTown.png'
import forgottenAnimals from '../../assets/images/forgottenAnimals.png'
import muttville from '../../assets/images/muttville.png'
import globalSanctuaryElephants from '../../assets/images/globalSanctuaryElephants.png'
import dogsForBetterLvies from '../../assets/images/dogsForBetterLives.png'
import theRealBark from '../../assets/images/theRealBark.png'
import mauiHumaneSociety from '../../assets/images/mauiHumaneSociety.png'
import savasSafeHaven from '../../assets/images/savasSafeHaven.png'
import slothConservationFoundation from '../../assets/images/slothConservationFoundation.png'
import northShoreAnimalLeague from '../../assets/images/northShoreAnimalLeague.png'
import bridge from '../../assets/images/bridge.png'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const InfoCard = styled(DataCard)`
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
  min-width: 33%;
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
const ethplorerApiKey = process.env.REACT_APP_ETHPLORER_API_KEY || ''
const pawthMarketingWallet = '0x16b1db77b60c8d8b6ecea0fa4e0481e9f53c9ba1'

export default function Stats() {
  const { account, chainId } = useActiveWeb3React()

  const pawth = chainId ? PAWTH[chainId] : undefined
  const pawthBalance: CurrencyAmount | undefined = useCurrencyBalance(account ?? undefined, pawth)
  const pawthBalanceUsdValue = useUSDCValue(pawthBalance)
  const pawthPrice = useUSDCPrice(pawth)

  const [updatingStats, setUpdatingStats] = useState(false)
  // wallet state vars
  const [balance, setBalance] = useState<number>()
  const [reflectionBalance, setReflectionBalance] = useState<CurrencyAmount | null>(null)
  const [totalIn, setTotalIn] = useState(0)
  const [totalOut, setTotalOut] = useState(0)
  
  // price state vars
  const [price, setPrice] = useState('-')
  const [marketCap, setMarketCap] = useState('-')

  // charity wallet state vars
  const [charityOneDayTotal, setCharityOneDayTotal] = useState(0)
  const [charityOneDayUsd, setCharityWalletOneDayUsd] = useState('-')
  const [charityAllTimeTotal, setCharityAllTimeTotal] = useState(0)
  const [charityWalletAllTimeUsd, setCharityWalletAllTimeUsd] = useState('-')
  const [charityTransferredOut, setCharityTransferredOut] = useState(0)
  const [charityTransferredOutUsd, setCharityTransferredOutUsd] = useState('-')

  // for testing
  const [isTester, setIsTester] = useState(false)

  // badges state vars
  const [isOriginalSwapper, setIsOriginalSwapper] = useState(false)
  const [isDiamondHands, setIsDiamondHands] = useState(false)
  const [isVoter, setIsVoter] = useState(false)
  const [isHolder, setIsHolder] = useState(false)
  const [isInWildCatClub, setIsInWildCatClub] = useState(false)
  const [isBugSquisher, setIsBugSquisher] = useState(false)
  const [isCatDayVisitor, setIsCatDayVisitor] = useState(false)
  const [isMarketingDonor, setIsMarketingDonor] = useState(false)
  const [isEdinburghEventVisitor, setIsEdinburghEventVisitor] = useState(false)
  const [isRedCandleSurvivor, setIsRedCandleSurvivor] = useState(false)
  const [isNov18Slurper, setIsNov18Slurper] = useState(false)
  const [isPawsOrgEventVisitor, setIsPawsOrgEventVisitor] = useState(false)
  const [isBlackFurday2021Buyer, setIsBlackFurday2021Buyer] = useState(false)
  const [isGivingTuesdayVisitor, setIsGivingTuesdayVisitor] = useState(false)
  const [is12DaysVisitor, setIs12DaysVisitor] = useState(false)
  const [isNewtownVisitor, setIsNewtownVisitor] = useState(false)
  const [isKoreanK9Visitor, setIsKoreanK9Visitor] = useState(false)
  const [isCatTownVisitor, setIsCatTownVisitor] = useState(false)
  const [isForgottenAnimalsVisitor, setIsForgottenAnimalsVisitor] = useState(false)
  const [isMuttvilleVisitor, setIsMuttvilleVisitor] = useState(false) 
  const [isGlobalElephantSanctuaryVisitor, setIsGlobalElephantSanctuaryVisitor] = useState(false)
  const [isDogsForBetterLivesVisitor, setIsDogsForBetterLivesVisitor] = useState(false)
  const [isTheRealBarkVisitor, setIsTheRealBarkVisitor] = useState(false)
  const [isMauiHumaneSocietyVisitor, setIsMauiHumaneSocietyVisitor] = useState(false)
  const [isSavasSafeHavenVisitor, setIsSavasSafeHavenVisitor] = useState(false)
  const [isSlothFoundationVisitor, setIsSlothFoundationVisitor] = useState(false)
  const [isNorthShoreAnimalLeagueVisitor, setIsNorthShoreAnimalLeagueVisitor] = useState(false)
  const [isBridgeTester, setIsBridgeTester] = useState(false)

  const shibaLpBalance: CurrencyAmount | undefined = useCurrencyBalance(account ?? undefined, SHIBLP)
  const isShibaLpProvider = shibaLpBalance ? parseFloat(shibaLpBalance.toFixed()) > 0 : false

  const uniPawthLpBalance: CurrencyAmount | undefined = useCurrencyBalance(account ?? undefined, PAWTHLP)
  const isUniswapLpProvider = uniPawthLpBalance ? parseFloat(uniPawthLpBalance.toFixed()) > 0 : false

  // visits for awards
  const [visits, setVisits] = useState<any[]>([])
  const badgeEvents = [
    { name: '12 Days of Giving' , start: 1639458000, end: 1640451599, setState: setIs12DaysVisitor },
    { name: 'Newtown Visitor', start: 1639489730, end: 1639576800, setState: setIsNewtownVisitor },
    { name: 'Korean K9 Rescue Visitor', start: 1639576800, end: 1639663200, setState: setIsKoreanK9Visitor },
    { name: 'Cat Town Visitor', start: 1639674000, end: 1639749600, setState: setIsCatTownVisitor },
    { name: 'Forgotten Animals Visitor', start: 1639749600, end: 1639836000, setState: setIsForgottenAnimalsVisitor },
    { name: 'Muttville Visitor', start: 1639836000, end: 1639924200, setState: setIsMuttvilleVisitor },
    { name: 'Global Elephant Sanctuary Visitor', start: 1639834778, end: 1640010600, setState: setIsGlobalElephantSanctuaryVisitor },
    { name: 'Dogs for Better Lives', start: 1640010600, end: 1640097000, setState: setIsDogsForBetterLivesVisitor },
    { name: 'The Real Bark', start: 1640095200, end: 1640181600, setState: setIsTheRealBarkVisitor },
    { name: 'Maui Humane Society', start: 1640183400, end: 1640269800, setState: setIsMauiHumaneSocietyVisitor },
    { name: 'Savas Safe Haven', start: 1640269800, end: 1640356200, setState: setIsSavasSafeHavenVisitor },
    { name: 'Sloth Conservation Foundation', start: 1640356200, end: 1640442600, setState: setIsSlothFoundationVisitor },
    { name: 'North Shore Animal League', start: 1640442600, end: 1640529000, setState: setIsNorthShoreAnimalLeagueVisitor },
  ]

  function formatPrice(price: number) {
    if (price > 0) {
      const priceString = (price).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })

      return priceString
    }

    return price.toString()
  }

  function formatPriceUsd(price: number) {
    if (price > 0) {
      return (price).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })
    }

    return price.toString()
  }

  async function getTokenStats(redistributedAmount: number, charityOneDayTotal: number) {
    const stats_api = new URL('https://api.ethplorer.io/getTokenInfo/0xaecc217a749c2405b5ebc9857a16d58bdc1c367f')
    stats_api.searchParams.append('apiKey', ethplorerApiKey)

    const statsReq = await fetch(stats_api.href)
    const statsRes = await statsReq.json()

    if (!statsRes.hasOwnProperty('error')) {
      const balance = pawthBalance ? parseFloat(pawthBalance.toFixed()) : 0
      const price = statsRes.price

      const charityWalletAllTimeUsd = charityAllTimeTotal / 1000000000 * price.rate
      const charityWalletTodayUsd = charityOneDayTotal / 1000000000 * price.rate
      const charityTransferredOutUsd = charityTransferredOut * price.rate

      setPrice(price.rate ? '$' + price.rate.toFixed(6) : '-')

      setMarketCap(
        price.rate 
        ?
          '$' +
            price.marketCapUsd.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
        :
          '-'
      )
      // TODO: when you are ready to show all time charity stats, pass the 
      // charityWalletAllTimeUsd data into this getStats function to 
      // avoid race conditions
      setCharityWalletAllTimeUsd(
        isNaN(charityWalletAllTimeUsd)
        ?
          '-'
        :
          '$' + formatPriceUsd(charityWalletAllTimeUsd)
      )
      setCharityWalletOneDayUsd(
        isNaN(charityWalletTodayUsd)
        ?
          '-'
        :
          '$' + formatPriceUsd(charityWalletTodayUsd)
      )
      setCharityTransferredOutUsd(
        isNaN(charityTransferredOutUsd)
        ?
          '-'
        :
          '$' + formatPriceUsd(charityTransferredOutUsd)
      )
    }
  }

  async function getWallet() {
    if (account) {
      const charityTx = await getCharityWalletTransaction()
      setCharityOneDayTotal(charityTx.oneDayTotal)
      setCharityAllTimeTotal(charityTx.totalIn)
      setCharityTransferredOut(charityTx.totalOut)

      // this needs to be set before the transactions are analyzed
      setIsRedCandleSurvivor(RED_CANDLE_SURVIVORS.includes(account.toLowerCase()))
      
      const tx = await getTransactionHistory()
      const isVoter = await getVoterStatus()

      const ethTransactions = await getEthTransaction()
      setIsMarketingDonor(ethTransactions.isMarketingWalletDonor)
      
      getTokenStats(tx.redistribution, charityTx.oneDayTotal)

      setTotalIn(tx.totalIn)
      setTotalOut(tx.totalOut)

      setIsOriginalSwapper(ORIGINAL_SWAPPERS.includes(account.toLowerCase()))
      setIsBugSquisher(BUG_SQUISHERS.includes(account.toLowerCase()))
      setIsBridgeTester(BRIDGE_TESTERS.includes(account.toLowerCase()))
      setIsTester(TESTERS.includes(account.toLowerCase()))
      setIsVoter(isVoter)

      setIsCatDayVisitor(CAT_DAY_VISITORS.includes(account.toLowerCase()))
      setIsEdinburghEventVisitor(EDINBURGH_VISITORS.includes(account))
      setIsPawsOrgEventVisitor(PAWS_ORG_VISITORS.includes(account.toLowerCase()))

      // TODO: we can get rid of all of this after giving tuesday
      const endOfEvent = 1638421199 // 11:59pm dec 1 (est)
      const now = Math.floor(Date.now() / 1000)
      const isGivingTuesday = now <= endOfEvent

      if (isGivingTuesday) {
        const addVisitorUrl = 'https://grumpyfinance.api.stdlib.com/cat-day-visitors@dev?account=' + account
        const resp = await fetch (addVisitorUrl)
        console.log('resp', resp)
      }
      // once eventis over delete the code above and change the state setter
      // to only check if they are part of the visitors constant
      setIsGivingTuesdayVisitor(isGivingTuesday)
    }
  }

  async function getVoterStatus() {
    return fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Votes {
            votes (
              first: 1000
              skip: 0
              where: {
                space_in: ["pawthereum.eth"]
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              voter
            }
          }        
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const votes = result.data ? result.data.votes : []
        const voters = Object.entries(votes).map((v: any) => v[1].voter)
        return voters.includes(account)
      })
  }

  async function getEthTransaction() {
    if (!account) return { isMarketingWalletDonor: false }
    const transactions_api = new URL('https://api.etherscan.io/api')

    transactions_api.searchParams.append('module', 'account')
    transactions_api.searchParams.append('action', 'txlist')
    transactions_api.searchParams.append('address', account)
    transactions_api.searchParams.append('page', '1')
    transactions_api.searchParams.append('offset', '10000')
    transactions_api.searchParams.append('apikey', ethescanApiKey)

    const transactionReq = await fetch(transactions_api.href)
    const transactionRes = await transactionReq.json()
    const transaction = transactionRes.result

    let isMarketingWalletDonor = false
    for (const item of transaction) {
      if (item.to === pawthMarketingWallet.toLowerCase()) {
        isMarketingWalletDonor = true
      }
    }

    return { isMarketingWalletDonor }
  }

  async function getTransactionHistory() {
    if (!account || !pawth) return {
      totalIn: 0, 
      totalOut: 0,
      redistribution: 0,
      balanceWithoutRedistribution: 0
    }
    const transactions_api = new URL('https://api.etherscan.io/api')

    transactions_api.searchParams.append('module', 'account')
    transactions_api.searchParams.append('action', 'tokentx')
    transactions_api.searchParams.append('contractaddress', pawth?.address)
    transactions_api.searchParams.append('address', account)
    transactions_api.searchParams.append('page', '1')
    transactions_api.searchParams.append('offset', '10000')
    transactions_api.searchParams.append('apikey', ethescanApiKey)

    const transactionReq = await fetch(transactions_api.href)
    const transactionRes = await transactionReq.json()
    const transaction = transactionRes.result

    let totalIn = 0.0
    let totalOut = 0.0

    const startBlockOfNov18Slurp = 13642443
    const endBlockOfNov18Slurp = 13643054

    const startBlackFurday2021 = 13686521
    const endBlackFurday2021 = 13695284

    const startBlockReflectionsOff = 13690729
    const endBlockReflectionsOff = 13893775

    const startBlockReflectionsOnePercent = endBlockReflectionsOff

    for (const item of transaction) {
      if (item.to === account.toLowerCase()) {
        totalIn += parseFloat(item.value)

        if (parseInt(item.blockNumber) >= startBlockOfNov18Slurp &&
            parseInt(item.blockNumber) <= endBlockOfNov18Slurp) {
              setIsNov18Slurper(true)
        }

        if (parseInt(item.blockNumber) >= startBlackFurday2021 &&
            parseInt(item.blockNumber) <= endBlackFurday2021) {
              setIsBlackFurday2021Buyer(true)
        }

      } else if (parseInt(item.blockNumber) > startBlockReflectionsOff &&
                 parseInt(item.blockNumber) <= endBlockReflectionsOff) {
        totalOut += parseFloat(item.value)
      } else if (parseInt(item.blockNumber) >= startBlockReflectionsOnePercent) {
        totalOut += parseFloat(item.value)
        totalOut += parseFloat(item.value) * 0.01
      } else {
        totalOut += parseFloat(item.value)
        totalOut += parseFloat(item.value) * 0.02
        // if you sold during the Nov 18 dip, you did not survive
        if (parseInt(item.blockNumber) >= startBlockOfNov18Slurp &&
            parseInt(item.blockNumber) <= endBlockOfNov18Slurp) {
              setIsRedCandleSurvivor(false)
        }
      }
    }

    // if this person never sold, they are diamond hands
    setIsDiamondHands(totalOut === 0 && totalIn > 0)

    let balanceWithoutRedistribution = totalIn - totalOut
    let redistribution = pawthBalance ? parseFloat(pawthBalance.toFixed()) - (balanceWithoutRedistribution / 10**pawth?.decimals) : 0
    
    // for paperhands who sold all of their pawth, dont let balance
    // without reflections show a negative balance
    if (balanceWithoutRedistribution < 0) {
      balanceWithoutRedistribution = 0
    }

    totalIn = totalIn / 10**pawth?.decimals
    totalOut = totalOut / 10**pawth?.decimals
    redistribution = redistribution * 10**pawth?.decimals
    balanceWithoutRedistribution = balanceWithoutRedistribution / 10**pawth?.decimals

    const redistributionBalance: CurrencyAmount | undefined = new TokenAmount(pawth, Math.floor(redistribution).toString())
    setReflectionBalance(redistributionBalance)
    return { totalIn, totalOut, redistribution, balanceWithoutRedistribution }
  }

  async function getCharityWalletTransaction() {
    if (!pawth) return {
      oneDayTotal: 0, totalIn: 0, totalOut: 0
    }
    const transactions_api = new URL('https://api.etherscan.io/api')
    const charityWallet = '0xf4a22c530e8cc64770c4edb5766d26f8926e20bd'

    transactions_api.searchParams.append('module', 'account')
    transactions_api.searchParams.append('action', 'tokentx')
    transactions_api.searchParams.append('contractaddress', pawth?.address)
    transactions_api.searchParams.append('address', charityWallet)
    transactions_api.searchParams.append('page', '1')
    transactions_api.searchParams.append('offset', '10000')
    transactions_api.searchParams.append('apikey', ethescanApiKey)

    const transactionReq = await fetch(transactions_api.href)
    const transactionRes = await transactionReq.json()
    const transaction = transactionRes.result
    if (transaction === 'Max rate limit reached') {
      return {
        oneDayTotal: 0,
        totalIn: 0,
        totalOut: 0
      }
    }
    let totalIn = 0.0
    let totalOut = 0.0
    let oneDayTotal = 0.0

    const now = new Date().getTime()
    const oneDayAgo = 60 * 60 * 24 * 1000
    const transactionHashesToday = transaction ? transaction.filter((t: any) => {
      return now - new Date(t.timeStamp * 1000).getTime() <= oneDayAgo
    }).map((t: any) => t.hash) : []

    for (const item of transaction) {
      if (item.to === charityWallet.toLowerCase()) {
        if (transactionHashesToday.includes(item.hash)) {
          oneDayTotal += parseFloat(item.value)
        }
        totalIn += parseFloat(item.value)
      } else {
        totalOut += parseFloat(item.value)
      }
    }

    return { oneDayTotal, totalIn, totalOut }

  }

  useEffect(() => {
    const newBalance = pawthBalance ? parseFloat(pawthBalance.toFixed()) : 0

    async function updateStats () {
      try {
        if (balance === undefined) {
          setBalance(0)
        }
        if (balance !== newBalance && pawth && account) {
          setBalance(newBalance)
          if (newBalance && newBalance >= 1) {
            setIsHolder(true)
          }
          if (newBalance && newBalance >= 10000) {
            setIsInWildCatClub(true)
          }
          getWallet()
        }
      } catch (err) {
        console.log('error updating stats', err)
      }
    }

    if (!updatingStats) {
      setUpdatingStats(true)
      updateStats()
      setUpdatingStats(false)
    }

    if (newBalance !== 0) {

    }

  }, [account, pawthBalance])

  useEffect(() => {
    async function logVisit() {
      const db = getFirestore()
      const docRef = doc(db, 'pawthereum', 'wallets', `${account}`, 'visits')
      const docSnap = await getDoc(docRef)
      let dates = []
      if (docSnap.exists()) {
        dates = docSnap.data().dates || []
        dates.push(Timestamp.fromDate(new Date()))
        await updateDoc(docRef, {
          dates
        })
      } else {
        dates.push(Timestamp.fromDate(new Date()))
        await setDoc(docRef, {
          dates: dates
        })
      }
      setVisits(dates)
    }
    if (account) {
      logVisit()
    }
  }, [account])

  useEffect(() => {
    async function checkBadgeVisits() {
      if (visits.length === 0) return
      let badges:any[] = []
      for (const visit of visits) {
        const date = new Date(visit.toDate()).getTime() / 1000
        badges = badges.concat(badgeEvents.filter(e => {
          return date >= e.start && date <= e.end
        }))
      }
      for (const badge of badges) {
        badge.setState(true)
      }
    }
    checkBadgeVisits()
  }, [visits])

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <InfoCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Information</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Pawthereum is a decentralized community-run charity cryptocurrency that aims to help animal shelters all over the world and has already donated over $400k!
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </InfoCard>
      </TopSection>

      {account ? (
        <TopSection gap="md">
          <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0, color: 'white' }}>
                Your Wallet
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <AutoColumn gap="lg">
                <AutoColumn gap="md" justify="center">
                  <img src={logo} alt="Logo" style={{ width: 100, height: 100 }} />
                </AutoColumn>
                <AutoColumn gap="sm">
                  <TYPE.body textAlign="center">Your $PAWTH Balance</TYPE.body>
                  <TYPE.largeHeader textAlign="center">
                    { (pawthBalance ? parseFloat(pawthBalance.toFixed(0)) : 0).toLocaleString() }
                  </TYPE.largeHeader>
                </AutoColumn>
                <AutoColumn gap="sm">
                  <TYPE.body textAlign="center">Your $PAWTH USD Value</TYPE.body>
                  <TYPE.largeHeader textAlign="center">
                    {'$' + (pawthBalanceUsdValue ? parseFloat(pawthBalanceUsdValue.toFixed(0)) : 0).toLocaleString() }
                  </TYPE.largeHeader>
                </AutoColumn>

                <AutoColumn gap="sm">
                  <AutoRow justify="center">
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">Price</TYPE.body>
                      <TYPE.largeHeader textAlign="center">
                        { '$' + (pawthPrice ? pawthPrice.toFixed() : 0).toLocaleString() }
                      </TYPE.largeHeader>
                    </PaddedAutoColumn>

                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">Market Cap</TYPE.body>
                      <TYPE.largeHeader textAlign="center">{marketCap}</TYPE.largeHeader>
                    </PaddedAutoColumn>
                  </AutoRow>
                </AutoColumn>
              </AutoColumn>
            </MainContentWrapper>
          </TopSection>

          <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0, color: 'white' }}>
                Your $PAWTH Reflections
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <Reflections
                reflectionBalance={reflectionBalance} 
                pawthBalance={pawthBalance}
                totalIn={totalIn}
                totalOut={totalOut}
              />
            </MainContentWrapper>
          </TopSection>

          <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0, color: 'white' }}>
                Your Rank and Badges
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <Rank refresh={false} balance={pawthBalance} showHelp={true} />
                  </PaddedAutoColumn>
                </AutoRow>
              </AutoColumn>
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.mediumHeader textAlign="center">Your $PAWTH Badges</TYPE.mediumHeader>
                  </PaddedAutoColumn>
                </AutoRow>

                <AutoRow justify="center">
                { isHolder ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={fist} alt="Pawth Holder" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Pawth Holder</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Holds 1+ Pawth</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : ''
                }
                { isOriginalSwapper ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={swap} alt="Original Swapper" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Original Swapper</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Swapped $GRUMPY</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : ''
                }
                {
                  isDiamondHands ? (
                    <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">
                      <img src={diamondPaws} alt="Diamond Paws" style={{ width: 50, height: 50 }} />
                    </TYPE.body>
                    <TYPE.body textAlign="center"><strong>Diamond Paws</strong></TYPE.body>
                    <TYPE.body textAlign="center"><small>Never sold Pawth</small></TYPE.body>
                  </PaddedAutoColumn>
                  ) : ''
                }
                {
                  isVoter ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={vote} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Snapshot Voter</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Voted on proposal</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isInWildCatClub ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={wildcat} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Wild Cats Club</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Holds 10k+ Pawth</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isBugSquisher ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={bug} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Bug Squisher</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Reported a Pawth bug</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isCatDayVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={catDay} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>National Cat Day</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited MyPawth on Cat Day</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isShibaLpProvider ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={shibaInuLp} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Shiba Liquidity Legend</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Provided Liquidity to Shiba Swap</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isUniswapLpProvider ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={uniLp} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Uni Liquidity Legend</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Provided Liquidity to Uniswap</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isMarketingDonor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={heartSparkle} alt="Voter" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Marketing Donor</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Donated to the Marketing Wallet</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isEdinburghEventVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={edinburgh} alt="EdinburghVisitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Edinburgh Dog &amp; Cat Home</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 15-Nov-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isRedCandleSurvivor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={redCandle} alt="Red Candle Survivor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Big Red Candle Survivor</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Survived the 18-Nov-2021 Candle</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isNov18Slurper ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={slurp} alt="November 18 Slurper" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Dip Buyer</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Slurped the 18-Nov-21 Dip</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isPawsOrgEventVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={paws} alt="Paws Org Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Paws.org</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 22-Nov-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isBlackFurday2021Buyer ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={cart} alt="Black Furday 2021 Buyer" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Black Furday 2021 Buyer</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Made a purchase on 26-Nov-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isGivingTuesdayVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={givingTuesday} alt="Giving Tuesday Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Giving Tuesday Visitor</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on 30-Nov-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  is12DaysVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={twelveDaysOfGiving} alt="12 Days of Giving Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>12 Days of Giving Visitor</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited during 12 Days of Giving</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isNewtownVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={newtown} alt="Catherine Hubbard Sanctuary Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Catherine Hubbard Sanctuary</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 14-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isKoreanK9Visitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={koreanK9Rescue} alt="Korean K9 Rescue Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Korean K9 Rescue</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 15-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isCatTownVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={catTown} alt="Cat Town Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Cat Town</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 16-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isForgottenAnimalsVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={forgottenAnimals} alt="Forgotten Animals Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Forgotten Animals</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 17-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isMuttvilleVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={muttville} alt="Muttville Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Muttville</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 18-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isGlobalElephantSanctuaryVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={globalSanctuaryElephants} alt="Global Sanctuary for Elephants Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Global Sanctuary for Elephants</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 19-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isDogsForBetterLivesVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={dogsForBetterLvies} alt="Dogs For Better Lives Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Dogs For Better Lives</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 20-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isTheRealBarkVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={theRealBark} alt="The Real Bark Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>The Real Bark</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 21-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isMauiHumaneSocietyVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={mauiHumaneSociety} alt="Maui Humane Society Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Maui Humane Society</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 22-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isSavasSafeHavenVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={savasSafeHaven} alt="Sava's Safe Haven Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Sava&apos;s Safe Haven</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 23-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isSlothFoundationVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={slothConservationFoundation} alt="Sloth Conservation Foundation Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>The Sloth Conservation Foundation</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 24-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isNorthShoreAnimalLeagueVisitor ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={northShoreAnimalLeague} alt="North Shore Animal League Visitor" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>North Shore Animal League America</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Visited on Donation Day: 25-Dec-2021</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                {
                  isBridgeTester ? (
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">
                        <img src={bridge} alt="Bridge Tester" style={{ width: 50, height: 50 }} />
                      </TYPE.body>
                      <TYPE.body textAlign="center"><strong>Bridge Tester</strong></TYPE.body>
                      <TYPE.body textAlign="center"><small>Helped Test Pawth Bridges</small></TYPE.body>
                    </PaddedAutoColumn>
                  ) : '' 
                }
                </AutoRow>
              </AutoColumn>
            </MainContentWrapper>
          </TopSection>

          <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0, color: 'white' }}>
                Charity Wallet
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">$PAWTH Collected Last 24h</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(charityOneDayTotal / 1000000000)}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">USD Value Collected Last 24h</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{charityOneDayUsd}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                </AutoRow>
              </AutoColumn>

              {/* TODO: Uncomment this if we ever want to show charity all time stats
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">$PAWTH Collected All Time</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(charityAllTimeTotal)}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">USD Value Collected All Time</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{charityWalletAllTimeUsd}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                </AutoRow>
              </AutoColumn> */}
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
              <TYPE.body textAlign="center">Connect your wallet to see your $PAWTH stats</TYPE.body>
            </AutoColumn>
          </MainContentWrapper>
        </TopSection>
      )}
    </PageWrapper>
  )
}
