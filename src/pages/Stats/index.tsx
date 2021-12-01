import React, { useEffect, useState, useContext } from 'react'
import { HelpCircle } from 'react-feather'
import { 
  ORIGINAL_SWAPPERS, 
  BUG_SQUISHERS, 
  TESTERS, 
  CAT_DAY_VISITORS, 
  EDINBURGH_VISITORS,
  RED_CANDLE_SURVIVORS,
  PAWS_ORG_VISITORS
} from './../../constants/index'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { RowBetween, AutoRow } from '../../components/Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
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
const grumpyContractAddress = '0xaecc217a749c2405b5ebc9857a16d58bdc1c367f'
const pawthCharityWallet = '0xf4a22c530e8cc64770c4edb5766d26f8926e20bd'
const pawthMarketingWallet = '0x16b1db77b60c8d8b6ecea0fa4e0481e9f53c9ba1'

export default function Stats() {
  const { account } = useActiveWeb3React()

  // wallet state vars
  const [grumpyBalance, setGrumpyBalance] = useState(0)
  const [grumpyBalanceWithoutRedistribution, setGrumpyBalanceWithoutRedistribution] = useState(0)
  const [grumpyUsdValue, setGrumpyUsdValue] = useState('-')
  const [redistributedAmount, setRedistributedAmount] = useState(0)
  const [redistributedUsdValue, setRedistributedUsdValue] = useState('-')
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

  // rank state vars
  const [previousPawthRank, setPreviousPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [pawthRank, setPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [nextPawthRank, setNextPawthRank] = useState({ name: '', img: '', threshold: 0 })
  const [distanceToNextRank, setDistanceToNextRank] = useState('-')
  const [distanceToPreviousRank, setDistanceToPreviousRank] = useState('-')

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
  const [isShibaLpProvider, setIsShibaLpProvider] = useState(false)
  const [isUniswapLpProvider, setIsUniswapLpProvider] = useState(false)
  const [isMarketingDonor, setIsMarketingDonor] = useState(false)
  const [isEdinburghEventVisitor, setIsEdinburghEventVisitor] = useState(false)
  const [isRedCandleSurvivor, setIsRedCandleSurvivor] = useState(false)
  const [isNov18Slurper, setIsNov18Slurper] = useState(false)
  const [isPawsOrgEventVisitor, setIsPawsOrgEventVisitor] = useState(false)
  const [isBlackFurday2021Buyer, setIsBlackFurday2021Buyer] = useState(false)
  const [isGivingTuesdayVisitor, setIsGivingTuesdayVisitor] = useState(false)

  function openRankMenu () {
    const rankMenuLink = 'https://cdn.discordapp.com/attachments/891351589162483732/895435039834251364/wcc2.png'
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

  function formatPriceUsd(price: number) {
    if (price > 0) {
      return (price / 1000000000).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })
    }

    return price.toString()
  }

  async function getGrumpyStats(balance: number, redistributedAmount: number, charityOneDayTotal: number) {
    const stats_api = new URL('https://api.ethplorer.io/getTokenInfo/0xaecc217a749c2405b5ebc9857a16d58bdc1c367f')
    stats_api.searchParams.append('apiKey', ethplorerApiKey)

    const statsReq = await fetch(stats_api.href)
    const statsRes = await statsReq.json()

    if (!statsRes.hasOwnProperty('error')) {
      const price = statsRes.price
      const userGrumpyValueInUsd = balance * price.rate
      const userRedistributedValueInUsd = redistributedAmount * price.rate

      const charityWalletAllTimeUsd = charityAllTimeTotal * price.rate
      const charityWalletTodayUsd = charityOneDayTotal * price.rate
      const charityTransferredOutUsd = charityTransferredOut * price.rate

      setPrice(price.rate ? '$' + price.rate.toFixed(6) : '-')

      // TODO: once market cap starts coming back in the API, use that
      // setMarketCap(
      //   price.rate 
      //   ?
      //     '$' +
      //       price.marketCapUsd.toLocaleString(undefined, {
      //         maximumFractionDigits: 0,
      //       })
      //   :
      //     '-'
      // )
      const hardcodedSupply = 858000000 // hardcode supply until we get mc data in api
      setMarketCap(
        price.rate 
        ?
          '$' +
            (price.rate * hardcodedSupply).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
        :
          '-'
      )
      setGrumpyUsdValue(
        isNaN(userGrumpyValueInUsd) 
        ?
          '-'
        :
          '$' + formatPriceUsd(userGrumpyValueInUsd)
      )
      setRedistributedUsdValue(
        isNaN(userRedistributedValueInUsd) 
        ?
          '-'
        :
          '$' + formatPriceUsd(userRedistributedValueInUsd)
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

      const balance = await getGrumpyBalance(account)
      const tx = await getGrumpyTransaction(account, balance)
      const ranks = await getPawthRanks(balance)
      const isVoter = await getVoterStatus(account)

      const ethTransactions = await getEthTransaction(account)
      setIsMarketingDonor(ethTransactions.isMarketingWalletDonor)
      
      getGrumpyStats(balance, tx.redistribution, charityTx.oneDayTotal)

      setGrumpyBalance(balance)

      setPreviousPawthRank(ranks.previousRank)
      setPawthRank(ranks.rank)
      setNextPawthRank(ranks.nextRank)
      setDistanceToNextRank(ranks.distanceToNextRank)
      setDistanceToPreviousRank(ranks.distanceToPreviousRank)

      setTotalIn(tx.totalIn)
      setTotalOut(tx.totalOut)
      setRedistributedAmount(tx.redistribution)
      setGrumpyBalanceWithoutRedistribution(tx.balanceWithoutRedistribution)

      setIsOriginalSwapper(ORIGINAL_SWAPPERS.includes(account.toLowerCase()))
      setIsBugSquisher(BUG_SQUISHERS.includes(account.toLowerCase()))
      setIsTester(TESTERS.includes(account.toLowerCase()))
      setIsVoter(isVoter)

      const shibaLpTokenAddr = '0xc57dc778a0d2d150d04fc0fd09a0113ebe9d600c'
      const shibaLpTokenBalance = await getTokenBalance(account, shibaLpTokenAddr, 18)
      if (shibaLpTokenBalance.balance > 0) {
        setIsShibaLpProvider(true)
      }

      const uniswapLpTokenAddr = '0x800a45f2b861229d59e952aef57b22e84ff949a1'
      const uniswapLpTokenBalance = await getTokenBalance(account, uniswapLpTokenAddr, 18)
      if (uniswapLpTokenBalance.balance > 0) {
        setIsUniswapLpProvider(true)
      }

      setIsCatDayVisitor(CAT_DAY_VISITORS.includes(account.toLowerCase()))
      setIsEdinburghEventVisitor(EDINBURGH_VISITORS.includes(account))
      setIsPawsOrgEventVisitor(PAWS_ORG_VISITORS.includes(account.toLowerCase()))

      // TODO: we can get rid of all of this after giving tuesday
      const endOfEvent = 1638421199 // 11:59pm dec 1 (est)
      const now = Math.floor(Date.now() / 1000)
      const isGivingTuesday = now <= endOfEvent
      console.log('is Giving Event', isGivingTuesday)
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

  async function getVoterStatus(account: string) {
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
        const votes = result.data.votes
        const voters = Object.entries(votes).map((v: any) => v[1].voter)
        return voters.includes(account)
      })
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

    const formattedBalance = balance / 1000000000
    if (formattedBalance >= 1) {
      setIsHolder(true)
    }
    if (formattedBalance >= 10000) {
      setIsInWildCatClub(true)
    }

    return balance
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

  async function getEthTransaction(account: string) {
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

  async function getGrumpyTransaction(account: string, balance: number) {
    const transactions_api = new URL('https://api.etherscan.io/api')

    transactions_api.searchParams.append('module', 'account')
    transactions_api.searchParams.append('action', 'tokentx')
    transactions_api.searchParams.append('contractaddress', grumpyContractAddress)
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

    const startBlockReflectionsOff = 13643056

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

      } else if (parseInt(item.blockNumber) > startBlockReflectionsOff) {
        totalOut += parseFloat(item.value)
      } else {
        totalOut += parseFloat(item.value) * 0.02
        // if you sold during the Nov 18 dip, you did not survive
        if (parseInt(item.blockNumber) >= startBlockOfNov18Slurp &&
            parseInt(item.blockNumber) <= endBlockOfNov18Slurp) {
              setIsRedCandleSurvivor(false)
            }
      }
    }

    // 2% of the out transaction goes to reflections, but we don't see that in etherscan
    // totalOut = totalOut + totalOut * 0.02

    // if this person never sold, they are diamond hands
    setIsDiamondHands(totalOut === 0 && totalIn > 0)

    let balanceWithoutRedistribution = totalIn - totalOut
    const redistribution = balance - balanceWithoutRedistribution
    
    // for paperhands who sold all of their pawth, dont let balance
    // without reflections show a negative balance
    if (balanceWithoutRedistribution < 0) {
      balanceWithoutRedistribution = 0
    }

    return { totalIn, totalOut, redistribution, balanceWithoutRedistribution }
  }

  async function getCharityWalletTransaction() {
    const transactions_api = new URL('https://api.etherscan.io/api')
    const charityWallet = '0xf4a22c530e8cc64770c4edb5766d26f8926e20bd'

    transactions_api.searchParams.append('module', 'account')
    transactions_api.searchParams.append('action', 'tokentx')
    transactions_api.searchParams.append('contractaddress', grumpyContractAddress)
    transactions_api.searchParams.append('address', charityWallet)
    transactions_api.searchParams.append('page', '1')
    transactions_api.searchParams.append('offset', '10000')
    transactions_api.searchParams.append('apikey', ethescanApiKey)

    const transactionReq = await fetch(transactions_api.href)
    const transactionRes = await transactionReq.json()
    const transaction = transactionRes.result

    let totalIn = 0.0
    let totalOut = 0.0
    let oneDayTotal = 0.0

    const now = new Date().getTime()
    const oneDayAgo = 60 * 60 * 24 * 1000
    const transactionHashesToday = transaction.filter((t: any) => {
      return now - new Date(t.timeStamp * 1000).getTime() <= oneDayAgo
    }).map((t: any) => t.hash)

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
      { name: 'You achieved the top rank!', img: crown, threshold: 10000000 },
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
  }, [account])

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
                  Pawthereum is a decentralized community-run charity cryptocurrency that aims to help animal shelters all over the world and has already donated over $80k!
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
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0 }}>
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
                  <TYPE.largeHeader textAlign="center">{formatPrice(grumpyBalance)}</TYPE.largeHeader>
                </AutoColumn>
                <AutoColumn gap="sm">
                  <TYPE.body textAlign="center">Your $PAWTH USD Value</TYPE.body>
                  <TYPE.largeHeader textAlign="center">{grumpyUsdValue}</TYPE.largeHeader>
                </AutoColumn>

                <AutoColumn gap="sm">
                  <AutoRow justify="center">
                    <PaddedAutoColumn gap="sm">
                      <TYPE.body textAlign="center">Price</TYPE.body>
                      <TYPE.largeHeader textAlign="center">{price}</TYPE.largeHeader>
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
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0 }}>
                Your Rank and Badges
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
            { grumpyBalance ? (
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <AutoColumn gap="sm">
                    <TYPE.mediumHeader textAlign="center">
                      Your PAWTHER Rank 
                      <StyledHelpButton onClick={() => openRankMenu()}>
                        <HelpCircle size={14} />
                      </StyledHelpButton>
                    </TYPE.mediumHeader>
                    <TYPE.body textAlign="center">
                      <img src={pawthRank.img} alt="Logo" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
                    </TYPE.body>
                    <TYPE.largeHeader textAlign="center">{pawthRank.name}</TYPE.largeHeader>
                  </AutoColumn>
                </AutoRow>
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm" style={{ width: '50%' }}>
                    <TYPE.body textAlign="center"><small>Next Rank</small></TYPE.body>
                    <TYPE.body textAlign="center">
                      <img src={nextPawthRank.img} alt="Logo" style={{ width: 50, height: 50 }} />
                    </TYPE.body>
                    <TYPE.body textAlign="center">
                      <small><strong>{nextPawthRank.name}</strong></small>
                    </TYPE.body>
                    <TYPE.body textAlign="center"><small>{distanceToNextRank}</small></TYPE.body>
                  </PaddedAutoColumn>
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
                </AutoRow>
              </AutoColumn>
              ) : (
                <AutoColumn gap="lg">
                  <AutoRow justify="center">
                    <AutoColumn gap="sm">
                      <TYPE.mediumHeader textAlign="center">Your PAWTHER Rank</TYPE.mediumHeader>
                      <TYPE.largeHeader textAlign="center">-</TYPE.largeHeader>
                    </AutoColumn>
                  </AutoRow>
                  
                  <AutoRow justify="center">
                    <PaddedAutoColumn gap="sm">
                      <TYPE.mediumHeader textAlign="center">Your $PAWTH Badges</TYPE.mediumHeader>
                    </PaddedAutoColumn>
                  </AutoRow>
                </AutoColumn>
                
              )
            }
            </MainContentWrapper>
          </TopSection>

          {/* <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0 }}>
                Your $PAWTH Activity
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">Total $PAWTH In</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(totalIn)}</TYPE.largeHeader>
                  </PaddedAutoColumn>

                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">Total $PAWTH Out</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(totalOut)}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                </AutoRow>

                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">$PAWTH Reflections Earned</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(redistributedAmount)}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">$PAWTH Reflections USD Value</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{redistributedUsdValue}</TYPE.largeHeader>
                  </PaddedAutoColumn>
                </AutoRow>

                <AutoColumn gap="sm">
                  <TYPE.body textAlign="center">$PAWTH Balance without Reflections</TYPE.body>
                  <TYPE.largeHeader textAlign="center">
                    {formatPrice(grumpyBalanceWithoutRedistribution)}
                  </TYPE.largeHeader>
                </AutoColumn>
              </AutoColumn>
            </MainContentWrapper>
          </TopSection> */}

          <TopSection gap="2px">
            <WrapSmall>
              <TYPE.mediumHeader style={{ margin: '1rem 0.5rem 0 0', flexShrink: 0 }}>
                Charity Wallet
              </TYPE.mediumHeader>
            </WrapSmall>
            <MainContentWrapper>
              <AutoColumn gap="lg">
                <AutoRow justify="center">
                  <PaddedAutoColumn gap="sm">
                    <TYPE.body textAlign="center">$PAWTH Collected Last 24h</TYPE.body>
                    <TYPE.largeHeader textAlign="center">{formatPrice(charityOneDayTotal)}</TYPE.largeHeader>
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
